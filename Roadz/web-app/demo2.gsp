<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<title>ByWaze</title>
	<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojox/mobile/themes/iphone/base.css">
	<link rel="stylesheet" type="text/css" href="http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojox/mobile/themes/iphone/TabBar.css">
<!-- 	<script src="http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojo/dojo.js" djConfig="parseOnLoad: true, async: true, mblAlwaysHideAddressBar: true"></script> -->
    <script type="text/javascript" src="dojo-1.7.1/dojo/dojo.js" djConfig="parseOnLoad: true, async: false, mblAlwaysHideAddressBar: true"></script>
	<script type="text/javascript">
	require([
	     	"dojox/mobile/parser",
	     	"dojox/mobile",
	     	"dojox/mobile/ScrollableView",
	     	"dojox/mobile/View",
	     	"dojox/mobile/TabBar",
// 	     	"dojox/mobile/TextBox",
// 	     	"dojox/mobile/compat"
	     ]);
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
	        logoutUrl: "logout",
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

    <script src="http://maps.google.com/maps/api/js?v=3.8&key=AIzaSyCPgZBX3_gTNaU9hIyPU_6iKkpqcbLUjEk&sensor=true" type="text/javascript"></script>
	
    <link rel="stylesheet" type="text/css" href="chat/chat.css">
    <script type="text/javascript" src="chat/geolocate.js"></script>
    <script type="text/javascript" src="chat/chat.js"></script>
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
// 		google.maps.event.addDomListener(window, 'load', initialize);
	</script>
	<link href="chat/genericdrag.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="chat/genericdrag.js"></script>
	<link href="tmp4/demo.css" rel="stylesheet">
	<link href="tmp4/touchscroll.css" rel="stylesheet">
	
	
</head>
<body style="visibility:hidden;">
		<sec:ifNotLoggedIn>
			<div id="navbar"></div>
	    </sec:ifNotLoggedIn>
		<sec:ifLoggedIn>
		<script>
			room.join.call(dojo, '<sec:username/>');
		</script>
<%-- 			<div>Welcome back <sec:username/>!</div> --%>

		<div id="friends" dojoType="dojox.mobile.ScrollableView" threshold="10000000">
			<h1 dojoType="dojox.mobile.Heading" label="ByWaze" back="Back"
				moveTo="back">
				<div dojoType="dojox.mobile.ToolBarButton" label="Edit"
					class="mblColorBlue" style="width: 25px; float: right"></div>
			</h1>
				<div id="chatx" dojoType="dojox.mobile.View">
				asdfasdf<br>
				asdfasdf<br>
				asdfasdf<br>
				asdfasdf<br>
				asdfasdf<br>
				asdfasdf<br>
				asdfasdf<br>
				asdfasdf<br>
				asdfasdf<br>
				
				</div>
			<div id="map_canvas"></div>
	<div id="boxB" class="dragbox dragcontent"
		style="left: 100px; top: 50px;">
		<div class="dragcontent" style="width: 14em;"
			ontouchstart="dragStart(event, 'boxB')"
			onmousedown="dragStart(event, 'boxB')">
			dragcontent
			<div id="chatroom">
				<div id="chat">

		<div id="demo">
			<div class="toolbar">
				<h1>TouchScroll Demo</h1>
			</div>

			<div class="scroller" id="about">

				<h2>Yet to be done</h2>

			</div>
			<div class="scroller" id="twodim">
				<h2>Yet to be done</h2>
			</div>

			<div class="scroller" id="config">
				<label>threshold: <input type="text" name="threshold"></label>
				<label>scrollHandleMinSize: <input type="text"
					name="scrollHandleMinSize"></label>
				<fieldset title="flicking">
					<legend>flicking</legend>
					<label>triggerThreshold: <input type="text"
						name="triggerThreshold"></label> <label>friction: <input
						type="text" name="friction"></label> <label>minSpeed: <input
						type="text" name="minSpeed"></label> <label>timingFunc: <input
						type="text" name="timingFunc"></label>
				</fieldset>

				<fieldset title="elasticity">
					<legend>elasticity</legend>
					<label>factorDrag: <input type="text" name="factorDrag"></label>
					<label>factorFlick: <input type="text" name="factorFlick"></label>
					<label>max: <input type="text" name="max"></label>
				</fieldset>

				<fieldset title="snapBack">
					<legend>snapBack</legend>
					<label>timingFunc: <input type="text" name="timingFunc"></label>
					<label>defaultTime: <input type="text" name="defaultTime"></label>
					<label>alwaysDefaultTime: <input type="checkbox"
						name="alwaysDefaultTime"></label>
				</fieldset>

			</div>

			<div class="tabs">
				<a href="#about" class="current">About</a> 
				<a href="#twodim">Full</a> <a href="#config">Config</a>
			</div>
		</div>
				
				</div>			
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
 		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-16.png" icon2="images/tab-icon-16h.png" selected="true" moveTo="friends">Friends</li> 
		<li dojoType="dojox.mobile.TabBarButton" icon1="images/tab-icon-13.png" icon2="images/tab-icon-13h.png" moveTo="article">Updates</li>
	</ul>
	    </sec:ifLoggedIn>
	<script src="tmp4/touchscroll.min.js"></script>
	<script>
		(function() {
			var scrollers = {};

			function showScreen(screenId) {
				try {
					var activeScreen = document
							.querySelector("#demo .scroller#" + screenId);
				} catch (e) {
					return;
				}

				if (!activeScreen) {
					return;
				}

				Array.prototype.forEach.call(document
						.querySelectorAll("#demo .scroller"), function(screen) {
					screen.style.display = "none";
				});
				activeScreen.style.display = "block";

				scrollers[screenId].setupScroller(true);
			}

			Array.prototype.forEach.call(document
					.querySelectorAll("#demo .scroller"), function(scroller) {
				scrollers[scroller.id] = new TouchScroll(scroller, {
					elastic : true
				});
			});

			document.querySelector("#demo .tabs").addEventListener(
					"click",
					function(event) {
						var screenId = event.target.getAttribute("href");
						if (screenId) {
							showScreen(screenId.slice(1));

							Array.prototype.forEach.call(this.children,
									function(tab) {
										tab.className = "";
									});
							event.target.className = "current";
						}
					}, false);

			var hash = location.hash.slice(1);
			showScreen(hash || "about");
			tab = document.querySelector('#demo .tabs [href="' + location.hash
					+ '"]');
			if (tab) {
				Array.prototype.forEach.call(tab.parentNode.children, function(
						tab) {
					tab.className = "";
				});
				tab.className = "current";
			}

			function onConfigChange(evt) {
				var node = evt.target;
				if (node.nodeName.toLowerCase() != "input") {
					return
				}

				var value = node.value;
				var group = node.parentNode.parentNode;
				var curNamespace = (group.nodeName.toLowerCase() == "fieldset") ? TouchScroll.prototype.config[group.title]
						: TouchScroll.prototype.config;
				var valueName = node.name;
				// Parse value
				if (curNamespace[valueName] instanceof Array) { // Is it an array?
					curNamespace[valueName] = value.split(",").map(parseFloat);
				} else if (node.type == "checkbox") {
					curNamespace[valueName] = node.checked;
				} else {
					curNamespace[valueName] = parseFloat(value);
				}
			}

			document.querySelector("#config").addEventListener("keyup",
					onConfigChange, false);
			document.querySelector("#config").addEventListener("change",
					onConfigChange, false);

			//
			// Init config values
			//
			var configNode = document.getElementById("config");
			var inputNodes = document.querySelectorAll("input");
			for ( var i = 0, l = inputNodes.length, node; i < l; i++) {
				node = inputNodes[i];
				var group = node.parentNode.parentNode;
				var curNamespace = (group.nodeName.toLowerCase() == "fieldset") ? TouchScroll.prototype.config[group.title]
						: TouchScroll.prototype.config;
				if (node.type == "checkbox") {
					node.checked = curNamespace[node.name];
				} else {
					node.value = curNamespace[node.name];
				}
			}

		}())
	</script>
</body>
</html>
