var figue = require('../../libs/figue');
var utils = require('./utils');

var clustermap = function () {
	var _selectedNodes;
	var _displayedMarkers;
	
	function HCMap (params) {
		this._map = params.map ;
		//store initial map position
		this._map._previous = this._map.getRegion();
		this._elements = params.elements;
		this._minDistance = 140 ;
		this._vectors = [];
		this._tags = {};
		var that = this ;
		var indexes = [];
		if (this._elements) {
			// extract the points and convert the lat/lng coordinates to map coordinates
			//for (var i in this._elements) {
            for (var i = 0, li = this._elements.length; i < li; i++) {
            	var element = this._elements[i];
				if (element) {
    				element.latlng = new utils.LatLng(element.loc[0], element.loc[1]);
    				var projcoord = this._map.fromLatLngToPoint(element.latlng) ;
    				var vector = [projcoord.x, projcoord.y];
    				this._vectors.push (vector) ;
    				indexes.push(i);
    				for (var j = 0, lj = element.tags.length; j < lj; j++) {
    					var tag = element.tags[j];
    					if (this._tags[tag]) {
    						this._tags[tag]++;
    					} else {
    						this._tags[tag] = 1;
    					}
    				}
				}
			}
			// cluster the map coordinates
			this._tree = figue.agglomerate (indexes,
                                       this._vectors,
                                       figue.EUCLIDIAN_DISTANCE,
                                       figue.COMPLETE_LINKAGE) ;
			
			this._region_changed_listener = function(e) {
				if (this._timer) {
					clearTimeout(this._timer);
				}
				var map = this;
				var args = arguments;
				var func = function(e) {
					if (this._previous.longitudeDelta != e.longitudeDelta) {
						//zoom changed
						updateNodes(that);
						updateMarkers(that, true);
					} else {
						//bounds changed
						updateMarkers(that, false);
					}
					this._previous = e;
					if (!that._map) {
						return;
					}
				}
				this._timer = setTimeout(function() {
					func.apply(map, args);
				}, 200);
			}
			this._map.addEventListener('regionChanged', this._region_changed_listener);
			updateNodes(that);
			updateMarkers (that, true) ;
		}
	}

	// Node Selection Algorithm (ref Hierarchical Clusters in Web Mapping Systems, In Proceedings of the 19th ACM International World Wide Web Conference (WWW'10))
	function selectNodes(node, MCD) {
		var selectedNodes ;
		if (!node) {
			return;
		}
		if (node.isLeaf()) 
			return [node] ;
		else if (node.dist < MCD) 
			return [] ;
		else {
			selectedNodes = new Array() ;
			if (node.left != null) {
				if (node.left.isLeaf()) 
					selectedNodes.push(node.left) ;
				else {
					if (node.left.dist < MCD)
						selectedNodes.push (node.left) ;
					else
						selectedNodes = selectedNodes.concat (selectNodes(node.left, MCD)) ;
				}
			}
			
			if (node.right != null) {
				if (node.right.isLeaf()) 
					selectedNodes.push(node.right) ;
				else {
					if (node.right.dist < MCD)
						selectedNodes.push (node.right) ;
					else
						selectedNodes = selectedNodes.concat (selectNodes(node.right, MCD)) ;
				}
			}
		}
		return selectedNodes ;
	}
	
	function updateMarkers(hcmap, reset) {
		if (! hcmap._selectedNodes || !hcmap._map) {
			return ;
		}
		// remove visible markers
		if (reset) {
			hcmap.removeMarkers();
		}
		// display nodes as markers
		var viewport = hcmap._map.getBounds() ;
		
		var selectedNodes = hcmap._selectedNodes ;
        
		var current_zoom_level = hcmap._map.getZoom() ;
		var _count = 0;
		for (var i = 0, l = selectedNodes.length ; i < l ; i++) {
			var element;
			var position;
			var description;
			var cat;
			var author;
			if (!selectedNodes[i]) {
                continue;
			}
			if (selectedNodes[i].isLeaf()) {
				element = hcmap._elements[ selectedNodes[i].index ] ;
				position = element.latlng;
				cat = element.cat;
				author = element.author;
			} else {
				// Convert pixel coordinates to world coordinates
				var projcoord = new utils.Point (selectedNodes[i].centroid[0],
                                               selectedNodes[i].centroid[1]) ;
				position = hcmap._map.fromPointToLatLng(projcoord) ;
			}

			if ((current_zoom_level > 2) && (! viewport.contains(position))) {
				continue;
			}
            var clusterSize = selectedNodes[i].size ;
			if (clusterSize) {
				var _id = position.lat+'/'+position.lng;
				if (!hcmap._displayedMarkers[_id]) {
					if (clusterSize > 1) {
						/*var marker = Ti.Map.createAnnotation({
							title: '.' + Math.round(Math.random()*1000),
							animate: false,
							image: utils.img + '/maps/group/' + getCLusterPic(clusterSize) + '.png',
							latitude: position.lat,
							longitude: position.lng,
							elements: selectedNodes[i].indexes
						});*/
					} else {
						/*var marker = Ti.Map.createAnnotation({
							title: '~' + Math.round(Math.random()*1000),
							animate: false,
							image: /*(author && author[0] == 'eventful' ? utils.img + '/maps/cat/eventful.png' : * / utils.img + '/maps/cat/' + cat + '.png'/*)* /,
							latitude: position.lat,
							longitude: position.lng,
							elements: [selectedNodes[i].index]
						});*/
					}
					hcmap._map.addAnnotation(marker);
					hcmap._displayedMarkers[_id] = marker ;
					_count++;
				}
			}
		}
	}
	
	function updateNodes(hcmap) {
		if (!hcmap || !hcmap._map) {
			return;
		}
		var MCD = hcmap._minDistance/Math.pow(2, hcmap._map.getZoom());

		var selectedNodes = selectNodes (hcmap._tree , MCD) ;
		if (selectedNodes == null) {
			selectedNodes = [];
		}
		if (selectedNodes.length == 0)
			selectedNodes.push(hcmap._tree) ;
		
		hcmap._selectedNodes = selectedNodes ;
	}
	
	function getCLusterPic(size) {
		if (size > 1 && size < 10) {
			return size;
		}
		if (size >= 100) {
			return '100';
		}
		if (size >= 50) {
			return '50';
		}
		return (Math.floor(size/10) * 10);
	}

	return {
		HCMap: HCMap
	}
	
}() ;
	

clustermap.HCMap.prototype.reset = function () {
	if (this._region_changed_listener && this._map) {
		this._map.removeEventListener('regionChange', this._region_changed_listener);
	}
	this.removeMarkers();
	this._map = null ;
	this._positions = new Array () ;
	this._elements = new Array ();
	this._vectors = new Array () ;
	this._selectedNodes = new Array () ;
	this._tree = null;
}
clustermap.HCMap.prototype.getTags = function () {
	var _tags = utils.natsort(this._tags);
	var tags = [];
	for (var i in _tags) {
		tags.push('#' + i);
	}
	tags.push(L('every'));
	tags.reverse();
	return tags;
}

clustermap.HCMap.prototype.removeMarkers = function () {
	this._map.removeAllAnnotations();
	this._displayedMarkers = {} ;
}

module.exports = clustermap;

