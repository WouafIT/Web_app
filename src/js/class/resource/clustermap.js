/*!
 * Clustermap v1.0.1
 *
 * Copyright 2010, Jean-Yves Delort
 * Licensed under the MIT license.
 *
 */

var figue = require('../../../libs/figue/figue.js');

var clustermap = function () {
	var $document = $(document);

	function HCMap(params) {
		this._map = params.map;
		this._infowindow = params.infowindow;
		this._elements = params.elements;

		if (typeof params.minDistance !== 'undefined') {
			this._minDistance = params.minDistance;
		} else {
			this._minDistance = 140;
		}

		if (typeof params.linkageType !== 'undefined') {
			this._linkageType = params.linkageType;
		} else {
			this._linkageType = figue.COMPLETE_LINKAGE;
		}
		var thishcmap = this;

		this._vectors = [];
		var labels = [];
		if (this._elements.length > 0) {
			var projection = this._map.getProjection();
			if (!projection || typeof projection === 'undefined') {
				return;
			}

			// extract the points and convert the lat/lng coordinates to map coordinates
			for (var i = 0, l = this._elements.length; i < l; i++) {
				var element = this._elements[i];
				element.latlng = new google.maps.LatLng(element.coordinates.lat, element.coordinates.lng);
				var projcoord = projection.fromLatLngToPoint(element.latlng);
				var vector = [projcoord.x, projcoord.y];

				this._vectors.push(vector);
				labels.push(i);
			}
			// cluster the map coordinates
			this._tree = figue.agglomerate(labels, this._vectors, figue.EUCLIDIAN_DISTANCE, this._linkageType);
			this._zoom_changed_listener = google.maps.event.addListener(this._map, "zoom_changed", function () {
				$document.triggerHandler('menu.close');
				thishcmap._infowindow.close();
				$document.triggerHandler('history.set-state', {state: 'wouaf', value: null});
				updateNodes(thishcmap);
				updateMarkers(thishcmap, true);
			});

			this._bounds_changed_listener_start = google.maps.event.addListener(this._map, "dragstart", function () {
				$document.triggerHandler('menu.close');
			});
			this._bounds_changed_listener_end = google.maps.event.addListener(this._map, "dragend", function () {
				updateMarkers(thishcmap);
			});
			updateNodes(thishcmap);
			updateMarkers(thishcmap, true);
		}
	}

	// Node Selection Algorithm as described in:
	// Hierarchical Cluster Visualization in Web Mapping Systems, Proc. of the 19th ACM International WWW Conference (WWW'10)
	function selectNodes(node, MCD) {
		var selectedNodes;
		if (!node) {
			return [];
		}
		if (node.isLeaf()) {
			return [node];
		} else {
			if (node.dist < MCD) {
				return [];
			} else {
				selectedNodes = [];
				if (node.left != null) {
					if (node.left.isLeaf()) {
						selectedNodes.push(node.left);
					} else {
						if (node.left.dist < MCD) {
							selectedNodes.push(node.left);
						} else {
							selectedNodes = selectedNodes.concat(selectNodes(node.left, MCD));
						}
					}
				}
				if (node.right != null) {
					if (node.right.isLeaf()) {
						selectedNodes.push(node.right);
					} else {
						if (node.right.dist < MCD) {
							selectedNodes.push(node.right);
						} else {
							selectedNodes = selectedNodes.concat(selectNodes(node.right, MCD));
						}
					}
				}
			}
		}
		return selectedNodes;
	}

	function updateMarkers(hcmap, reset) {
		if (!hcmap._selectedNodes || !hcmap._map) {
			return;
		}
		// remove visible markers
		if (reset) {
			hcmap.removeMarkers();
		}
		// display nodes as markers
		var viewport = hcmap._map.getBounds();
		if (viewport === 'undefined') {
			return;
		}

		var selectedNodes = hcmap._selectedNodes;

		var current_zoom_level = hcmap._map.getZoom();
		for (var i = 0, l = selectedNodes.length; i < l; i++) {
			var element;
			var position;
			var description;
			var cat;
			if (selectedNodes[i].isLeaf()) {
				element = hcmap._elements[ selectedNodes[i].label ];
				position = element.latlng;
				description = element.description;
				cat = element.cat;
			} else {
				description = '';
				cat = null;
				// Convert pixel coordinates to world coordinates
				var projcoord = new google.maps.Point(selectedNodes[i].centroid[0], selectedNodes[i].centroid[1]);
				position = hcmap._map.getProjection().fromPointToLatLng(projcoord);
			}
			if ((current_zoom_level > 2) && (!viewport.contains(position))) {
				continue;
			}

			var clusterSize = selectedNodes[i].size;
			var _id = clusterSize + '/' + position.lat() + '/' + position.lng();
			if (!hcmap._displayedMarkers[_id]) {
				var width = calculateCircleWidth(clusterSize);
				var clusterInfos = getClusterInfos(hcmap, selectedNodes[i]);
				var marker = new ClusterMarker({'latlng': position,
												   'size': clusterSize,
												   'colors': clusterInfos.colors,
												   'ids': clusterInfos.ids,
												   'description': description,
												   'cat': cat,
												   'hcmap': hcmap,
												   'width': width});

				marker.setMap(hcmap._map);
				hcmap._displayedMarkers[_id] = marker;
			}
		}
	}

	function updateNodes(hcmap) {
		var MCD = hcmap._minDistance / Math.pow(2, hcmap._map.getZoom());

		var selectedNodes = selectNodes(hcmap._tree, MCD);
		if (selectedNodes.length == 0) {
			selectedNodes.push(hcmap._tree);
		}
		hcmap._selectedNodes = selectedNodes;
	}

	function getLeafZoom(hcmap, id, zoomMin, zoomMax) {
		var MCD, selectedNodes;
		for (var i = zoomMin; i < zoomMax; i++) {
			MCD = hcmap._minDistance / Math.pow(2, i);
			selectedNodes = selectNodes(hcmap._tree, MCD);
			if (selectedNodes.length == 0) {
				selectedNodes.push(hcmap._tree);
			}
			for (var j = 0, l = selectedNodes.length; j < l; j++) {
				if (selectedNodes[j].label != -1
					&& hcmap._elements[ selectedNodes[j].label ].id == id
					&& selectedNodes[j].isLeaf()) {
					return i;
				}
			}
		}
		return zoomMax;
	}

	function getClusterInfos(hcmap, node) {
		if (node.isLeaf()) {
			return {
				colors: [hcmap._elements[node.label].color],
				ids: [hcmap._elements[node.label].id]
			};
		}
		var infos = {
			colors: [],
			ids: []
		};
		var cinfos, val, i, l;
		if (node.left != null) {
			cinfos = getClusterInfos(hcmap, node.left);
			for (i = 0, l = cinfos.colors.length; i < l; i++) {
				val = cinfos.colors[i];
				if (infos.colors.indexOf(val) == -1) {
					infos.colors.push(val);
				}
			}
			infos.ids = infos.ids.concat(cinfos.ids);
		}

		if (node.right != null) {
			cinfos = getClusterInfos(hcmap, node.right);
			for (i = 0, l = cinfos.colors.length; i < l; i++) {
				val = cinfos.colors[i];
				if (infos.colors.indexOf(val) == -1) {
					infos.colors.push(val);
				}
			}
			infos.ids = infos.ids.concat(cinfos.ids);
		}
		return infos;
	}

	function calculateCircleWidth(cSize) {
		var sizes = [30, 40, 50, 60];

		var i = 0;
		var l = sizes.length;
		while (i < l && Math.round(cSize / 10) > 1) {
			cSize = Math.round(cSize / 10);
			i++;
		}
		return sizes[i];
	}

	function ClusterMarker(params) {
		this._latlng = params.latlng;
		this._size = params.size;
		this._width = params.width;
		this._colors = params.colors;
		this._ids = params.ids;
		this._cat = params.cat;
		this._description = params.description;
		this._hcmap = params.hcmap;

		this._div = null;
		this._shadow = null;
	}

	return {
		HCMap: HCMap,
		ClusterMarker: ClusterMarker,
		getLeafZoom: getLeafZoom
	}
}();

clustermap.HCMap.prototype.reset = function () {
	if (this._bounds_changed_listener_start) {
		google.maps.event.removeListener(this._bounds_changed_listener_start);
		this._bounds_changed_listener_start = null;
	}
	if (this._bounds_changed_listener_end) {
		google.maps.event.removeListener(this._bounds_changed_listener_end);
		this._bounds_changed_listener_end = null;
	}
	if (this._zoom_changed_listener) {
		google.maps.event.removeListener(this._zoom_changed_listener);
		this._zoom_changed_listener = null;
	}

	this._map = null;
	this._elements = [];
	this._vectors = [];
	this._selectedNodes = [];
	this._tree = null;
	this.removeMarkers();
};

clustermap.HCMap.prototype.removeMarkers = function () {
	if (this._displayedMarkers) {
		for (var i in this._displayedMarkers) {
			if (this._displayedMarkers.hasOwnProperty(i)) {
				this._displayedMarkers[i].setMap(null);
			}
		}
	}

	this._displayedMarkers = {};
};

clustermap.ClusterMarker.prototype = new google.maps.OverlayView();

clustermap.ClusterMarker.prototype.onAdd = function () {
	// create the div
	var div = document.createElement('DIV');

	// set its style
	div.className = this._cat ? 'baseMarker marker' + this._cat : 'baseMarker markerCluster';

	// set its color
	var nbColors = this._colors.length;
	if (nbColors > 1 && nbColors <= 3) {
		var stepSize = 100 / nbColors;
		var new_style = "(";
		for (var i = 0; i < nbColors; i++) {
			new_style += this._colors[i] + " " + Math.round(stepSize * i) + "%, " + this._colors[i] + " " + Math.round(stepSize * (i + 1)) + "%";
			if (i < nbColors - 1) {
				new_style += ",";
			}
		}
		new_style += ")";
		div.style.backgroundImage = "linear-gradient" + new_style;
	} else if (nbColors == 1) {
		div.style.background = this._colors[0];
	}

	// set its dimension
	div.style.width = this._width + (this._cat ? 0 : 6) + 'px';
	div.style.height = this._width + (this._cat ? 0 : 6) + 'px';

	if (!this._cat) {
		// set the size of the cluster
		div.innerHTML = '<p style="line-height:' + this._width + 'px">' + this._size + '</p>';
	}
	div.setAttribute("data-id", this._ids.join(','));
	this._div = div;
	this.getPanes().overlayImage.appendChild(div);
	if (this._cat) {
		// create the shadow
		var shadow = document.createElement('DIV');
		// set its style
		shadow.className = 'markerShadow';
		this._shadow = shadow;
		this.getPanes().overlayImage.appendChild(shadow);
	}
	// Register listeners to open up an info window when clicked.
	var me = this;
	var $document = $(document);
	google.maps.event.addDomListener(div, 'click', function (e) {
		if (e) {
			e.stopPropagation(); //stop click event propagation
		}
		var iw = me._hcmap._infowindow;
		iw.setPosition(me._latlng);
		iw.setOptions({pixelOffset: new google.maps.Size(0, (me._cat ? -me._width : me._width / -2))});
		//trigger handler to open info window with wouaf content
		$document.triggerHandler('app.wouaf-show', {ids: me._ids, map: me._hcmap._map, iw: iw});
	});
};

clustermap.ClusterMarker.prototype.onRemove = function () {
	this._div.parentNode.removeChild(this._div);
	this._div = null;
	if (this._shadow) {
		this._shadow.parentNode.removeChild(this._shadow);
		this._shadow = null;
	}
};

clustermap.ClusterMarker.prototype.draw = function () {
	var overlayProjection = this.getProjection();
	// Retrieve the southwest and northeast coordinates of this overlay
	// in latlngs and convert them to pixels coordinates.
	var loc = overlayProjection.fromLatLngToDivPixel(this._latlng);

	// Set the marker at the right position.
	this._div.style.left = (loc.x - this._width / 2) + 'px';
	if (this._cat) {
		this._div.style.top = (loc.y - this._width - 6) + 'px';
	} else {
		this._div.style.top = (loc.y - this._width / 2) + 'px';
	}
	if (this._shadow) {
		this._shadow.style.left = (loc.x - 7) + 'px';
		this._shadow.style.top = (loc.y -((60 - this._width) / 5)) + 'px';
	}
};

module.exports = clustermap;