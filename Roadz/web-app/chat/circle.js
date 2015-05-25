// create an circle class that the user can instantiate for each friends circle
define([ "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin" ], function(declare, _WidgetBase, _TemplatedMixin){
    return declare("bywaze.Circle", [ _WidgetBase, _TemplatedMixin ], {
    	
    });
});

require(["dojo", "dojox/cometd", "dojox/cometd/timestamp", "dojox/cometd/ack", "dojox/cometd/reload", "chat/chat"],
	function(dojo, cometd, timestamp, ack, reload){
		var circle = {
			_init: function(){
		      return this.inherited(arguments);
		    },
		    join: function(){
		      return this.inherited(arguments);
		    },
		    _unsubscribe: function(){
			      return this.inherited(arguments);
			},
			_subscribe: function(){
			      return this.inherited(arguments);
			},
			leave: function(){
			      return this.inherited(arguments);
			},
			chat: function(){
			      return this.inherited(arguments);
			},
			receive: function(){
			      return this.inherited(arguments);
			},
			members: function(){
			      return this.inherited(arguments);
			},
			_connectionInitialized: function(){
			      return this.inherited(arguments);
			},
			_connectionEstablished: function(){
			      return this.inherited(arguments);
			},
			_connectionBroken: function(){
			      return this.inherited(arguments);
			},
			_connectionClosed: function(){
			      return this.inherited(arguments);
			},
			_metaHandshake: function(){
			      return this.inherited(arguments);
			},
			_metaConnect: function(){
			      return this.inherited(arguments);
			},
		}
    }
);