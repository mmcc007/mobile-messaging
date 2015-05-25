// custom.ChatWidget
define(["dojo/_base/declare", "dijit/_WidgetBase", "custom/ChatWidget", "custom/FloatWidget", "dojo/text!./ChatWidget/templates/FloatingChatWidget.html"],
    function(declare, WidgetBase, ChatWidget, FloatWidget, template){
        return declare([WidgetBase, ChatWidget, FloatWidget], {
			// Our template - important!
			templateString: template,
			myScroll: null,
			
			postCreate: function(){
				// Get a DOM node reference for the root of our widget
				var domNode = this.domNode;

				// Run any parent postCreate processes - can be done at any point
				this.inherited(arguments);
				this.connect(this.barNode, "onmousedown", function(e) {
					dragStart(event);
				});
			},
			
		    constructor: function(/*Object*/ args){
	            document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
//				this.connect(this.barNode, "ontouchstart", function(e) {
//					dragStart(event, 'boxc');
//				});

		        declare.safeMixin(this, args);
		      },
		      
			    startup: function(){
	            	this.myScroll = new iScroll('standard');
			    	
			    }
        });
        
    });
