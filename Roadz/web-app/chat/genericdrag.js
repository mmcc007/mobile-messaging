//*****************************************************************************
// Do not remove this notice.
//
// Copyright 2001 by Mike Hall.
// See http://www.brainjar.com for terms of use.
//*****************************************************************************

// Determine browser and version.

function Browser() {

  var ua, s, i;

  this.isIE    = false;
  this.isNS    = false;
  this.version = null;

  ua = navigator.userAgent;
//  console.log('ua=' +  ua);
//  document.write("<p>" + ua + "</p>");
  s = "MSIE";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
//    console.log('s=' + s);
    return;
  }

  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
//    console.log('s=' + s);
    return;
  }

  // Treat any other "Gecko" browser as NS 6.1.

  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = 6.1;
//    console.log('s=' + s);
    return;
  }
  
}

var browser = new Browser();

// Global object to hold drag information.

var dragObj = new Object();
dragObj.zIndex = 0;

function dragStart(e, id) {
	  if(e.touches==undefined) {
		  event=e;
	  } else {
		  if (e.touches.length == 1){ // Only deal with one finger
			  event=e.touches[0];
		  } else {
			  return
		  }
	  }

  var el;
  var x, y;

  // If an element id was given, find it. Otherwise use the element being
  // clicked on.

  if (id)
    dragObj.elNode = document.getElementById(id);
  else {
    if (browser.isIE)
      dragObj.elNode = window.event.srcElement;
    if (browser.isNS)
      dragObj.elNode = event.target;

    // If this is a text node, use its parent element.

    if (dragObj.elNode.nodeType == 3)
      dragObj.elNode = dragObj.elNode.parentNode;
  }

  // Get cursor position with respect to the page.

  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
  }
  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Save starting positions of cursor and element.
//  console.log('dragStart: event.clientX=' + event.clientX + ', event.clientY=' + event.clientY);
//  console.log('dragStart: window.scrollX=' + window.scrollX + ', window.scrollY=' + window.scrollY);
//  console.log('dragStart: x=' + x + ', y=' + y);

  dragObj.cursorStartX = x;
  dragObj.cursorStartY = y;
  dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
  dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);

  if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
  if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;

  // Update element's z-index.

  dragObj.elNode.style.zIndex = ++dragObj.zIndex;

  // Capture mousemove and mouseup events on the page.

  if (browser.isIE) {
    document.attachEvent("onmousemove", dragGo);
    document.attachEvent("onmouseup",   dragStop);
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (browser.isNS) {
  document.addEventListener("mousemove", dragGo,   true);
  document.addEventListener("mouseup",   dragStop, true);
  document.addEventListener("touchmove", dragGo,   true);
  document.addEventListener("touchend",   dragStop, true);
//    event.preventDefault();
  }
}

function dragGo(e) {
//	console.log('e=' + e);
//	console.log('e.touches=' + e.touches);
    var event = undefined==e.touches?e:e.touches[0]; // Get the information for finger #1 if avail
//    var event = e.touches[0];
  var x, y;

  // Get cursor position with respect to the page.

  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }
//  console.log('window.scrollX=' + window.scrollX + ', window.scrollY=' + window.scrollY);
//  console.log('window.pageXOffset=' + window.pageXOffset + ', window.pageYOffset=' + window.pageYOffset);
//  console.log('event=' + event);
//  console.log('event.clientX=' + event.clientX + ', event.clientY=' + event.clientY);
//  console.log('event.pageX=' + event.pageX + ', event.pageY=' + event.pageY);
//  console.log('dragObj.elStartLeft=' + dragObj.elStartLeft + ', dragObj.elStartTop=' + dragObj.elStartTop);
//  console.log('dragObj.cursorStartX=' + dragObj.cursorStartX + ', dragObj.cursorStartY=' + dragObj.cursorStartY);
//  console.log('x=' + x + ', y=' + y);

  // Move drag element by the same amount the cursor has moved.

  dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
  dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";

  if (browser.isIE) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
//  if (browser.isNS)
//    event.preventDefault();
}

function dragStop(event) {

  // Stop capturing mousemove and mouseup events.

  if (browser.isIE) {
    document.detachEvent("onmousemove", dragGo);
    document.detachEvent("onmouseup",   dragStop);
  }
  if (browser.isNS) {
    document.removeEventListener("mousemove", dragGo,   true);
    document.removeEventListener("mouseup",   dragStop, true);
    document.removeEventListener("touchmove", dragGo,   true);
    document.removeEventListener("touchend",   dragStop, true);
  }
}
