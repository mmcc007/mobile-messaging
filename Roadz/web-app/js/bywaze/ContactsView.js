define(["dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/aspect", "dojo/i18n", "dojo/dom-class", "dojo/dom-attr", "dojox/mobile/ScrollableView", "dojox/mobile/ListItem", "dojox/mobile/TextBox", "dojo/DeferredList", "dojo/_base/xhr", "dojo/io-query", "dojo/dom", "bywaze/_ViewMixin", "dijit/registry"], function(declare, baseArray, lang, aspect, i18n, domClass, domAttr, ScrollableView, ListItem, TextBox, DeferredList, xhr, ioQuery, dom, _ViewMixin, registry) {
		var urlParams = ioQuery.queryToObject(window.location.search.slice(1));
		var provider = urlParams?urlParams.provider:undefined;
		var code = urlParams?urlParams.code:undefined;

	return declare("bywaze.ContactsView", [ScrollableView, _ViewMixin], {

		// Create a template string for contacts:
		contactTemplateString: '<img src="${avatar}" alt="${name}" class="friendviewAvatar" />' + 
		'<div class="friendviewContent"> ' +
			'<div class="friendviewUser">${name}</div>' + 
			'<input type="checkbox" name="addresses" id="${id}" value="${id}" />' +
		'</div>',

		// Icon for loading...
		iconLoading: _base + "/js/bywaze/resources/images/loading.gif",

		// URL to pull tweets from; simple template included
		//serviceUrl: "http://twitter.com/statuses/user_timeline/${account}.json?since_id=${since_id}",
//		serviceUrl: "http://192.168.0.5:8080/Roadz/inviter/contacts?provider=" + provider + "&code=" + code,
//		sendInviteUrl: "http://192.168.0.5:8080/Roadz/inviter/sendInvites?provider=" + provider + "&code=" + code,
		contactsUrl: _base + "/inviter/contacts" + window.location.search,
		sendInviteUrl: _base + "/inviter/sendInvites" + window.location.search,
		//sendInviteUrl: "http://localhost:8080/Roadz/inviter/test?provider=" + provider + "&code=" + code,

		// When the widgets have started....
		startup: function() {
			// Retain functionality of startup in dojox/mobile/ScrollableView
			this.inherited(arguments);
			
			// Get the refresh button and image
			this.inviteButton = registry.byId(this.getElements("inviteButton", this.domNode)[0].id);
			//this.iconNode = this.inviteButton.iconNode.childNodes[0];
			//this.iconImage = this.iconNode.src;
			
			// Add a click handler to the button that calls refresh
			aspect.after(this.inviteButton, "onClick", lang.hitch(this, "sendInvites"), true);

			// Get the list widget
			this.listNode = this.getListNode();

			// Add a click handler to the button that calls refresh
			//aspect.after(this.refreshButton, "onClick", lang.hitch(this, "refresh"), true);
			console.warn("My provider is: ", provider);
			console.warn("My this.contactsUrl is: ", this.contactsUrl);
			console.warn("My this.sendInviteUrl is: ", this.sendInviteUrl);

			if (provider) this.refresh();
		},
	
		refresh: function() {
			var defs = [];
						defs.push(xhr.get({
							// The URL of the request
							url: this.contactsUrl,
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
			new DeferredList(defs).then(lang.hitch(this, this.onContactsReceived));

		},

		sendInvites: function() {

						// Get the result node
						var resultNode = dom.byId("formResultNode");
						
						// Post the form information
						xhr.post({
							// The URL of the request
							url: this.sendInviteUrl,
							// Form to send
							form: dom.byId("formNode"),
							// The success callback with result from server
							load: function(newContent) {
								resultNode.style.display = "block";
								resultNode.innerHTML = newContent;
								console.info("sendInvites: JSON loaded from server:  ", newContent);
							},
							// The error handler
							error: function() {
								resultNode.innerHTML = "sendInvites: Your form could not be sent.";
							}
						});

		},


		// Fires when friends are received from the controller
		updateContent: function(contactsData) {
			// remove existing items
			this.listNode.innerHTML = "";
			// For every friend received....
			baseArray.forEach(contactsData[0][1], function(contact) {
				// Get the user's screen name
				var name = contact.name;
	//			var avatar = contact.photoUrl;
				var avatar = contact.photo;
				var id = contact.address;

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

			// Show the list now that we have content for it
			this.showListNode(true);
		},

		// Event for when content is loaded from server
		onContactsReceived: function(contactData) {
			// Log to console
			console.info("JSON loaded from server:  ", contactData);

			// If we receive new tweets, update content
//			if(contactData.length) {
				this.updateContent(contactData);
//			}
		},

	});
	
});