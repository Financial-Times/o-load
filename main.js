import oLoad from './src/js/o-load';

const constructAll = () => {
	console.log('whut2');
	oLoad.init();
	console.log('whut');
	// Constructor code here

	document.removeEventListener('o.DOMContentLoaded', constructAll);
};

document.addEventListener('o.DOMContentLoaded', constructAll);

export { constructAll as init };
export default oLoad;
