/*!
 * Clustermap v1.0.1
 *
 * Copyright 2010, Jean-Yves Delort
 * Licensed under the MIT license.
 *
 */

var figue = require('./figue.js');

var clustermap = function () {
	var _map;
	var _vectors;
	var _elements;
	var _tree;
	var _minDistance; // expressed in PIXELS
	var _selectedNodes;
	var _linkageType;
	var _displayedMarkers = {};
	var _infowindow;

	function HCMap(params) {
		this._map = params.map;
		this._elements = params.elements;
		this._infowindow = new google.maps.InfoWindow();

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
			if (projection === 'undefined') {
				console.info('Projection undefined. You need to wait for "bounds_changed" event before creating the clustermap');
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
																			console.info('zoom_changed');
																			updateNodes(thishcmap);
																			updateMarkers(thishcmap, true);
																		});

			this._bounds_changed_listener = google.maps.event.addListener(this._map, "dragend", function () {
																			  console.info('dragend');
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
			return;
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
		console.info('updateMarkers');
		// remove visible markers
		if (reset) {
			hcmap.removeMarkers();
		}
		// display nodes as markers
		var viewport = hcmap._map.getBounds();
		if (viewport === 'undefined') {
			console.info('Viewport undefined. You need to wait for "bounds_changed" event before creating the clustermap');
			return;
		}

		var selectedNodes = hcmap._selectedNodes;

		// TODO(jydelort): clean this hack to fix unshown markers at zoom level 1 or 2
		var current_zoom_level = hcmap._map.getZoom();

		for (var i = 0, l = selectedNodes.length; i < l; i++) {
			var element;
			var position;
			var description;
			if (selectedNodes[i].isLeaf()) {
				element = hcmap._elements[ selectedNodes[i].label ];
				position = element.latlng;
				description = element.description;
			} else {
				description = '';
				// Convert pixel coordinates to world coordinates
				var projcoord = new google.maps.Point(selectedNodes[i].centroid[0], selectedNodes[i].centroid[1]);
				position = hcmap._map.getProjection().fromPointToLatLng(projcoord);
			}
			if ((current_zoom_level > 2) && (!viewport.contains(position))) {
				continue;
			}

			var clusterSize = selectedNodes[i].size;
			var _id = clusterSize+'/'+position.lat()+'/'+position.lng();
			if (!hcmap._displayedMarkers[_id]) {
				var width = calculateCircleWidth(clusterSize);
				var color = calculateColor(hcmap, selectedNodes[i]);
				var marker = new ClusterMarker({'latlng': position,
												   'size': clusterSize,
												   'color': color,
												   'description': description,
												   'hcmap': hcmap,
												   'width': width});
				// Makes the info window go away when clicking anywhere on the Map.
				google.maps.event.addListener(marker, 'click', function () {});

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

	function childrenColors(hcmap, node) {
		if (node.isLeaf()) {
			return [hcmap._elements[node.label].color];
		}
		var colors = [];
		if (node.left != null) {
			var ccolors = childrenColors(hcmap, node.left);
			var len = ccolors.length;
			for (var i = 0; i < len; i++) {
				var val = ccolors[i];
				if (colors.indexOf(val) == -1) {
					colors.push(val);
				}
			}
		}

		if (node.right != null) {
			var ccolors = childrenColors(hcmap, node.right);
			var len = ccolors.length;
			for (var i = 0; i < len; i++) {
				var val = ccolors[i];
				if (colors.indexOf(val) == -1) {
					colors.push(val);
				}
			}
		}

		return colors;
	}

	function calculateColor(hcmap, node) {
		var colors = childrenColors(hcmap, node);
		if (colors.length == 1) {
			return colors[0];
		} else {
			return colors.join(",");
		}
	}

	function calculateCircleWidth(cSize) {
		var sizes = [27, 36, 45, 58];

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
		this._color = params.color;
		this._description = params.description;
		this._hcmap = params.hcmap;

		this._div = null;
	}

	return {
		HCMap: HCMap,
		ClusterMarker: ClusterMarker
	}

}();


clustermap.HCMap.prototype.reset = function () {
	if (this._bounds_changed_listener) {
		google.maps.event.removeListener(this._bounds_changed_listener);
		this._bounds_changed_listener = null;
	}

	if (this._zoom_changed_listener) {
		google.maps.event.removeListener(this._zoom_changed_listener);
		this._zoom_changed_listener = null;
	}

	this._map = null;
	this._positions = [];
	this._elements = [];
	this._vectors = [];
	this._selectedNodes = [];
	this._tree = null;
	this.removeMarkers();
}

clustermap.HCMap.prototype.removeMarkers = function () {
	if (this._displayedMarkers) {
		for (var i in this._displayedMarkers) {
			this._displayedMarkers[i].setMap(null);
		}
	}

	this._displayedMarkers = {};
}

clustermap.ClusterMarker.prototype = new google.maps.OverlayView();

clustermap.ClusterMarker.prototype.onAdd = function () {
	// create the div
	var div = document.createElement('DIV');

	// set its style
	div.className = "baseMarker";

	// set its color
	if (this._color.indexOf(",") > -1) {
		colors = this._color.split(",");
		var nbColors = colors.length;
		var stepSize = 100 / nbColors;
		var currentStep = 0;
		var new_style = "(right bottom,";
		for (var i = 0; i < nbColors; i++) {
			new_style += colors[i] + " " + stepSize + "%";
			if (i < nbColors - 1) {
				new_style += ",";
			}
		}
		new_style += ")";

		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('chrome') > -1) {
			div.style.backgroundImage = "-webkit-linear-gradient" + new_style;
		} else {
			if (ua.indexOf('safari') > -1) {
				div.style.backgroundImage = "-webkit-linear-gradient" + new_style;
			} else {
				if (ua.indexOf('mozilla') > -1) {
					div.style.backgroundImage = "-moz-linear-gradient" + new_style;
				} else {
					if (ua.indexOf('explorer') > -1) {
						div.style.backgroundImage = "-ms-linear-gradient" + new_style;
					} else {
						if (ua.indexOf('opera') > -1) {
							div.style.backgroundImage = "-o-linear-gradient" + new_style;
						} else {
							div.style.backgroundImage = "linear-gradient" + new_style;
						}
					}
				}
			}
		}
	} else {
		div.style.background = this._color;
	}

	div.style.opacity = 0.75;

	// set its dimension
	div.style.width = this._width + 'px';
	div.style.height = this._width + 'px';

	// set the size of the cluster
	div.innerHTML = '<p style="font-weight:bold; color: white; margin: 0px; padding:0px; line-height:' + this._width + 'px">' + this._size + '</p>';

	this._div = div;
	this.getPanes().overlayImage.appendChild(div);

	// Register listeners to open up an info window when clicked.
	if (this._size == 1) {
		var me = this;
		google.maps.event.addDomListener(div, 'click', function () {
			var iw = me._hcmap._infowindow;
			iw.setContent(me._description);
			iw.setPosition(me._latlng);
			iw.open(me._hcmap._map);
		});
	}
};

clustermap.ClusterMarker.prototype.onRemove = function () {
	this._div.parentNode.removeChild(this._div);
	this._div = null;
}

clustermap.ClusterMarker.prototype.draw = function () {
	var overlayProjection = this.getProjection();
	// Retrieve the southwest and northeast coordinates of this overlay
	// in latlngs and convert them to pixels coordinates.
	var loc = overlayProjection.fromLatLngToDivPixel(this._latlng);

	// Set the marker at the right position.
	this._div.style.left = (loc.x - this._width / 2) + 'px';
	this._div.style.top = (loc.y - this._width / 2) + 'px';
}

module.exports = clustermap;