require(["dojo", "dojo/_base/lang", "dojo/_base/declare", "dojox/cometd", "dojox/cometd/timestamp", "dojox/cometd/ack", "dojox/cometd/reload"],
		function(dojo, lang, declare, cometd)
		{
	var room = {
			_lastUser: null,
			_username: null,
			_connected: false,
			_disconnecting: false,
			_chatSubscription: null,
			_membersSubscription: null,
			_roomName: null,

			_init: function(roomName)
			{
				_roomName = roomName,
//				dojo.removeClass("join", "hidden");
//				dojo.addClass("joined", "hidden");
//				dojo.byId('username').focus();


				dojo.query("#username").attr({
					"autocomplete": "off"
				}).onkeyup(function(e)
						{
					if (e.keyCode == dojo.keys.ENTER)
					{
						room.join(dojo.byId('username').value);
					}
						});

				dojo.query("#joinButton").onclick(function(e)
						{
					room.join(dojo.byId('username').value);
						});

				dojo.query("#phrase").attr({
					"autocomplete": "off"
				}).onkeyup(function(e)
						{
					if (e.keyCode == dojo.keys.ENTER)
					{
						room.chat();
					}
						});

				dojo.query("#sendButton").onclick(function(e)
						{
					room.chat();
						});

				dojo.query("#leaveButton").onclick(room, "leave");

				// Check if there was a saved application state
				var stateCookie = dojo.cookie('org.cometd.' + _roomName + '.state');
				var state = stateCookie ? dojo.fromJson(stateCookie) : null;
				// Restore the state, if present
				if (state)
				{
//					dojo.byId('username').value=state.username;
					setTimeout(function()
							{
						// This will perform the handshake
						room.join(state.username);
							}, 0);
				} else {
					// join the room
					if (USER_NAME) 
						room.join(USER_NAME);
					else 				{
						alert('Please log out and log back in again');
						return;
					}

				}

			},

			join: function(name)
			{
				room._disconnecting = false;

				if (name == null || name.length == 0)
				{
					alert('Please enter a username');
					return;
				}

				//cometd.ackEnabled = dojo.byId("ackEnabled").checked;
				geolocate.startGeolocation();

				var cometdURL = location.protocol + "//" + location.host + config.contextPath + "/cometd";
				cometd.init({
					url: cometdURL,
					logLevel: "info"
				});

				room._username = name;

//				dojo.addClass("join", "hidden");
//				dojo.removeClass("joined", "hidden");
//				dojo.byId("phrase").focus();
			},

			_unsubscribe: function()
			{
				if (room._chatSubscription)
				{
					cometd.unsubscribe(room._chatSubscription);
				}
				room._chatSubscription = null;
				if (room._membersSubscription)
				{
					cometd.unsubscribe(room._membersSubscription);
				}
				room._membersSubscription = null;
			},

			_subscribe: function()
			{
				room._chatSubscription = cometd.subscribe('/chat/' + _roomName, room.receive);
				room._membersSubscription = cometd.subscribe('/members/' + _roomName, room.members);
			},

			leave: function()
			{
				geolocate.stopGeolocation();
				dojox.cometd.batch(function()
						{
					removeMarker(room._username);
					zoomOut();
					cometd.publish('/chat/' + _roomName, {
						user: room._username,
						membership: 'leave',
						chat: room._username + " has left"
					});
					room._unsubscribe();
						});
				cometd.disconnect();

				// switch the input form
				dojo.removeClass("join", "hidden");
				dojo.addClass("joined", "hidden");

				dojo.byId("username").focus();
				dojo.byId('members').innerHTML = "";

				room._username = null;
				room._lastUser = null;
				room._disconnecting = true;
			},

			chat: function()
			{
				var text = dojo.byId('phrase').value;
				dojo.byId('phrase').value = '';
				if (!text || !text.length) return;

				var colons = text.indexOf("::");
				if (colons > 0)
				{
					cometd.publish("/service/privatechat", {
						room: "/chat/" + _roomName, // This should be replaced by the room name
						user: room._username,
						chat: text.substring(colons + 2),
						peer: text.substring(0, colons)
					});
				}
				else
				{
					cometd.publish("/chat/" + _roomName, {
						user: room._username,
						chat: text
					});
				}
			},

			receive: function(message)
			{
				var fromUser = message.data.user;
				// check for position message
				if (message.data.latitude) {
//					geolocate.geoReceive(message);
					moveMarker(fromUser, message.data.latitude, message.data.longitude);
					return;
				}
//				if (message.data.chat == "Connection to Server Closed") {
//				removeAllMarkers();
//				}

				// check for member leaving message
//				if (message.data.leave) {
				if (message.data.membership == "leave") {
					removeMarker(fromUser);
				}

				// announce your location to new users
				if (message.data.membership=="join")
					geoPublish();

				var membership = message.data.join || message.data.leave;
				var text = message.data.chat;

				if (!membership && fromUser == room._lastUser)
				{
					fromUser = "...";
				}
				else
				{
					room._lastUser = fromUser;
					fromUser += ":";
				}

				var chat = dojo.byId('myList');
				if (membership)
				{
					chat.innerHTML += "<li><span class=\"membership\"><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">" + text + "</span></span></li>";
					room._lastUser = null;
				}
				else if (message.data.scope == "private")
				{
					// check if this is a system message
					if (message.data.user = "System") {
						require(["dojo/_base/connect"], function(connect){
							connect.publish("/bywaze/showSystemMsg", [{ text:text }]);
						});
						//systemMsg.innerHTML = text;
						//dijit.registry.byId('notifier2').show();
						//dijit.byId('calPicker').show(this, ['above-centered','below-centered','after','before']);
					} else
						chat.innerHTML += "<li><span class=\"private\"><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">[private]&nbsp;" + text + "</span></span></li>";
				}
				else
				{
					chat.innerHTML += "<li><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">" + text + "</span></li>";
				}

				//chat.scrollTop = chat.scrollHeight - chat.clientHeight;
				myScroll.refresh();
				//myScroll.scrollToElement('li:nth-child(6)', 100);
				myScroll.scrollToElement('li:last-child');
			},

			members: function(message)
			{
				var members = dojo.byId('members');
				var list = "";
//				removeAllMarkers();
//				for (var i in message.data) {
//				var user = message.data[i];
//				list += user.username + "<br/>";
//				var username = user.username;
//				var latitude = user.latitude;
//				var longitude = user.longitude;
//				moveMarker(
//				username,
//				latitude,
//				longitude);

//				}
				for (var i in message.data) {
					list += message.data[i] + "<br/>";
				}
				members.innerHTML = list;
			},

			_connectionInitialized: function()
			{
				// first time connection for this client, so subscribe and tell everybody.
				cometd.batch(function()
						{
					room._subscribe();
					cometd.publish('/chat/' + _roomName, {
						user: room._username,
						membership: 'join',
						chat: room._username + ' has joined circle'
					});
						});
			},

			_connectionEstablished: function()
			{
				// connection establish (maybe not for first time), so just
				// tell local user and update membership
				room.receive({
					data: {
						user: 'system',
						chat: 'Connection to Server Opened'
					}
				});
				cometd.publish('/service/members', {
					user: room._username,
					room: '/chat/' + _roomName,
//					latitude : myPosition.coords.latitude,
//					longitude : myPosition.coords.longitude
				});
			},

			_connectionBroken: function()
			{
				room.receive({
					data: {
						user: 'system',
						chat: 'Connection to Server Broken'
					}
				});
				dojo.byId('members').innerHTML = "";
			},

			_connectionClosed: function()
			{
				room.receive({
					data: {
						user: 'system',
						chat: 'Connection to Server Closed'
					}
				});
			},

			_metaHandshake: function(message)
			{
				if (message.successful)
				{
					room._connectionInitialized();
				}
			},

			_metaConnect: function(message)
			{
				if (room._disconnecting)
				{
					room._connected = false;
					room._connectionClosed();
				}
				else
				{
					var wasConnected = room._connected;
					room._connected = message.successful === true;
					if (!wasConnected && room._connected)
					{
						room._connectionEstablished();
					}
					else if (wasConnected && !room._connected)
					{
						room._connectionBroken();
					}
				}
			}
	};

	cometd.addListener("/meta/handshake", room, room._metaHandshake);
	cometd.addListener("/meta/connect", room, room._metaConnect);
	dojo.addOnLoad(room, "_init");
	dojo.addOnUnload(function()
		{
			if (room._username)
			{
				cometd.reload();
				dojo.cookie('org.cometd.' + _roomName + '.state', dojo.toJson({
					username: room._username
				}), { 'max-age': 5 });
			}
			else
				cometd.disconnect();
		});
});
