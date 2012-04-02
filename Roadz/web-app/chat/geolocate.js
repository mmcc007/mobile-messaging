var geolocate = {
	_watch_position_id : undefined,

	_init : function() {
		geolocate.startGeolocation();
	},

	startGeolocation : function() {
		if (navigator.geolocation) {
			if (!geolocate._watch_position_id) {
				geolocate._watch_position_id = navigator.geolocation.watchPosition(setPosition, handlePositionError);
			}
		} else {
			alert("Sorry, your browser does not support geolocation services.");
		}
	},

	stopGeolocation : function() {
		if (navigator.geolocation) {
			if (geolocate._watch_position_id) {
				navigator.geolocation.clearWatch(geolocate._watch_position_id);
				geolocate._watch_position_id = undefined;
			}
//		} else {
//			alert("Sorry, your browser does not support geolocation services.");
		}

	},

//	geoReceive : function(message) {
//		log('geoReceive: msg received : clientId=' + message.data.clientId);
//		// Move or create the marker
//		moveMarker(message.data.user, message.data.latitude, message.data.longitude);
//
//	}
};

var map;
var mapInitState=true;
var myPosition;
var myClientId;
var myMarker;
var markers = new Array();
var heartbeatIntervalName;

//Array Remove - By John Resig (MIT Licensed)
//Array.prototype.remove = function(from, to) {
//  var rest = this.slice((to || from) + 1 || this.length);
//  this.length = from < 0 ? this.length + from : from;
//  return this.push.apply(this, rest);
//};

//and here's some examples of how it could be used:
//// Remove the second item from the array
//array.remove(1);
//// Remove the second-to-last item from the array
//array.remove(-2);
//// Remove the second and third items from the array
//array.remove(1,2);
//// Remove the last and second-to-last items from the array
//array.remove(-2,-1);

function dateTimeString(d) {
	function pad(n) {
		return n < 10 ? '0' + n : n;
	}
	return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-'
			+ pad(d.getDate()) + ' ' + pad(d.getHours()) + ':'
			+ pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.'
			+ pad(d.getMilliseconds());
}

function logDateTime() {
	return dateTimeString(new Date());
}

// if true, run immediately
// runs asynchronously
function asyncWhenTrueDo(cond, func) {
	console.log(logDateTime() + " : asyncWhenTrueDo: cond=" + cond + " : func=" + func);
	setTimeout("whenTrueDo('" + cond + "','" + func + "')", 0);
}

function whenTrueDo(cond, func) {
	if (eval(cond))
		eval(func);
	else {
		console.log(logDateTime() + ": sleeping for 100ms");
		setTimeout("whenTrueDo('" + cond + "','" + func + "')", 100);
	}
}

function log(msg) {
	console.log(logDateTime() + ": " + msg);
}

function moveMarker(id, latitude, longitude) {
	log('moveMarker : id: ' + id + ': lat: ' + latitude + ' : long: ' + longitude);
	// if no map do nothing
	if (map) {
		var coords = new google.maps.LatLng(latitude, longitude);

		// find the marker
		var marker = markers[id];
		if (!marker) {
			marker = new google.maps.Marker({
				map : map,
				title : id
			});
			markers[id] = {
				date : new Date(),
				mapMarker : marker
			};
		}
		marker.position = coords;
//		marker.mapMarker.position = coords;
		marker.lastMoved = new Date();
	}
}

function removeMarker(id) {
	log('removeMarker : id: ' + id);
	// if no map do nothing
	if (map) {
		var marker = markers[id];
		marker.mapMarker.setMap(null);
		delete markers[id];
	}
}

function removeAllMarkers() {
	log('removeMarkers()');
	// if no map do nothing
	if (map) {
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
	}
}

function cleanupMarkers(age) {

	log('cleanMarkers');
	// if no map do nothing
	if (map) {
		for (marker in markers) {
			var lastHeartbeat = marker.heartbeatDate;
			if (lastHeartbeat + age > new Date()) {
				// remove marker from map
				log("removing stale marker: id=");
				marker.marker.setMap(null);
			}
		}
	}
}

//	asyncWhenTrueDo("dojox.cometd.getClientId() && myPosition", "heartbeat()");

function initMap(position) {
	if (!map) {
		// Define the coordinates as a Google Maps LatLng Object
		var latLng = undefined;
		if (position)
			latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

		// Prepare the map options
		var mapOptions = {
			zoom : 15,
			center : latLng,
			mapTypeControl : false,
			navigationControlOptions : {
				style : google.maps.NavigationControlStyle.SMALL
			},
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};

		// Create the map, and place it in the map_canvas div
		map = new google.maps.Map(document.getElementById("map_canvas"),
				mapOptions);
	}

}

function setPosition(position) {
	log('location found : lat: ' + position.coords.latitude + ' : long: ' + position.coords.longitude);
	
//	initMap(position);

	// set map display if in initial state
	if (mapInitState) {
		map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		map.setZoom(14);
		mapInitState = false;
	}

	// prepare to publish the location
	//		log('calling geoPublish()');
	myPosition = position;
	if (!room._connected) {
		asyncWhenTrueDo("room._connected", "geoPublish()");
		geolocate.stopGeolocation();
	} else
		geoPublish();

}

function zoomOut() {
	map.setZoom(1);
	mapInitState = true;
	
}

function handlePositionError(error)
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
}

function geoPublish() {
	var cometd = dojox.cometd;
	var clientId = cometd.getClientId();
	log('Publishing my position with clientId : ' + clientId);
	// Publish on a normal channel since the message is for broadcast
	var myLocation = {};
	myLocation['user'] = room._username;
	myLocation['clientId'] = clientId;
	myLocation['latitude'] = myPosition.coords.latitude;
	myLocation['longitude'] = myPosition.coords.longitude;
	cometd.publish('/chat/demo', myLocation);
}

function heartbeat() {
	heartbeatIntervalName = setInterval("geoPublish()", 30000);
}

// on disconnect publish
function disconnected() {
	log('Publishing my disconnect with clientId : ' + dojox.cometd.getClientId());
	cometd.publish('/chat', {
		clientId : dojox.cometd.getClientId()
	});
}

//	var markerMaxAge = 60000;
//	setInterval("cleanupMarkers(" + markerMaxAge + ')',10000);

//dojo.addOnLoad(chat, "_init");
