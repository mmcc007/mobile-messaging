<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<title>ByWaze</title>
	<link rel="stylesheet" type="text/css" href="dojo-1.7.1/dojox/mobile/themes/iphone/base.css">
	<link rel="stylesheet" type="text/css" href="dojo-1.7.1/dojox/mobile/themes/iphone/TabBar.css">
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
					async: false,
					isDebug: true,
					packages: [{
						name: "bywaze",
						location: _base + "/js/bywaze"
					}]
				};
			})();
			
		</script>
	<script type="text/javascript" src="js/bywaze/deviceTheme.js" data-dojo-config="mblThemeFiles: ['base','SimpleDialog','TextBox','Button','Slider']"></script>
    <script type="text/javascript" src="dojo-1.7.1/dojo/dojo.js"></script>
	<script type="text/javascript" src="src.js"></script>
<script type="text/javascript">
</script>
	<link href="demo.css" rel="stylesheet">
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/jsapi"></script>
	<script type="text/javascript"> 
		google.load("identitytoolkit", "1", {packages: ["mobile_ac"], language:"en"});
	</script>
	<script type="text/javascript">
	  $(function() {
	    window.google.identitytoolkit.setConfig({
	        developerKey: "AIzaSyBxRA1SwApaq3WQUreST9m_kJfVMTO3sPw",
	        companyName: "Orbsoft",
	        callbackUrl: "http://${request.serverName}:${request.serverPort}${request.contextPath}/gitkit?rp_fullPageRedirect=true",
	        realm: "",
	        userStatusUrl: "/userstatus",
	        loginUrl: "/login",
	        signupUrl: "/signup",
	        homeUrl: "${request.requestURI}",
	        logoutUrl: "/logout",
	        idps: ["Gmail", "Yahoo", "AOL"],
	        tryFederatedFirst: true,
	        useCachedUserStatus: false,
	        useContextParam: false
	    });
	    $("#navbar").accountChooser();
	    <g:if test="${session.login_account != null}" >
		    var userData = {
		      email: '${session.login_account.email}',
		      displayName: '${session.login_account.displayName}',
		      photoUrl: '${session.login_account.photoUrl}',
		    };
		    window.google.identitytoolkit.updateSavedAccount(userData);
		    window.google.identitytoolkit.showSavedAccount('${session.login_account.email}');
	    </g:if>
	    });
	</script>

    <script type="text/javascript" src="scroll/iscroll.js"></script>
    <script src="http://maps.google.com/maps/api/js?v=3.8&key=AIzaSyCPgZBX3_gTNaU9hIyPU_6iKkpqcbLUjEk&sensor=true" type="text/javascript"></script>
	
    <link rel="stylesheet" type="text/css" href="chat/chat.css">
    <script type="text/javascript" src="chat/geolocate.js"></script>
    <script type="text/javascript" src="chat/chat.js"></script>
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
<link type="text/css" media="all" href="scroll/iscroll.css" rel="stylesheet">
<link href="scroll/genericdrag.css" rel="stylesheet" type="text/css">
	<link href="chat/genericdrag.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="chat/genericdrag.js"></script>
	
		<script>
		(function(){
			
			require(["dijit/registry", "dojox/mobile/parser", "dojox/mobile/TabBar", "dojox/mobile/Button", "bywaze/FriendsView", "bywaze/ContactsView", "bywaze/InvitesView", "bywaze/SystemDialog", "dojox/mobile/deviceTheme", "dojo/dom-attr", "dojo/_base/array", "dojo/io-query", "dojo/_base/connect", "dojo/dom-style", "dojox/mobile", "dojo/domReady!"], function(registry, mobileParser, TabBar, Button, FriendsView, ContactsView, InvitesView, SystemDialog, dm, domAttr, baseArray, ioQuery, connect, domStyle) {
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

				hide = function(dlg){
					registry.byId(dlg).hide();
				}

			});
						
			// Set current user for bywaze directly on the namespace
			//username = "sec:username/>";

		})();
		</script>
</head>
<body style="visibility:hidden;">
		<sec:ifNotLoggedIn>
			<div id="navbar"></div>
	    </sec:ifNotLoggedIn>
		<sec:ifLoggedIn>
		<script>
			room.join.call(dojo, '<sec:username/>');
		</script>

				<div id="dlg_message" data-dojo-type="bywaze.SystemDialog">
					<div class="mblSimpleDialogTitle">Alert</div>
					<div id="dlg_messagetext" class="mblSimpleDialogText">This is a sample dialog.</div>
					<button data-dojo-type="dojox.mobile.Button" class="mblSimpleDialogButton" style="width:100px;" onclick="hide('dlg_message')">OK</button>
				</div>

		<div id="map" dojoType="dojox.mobile.ScrollableView" threshold="10000000" data-dojo-props="selected: true">
			<h1 dojoType="dojox.mobile.Heading" label="ByWaze" back="Friends" moveTo="friends">
				<div dojoType="dojox.mobile.ToolBarButton" label="Edit"
					class="mblColorBlue" style="width: 25px; float: right"></div>
			</h1>
			<div id="map_canvas"></div>
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
		</div>

		<div id="friends" data-dojo-type="bywaze.FriendsView">
			<h1 dojoType="dojox.mobile.Heading" fixed="top"
				label="Friends" back="Back" moveTo="map" transition="fade">
				<div id="friendsRefreshButton" dojoType="dojox.mobile.ToolBarButton" label="Refresh" 
					data-dojo-props="icon: '/Roadz/js/bywaze/resources/images/refresh.png'"
					class="mblColorBlue friendsRefreshButton" style="width: 25px; float: right;" ></div>
				<div id="contactsButton" dojoType="dojox.mobile.ToolBarButton" label="Add" moveTo="invite"
					class="mblColorBlue" style="width: 25px; float: right;" transition="slide"></div>
			</h1>
			<div data-dojo-type="dojox.mobile.RoundRectList" class="friendsviewList"></div>
		</div>

		<div id="invite" data-dojo-type="dojox.mobile.ScrollableView" data-dojo-props="">
		<h1 dojoType="dojox.mobile.Heading" fixed="top"
			label="Invite" back="Back" moveTo="friends">
		</h1>
			<div data-dojo-type="dojox.mobile.RoundRectList" class="friendsviewList">
				<ul>
					<g:each in="${[ 'facebook', 'twitter' ]}" var="provider">
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
					class="mblColorBlue inviteButton" style="width: 25px; float: right;"></div>
			</h1>
			<pre id="formResultNode"></pre>
			<form id="formNode">
				<ul data-dojo-type="dojox.mobile.EdgeToEdgeList" class="friendsviewList" select="multiple"></ul>
			</form>
		</div>

	<div id="pendingInvites" dojoType="bywaze.InvitesView">
			<h1 dojoType="dojox.mobile.Heading" fixed="top" label="Pending Invites">
				<div id="acceptInviteButton" dojoType="dojox.mobile.ToolBarButton" label="Acpt" 
					class="mblColorBlue acceptInviteButton" style="width: 30px; float: right;"></div>
				<div id="pendingInvitesRefreshButton" dojoType="dojox.mobile.ToolBarButton" label="Refresh" 
					class="mblColorBlue pendingInvitesRefreshButton" style="width: 35px; float: right;" ></div>
			</h1>
			<pre id="acceptInvitesFormResultNode"></pre>
			<form id="acceptInvitesFormNode">
				<ul data-dojo-type="dojox.mobile.EdgeToEdgeList" class="friendsviewList" select="multiple"></ul>
			</form>
	</div>

		<div id="orig" dojoType="dojox.mobile.View" selected="false">
		<ul dojoType="dojox.mobile.TabBar" barType="segmentedControl" fixed="top">
			<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-16.png" icon2="images/tab-icon-16h.png" moveTo="view1" selected="true">New</li>
			<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-15.png" icon2="images/tab-icon-15h.png" moveTo="view2">What's Hot</li>
			<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-10.png" icon2="images/tab-icon-10h.png" moveTo="view3">Genius</li>
		</ul>

		<div id="view1" dojoType="dojox.mobile.ScrollableView" selected="true">
			<ul dojoType="dojox.mobile.EdgeToEdgeList" class="list1">
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/icon-1.png">
								</td>
								<td>
									<a class="lnk" href="#">Dojo: Traditional Karate-do Spirit</a><br>
									Sarah Connor Hardcover<br>
									Eligible for FREE Super Saver Shipping
								</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/icon-1.png">
								</td>
								<td>
									<a class="lnk" href="#">Japanese Martial Arts Dojo</a><br>
									Martin Parker Hardcover<br>
									Eligible for FREE Super Saver Shipping<br>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/icon-1.png">
								</td>
								<td>
									<a class="lnk" href="#">Total Solar Eclipse</a><br>
									Steven Young Hardcover<br>
									Eligible for FREE Super Saver Shipping<br>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/icon-1.png">
								</td>
								<td>
									<a class="lnk" href="#">The History of Java Coffee</a><br>
									Marco Rodriguez Hardcover<br>
									Eligible for FREE Super Saver Shipping<br>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/icon-1.png">
								</td>
								<td>
									<a class="lnk" href="#">The Principles of Spider's Web</a><br>
									Melissa Morgan Hardcover<br>
									Eligible for FREE Super Saver Shipping<br>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
			</ul>
		</div>

		<div id="view2" dojoType="dojox.mobile.ScrollableView">
			<ul dojoType="dojox.mobile.EdgeToEdgeList" id="list2">
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/a-icon-2-41x41.png">
								</td>
								<td>
									<a class="lnk" href="#">The Principles of Spider's Web</a><br>
									Melissa Morgan Hardcover<br>
									Eligible for FREE Super Saver Shipping<br>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/a-icon-2-41x41.png">
								</td>
								<td>
									<a class="lnk" href="#">The History of Java Coffee</a><br>
									Marco Rodriguez Hardcover<br>
									Eligible for FREE Super Saver Shipping<br>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/a-icon-2-41x41.png">
								</td>
								<td>
									<a class="lnk" href="#">Dojo: Traditional Karate-do Spirit</a><br>
									Sarah Connor Hardcover<br>
									Eligible for FREE Super Saver Shipping
								</td>
							</tr>
						</tbody>
					</table>
				</li>
				<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size: 10px;">
					<table>
						<tbody>
							<tr>
								<td>
									<img src="images/a-icon-2-41x41.png">
								</td>
								<td>
									<a class="lnk" href="#">Total Solar Eclipse</a><br>
									Steven Young Hardcover<br>
									Eligible for FREE Super Saver Shipping<br>
								</td>
							</tr>
						</tbody>
					</table>
				</li>
			</ul>
		</div>

		<div id="view3" dojoType="dojox.mobile.ScrollableView">
			<h2 dojoType="dojox.mobile.RoundRectCategory">Generic Mobile Device</h2>
			<ul dojoType="dojox.mobile.RoundRectList">
				<li dojoType="dojox.mobile.ListItem" rightText="AcmePhone">
					Network											   
				</li>												   
				<li dojoType="dojox.mobile.ListItem" rightText="AcmePhone">
					Line
				</li>
				<li dojoType="dojox.mobile.ListItem" rightText="1024">
					Songs
				</li>
				<li dojoType="dojox.mobile.ListItem" rightText="10">
					Videos
				</li>
				<li dojoType="dojox.mobile.ListItem" rightText="96">
					Photos
				</li>
				<li dojoType="dojox.mobile.ListItem" rightText="2">
					Applications
				</li>
				<li dojoType="dojox.mobile.ListItem" rightText="29.3 BG">
					Capacity
				</li>
				<li dojoType="dojox.mobile.ListItem" rightText="28.0 BG">
					Available
				</li>
				<li dojoType="dojox.mobile.ListItem" rightText="3.0 (7A341)">
					Version
				</li>
			</ul>
		</div>
	</div>

	<div id="friends2" dojoType="dojox.mobile.ScrollableView">
		<h1 dojoType="dojox.mobile.Heading" fixed="top">ByWaze
				<div dojoType="dojox.mobile.ToolBarButton" label="Map" moveTo="map"
					class="mblColorBlue" style="width: 25px; float: left"></div>
				<div id="addFriendsButton" dojoType="dojox.mobile.ToolBarButton" label="Add" moveTo="contacts"
					class="mblColorBlue" style="width: 25px; float: right"></div>
		</h1>
		<ul dojoType="dojox.mobile.EdgeToEdgeList" class="list1" id="categ1">
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 1</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 2</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 3</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 4</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 5</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 6</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 7</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 8</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 9</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 10</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 11</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 12</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 13</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 14</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 15</li>
		</ul>
	</div>

	<div id="contacts2" dojoType="dojox.mobile.ScrollableView">
		<h1 dojoType="dojox.mobile.Heading" fixed="top" back="Friends" moveTo="friends" >Contacts
				<div id="inviteButton2" dojoType="dojox.mobile.ToolBarButton" label="Invite"
					class="mblColorBlue" style="width: 25px; float: right"></div>
		</h1>
		<ul dojoType="dojox.mobile.EdgeToEdgeList" class="list1" id="categ2">
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 1</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 2</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 3</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 4</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 5</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 6</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 7</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 8</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 9</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 10</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 11</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 12</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 13</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 14</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">Category 15</li>
		</ul>
	</div>

	<div id="top25" dojoType="dojox.mobile.ScrollableView">
		<h1 dojoType="dojox.mobile.Heading" fixed="top">News</h1>
		<h2 dojoType="dojox.mobile.RoundRectCategory">Top Stories</h2>
		<ul dojoType="dojox.mobile.RoundRectList">
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">
				Top 10 news stories of the decade
			</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">
				Create client-side diagrammatic interaction in Web applications with GFX
			</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem">
				Explores advanced topics in the new Java framework for implementing and consuming REST-based Web services, Part 3
			</li>
		</ul>
	</div>

	<div id="search" dojoType="dojox.mobile.ScrollableView">
		<h1 dojoType="dojox.mobile.Heading" fixed="top">Search Result</h1>
		<ul dojoType="dojox.mobile.RoundRectList">
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size:10px">
				1. <a href="#" class="lnk">Dojo: Traditional Karate-do Spirit</a><br>
				Sarah Connor Hardcover<br>
				Eligible for FREE Super Saver Shipping<br>
				<font color="red">$14.50 (50%)</font> In Stock<br>
				# (531)
			</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size:10px">
				2. <a href="#" class="lnk">Japanese Martial Arts Dojo</a><br>
				Martin Parker Hardcover<br>
				<font color="red">$14.00 (60%)</font> In Stock<br>
				# (173)
			</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size:10px">
				3. <a href="#" class="lnk">Total Solar Eclipse</a><br>
				Steven Young Hardcover<br>
				Get it by Mar. 2 if you order in the next <font color="green"><b>16 hours</b></font><br>
				Eligible for FREE Super Saver Shipping<br>
				<font color="red">$9.50 (62%)</font> In Stock<br>
				# (1199)
			</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size:10px">
				4. <a href="#" class="lnk">The History of Java Coffee</a><br>
				Marco Rodriguez Hardcover<br>
				<font color="blue">Not Available</font>
			</li>
			<li class="mblVariableHeight" dojoType="dojox.mobile.ListItem" style="font-size:10px">
				5. <a href="#" class="lnk">The Principles of Spider's Web</a><br>
				Melissa Morgan Hardcover<br>
				Eligible for FREE Super Saver Shipping<br>
				<font color="red">$12.00 (60%)</font> In Stock<br>
				# (1847)
			</li>
		</ul>
	</div>

	<div id="article" dojoType="dojox.mobile.ScrollableView" style="background-color:white;height:100%">
		<h1 dojoType="dojox.mobile.Heading" fixed="top">Article</h1>
		<div class="content">
			<div id="controller-list" role="navigation">
				<h2>Available Controllers:</h2>
				<ul>
					<g:each var="c" in="${grailsApplication.controllerClasses.sort { it.fullName } }">
						<li class="controller"><g:link controller="${c.logicalPropertyName}">${c.fullName}</g:link></li>
					</g:each>
				</ul>
			</div>
		<div id="status" role="complementary">
			<h1>Application Status</h1>
			<ul>
				<li>App version: <g:meta name="app.version"/></li>
				<li>Grails version: <g:meta name="app.grails.version"/></li>
				<li>Groovy version: ${org.codehaus.groovy.runtime.InvokerHelper.getVersion()}</li>
				<li>JVM version: ${System.getProperty('java.version')}</li>
				<li>Reloading active: ${grails.util.Environment.reloadingAgentEnabled}</li>
				<li>Controllers: ${grailsApplication.controllerClasses.size()}</li>
				<li>Domains: ${grailsApplication.domainClasses.size()}</li>
				<li>Services: ${grailsApplication.serviceClasses.size()}</li>
				<li>Tag Libraries: ${grailsApplication.tagLibClasses.size()}</li>
			</ul>
			<h1>Installed Plugins</h1>
			<ul>
				<g:each var="plugin" in="${applicationContext.getBean('pluginManager').allPlugins}">
					<li>${plugin.name} - ${plugin.version}</li>
				</g:each>
			</ul>
		</div>
			<h3 class="title">Did you know?</h3>
			<h4 class="subtitle">Features of dojox.mobile</h4>
			<h5 class="subsubtitle">No images are used</h5>
			<ul class="lst">
			  	<li>UI parts consist of DOM and CSS3.</li>
				<li>Only application icons are images.</li>
			</ul>

			<h5 class="subsubtitle">Removed dependencies on the dojo modules as much as possible</h5>
			<ul class="lst">
			  	<li>No dependencies even on some of the essential core modules like Templated, Container, Contained, dojo.query, or dojo.parser.</li>
			</ul>

			<h5 class="subsubtitle">Support for CSS sprite</h5>
			<ul class="lst">
				<li>Application icon images can be aggregated into a single file to reduce the number of http requests.</li>
			</ul>

			<h5 class="subsubtitle">Possible to use the webkitMobile build option (when PC browser support is unnecessary)</h5>
			<ul class="lst">
				<li>Drops IE and Firefox-specific code at build time, and thus reduces the dojo core size</li>
			</ul>
		</div>
	</div>

	<ul dojoType="dojox.mobile.TabBar" fixed="bottom" style="border-bottom:none;">
 		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-16.png" icon2="images/tab-icon-16h.png" selected="true" moveTo="map">Friends</li> 
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-15.png" icon2="images/tab-icon-15h.png" moveTo="pendingInvites">Invites</li>
<!--
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-15.png" icon2="images/tab-icon-15h.png" moveTo="checkin">CheckIn</li>
-->
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-10.png" icon2="images/tab-icon-10h.png" moveTo="top25">Top 25</li>
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-11.png" icon2="images/tab-icon-11h.png" moveTo="search">Search</li>
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-13.png" icon2="images/tab-icon-13h.png" moveTo="article">Updates</li>
	</ul>
		<script>
			var provider;
			var code;
		(function(){
			
			require(["dojox/mobile/parser", "dojox/mobile/TabBar", "bywaze/FriendsView", "bywaze/ContactsView", "dojox/mobile/deviceTheme", "dojo/dom-attr", "dojo/_base/array", "dojo/io-query", "dojo/_base/connect", "dojo/dom-style", "dojox/mobile", "dojo/domReady!"], function(mobileParser, TabBar, FriendsView, ContactsView, dm, domAttr, baseArray, ioQuery, connect, domStyle) {
				var params = ioQuery.queryToObject(window.location.search.slice(1));
				if (params.provider) {
					// turn on contacts view
					console.warn("turn on contacts view: provider: ", params.provider);
					domStyle.set("map", "display", "none")
				} else {
					// turn on map view
//					console.warn("turn on map view");
//					domStyle.set("map", "display", "block")
					domStyle.set("contacts", "display", "none")					
				}

			});
						

		})();
		</script>	
	    </sec:ifLoggedIn>
</body>
</html>
