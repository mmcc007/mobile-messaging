define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/aspect", "dojo/i18n", "dojo/dom-class", "dojo/dom-attr", "dojox/mobile/ScrollableView", "dojox/mobile/ListItem", "dojox/mobile/TextBox", "dojo/DeferredList", "dojo/_base/xhr", "dojo/io-query", "dojo/dom", "bywaze/_ViewMixin", "dijit/registry"], function(declare, baseArray, lang, aspect, i18n, domClass, domAttr, ScrollableView, ListItem, TextBox, DeferredList, xhr, ioQuery, dom, _ViewMixin, registry) {
		var urlParams = ioQuery.queryToObject(window.location.search.slice(1));
		var provider = urlParams?urlParams.provider:undefined;
		var code = urlParams?urlParams.code:undefined;

	return declare("bywaze.InvitesView", [ScrollableView, _ViewMixin], {

		// Create a template string for contacts:
		contactTemplateString: '<img src="${avatar}" alt="${name}" class="friendviewAvatar" />' + 
		'<div class="friendviewContent"> ' +
			'<div class="friendviewUser">${name}</div>' + 
			'<input type="checkbox" name="invites" id="${id}" value="${name}" />' +
		'</div>',

		// Icon for loading...
		iconLoading: _base + "/js/bywaze/resources/images/loading.gif",

		// URL to pull invites from; simple template included
		pendingInvitesUrl: _base + "/inviter/getPendingInvites",
		acceptInvitesUrl: _base + "/inviter/acceptInvites",
		createPendingInviteFromSessionUrl: _base + "/inviter/createPendingInviteFromSession",

		// When the widgets have started....
		startup: function() {
			// Retain functionality of startup in dojox/mobile/ScrollableView
			this.inherited(arguments);
			
			// Get the accept button and image
			this.acceptInviteButton = registry.byId(this.getElements("acceptInviteButton", this.domNode)[0].id);
			this.pendingInvitesRefreshButton = registry.byId(this.getElements("pendingInvitesRefreshButton", this.domNode)[0].id);
			//this.iconNode = this.inviteButton.iconNode.childNodes[0];
			//this.iconImage = this.iconNode.src;
			
			// Add a click handler to the button that calls refresh
			aspect.after(this.acceptInviteButton, "onClick", lang.hitch(this, "acceptInvites"), true);
			aspect.after(this.pendingInvitesRefreshButton, "onClick", lang.hitch(this, "refreshInvites"), true);

			// Get the list widget
			this.listNode = this.getListNode();

			// note: create pending invite from session before showing invites
			this.createPendingInvite();
			this.refreshInvites();

		},
	
		refreshInvites: function() {
			var defs = [];
						defs.push(xhr.get({
							// The URL of the request
							url: this.pendingInvitesUrl,
							// Handle as JSON Data
							handleAs: "json",
							// The success callback with result from server
							load: function(newContent) {
								// Do nothing -- using deferreds
							},
							// The error handler
							error: function() {
								// Do nothing -- keep old content there
								console.info("JSON not loaded from server:  ");
							}
						}));
			// Create a deferredlist to handle when all friends are returned
			// Add this.onContactsReceived as the callback
			new DeferredList(defs).then(lang.hitch(this, this.onPendingInvitesReceived));

		},

		createPendingInvite: function() {

						// Get the result node
						var resultNode = dom.byId("acceptInvitesFormResultNode");
						
						// Post the form information
						xhr.post({
							// The URL of the request
							url: this.createPendingInviteFromSessionUrl,
							// The success callback with result from server
							load: function(newContent) {
								console.info("createPendingInvite: JSON loaded from server:  ", newContent);
							},
							// The error handler
							error: function() {
								resultNode.innerHTML = "createPendingInvite: Your form could not be sent.";
							}
						});

		},

		acceptInvites: function() {

						// Get the result node
						var resultNode = dom.byId("acceptInvitesFormResultNode");
						
						// Post the form information
						xhr.post({
							// The URL of the request
							url: this.acceptInvitesUrl,
							// Form to send
							form: dom.byId("acceptInvitesFormNode"),
							// The success callback with result from server
							load: function(newContent) {
								resultNode.style.display = "block";
								resultNode.innerHTML = newContent;
								console.info("acceptInvites: JSON loaded from server:  ", newContent);
			this.refreshInvites();
							},
							// The error handler
							error: function() {
								resultNode.innerHTML = "acceptInvites: Your form could not be sent.";
			this.refreshInvites();
							}
						});
						// TODO get existing invites from response or handle locally
		},


		// Fires when friends are received from the controller
		updateContent: function(pendingInviteData) {
			// remove existing items
			this.listNode.innerHTML = "";
			// For every friend received....
			baseArray.forEach(pendingInviteData, function(contact) {
				// Get the user's screen name
				//var name = contact.firstName + " " + contact.lastName;
				var name = contact.username;
				var avatar = contact.photoUrl;
				var id = contact.id;

				// Create a new list item, inject into list
				var item = new ListItem({
					"class": "friendsviewListItem user-" + name,
					"dojoType": "dojox.mobile.ListItem"
				}).placeAt(this.listNode, "first");

				// Update the list item's content using our template for contacts
				item.containerNode.innerHTML += this.substitute(this.contactTemplateString, {
					name: name,
					avatar: avatar,
					id: id
				});
			}, this);
			new TextBox({
					"name": "message",
					"type": "hidden",
					"value": "test message",
				}).placeAt(this.listNode, "first");
			new TextBox({
					"name": "subject",
					"type": "hidden",
					"value": "test subject",
				}).placeAt(this.listNode, "first");
			new TextBox({
					"name": "link",
					"type": "hidden",
					"value": "test link",
				}).placeAt(this.listNode, "first");
			new TextBox({
					"name": "description",
					"type": "hidden",
					"value": "test description",
				}).placeAt(this.listNode, "first");


			// Show the list now that we have content for it
			this.showListNode(true);
		},

		// Event for when content is loaded from server
		onPendingInvitesReceived: function(pendingInviteData) {
			// Log to console
			console.log("JSON loaded from server:  ", pendingInviteData);

			// If we receive pending invites, update content
			pendingInvites = pendingInviteData[0][1];
//			if(pendingInvites.length) {
				this.updateContent(pendingInvites);
//			}
		},

	});
	
});