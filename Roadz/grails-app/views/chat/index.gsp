<html>
  <head>
    <title>Map</title>
    <meta name="layout" content="atmosphere" />
    <g:javascript src="map/prototype.js" />
    <g:javascript src="map/behaviour.js" />
    <g:javascript src="map/moo.fx.js" />
    <g:javascript src="map/moo.fx.pack.js" />
    <g:javascript src="map/chat.js" />
    <g:javascript>
      app.url = "${resource(dir: '/atmosphere/map')}";
    </g:javascript>
    <style type="text/css">
      #display {
        border: 1px solid #5c8098;
        width: 500px;
        height: 300px;
        margin-bottom: 10px;
        overflow-y: scroll;
      }
      #login-name {
        width: 200px;
      }
      #message {
        width: 500px;
        height: 50px;
      }
    </style>
  </head>
  <body>
	<div id="display"></div>
	<div id="form">
		<div id="system-message">Please input your name:</div>
		<div id="login-form">
			<input id="login-name" type="text" />
            <br />
			<input id="login-button" type="button" value="Login" />
        </div>
		<div id="message-form" style="display: none;">
			<div>
				<textarea id="message" name="message" rows="2" cols="40"></textarea>
				<br />
				<input id="post-button" type="button" value="Post Message" />
			</div>
		</div>
	</div>
    <iframe id="comet-frame" style="display: none;"></iframe>
    <g:if test="${request.xhr}">
  <r:layoutResources disposition="defer"/>
</g:if>
  </body>
</html>
