define(["dojo/_base/connect", "dojo/_base/declare", "dojo/_base/array", "dojo/_base/lang", "dojo/aspect", "dojo/i18n", "dojo/dom-class", "dojo/dom-attr", "dojox/mobile/Opener", "dojox/mobile/ListItem", "dojox/mobile/TextBox", "dojo/DeferredList", "dojo/_base/xhr", "dojo/io-query", "dojo/dom", "bywaze/_ViewMixin", "dijit/registry"], 
	function(connect, declare, baseArray, lang, aspect, i18n, domClass, domAttr, Opener, ListItem, TextBox, DeferredList, xhr, ioQuery, dom, _ViewMixin, registry) {

	return declare("bywaze.SystemOpener", [Opener, _ViewMixin], {

         alarmTemplateString: "<div>" +
             "<button data-dojo-attach-event='onclick: increment'>press me</button>" +
             "&nbsp; count: <span data-dojo-attach-point='counter'>0</span>" +
             "</div>",

		// When the widgets have started....
		startup: function() {
			// Retain functionality of startup in dojox/mobile/Opener
			this.inherited(arguments);
						
			// Get the refresh button and image
			this.doneButton = registry.byId(this.getElements("doneButton", this.domNode)[0].id);

			// Add a click handler to the button that send a message to hide all system message widgets
			aspect.after(this.doneButton, "onClick", lang.hitch(this, "sendHideAllSystemOpenerWidgets"), true);

			// Get the list widget
			//this.listNode = this.getListNode();

			//this.refresh();

			this.systemMsg = dojo.byId(this.getElements("systemMsg", this.domNode)[0].id);

			// subscribe to a channel for showing system messages
	        connect.subscribe("/bywaze/showSystemMsg", this, this.onShowSystemMsg);
			// subscribe to a channel for hiding system messages
	        connect.subscribe("/bywaze/hideSystemMsg", this, this.onHideSystemMsg);
		},
	
		sendHideAllSystemOpenerWidgets: function() {
            connect.publish("/bywaze/hideSystemMsg", [{ text:"hide my message" }]);
		},

		onShowSystemMsg: function(data){
	        // display data
	        this.systemMsg.innerHTML = data.text;
//	        this.innerHTML = this.alarmTemplateString;
	        this.show();
	        console.log("i show", data);
	    },

		onHideSystemMsg: function(data){
	        // hide data
	        this.hide();
	        console.log("i hide", data);
	    }

	});
	
});