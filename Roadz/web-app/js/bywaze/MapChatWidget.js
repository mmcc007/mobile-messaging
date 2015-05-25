// custom.ChatWidget
define(["dojo/_base/declare","bywaze/ChatWidget", "dojo/text!./MapChatWidget/templates/MapChatWidget.html","dojox/cometd", "bywaze/MapMarkers", "dojo/_base/lang"],
    function(declare, ChatWidget, template, cometd, MapMarkers, lang){
        return declare("bywaze.MapChatWidget", [ChatWidget], {

        	// Our template - important!
			templateString: template,
			
			// default zoom level
			_zoomLevel: 18,
			
			// map marker manager
			mapMarkers: new MapMarkers(),
			

//		    constructor: function(/*object*/ args){
		    	// find out when the map is ready
//				require(["dojo/_base/connect"], function(connect){
//					connect.subscribe("/map", lang.hitch(this, this.onMap));
//				});

//		    	// username is a required field
//		    	if (!args._username) {
//		    		console.error('_username is a required argument');
//		    		return;
//		    	}
//		        declare.safemixin(this, args);
//		        this._username = args._username;
//		    },

			// postCreate is called once our widget's DOM is ready,
			// but BEFORE it's been inserted into the page!
			// This is far and away the best point to put in any special work.
//			postCreate: function(){
//				// Run any parent postCreate processes - can be done at any point
//				this.inherited(arguments);
////		    	this.join(this._username);
//			},
			
//		    onMap: function(message) {
////		    	if (message.ready)
//		    		this.mapMarkers.addRandomMarkers();		    	
//		    },
//		    
			join: function(username) {
//				geolocate.startGeolocation();
				this.inherited(arguments)
			},
			
		    receive: function(message){
				// check for position message
				if (message.data.latitude) {
					var latLng = new google.maps.LatLng(message.data.latitude, message.data.longitude);

//					geolocate.geoReceive(message);
					// center and zoom the map over the new location if it is me and this is the first time
					if (!this.mapMarkers.getMarker(this._username)) {
						map.setCenter(latLng);
						map.setZoom(this._zoomLevel);	
						// test
//						this.mapMarkers.addRandomMarkers();
//						this.mapMarkers.sort();
					}
					this.mapMarkers.moveMarker(message.data.user, latLng);
					
					return;
				}
				// check for member leaving message
//				if (message.data.leave) {
				if (message.data.membership == "leave") {
					this.mapMarkers.removeMarker(fromUser);
				}
				// announce your location to new users
//				if (message.data.membership=="join")
//					geoPublish();
				// check if this is a system message
				if (message.data.scope == "private" && message.data.user == "System") {
//					addMapMarker
					require(["dojo/_base/connect"], function(connect){
						connect.publish("/bywaze/showSystemMsg", [{ text:text }]);
					});
					return;
				}
		    	this.inherited(arguments);
		    },
		    
        });
        
    });
