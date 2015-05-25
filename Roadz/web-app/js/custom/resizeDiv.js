define(["dojo/aspect", "dojo/_base/declare", "dojo/_base/lang", "dojo/_base/window",
		"dojo/dom","dojo/dom-geometry", "dojo/has", "dojo/dom-style",
		"dojo/io/script", "dijit/registry", "dojox/mobile/ProgressIndicator", "dojo/_base/lang", 'dojox/timing'
],function(aspect, declare, lang, win, dom, domGeom, has, style, script, registry, ProgressIndicator, lang, timing){
	// Map class
	var Map = declare(null, {
		constructor: function(args){
			this.id = args.id;
			var opt = (args.options ? args.options : {});
			this.options = lang.mixin({
				zoom : 8,
				disableDefaultUI: true,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			}, opt);
		},
		load: function(){
			this.map = new google.maps.Map(document.getElementById(this.id),
					this.options);
		},
		resize: function(){
			console.log("google.resize()");
			google.maps.event.trigger(this.map, "resize");
		}
	});
	
	var isLoaded = false; // flag to indicate whether the map is loaded
//	var prog; // progress bar

	var iphoneAddressBarHeight = 64;
	var iphoneHeightWithAddressBar = 416;
	
	function showMap(latLng) {
		var googleMap = new Map({
			id : "googleMap",
			options: {
				center: (latLng ? latLng : new google.maps.LatLng(-34.397, 150.644))
			}
		});
		googleMap.load();
//		prog.stop();
		// fix resize problem after rotation
		aspect.after(registry.byId("map"), "resize", function(){
			fullScreenWindow();
			googleMap.resize();
		});
		aspect.after(window, "scrollTo", function(){
			googleMap.resize();
		});
		// since some browsers to not fire the resize event after removing the address bar
			var t = new timing.Timer(4000);
		    
		    t.onTick = function(){
				fullScreenWindow();
				googleMap.resize();
			}
			t.onStart = function(){
			 console.info("Starting timer");
			}
			t.start();
//			connect.publish("/dojox/mobile/resizeAll", [evt, root]);

		isLoaded = true;
	}
	
	var mapDemo = lang.getObject("bywaze.map", true);
	mapDemo.initMap = function(){
		if (navigator.geolocation)
			navigator.geolocation.getCurrentPosition(function(position) {
				var myLatLng = new google.maps.LatLng(
						position.coords.latitude, position.coords.longitude);
				showMap(myLatLng);
			}, function(){showMap();});
		else
			showMap();
	};

	function fullScreenWindow() {
		var mapBox = domGeom.getMarginBox("googleMap");
		mapBox.w = win.global.innerWidth;
//    	if (has('safari') && window.innerHeight==iphoneHeightWithAddressBar) {
//    		mapBox.h = window.outerHeight;
//    		window.innerHeight += iphoneAddressBarHeight;
//    	}
    	if (has('safari')) {
    		console.log("reset for safari");
//    		mapBox.h = window.outerHeight;
    		mapBox.h = 600;
    	}
    	else mapBox.h = window.innerHeight;
		domGeom.setMarginBox("googleMap", mapBox);
		mapBox = domGeom.getMarginBox("googleMap");
		var googleMapNode = dom.byId("googleMap");
		style.set("googleMap", "height", "600px");
//		googleMapNode.style.height = "600px";
		mapBox.h = "600px";
		console.log(mapBox.w  +', ' + mapBox.h  +', ' + win.global.innerWidth +', ' + win.global.innerHeight + ', ' + window.outerWidth+ ', ' + window.outerHeight);
		console.log("googleMap: " + googleMapNode.style.width  +', ' + googleMapNode.style.height);
	};
	
	function loadMap(){
		script.get({
			url : "http://maps.google.com/maps/api/js",
			content : {
				sensor : false,
				key: "AIzaSyCPgZBX3_gTNaU9hIyPU_6iKkpqcbLUjEk",
				v: "3.8",
				callback : "bywaze.map.initMap"
			},
			timeout: 120000,
			error: function(err){
//				prog.stop();
				dom.byId("googleMap").innerHTML = err;
			}
		});
	};
	
	return {
		init: function(){
			// remove the address bar
//			window.scrollTo(0,1);
			// lazy load
//			dojo.subscribe("/dojox/mobile/startView","map", function() {
//					registry.byId("map").on("AfterTransitionIn", function() {
				if (isLoaded){
					return;
				}
//				prog = ProgressIndicator.getInstance();
//				prog.stop();
//				dom.byId("rightPane").appendChild(prog.domNode);
//				prog.start();
				fullScreenWindow();
				loadMap();
//			});
		}
	};
});
