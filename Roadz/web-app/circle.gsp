<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
<!--
<html manifest='index2.appcache'>
 -->	
 <!-- prevent cache 
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="pragma" content="no-cache">
-->	
	<title>ByWaze</title>
   <script type="text/javascript" src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
<!--
	<link rel="stylesheet" type="text/css" href="bywaze-release/dojo/dojox/mobile/themes/iphone/base.css">
	<link rel="stylesheet" type="text/css" href="bywaze-release/dojo/dojox/mobile/themes/iphone/TabBar.css">
-->	

		<link href="js/bywaze/resources/FriendsView.css" rel="stylesheet" />
		<script type="text/javascript">
			function getBase() {
				var base = location.href.split("/");
				base.pop();
				base = base.join("/");
				return base;
			}
			// make base global
			_base = getBase();
			
			var dojoConfig = (function(){

				return {
					//parseOnLoad: true,
					async: true,
					deps: ['chat/chat.js'],
					isDebug: true,
					packages: [
					{
						name: "bywaze",
						location: _base + "/js/bywaze"
					}]
				};
			})();
			
		</script>
	<script type="text/javascript" src="js/bywaze/deviceTheme.js" data-dojo-config="mblThemeFiles: ['base','SimpleDialog','TextBox','Button']"></script>
   <script type="text/javascript" src="bywaze-release/dojo/dojo/dojo.js"></script>
   <script src="bywaze-release/dojo/bywaze/bywaze-app.js"></script>
	<script type="text/javascript" src="src.js"></script>
	<link href="demo.css" rel="stylesheet">

    <script type="text/javascript" src="scroll/iscroll.js"></script>
	
    <link rel="stylesheet" type="text/css" href="chat/chat.css">
    <script type="text/javascript" src="chat/geolocate.js"></script>
	<script type="text/javascript">
            var myScroll;
            function loaded() {
            	//myScroll = new iScroll('standard' , { checkDOMChanges: true });
            	myScroll = new iScroll('standard');
            }
            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            document.addEventListener('DOMContentLoaded', loaded, false);

	    var config = {
				contextPath : '${request.contextPath}'
			};

	</script>
<link type="text/css" media="all" href="scroll/iscroll.css" rel="stylesheet">
<link href="scroll/genericdrag.css" rel="stylesheet" type="text/css">
	<link href="chat/genericdrag.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="chat/genericdrag.js"></script>
	
		<script type="text/javascript">
		//document.getElementsByTagName("body").style.property="visibility:hidden";
		(function(){
			
			require(["dijit/registry", "dojox/mobile/parser", "dojo/query", "dojox/mobile/TabBar", "dojox/mobile/Button", "bywaze/Circle", "dojox/mobile/deviceTheme", "dojo/dom-attr", "dojo/_base/array", "dojo/io-query", "dojo/_base/connect", "dojo/dom-style", "dojox/mobile", "dojo/domReady!"], function(registry, mobileParser, query, TabBar, Button, Circle, dm, domAttr, baseArray, ioQuery, connect, domStyle) {
				// If Android....
				if(dm.currentTheme == "android") {
					var imagePath = "../js/bywaze/resources/images/";
					// Update image path on bottom tabbar
					bywaze.prototype.iconLoading = imagePath + "androidLoading.gif";
					// Add a new "iconLoading" attribute to the bywaze instances
					//domAttr.set(document.getElementById("tabBar"), "iconBase", imagePath + "iconStripAndroid.png");
				}

				// Parse the page!
				mobileParser.parse();
				
				hide = function(dlg){
					registry.byId(dlg).hide();
				}

				// start my circle
				//var myCircle = new Circle('<sec:username/>');

				
			});
						
		})();

		// tell us who the logged-in user is and make it global
		USER_NAME = '<sec:username/>';


		</script>
</head>
<body style="visibility: hidden;">
		<div id="map" dojoType="dojox.mobile.ScrollableView" threshold="10000000" data-dojo-props="selected: true">
			<div id="boxc" class="box" style="left: 12px; top: 50px; z-index: 0; ">
				<div class="bar" 
					onmousedown="dragStart(event, 'boxc')"
					ontouchstart="dragStart(event, 'boxc')"
					>My Circle</div>
				<div class="content" >
					<div id="chatroom">
						<div id="chat">
							<div id="standard">
								<div class="scroller">
									<ul id="myList">
									</ul>
								</div>
							</div>
						</div>
					    <div id="members"></div>
					     <div id="joined">
					        <input id="phrase" type="text" />
					        <button id="sendButton" class="button">Send</button>
					    </div>
					</div>
				</div>
			</div>
							<div id="circle" data-dojo-type="bywaze.Circle" data-dojo-props="selected: true">
					<div class="mblSimpleDialogTitle">Alert</div>
					<div id="dlg_messagetext" class="mblSimpleDialogText">This is a sample dialog.</div>
					<button data-dojo-type="dojox.mobile.Button" class="mblSimpleDialogButton" style="width:100px;" onclick="hide('dlg_message')">OK</button>
				</div>
			
		</div>

</body>
</html>
