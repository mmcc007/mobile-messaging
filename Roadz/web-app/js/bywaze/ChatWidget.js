// custom.ChatWidget
define(["dojo/_base/declare","dijit/_WidgetBase", "dijit/_TemplatedMixin", "dojo/text!./ChatWidget/templates/ChatWidget.html", "dojo/dom-style", "dojo/_base/lang", "dojo/dom-attr", "dojo/cookie", "dojo/json", "dojo/_base/unload", "dojo/_base/connect", "dojox/cometd", "dojox/cometd/timestamp", "dojox/cometd/ack", "dojox/cometd/reload"],
    function(declare, WidgetBase, TemplatedMixin, template, domStyle, lang, domAttr, cookie, json, baseUnload, connect, cometd){
        return declare("bywaze.ChatWidget", [WidgetBase, TemplatedMixin], {
        	statics: {
        		// keep a list of instantiated widgets
        		chatWidgets: new Array()
        	},
            // Some default values for our chat
			// These typically map to whatever you're handing into the constructor
			_lastUser: null,
			_username: null,
			_connected: false,
			_disconnecting: false,
			_chatSubscription: null,
			_membersSubscription: null,
//			_roomName: null,
			_wrapInLi: false,
			
			// chat session
//			_chatSession: mySessionMgr.getInstance(),
			
			// Our template - important!
			templateString: template,

			// A class to be applied to the root node in our template
			baseClass: "chatWidget",

		    constructor: function(/*Object*/ args){
		    	// name is a required field
//		    	if (!args._roomName) return;
//				this._roomName = args.name.replace(/ /g, '');
				
				// check if overwriting the template
//				if (args.template)
//					this.templateString = args.template;
				
		        declare.safeMixin(this, args);
		      },
			
			// postCreate is called once our widget's DOM is ready,
			// but BEFORE it's been inserted into the page!
			// This is far and away the best point to put in any special work.
			postCreate: function(){
				// Get a DOM node reference for the root of our widget
				var domNode = this.domNode;

				// Run any parent postCreate processes - can be done at any point
				this.inherited(arguments);

				// add this widget to list
				this.statics.chatWidgets.push(this);
				
				// initialize the chat box
				this._init();

			},
			
			addListeners: function(args) {
				declare.safeMixin(this, args);
				cometd.addListener("/meta/handshake", this, this._metaHandshake);
				cometd.addListener("/meta/connect", this, this._metaConnect);
				if (!this._wrapInLi) // temp fix
					baseUnload.addOnUnload(lang.hitch(this, function()
							{
								if (this._username)
								{
									cometd.reload();
									cookie('org.cometd.' + this._roomName + '.state', json.stringify({
										username: this._username
									}), { 'max-age': 5 });
								}
								else
									this.disconnect();
							}));
				

			},

			_init: function()
			{
				if (this.joinNode) {
						
					domStyle.set(this.joinNode, "visibility", "visible");
					domStyle.set(this.joinedNode, "visibility", "hidden");
					this.usernameNode.focus();
	
					domAttr.set(this.usernameNode, "autocomplete", "off");
					this.connect(this.usernameNode, "onkeyup", function(e) {
						if (e.keyCode == dojo.keys.ENTER)
						{
							this.join(this.usernameNode.value);
						}
					});
	
					// connect events to our template
					this.connect(this.joinButtonNode, "onclick", function(e) {
						this.join(this.usernameNode.value);
					});
				}

				domAttr.set(this.phraseNode, "autocomplete", "off");
				this.connect(this.phraseNode, "onkeyup", function(e) {
					if (e.keyCode == dojo.keys.ENTER)
					{
						this.chat();
					}
				});

				this.connect(this.sendButtonNode, "onclick", function(e) {
					this.chat();
				});

				if (this.leaveButtonNode)
					this.connect(this.leaveButtonNode, "onclick", function(e) {
						this.leave();
					});

				if (!this._wrapInLi) {						
					// check if reconnecting
					// Check if there was a saved application state
					var stateCookie = cookie('org.cometd.' + this._roomName + '.state');
					var state = stateCookie ? json.parse(stateCookie) : null;
					// Restore the state, if present
					if (state)
					{
						this.username=state.username;
						setTimeout(lang.hitch(this, function()
								{
							// This will perform the handshake
							this.join(state.username);
								}), 0);
					}
				}
			},

			join: function(name)
			{
				this._disconnecting = false;

				if (name == null || name.length == 0)
				{
					alert('Please enter a username');
					return;
				}

				cometd.ackEnabled = this.ackEnabledNode?this.ackEnabledNode.checked:false;

				var cometdURL = location.protocol + "//" + location.host + config.contextPath + "/cometd";
				cometd.init({
					url: cometdURL,
					logLevel: "info"
				});

				this._username = name;
				if (this.joinNode) {
					domStyle.set(this.joinNode, "visibility", "hidden");
					domStyle.set(this.joinedNode, "visibility", "visible");
				}
				this.phraseNode.focus();
			},
        
		    _unsubscribe: function()
		    {
		        if (this._chatSubscription)
		        {
		            cometd.unsubscribe(this._chatSubscription);
		        }
		        this._chatSubscription = null;
		        if (this._membersSubscription)
		        {
		            cometd.unsubscribe(this._membersSubscription);
		        }
		        this._membersSubscription = null;
		    },

		    _subscribe: function()
		    {
		        this._chatSubscription = cometd.subscribe('/chat/' + this._roomName, this, this.receive);
		        this._membersSubscription = cometd.subscribe('/members/' + this._roomName, this, this.members);
		    },

		    leave: function()
		    {
		        cometd.batch(this, function()
		        {
		            cometd.publish("/chat/" + this._roomName, {
		                user: this._username,
		                membership: 'leave',
		                chat: this._username + " has left"
		            });
		            this._unsubscribe();
		        });
		        this.disconnect();

		        // switch the input form
				domStyle.set(this.joinNode, "visibility", "visible");
				domStyle.set(this.joinedNode, "visibility", "hidden");
				this.usernameNode.focus();
		        this.membersNode.innerHTML = "";

		        this._username = null;
		        this._lastUser = null;
		        this._disconnecting = true;
		    },

		    chat: function()
		    {
		        var text = this.phraseNode.value;
		        this.phraseNode.value = '';
		        if (!text || !text.length) return;

		        var colons = text.indexOf("::");
		        if (colons > 0)
		        {
		            cometd.publish("/service/privatechat", {
		                room: "/chat/" + this._roomName, 
		                user: this._username,
		                chat: text.substring(colons + 2),
		                peer: text.substring(0, colons)
		            });
		        }
		        else
		        {
		            cometd.publish("/chat/" + this._roomName, {
		                user: this._username,
		                chat: text
		            });
		        }
		    },

		    receive: function(message)
		    {
		        var fromUser = message.data.user;
		        var membership = message.data.join || message.data.leave;
		        var text = message.data.chat;

		        if (!membership && fromUser == this._lastUser)
		        {
		            fromUser = "...";
		        }
		        else
		        {
		            this._lastUser = fromUser;
		            fromUser += ":";
		        }

		        var chat = undefined;
	        	if (this._wrapInLi)
	        		chat = this.scrListNode;
	        	else
	        		chat = this.chatNode;
		        if (membership)
		        {
		        	if (this._wrapInLi)
		        		chat.innerHTML += "<li><span class=\"membership\"><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">" + text + "</span></span></li>";
		        	else
		        		chat.innerHTML += "<span class=\"membership\"><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">" + text + "</span></span><br/>";
		        		
		            this._lastUser = null;
		        }
		        else if (message.data.scope == "private")
		        {
		        	if (this._wrapInLi)
		        		chat.innerHTML += "<li><span class=\"private\"><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">[private]&nbsp;" + text + "</span></span></li>";
		        	else
		        		chat.innerHTML += "<span class=\"private\"><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">[private]&nbsp;" + text + "</span></span><br/>";
		        }
		        else
		        {
		        	if (this._wrapInLi)
			            chat.innerHTML += "<li><span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">" + text + "</span></li>";
		        	else
		        		chat.innerHTML += "<span class=\"from\">" + fromUser + "&nbsp;</span><span class=\"text\">" + text + "</span><br/>";
		        }

	        	if (this._wrapInLi) {	        		
					myScroll.refresh();
	        		//myScroll.scrollToElement('li:nth-child(6)', 100);
					myScroll.scrollToElement('li:last-child');
	        	} else {
					chat.scrollTop = chat.scrollHeight - chat.clientHeight;
	        	}

		    },

		    members: function(message)
		    {
		        var members = this.membersNode;
		        var list = "";
		        for (var i in message.data)
		            list += message.data[i] + "<br/>";
		        members.innerHTML = list;
		    },

		    _connectionInitialized: function()
		    {
		    	// check if this widget is active
		    	if (!this.isActive()) return;

		    	// first time connection for this client, so subscribe and tell everybody.
		        cometd.batch(this, function()
		        {
		            this._subscribe();
		            cometd.publish('/chat/' + this._roomName, {
		                user: this._username,
		                membership: 'join',
		                chat: this._username + ' has joined'
		            });
		        });
		        
		        // tell listening local objects
		        connect.publish("ChatWidget", [{connectionInitialized: true, _roomName: this._roomName}]);
		    },

		    _connectionEstablished: function()
		    {
		    	// check if this widget is active
		    	if (!this.isActive()) return;

		    	// connection establish (maybe not for first time), so just
		        // tell local user and update membership
		        this.receive({
		            data: {
		                user: 'system',
		                chat: 'Connection to Server Opened'
		            }
		        });
		        cometd.publish('/service/members', {
		            user: this._username,
		            room: '/chat/' + this._roomName
		        });
		        
		        // also tell anyone interested that the connection is good
		        connect.publish("ChatWidget", [{connection:true}]);
		    },

		    _connectionBroken: function()
		    {
		    	// check if this widget is active
		    	if (!this.isActive()) return;
		    	
		        this.receive({
		            data: {
		                user: 'system',
		                chat: 'Connection to Server Broken'
		            }
		        });
		        this.membersNode.innerHTML = "";
		    },

		    _connectionClosed: function()
		    {
		    	// check if this widget is active
		    	if (!this.isActive()) return;
		    	
		        this.receive({
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
		            this._connectionInitialized();
		        }
		    },

		    _metaConnect: function(message)
		    {
		        if (this._disconnecting)
		        {
		            this._connected = false;
		            this._connectionClosed();
		        }
		        else
		        {
		            var wasConnected = this._connected;
		            this._connected = message.successful === true;
		            if (!wasConnected && this._connected)
		            {
		                this._connectionEstablished();
		            }
		            else if (wasConnected && !this._connected)
		            {
		                this._connectionBroken();
		            }
		        }
		    },

			isAllDisconnected: function() {
				var chatWidgets = this.statics.chatWidgets;
				for (var i = 0; i < chatWidgets.length; i++) {
					var chatWidget = this.statics.chatWidgets[i];
					if (chatWidget != this && chatWidget._username) {
						return false;
					}
				}
				return true;
			},
			disconnect: function() {
				if (this.isAllDisconnected())
					cometd.disconnect();
			},
			isActive: function() {
				return this._username;
			}


        });
        
    });
