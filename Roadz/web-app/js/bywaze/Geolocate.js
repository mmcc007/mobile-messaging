define(['dojo/_base/declare',"dojo/_base/connect", "dojo/_base/lang"], function(declare, connect, lang){
  return declare(null, {
		_watch_position_id : undefined,
		_myPosition: null,
		_connected: false,
		_username: null,
		_roomName: null,

		constructor: function(/*Object*/ args){
      declare.safeMixin(this, args);
	  connect.subscribe("ChatWidget", lang.hitch(this, this.onCometConnect));
    },
 

//	_init : function() {
//		geolocate.startGeolocation();
//	},

	startGeolocation : function() {
		if (navigator.geolocation) {
			if (!this._watch_position_id) {
				this._watch_position_id = navigator.geolocation.watchPosition(lang.hitch(this, this.setPosition), lang.hitch(this, this.handlePositionError));
			}
		} else {
			alert("Sorry, your browser does not support geolocation services.");
		}
	},

	stopGeolocation : function() {
		if (navigator.geolocation) {
			if (this._watch_position_id) {
				navigator.geolocation.clearWatch(this._watch_position_id);
				this._watch_position_id = undefined;
			}
//		} else {
//			alert("Sorry, your browser does not support geolocation services.");
		}

	},

	setPosition: function(position) {
		console.log('location found : lat: ' + position.coords.latitude + ' : long: ' + position.coords.longitude);
		this._myPosition = position;
		
		// send my position
		connect.publish("position", [{_myPosition: position}]);

		// prepare to publish the location
		if (this._connected) {
			this.geoPublish();
		}
		// if no connection wait for the onCometConnect event an publish then
	},
	
	onCometConnect: function(message) {
		    console.log("I got: ", message);
		    this._roomName = message._roomName;
		    this._connected=true;
		    if (this._myPosition)
		    	this.geoPublish();
	},
	
	geoPublish: function() {
		var cometd = dojox.cometd;
		var clientId = cometd.getClientId();
		console.log('Publishing my position with clientId : ' + clientId);
		// Publish on a normal channel since the message is for broadcast
		var myLocation = {};
		myLocation['user'] = this._username;
		myLocation['clientId'] = clientId;
		myLocation['latitude'] = this._myPosition.coords.latitude;
		myLocation['longitude'] = this._myPosition.coords.longitude;
		cometd.publish('/chat/' + this._roomName, myLocation);
	},

	handlePositionError: function(error)
	{
		switch(error.code) 
		{
			case error.TIMEOUT:
				alert ('Timeout');
				break;
			case error.POSITION_UNAVAILABLE:
				alert ('Position unavailable');
				break;
			case error.PERMISSION_DENIED:
				alert ('Permission denied');
				break;
			case error.UNKNOWN_ERROR:
				alert ('Unknown error');
				break;
		}
	},

  });
});
//
//function dateTimeString(d) {
//	function pad(n) {
//		return n < 10 ? '0' + n : n;
//	}
//	return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-'
//			+ pad(d.getDate()) + ' ' + pad(d.getHours()) + ':'
//			+ pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.'
//			+ pad(d.getMilliseconds());
//}
//
//	return dateTimeString(new Date());
//}
//
//// if true, run immediately
//// runs asynchronously
//function asyncWhenTrueDo(cond, func) {
//	console.log(logDateTime() + " : asyncWhenTrueDo: cond=" + cond + " : func=" + func);
//	setTimeout("whenTrueDo('" + cond + "','" + func + "')", 0);
//}
//
//function whenTrueDo(cond, func) {
//	if (eval(cond))
//		eval(func);
//	else {
//		console.log(logDateTime() + ": sleeping for 200ms");
//		setTimeout("whenTrueDo('" + cond + "','" + func + "')", 200);
//	}
//}
//
//function log(msg) {
//	console.log(logDateTime() + ": " + msg);
//}
//
//function moveMarker(id, latitude, longitude) {
//	log('movconsole.logrker : id: ' + id + ': lat: ' + latitude + ' : long: ' + longitude);
//	// if no map do nothing
////	if (map) {
//		var coords = new google.maps.LatLng(latitude, longitude);
//
//		// find the marker
//		var marker = markers[id];
//		if (!marker) {
//			marker = new google.maps.Marker({
//				map : map,
//				title : id
//			});
//			markers[id] = {
//				date : new Date(),
//				mapMarker : marker
//			};
//		}
//		marker.position = coords;
////		marker.mapMarker.position = coords;
//		marker.lastMoved = new Date();
////	}
//}
//
//function removeMarker(id) {
//	log('removeMarker : id: ' + id);
//	// if no map do nothing
////	if (map) {
//		var marker = markers[id];
//		marker.mapMarker.setMap(null);
//		delete markers[id];
////	}
//}
//
//function removeAllMarkers() {
//	log('removeMarkers()');
//	// if no map do nothing
////	if (map) {
//		for ( var i in markers) {
//			var marker = markers[i];
//			if (typeof marker == "object") {
//				marker.marker.setMap(null);
//			}
//			marker = null;
//			delete markers[i];
//			//				markers.remove(i);
//		}
//		//			markers = null;
//		//			markers = [];
////	}
//}
//
//function cleanupMarkers(age) {
//
//	log('cleanMarkers');
//	// if no map do nothing
////	if (map) {
//		for (marker in markers) {
//			var lastHeartbeat = marker.heartbeatDate;
//			if (lastHeartbeat + age > new Date()) {
//				// remove marker from map
//				log("removing stale marker: id=");
//				marker.marker.setMap(null);
//			}
//		}
////	}
//}
//
////	asyncWhenTrueDo("dojox.cometd.getClientId() && myPosition", "heartbeat()");
//
//function initMap(position) {
////	if (!map) {
//		// Define the coordinates as a Google Maps LatLng Object
//		var latLng = undefined;
//		if (position)
//			latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//
//		// Prepare the map options
//		var mapOptions = {
//			zoom : 15,
//			center : latLng,
//			mapTypeControl : false,
//			navigationControlOptions : {
//				style : google.maps.NavigationControlStyle.SMALL
//			},
//			mapTypeId : google.maps.MapTypeId.ROADMAP
//		};
//
//		// Create the map, and place it in the map_canvas div
//		map = new google.maps.Map(document.getElementById("map_canvas"),
//				mapOptions);
////	}
//
//}
//
//
//function zoomOut() {
//	map.setZoom(1);
//	mapInitState = true;
//	
//}
//
//
//function heartbeat() {
//	heartbeatIntervalName = setInterval("geoPublish()", 30000);
//}
//
//// on disconnect publish
//function disconnected() {
//	log('Publishing my disconnect with clientId : ' + dojox.cometd.getClientId());
//	cometd.publish('/chat', {
//		clientId : dojox.cometd.getClientId()
//	});
//}
//
////	var markerMaxAge = 60000;
////	setInterval("cleanupMarkers(" + markerMaxAge + ')',10000);
//
////dojo.addOnLoad(chat, "_init");
