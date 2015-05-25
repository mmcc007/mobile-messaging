// custom.ChatWidget
define(["dojo/_base/declare","custom/ChatWidget", "dojo/text!./BywazeChatWidget/templates/BywazeChatWidget.html"],
    function(declare, ChatWidget, template){
        return declare("custom.BywazeChatWidget", [ChatWidget], {

        	// Our template - important!
			templateString: template,

		    constructor: function(/*Object*/ args){
		    	// username is a required field
		    	if (!args._username) {
		    		console.error('_username is a required argument');
		    		return;
		    	}
		        declare.safeMixin(this, args);
		        this._username = args._username;
		    },

			// postCreate is called once our widget's DOM is ready,
			// but BEFORE it's been inserted into the page!
			// This is far and away the best point to put in any special work.
			postCreate: function(){
				// Run any parent postCreate processes - can be done at any point
				this.inherited(arguments);
		    	this.join(this._username);
			},
        });
        
    });
