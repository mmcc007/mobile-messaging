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
	     	"dojox/mobile/TextBox",
	     	"dojox/mobile/compat"
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
		google.maps.event.addDomListener(window, 'load', initialize);
	</script>
	<link href="chat/genericdrag.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="chat/genericdrag.js"></script>
	
	
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
			<div id="map_canvas"></div>
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
</body>
</html>
