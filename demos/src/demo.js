import './../../main.js';
console.log('woo')
function initDemos() {
	document.addEventListener('DOMContentLoaded', function() {
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
	});
}




initDemos();
