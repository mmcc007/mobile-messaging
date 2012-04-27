<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <script type="text/javascript" src="${pageContext.request.contextPath}/dojo/dojo.js.uncompressed.js"></script>
<!--     <script type="text/javascript" src="application.js"></script> -->
    <title>Cometd chat</title>
<!--     <script type="text/javascript" src="../../dojo/dojo.js"></script> -->
    <script type="text/javascript" src="chat.js"></script>
    <script type="text/javascript" src="geolocate.js"></script>
    <script src="http://maps.google.com/maps/api/js?v=3.8&key=AIzaSyCPgZBX3_gTNaU9hIyPU_6iKkpqcbLUjEk&sensor=true" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="chat.css">
    <%--
    The reason to use a JSP is that it is very easy to obtain server-side configuration
    information (such as the contextPath) and pass it to the JavaScript environment on the client.
    --%>
    <script type="text/javascript">
        var config = {
            contextPath: '${pageContext.request.contextPath}'
        };
    </script>
</head>
<body>

<div id="chatroom">
	<div id="map_canvas" style="width: 600px; height: 400px; border-right: 1px solid #666666; border-bottom: 1px solid #666666; border-top: 1px solid #AAAAAA; border-left: 1px solid #AAAAAA;"></div>
    <div id="chat"></div>
    <div id="members"></div>
    <div id="input">
        <div id="join">
            <table>
                <tbody>
                <tr>
                    <td>
                        <input id="ackEnabled" type="checkbox" />
                    </td>
                    <td>
                        <label for="ackEnabled">Enable ack extension</label>
                    </td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>&nbsp;</td>
                    <td>
                        Enter Chat Nickname
                    </td>
                    <td>
                        <input id="username" type="text" />
                    </td>
                    <td>
                        <button id="joinButton" class="button">Join</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div id="joined">
            Chat:
            &nbsp;
            <input id="phrase" type="text" />
            <button id="sendButton" class="button">Send</button>
            <button id="leaveButton" class="button">Leave</button>
        </div>
    </div>
</div>
<br />
<div style="padding: 0.25em;">Tip: Use username[,username2]::text to send private messages</div>

    <div id="body"></div>

</body>
</html>
