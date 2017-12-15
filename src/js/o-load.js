/**
 * @file
 * Origami component to load modules using SystemJS.
 */

import $script from "scriptjs";
import { Html5Entities as Entities } from "html-entities";

/**
 * Required config for build modules on-the-fly via SystemJS plugin-babel
 * @type {Object}
 */
const devOpts = {
	map: {
		"plugin-babel": "https://unpkg.com/systemjs-plugin-babel@0.0.25",
		"systemjs-babel-build":
			"https://unpkg.com/systemjs-plugin-babel@0.0.25/systemjs-babel-browser.js"
	},
	packages: {
		"plugin-babel": {
			main: "plugin-babel.js"
		}
	},
	transpiler: "plugin-babel"
};

/**
 * A resolved o-load module
 * @typedef {Object} oLoadResolvedModule
 * @property {HTMLElement|undefined} component - The parent element of rendered component
 * @property {Object} config - The parsed component config
 * @property {Object} opts - The full o-load opts object
 */

/**
 * Main o-load constructor
 * @param  {HTMLElement} oLoadEl - Element to replace with rendered component
 * @param  {Object} defaultOpts  - Initial options object (merged with declarative opts)
 * @return {Promise<oLoadResolvedModule>}                               [description]
 */
function oLoad(
	oLoadEl,
	defaultOpts = {
		systemjsOpts: {}
	}
) {
	const opts = Object.assign({}, defaultOpts, createOptsFromDataSet(oLoadEl));
	const componentRoot = document.createElement("div");

	if (
		!window.System &&
		opts.moduleUrl &&
		opts.moduleUrl.match(/min\.(.js)?$/)
	) {
		return new Promise(resolveOLoadModule({ isProd: true }));
	} else {
		// Transpile in-dev code
		opts.systemjsOpts = Object.assign({}, devOpts, opts.systemjsOpts);
		return new Promise(resolveOLoadModule({ isProd: false }));
	}

	function resolveOLoadModule({ isProd = false }) {
		return (resolve, reject) => {
			$script(
				`https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.20.19/system${
					isProd ? "-production" : ""
				}.js`,
				function(System = window.System) {
					System.config(opts.systemjsOpts);

					if (oLoadEl && oLoadEl.parentNode && opts.moduleUrl) {
						return System.import(opts.moduleUrl)
							.then(m => {
								oLoadEl.parentNode.replaceChild(componentRoot, oLoadEl);
								componentRoot.classList.add("o-loaded");
								resolve({
									component: m.default(componentRoot, opts.config),
									config: opts.config,
									opts: opts
								});
							})
							.catch(e => {
								reject(e);
							});
					} else {
						// @TODO consider whether to reject instead when no module URL is provided
						// reject(new Error('No module URL provided'));
						resolve({
							component: undefined,
							config: opts.config,
							opts: opts
						});
					}
				}
			);
		};
	}
}

/**
 * Initialise o-load
 * @param  {undefined|HTMLElement|String} rootEl - A o-load element
 * @param  {Object} opts?   - Optional configuration object
 * @return {oLoad|oLoad[]}  - o-load instance(s)
 */
oLoad.init = (rootEl, opts) => {
	if (!rootEl) {
		rootEl = document.body;
	}

	if (!(rootEl instanceof HTMLElement)) {
		rootEl = document.querySelector(rootEl);
	}

	if (
		rootEl instanceof HTMLElement &&
		/\bo-load\b/.test(rootEl.getAttribute("data-o-component"))
	) {
		return oLoad(rootEl, opts);
	}

	return Array.from(
		rootEl.querySelectorAll('[data-o-component="o-load"]'),
		rootEl => oLoad(rootEl, opts)
	);
};

/**
 * Rename data attributes and assign values to options Object
 * @param  {HTMLElement} el - Parent HTML createElement
 * @return {Object}         - Parsed options object
 */
function createOptsFromDataSet(el) {
	const opts = Object.entries(el.dataset)
		.filter(([key]) => key.startsWith("oLoad"))
		.reduce((acc, [key, value]) => {
			const shorthandKey = key.replace(/^oLoad/, "");
			acc[shorthandKey.charAt(0).toLowerCase() + shorthandKey.slice(1)] = value;
			return acc;
		}, {});

	try {
		// Decode URLEncoded entities on data-o-load-config attribute
		if (opts.config) {
			const entities = new Entities();
			opts.config = JSON.parse(entities.decode(opts.config));
		} else {
			opts.config = {};
		}

		return opts;
	} catch (e) {
		if (e.name === "SyntaxError") console.error("Invalid o-load config object");
		return opts;
	}
}

export default oLoad;
