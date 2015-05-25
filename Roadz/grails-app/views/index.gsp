<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html manifest='index.appcache'>
<head>
	<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- prevent cache -->
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="pragma" content="no-cache">
 	
	<title>ByWaze</title>
   <script type="text/javascript" src="http://ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/jquery-ui.min.js"></script>
<!-- 	<script type="text/javascript" src="http://cachedcommons.org/cache/jquery-cookie/0.0.0/javascripts/jquery-cookie-min.js"></script> -->
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/googleapis/0.0.4/googleapis.min.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/jsapi"></script>
	<script type="text/javascript"> 
		google.load("identitytoolkit", "1", {packages: ["mobile_ac"], language:"en"});
	</script>
	<script type="text/javascript">
	   // if currently logged-in forward to main page and include url
	   function readCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}
	   
	   if  (readCookie("grails_remember_me")!=null) {
// 		    _kmq.push(['record', 'Signed In']);
    	   window.location = "index2.gsp" + window.location.search;
//     	   window.location = "index4.html" + window.location.search;
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
	    // show logged-in user after login
<!-- 
	    <g:if test="${session.login_account != null}" >
		    var userData = {
		      email: '${session.login_account.email}',
		      displayName: '${session.login_account.displayName}',
		      photoUrl: '${session.login_account.photoUrl}',
		    };
		    window.google.identitytoolkit.updateSavedAccount(userData);
		    window.google.identitytoolkit.showSavedAccount('${session.login_account.email}');
	    </g:if>
 -->
 		});

		// Check if a new cache is available on page load.
		window.addEventListener('load', function(e) {

		  window.applicationCache.addEventListener('updateready', function(e) {
		    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		      // Browser downloaded a new app cache.
		      // Swap it in and reload the page to get the new hotness.
		      window.applicationCache.swapCache();
		      if (confirm('A new version of ByWaze is available. Load it?')) {
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
<script type="text/javascript">
//     var _kmq = _kmq || [];
//     var _kmk = _kmk || 'fbf0e012c9938680c1a136b317e3de3ead798e04';
//     function _kms(u){
//     setTimeout(function(){
//     var d = document, f = d.getElementsByTagName('script')[0],
//     s = d.createElement('script');
//     s.type = 'text/javascript'; s.async = true; s.src = u;
//     f.parentNode.insertBefore(s, f);
//     }, 1);
//     }
//     _kms('//i.kissmetrics.com/i.js');
//     _kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');
    </script>
</html>
