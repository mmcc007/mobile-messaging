<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html manifest='index.appcache'>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- prevent cache 
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="pragma" content="no-cache">
--> 	
	<title>ByWaze</title>
   <script type="text/javascript" src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
	<script type="text/javascript" src="http://cachedcommons.org/cache/jquery-cookie/0.0.0/javascripts/jquery-cookie-min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/jsapi"></script>
	<script type="text/javascript"> 
		google.load("identitytoolkit", "1", {packages: ["mobile_ac"], language:"en"});
	</script>
	<script type="text/javascript">
	   if  ($.cookie("grails_remember_me")!=null) {
    	   window.location = "index2.gsp";
       }

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

		// Check if a new cache is available on page load.
		window.addEventListener('load', function(e) {

		  window.applicationCache.addEventListener('updateready', function(e) {
		    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		      // Browser downloaded a new app cache.
		      // Swap it in and reload the page to get the new hotness.
		      window.applicationCache.swapCache();
		      if (confirm('A new version of this site is available. Load it?')) {
		        window.location.reload();
		      }
		    } else {
		      // Manifest didn't changed. Nothing new to server.
		    }
		  }, false);

		}, false);

	</script>
</head>
<body style="visibility: hidden;">
			<script type="text/javascript">
					// set visibility of body
				document.body.style.visibility='visible';
			</script>
			<div id="navbar"></div>
</body>
</html>
