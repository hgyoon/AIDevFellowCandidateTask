//THIS FILE CONSISTS OF UTILITIES TO BE USED IN THE APP

/* Returns document height */
function getWindowHeight() {
	const body = document.body;
	const html = document.documentElement;

	return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

/* Returns scrollTop height: The pixels value which is above the visible scrollable area */
function getScrollHeight() {
	return window.pageYOffset !== undefined
		? window.pageYOffset
		: (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

/* Checks if scroll reached bottom of the document */
export function isScrollable() {
	return getScrollHeight() < getWindowHeight() - window.innerHeight;
}

/* Throttle function for constant execution of a function after every x secs */
export function throttler(fn, threshhold, scope) {
	threshhold || (threshhold = 250);
	var last, deferTimer;
	return function() {
		var context = scope || this;
		var now = new Date(),
			args = arguments;
		if (last && now < last + threshhold) {
			// hold on to it
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function() {
				last = now;
				fn.apply(context, args);
			}, threshhold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}

/* Parses response to JSON object */
export function parseJSON(response) {
	return response.json();
}

/* Generates image url */
export function getImageUrl(farm, server, id, secret) {
	return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}.jpg`;
}

/* Debounces function to discard a number of fastpace events */
export function debouncer(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}
