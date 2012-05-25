define(["dojo/_base/declare", "dojo/dom", "dojo/_base/connect", "bywaze/SimpleDialog", "bywaze/_ViewMixin", "dijit/registry"], 
	function(declare, dom, connect, SimpleDialog, _ViewMixin, registry) {

	return declare("bywaze.SystemDialog", [SimpleDialog, _ViewMixin], {

		// When the widgets have started....
		startup: function() {
			// Retain functionality of startup in dojox/mobile/Opener
			this.inherited(arguments);
						
			this.systemMsg = dom.byId(this.getElements("mblSimpleDialogText", this.domNode)[0].id);

			// subscribe to a channel for showing system messages
	        connect.subscribe("/bywaze/showSystemMsg", this, this.onShowSystemMsg);
		},
	
		onShowSystemMsg: function(data){
	        // display data
			this.systemMsg.innerHTML = data.text;
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