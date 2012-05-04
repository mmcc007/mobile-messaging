<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<title>Mobile App</title>
	<link rel="stylesheet" type="text/css" href="../dojo-1.7.1/dojox/mobile/themes/iphone/base.css">
	<link rel="stylesheet" type="text/css" href="../dojo-1.7.1/dojox/mobile/themes/iphone/TabBar.css">
<!-- 	<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.7.2/dojo/dojo.js" djConfig="parseOnLoad: true, async: true, mblAlwaysHideAddressBar: true"></script> -->
		<link href="../js/bywaze/resources/FriendsView.css" rel="stylesheet" />
		<script type="text/javascript">
			
			var dojoConfig = (function(){
				var base = location.href.split("/");
				base.pop();
				base = base.join("/");
				
				return {
					async: true,
					isDebug: true,
					packages: [{
						name: "bywaze",
						location: base + "/../js/bywaze"
					}]
				};
			})();
			
		</script>
    <script type="text/javascript" src="../dojo-1.7.1/dojo/dojo.js"></script>
<!-- 	<script type="text/javascript" src="src.js"></script> -->
<script type="text/javascript">
require([
     	"dojox/mobile/parser",
     	"dojox/mobile",
     	"dojox/mobile/ScrollableView",
//     	"dojox/layout/FloatingPane",
//     	"dojox/mobile/ToolbarButton",
//      	"dojox/mobile/TabBar",
//      	"dojox/mobile/TextBox",
//     	"dojox/cometd",
//     	"dojox/cometd/timestamp",
//     	"dojox/cometd/ack",
//     	"dojox/cometd/reload",
//      	"dojox/mobile/compat"
     ]);
</script>
		<script>
			
			// Require the xhr module
			require(["dojo/_base/xhr", "dojo/on", "dojo/dom", "dojo/json", "dojo/io-query", "dojo/domReady!"],
				function(xhr, on, dom, json, ioQuery) {
					
					// Get the content node
					var contentNode = dom.byId("contentNode");
					var params = ioQuery.queryToObject(window.location.search.slice(1));
					var provider = params.provider;
					var code = params.code;

					// Using xhr.get, as no information is being sent -- only requesting
					function getJSON() {
						xhr.get({
							// The URL of the request
							url: "http://localhost:8080/Roadz/inviter/contacts?provider=" + provider + "&code=" + code,
							// Handle as JSON Data
							handleAs: "json",
							// The success callback with result from server
							load: function(newContent) {
								// Update with content
								contentNode.style.display = "";
								contentNode.innerHTML = "<strong>JSON loaded from server:</strong><br /><br />";
								for (var i = newContent.length - 1; i >= 0; i--) {
									contentNode.innerHTML += "<img src='" + newContent[i].photo + "' >"+ newContent[i].address + ", " + newContent[i].name + "<br>"
								};
								contentNode.innerHTML += "<br /><br /><strong>Look at the JSON data in the console as well!</strong>";
								// Log to console
								console.info("JSON loaded from server:  ", newContent);
							},
							// The error handler
							error: function() {
								// Do nothing -- keep old content there
								// Log to console
								console.info("JSON not loaded from server:  ");
							}
						});
					}
					
					// Connect the button click
					on(dom.byId("getJson"), "click", getJSON);
					
			});
		</script>
		<script>
		(function(){
			
			require(["dojox/mobile/parser", "dojox/mobile/TabBar", "bywaze/FriendsView", "bywaze/ContactsView", "dojox/mobile/deviceTheme", "dojo/dom-attr", "dojo/_base/array", "dojo/io-query", "dojo/_base/connect", "dojo/dom-style", "dojox/mobile", "dojo/domReady!"], function(mobileParser, TabBar, FriendsView, ContactsView, dm, domAttr, baseArray, ioQuery, connect, domStyle) {
				// If Android....
				if(dm.currentTheme == "android") {
					var imagePath = "../js/tweetview/resources/images/";
					// Update image path on bottom tabbar
					TweetView.prototype.iconLoading = imagePath + "androidLoading.gif";
					// Add a new "iconLoading" attribute to the TweetView instances
					//domAttr.set(document.getElementById("tabBar"), "iconBase", imagePath + "iconStripAndroid.png");
				}

				// Parse the page!
				mobileParser.parse();

				var params = ioQuery.queryToObject(window.location.search.slice(1));
				if (params.provider) {
					// turn on contacts view
					console.warn("provider: ", params.provider);
					domStyle.set("friends", "display", "none")
				} else {
					domStyle.set("contacts", "display", "none")					
				}

			});
			
			// Set accounts for bywaze directly on the namespace
			bywaze = {
				ACCOUNTS: {
					//dojo: { enabled: true },
					sitepen: { enabled: true }/*,
					someaccounthatdoesntexist: { enabled: true }*/
				}
			};
			

		})();
		</script>

</head>
<body style="visibility:hidden;" >
		<div id="friends" data-dojo-type="bywaze.FriendsView" data-dojo-props="selected: true">
			<h1 dojoType="dojox.mobile.Heading" fixed="top"
				label="Friends" back="Back" moveTo="back">
				<div id="contactsButton" dojoType="dojox.mobile.ToolBarButton" label="Add" moveTo="invite"
					class="mblColorBlue" style="width: 25px; float: right;"></div>
			</h1>
			<div data-dojo-type="dojox.mobile.RoundRectList" class="friendsviewList"></div>
		</div>


		<div id="invite" data-dojo-type="dojox.mobile.ScrollableView" data-dojo-props="">
		<h1 dojoType="dojox.mobile.Heading" fixed="top"
			label="Invite" back="Back" moveTo="friends">
		</h1>
			<div data-dojo-type="dojox.mobile.RoundRectList" class="friendsviewList">
				<ul>
					<g:each in="${['test', 'facebook', 'google', 'yahoo', 'twitter', 'linkedin', 'windowslive' ]}" var="provider">
						<li>
							<riv:invitationLink provider="${provider}"><img
									src="${resource(dir: 'images', file: provider + '.png')}"/> ${provider}</riv:invitationLink>
						</li>
					</g:each>
				</ul>
			</div>
		</div>

		<div id="contacts" data-dojo-type="bywaze.ContactsView" data-dojo-props="selected: true">
			<h1 dojoType="dojox.mobile.Heading" fixed="top"
				label="Contacts" back="Back" moveTo="invite">
				<div id="inviteButton" dojoType="dojox.mobile.ToolBarButton" label="Inv" 
					class="mblColorBlue" style="width: 25px; float: right;"></div>
			</h1>
					<h1>Demo: Fetch JSON Data</h1>

				<button id="getJson">Get JSON</button>
				<br /><br />

				<pre id="contentNode" style="display:none;"></pre>
				<div data-dojo-type="dojox.mobile.RoundRectList" class="friendsviewList"></div>
		</div>
		<!-- the bottom tabbar -->
		<ul data-dojo-type="dojox.mobile.TabBar" id="tabBar" class="friendsviewTabBar" data-dojo-props="iconBase: '../js/tweetview/resources/images/iconStrip.png'">
			<!-- top left width height -->
			<li data-dojo-type="dojox.mobile.TabBarButton" data-dojo-props="iconPos1:'0,0,29,30', iconPos2:'29,0,29,30', selected: true, moveTo:'friends'">Friends</li>
			<li data-dojo-type="dojox.mobile.TabBarButton" data-dojo-props="iconPos1:'0,29,29,30', iconPos2:'29,29,29,30', moveTo:'mentions'">Mentions</li>
			<li data-dojo-type="dojox.mobile.TabBarButton" data-dojo-props="iconPos1:'0,58,29,30', iconPos2:'29,58,29,30', moveTo:'settings'">Settings</li>
		</ul>

</body>
</html>