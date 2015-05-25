// custom.ChatWidget
define(
		[ "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
				"dojo/text!./FloatWidget/templates/FloatWidget.html", "dojo/_base/lang","dojo/dom" ],
		function(declare, WidgetBase, TemplatedMixin, template, lang, dom) {
			return declare("custom.FloatWidget",
					[ WidgetBase, TemplatedMixin ],
					{
						statics : {
							// keep a 'singleton' browser object
							// browser: new browser()
							// Global object to hold current drag information.
							dragObj : new Object(),
						},
						// debug
						coords: null,

						// browser variables
						isIE : false,
						isNS : false,
						version : null,

						// current position
						x : null,
						y : null,

						// Our template - important!
						templateString : template,

						// A class to be applied to the root node in our
						// template
						baseClass : "floatWidget",

						// postCreate is called once our widget's DOM is ready,
						// but BEFORE it's been inserted into the page!
						// This is far and away the best point to put in any
						// special work.
						postCreate : function() {
							// Get a DOM node reference for the root of our
							// widget
							var domNode = this.domNode;

							// Run any parent postCreate processes - can be done
							// at any point
							this.inherited(arguments);

							// init browser vars
							this.browser();
							
							// init debug
							this.coords = dom.byId('coords');

							// init dragObj
							this.statics.dragObj.zIndex = 0;

							// add events
							this.connect(this.boxNode, "onmousedown", function(e) {
								this.dragStart(e);
							});
//							document.addEventListener('touchmove', function(e) {
//								e.preventDefault();
//							}, false);
//							this.connect(this.barNode, "ontouchstart",
//									function(e) {
//										this.dragStart(e, this.boxNode);
//									});
							this.connect(this.boxNode, "touchmove", function(e) {
								e.preventDefault();
							});
							this.connect(this.barNode, "ontouchstart", function(e) {
								this.dragStart(e, this.boxNode);
							});
							

						},

						constructor : function(/* Object */args) {
							declare.safeMixin(this, args);
						},

						// Determine browser and version.

						browser : function() {

							var ua, s, i;

							ua = navigator.userAgent;

							s = "MSIE";
							if ((i = ua.indexOf(s)) >= 0) {
								this.isIE = true;
								this.version = parseFloat(ua.substr(i
										+ s.length));
								return;
							}

							s = "Netscape6/";
							if ((i = ua.indexOf(s)) >= 0) {
								this.isNS = true;
								this.version = parseFloat(ua.substr(i
										+ s.length));
								return;
							}

							// Treat any other "Gecko" browser as NS 6.1.

							s = "Gecko";
							if ((i = ua.indexOf(s)) >= 0) {
								this.isNS = true;
								this.version = 6.1;
								return;
							}
						},

						dragStart : function(event, node) {

							// debug
							coords.innerHTML = "entered dragStart";
							console.log("entered dragStart");
							
//							var el;

							// If an element id was given, find it. Otherwise
							// use the element
							// being
							// clicked on.
							var dragObj = this.statics.dragObj;

							if (node)
//								dragObj.elNode = document.getElementById(id);
								dragObj.elNode = node;
							else {
								if (this.isIE)
									dragObj.elNode = window.event.srcElement;
								if (this.isNS)
//									dragObj.elNode = event.target;
									dragObj.elNode = event.target.parentNode;

								// If this is a text node, use its parent
								// element.

								if (dragObj.elNode.nodeType == 3)
									dragObj.elNode = dragObj.elNode.parentNode;
							}
						    console.log(event, dragObj.elNode);

							// Get cursor position with respect to the page.
							this._currentPosn();

							// Save starting positions of cursor and element.

							dragObj.cursorStartX = this.x;
							dragObj.cursorStartY = this.y;
							dragObj.elStartLeft = parseInt(dragObj.elNode.style.left, 10);
							dragObj.elStartTop = parseInt(dragObj.elNode.style.top, 10);

							if (isNaN(dragObj.elStartLeft))
								dragObj.elStartLeft = 0;
							if (isNaN(dragObj.elStartTop))
								dragObj.elStartTop = 0;

							// Update element's z-index.

							dragObj.elNode.style.zIndex = ++dragObj.zIndex;

							// Capture mousemove and mouseup events on the page.

							if (this.isIE) {
								document.attachEvent("onmousemove", this.dragGo);
								document.attachEvent("onmouseup", this.dragStop);
								window.event.cancelBubble = true;
								window.event.returnValue = false;
							}
							if (this.isNS) {
								this.onmousemoveHandler = this.connect(this.boxNode, "mousemove", lang.hitch(this, this.dragGo));
								this.onmouseupHandler = this.connect(this.boxNode, "mouseup", lang.hitch(this, this.dragStop));
								event.preventDefault();
							}

						},

						dragGo : function(event) {

							// Get cursor position with respect to the page.
							this._currentPosn();

							// Move drag element by the same amount the cursor
							// has moved.

							var dragObj = this.statics.dragObj;
							dragObj.elNode.style.left = (dragObj.elStartLeft + this.x - dragObj.cursorStartX) + "px";
							dragObj.elNode.style.top = (dragObj.elStartTop + this.y - dragObj.cursorStartY) + "px";

							// debug
							if (coords)
							coords.innerHTML = dragObj.elNode.style.left + ", " + dragObj.elNode.style.top + "<br>" +
							dragObj.elStartLeft + ", " + dragObj.elStartTop + "<br>" +
							this.x + ", " + this.y + "<br>" +
							dragObj.cursorStartX + ", " + dragObj.cursorStartY + "<br>" +
							dragObj.elNode.style.left + ", " + dragObj.elNode.style.top
		;
							
							if (this.isIE) {
								window.event.cancelBubble = true;
								window.event.returnValue = false;
							}
							if (this.isNS)
								event.preventDefault();

						},

						dragStop : function() {

							// Stop capturing mousemove and mouseup events.

							// debug
							coords.innerHTML = "entered dragStop";
							console.log("entered dragStop");
							
							if (this.isIE) {
								document.detachEvent("onmousemove", this.dragGo);
								document.detachEvent("onmouseup", this.dragStop);
							}
							if (this.isNS) {
//								document.removeEventListener("mousemove", this.dragGo, true);
//								document.removeEventListener("mouseup", this.dragStop, true);
//								this.disconnect(this.onmousedown);
								this.onmousemoveHandler.remove();
								this.onmouseupHandler.remove();
							}

						},

						// Get cursor position with respect to the page.
						_currentPosn : function() {
							if (this.isIE) {
								this.x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
								this.y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
							}
							if (this.isNS) {
								this.x = event.clientX + window.scrollX;
								this.y = event.clientY + window.scrollY;
							}
						},

					});
		});
