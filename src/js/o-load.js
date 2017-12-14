/**
 * @file
 * Origami component to load modules using SystemJS.
 */

import System from 'systemjs';

function oLoad(oLoadEl, defaultOpts = {
	systemjsOpts: {
		map: {
			// We let SystemJS be loaded as a module in case the component uses SystemJS.
			systemjs: 'https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.20.19/system.js',
			'plugin-babel': 'https://unpkg.com/systemjs-plugin-babel@0.0.25'
		},
		packages: {
	    'plugin-babel': {
	      main: 'plugin-babel.js',
	    },
	  },
		transpiler: 'plugin-babel',
	}
}) {
	console.log('in oLoad');
	console.dir(oLoadEl);

	const opts = Object.assign({}, defaultOpts, createOptsFromDataSet(oLoadEl));
	const componentRoot = document.createElement('div');
	const systemjsOpts = opts.systemjsOpts;

	System.config(opts.systemjsOpts);

	if (oLoadEl && oLoadEl.parentNode) {
		console.dir(opts);
		return System.import(opts.moduleUrl)
			.then(module => {
				console.dir(module);
				// oLoadEl.parentNode.replaceChild(componentRoot, oLoadEl);
				// componentRoot.classList.add('o-loaded');
				// return module(componentRoot);
			})
			.catch((e) => {
				console.error(e);
			});
	}
};

oLoad.init = (rootEl, opts) => {
	if (!rootEl) {
		rootEl = document.body;
	}
	if (!(rootEl instanceof HTMLElement)) {
		rootEl = document.querySelector(rootEl);
	}
	if (rootEl instanceof HTMLElement && /\bo-load\b/.test(rootEl.getAttribute('data-o-component'))) {
		return oLoad(rootEl, opts);
	}

	return Array.from(rootEl.querySelectorAll('[data-o-component="o-load"]'), rootEl => oLoad(rootEl, opts));
};

function createOptsFromDataSet(el) {
	return Object.entries(el.dataset)
		.filter(([key]) => key.startsWith('oLoad'))
		.reduce((acc, [key, value]) => {
			const shorthandKey = key.replace(/^oLoad/, '');
			acc[shorthandKey.charAt(0).toLowerCase() + shorthandKey.slice(1)] = value;
			return acc;
		}, {});
}

export default oLoad;
