<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<title>Mobile App</title>
	<link rel="stylesheet" type="text/css" href="../dojo-1.7.1/dojox/mobile/themes/iphone/base.css">
	<link rel="stylesheet" type="text/css" href="../dojo-1.7.1/dojox/mobile/themes/iphone/TabBar.css">
    <script type="text/javascript" src="../dojo-1.7.1/dojo/dojo.js" djConfig="parseOnLoad: true, async: false, mblAlwaysHideAddressBar: true"></script>
<!--     <script type="text/javascript" src="../dojo-1.7.1/dojo/dojo.js" djConfig="parseOnLoad: true, async: false, mblAlwaysHideAddressBar: true"></script> -->
<!-- 	<script type="text/javascript" src="src.js"></script> -->
	<link href="../chat/genericdrag.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../chat/genericdrag.js"></script>
<script type="text/javascript">
require([
      	"dojox/mobile/parser",
     	"dojox/mobile",
     	"dojox/mobile/ScrollableView",
     	"dojox/cometd",
     	"dojox/cometd/timestamp",
     	"dojox/cometd/ack",
     	"dojox/cometd/reload",
     	     ]);
</script>

    <script src="http://maps.google.com/maps/api/js?v=3.8&key=AIzaSyCPgZBX3_gTNaU9hIyPU_6iKkpqcbLUjEk&sensor=true" type="text/javascript"></script>
	<style>
	#map_canvas {
    width:100%;
    height:600px;
     top:0; 
     left:0; 
    position:absolute;
/*     z-index:-1; */
	}
	</style>
	<script type="text/javascript">
	    var config = {
				contextPath : '${request.contextPath}'
			};

		function initialize() {
			// Prepare the map options
		    var latlng = new google.maps.LatLng(34.1153032, -118.1566659);
			var myOptions = {
				zoom : 2,
				center : latlng,
			    disableDefaultUI: true,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			map = new google.maps.Map(document.getElementById("map_canvas"),
					myOptions);

		}
		google.maps.event.addDomListener(window, 'load', initialize);
	</script>
    <link rel="stylesheet" type="text/css" href="../chat/chat.css">
    <script type="text/javascript" src="geolocate.js"></script>
    <script type="text/javascript" src="chat.js"></script>


</head>
<body style="visibility: hidden;">
		<script>
			room.join.call(dojo, 'aaa');
//			dojo.addOnLoad(room, "_init");
		</script>
	<h1 dojoType="dojox.mobile.Heading" fixed="top"
		label="Application Header Bar" back="Back" moveTo="back">
		<div dojoType="dojox.mobile.ToolBarButton" label="Edit"
			class="mblColorBlue" style="width: 25px; float: right;"></div>
	</h1>
	<div id="view1" dojoType="dojox.mobile.ScrollableView"
		threshold="10000000">
		<div id="map_canvas"></div>

	</div>
	<h1 dojoType="dojox.mobile.Heading" fixed="bottom">Application
		Footer Bar</h1>
	<div id="boxB" class="dragbox dragcontent"
		style="left: 100px; top: 50px;">
		<div class="dragcontent" style="width: 14em;"
			ontouchstart="dragStart(event, 'boxB')"
			onmousedown="dragStart(event, 'boxB')">
			dragcontent
			<div id="chatroom">
				<!-- 	<div id="map_canvas" style="width:50%; height:240px;float:left;"></div> -->
				<div id="chat"></div>
				<div id="members"></div>
				<div id="input">
					<div id="joined">
						<input id="phrase" type="text" />
						<button id="sendButton" class="button">Send</button>
						<!--             <button id="leaveButton" class="button">Leave</button> -->
					</div>
				</div>
			</div>
		</div>
	</div>
	<ul dojoType="dojox.mobile.TabBar" fixed="bottom" style="border-bottom:none;">
 		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-16.png" icon2="images/tab-icon-16h.png" selected="true" moveTo="friends">Friends</li> 
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-15.png" icon2="images/tab-icon-15h.png" moveTo="orig">Orig</li>
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-15.png" icon2="images/tab-icon-15h.png" moveTo="checkin">CheckIn</li>
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-10.png" icon2="images/tab-icon-10h.png" moveTo="top25">Top 25</li>
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-11.png" icon2="images/tab-icon-11h.png" moveTo="search">Search</li>
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-13.png" icon2="images/tab-icon-13h.png" moveTo="article">Updates</li>
	</ul>
</body>
</html>