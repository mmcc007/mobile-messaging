define(['dojo/_base/declare'], function(declare){
  return declare(null, {
	  
	  // keep a list of map markers
	  markers: Array(), // Array of GLatLng objects
	  // my LatLng location
	  baseMarker: null,
	  
    constructor: function(/*Object*/ args){
      declare.safeMixin(this, args);
    },
  
    getMarker: function(id) {
    	this.markers[id];
    },
    
    moveMarker: function (id, latLng) {
    	console.log('moveMarker : id: ' + id + ': latLng: ' + latLng);
	// if no map do nothing
//	if (map) {

		// get the marker
		var marker = this.markers[id];
		if (!marker) {
			marker = new google.maps.Marker({
				map : map,
				title : id
			});
			this.markers[id] = {
				date : new Date(),
				mapMarker : marker
			};
		}
		marker.position = latLng;
//		marker.mapMarker.position = coords;
		marker.lastMoved = new Date();
//	}
    },
    
    compareDistance: function (LatLonA, LatLonB) {
    	return baseMarker.getLatLng().distanceFrom(LatLonA) - baseMarker.getLatLng().distanceFrom(LatLonB);
    },

    sortMarkers: function (baseMarkerID) {
    	this.baseMarker = markers[baseMarkerID];
    	markers.sort(compareDistance);
    },

    removeMarker: function (id) {
    	console.log('removeMarker : id: ' + id);
	// if no map do nothing
//	if (map) {
		var marker = markers[id];
		marker.mapMarker.setMap(null);
		delete markers[id];
//	}
    },

    removeAllMarkers: function () {
    	console.log('removeMarkers()');
	// if no map do nothing
//	if (map) {
		for ( var i in markers) {
			var marker = markers[i];
			if (typeof marker == "object") {
				marker.marker.setMap(null);
			}
			marker = null;
			delete markers[i];
			//				markers.remove(i);
		}
		//			markers = null;
		//			markers = [];
//	}
    },

    cleanupMarkers: function (age) {

    	console.log('cleanMarkers');
	// if no map do nothing
//	if (map) {
		for (marker in markers) {
			var lastHeartbeat = marker.heartbeatDate;
			if (lastHeartbeat + age > new Date()) {
				// remove marker from map
				log("removing stale marker: id=");
				marker.marker.setMap(null);
			}
		}
//	}
    },
    
    // random marker generator
    addRandomMarkers: function () {
//    	myPoints = Array(); // Array of GLatLng objects
//    	map.clearOverlays();
//    	map.addOverlay(baseMarker)
//
    	var bounds = map.getBounds();
    	for (var n = 0 ; n < 25 ; n++ ) {
    		// Get random lat and lon that fall within the bounds of the map
    		var lat = Math.random() * (bounds.getNorthEast().lat() - bounds.getSouthWest().lat()) + bounds.getSouthWest().lat();
    		var lon = Math.random() * (bounds.getNorthEast().lng() - bounds.getSouthWest().lng()) + bounds.getSouthWest().lng();
    		// Add each point to the array
			marker = new google.maps.Marker({
				map : map,
				title : n.toString()
			});
			marker.position = new google.maps.LatLng(lat,lon);
			this.markers.push(marker);
    	}
//
//
//
//    	// Print unsorted
//    	createIcons();
//
//    	myPointsTemp = Array();
//    	for (var n = 0 ; n < myPoints.length ; n++ ) {
//    		myPointsTemp.push(myPoints[n]);
//    	}
//    	plotMarkers();
    },

  });
});
