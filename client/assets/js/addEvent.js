//Author: Stephen Cirelli
//----- Cross browser event handling -------
function addEvent(elem, evtType, func) 
{
	if(typeof(elem) == "string")
		elem = document.getElementById(elem);
	if(elem == null)
		return;
	if (elem.addEventListener) {
		elem.addEventListener(evtType, func, false);
	} else if (elem.attachEvent) {
		elem.attachEvent("on" + evtType, func);
	} else {
		elem["on" + evtType] = func;
	}
}
function removeEvent(elem, evtType, func) 
{
	if(typeof(elem) == "string")
		elem = document.getElementById(elem);
	if(elem == null)
		return;
	if (elem.removeEventListener) {
		elem.removeEventListener(evtType, func, false);
	} else if (elem.detachEvent) {
		elem.detachEvent("on" + evtType, func);
	} else {
		elem["on" + evtType] = null;
	}
}

function fireEvent(elem,event)
{
	if(typeof(elem) == "string")
		elem = document.getElementById(elem);
	if(elem == null)
		return;
    if (document.createEventObject){
        // dispatch for IE
        var evt = document.createEventObject();
        return elem.fireEvent('on'+event,evt)
    }
    else{
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !elem.dispatchEvent(evt);
    }
}

function cancelEvent(evt)
{
	evt = (evt) ? evt : ((window.event) ? window.event : null);
	if( !evt ) return false;
	
	if(evt.stopPropagation)
		evt.stopPropagation();
	if(evt.preventDefault)
		evt.preventDefault();
	evt.cancelBubble = true;
	evt.cancel = true;
	evt.returnValue = false;
	return false;
}

/*
addEvent(window, "load", function() {
   addEvent(document.getElementById("myButton"), "click", handleClick);
   addEvent(document.body, "mouseup", function(evt) {handleClick(evt);});
});

function doSomething(evt) {
   evt = (evt) ? evt : ((window.event) ? window.event : null);
   if (evt) {
      // browser has an event to process
	  var elem = (evt.target) ? evt.target : ((evt.srcElement) ?  evt.srcElement : null);
      ...
   }
}

var elem = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
*/
