

function touchHandler(event)
{
	var dontChangeEvent = jQuery(event.target).hasClass('jquery-touch-disable');

	if (dontChangeEvent)
		return;

	var self = this;
	var touches = event.changedTouches,
        first = touches[0],
        type = "";

	switch (event.type)
	{
		case "touchstart":
			type = "mousedown";
			window.startY = event.pageY;
			break;
		case "touchmove":
			type = "mousemove";
			break;
		case "touchend":
			type = "mouseup";
			break;
		default:
			return;
	}
	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0 /*left*/, null);

	first.target.dispatchEvent(simulatedEvent);

	var scrollables = [];
	var clickedInScrollArea = false;

	// check if any of the parents has is-scollable class
	var parentEls = jQuery(event.target).parents().map(function ()
	{
		try
		{
			if (jQuery(this).hasClass('is-scrollable'))
			{
				clickedInScrollArea = true;
				// get vertical direction of touch event
				var direction = (window.startY < event.pageY) ? 'down' : 'up';
				// calculate stuff... :o)

				scrollables.push(this);

			}
		} catch (e) { }
	});
	// if not, prevent default to prevent bouncing
	if ((scrollables.length === 0) && (type === 'mousemove'))
    {
		event.preventDefault();
	}

}

function initTouchHandler()
{
	document.addEventListener("touchstart", touchHandler, true);
	document.addEventListener("touchmove", touchHandler, true);
	document.addEventListener("touchend", touchHandler, true);
	document.addEventListener("touchcancel", touchHandler, true);

}