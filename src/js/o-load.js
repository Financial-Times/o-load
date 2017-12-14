/**
 * @file
 * Origami component to load modules using SystemJS.
 */

import $script from "scriptjs";

function oLoad(
	oLoadEl,
	defaultOpts = {
		systemjsOpts: {
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
		}
	}
) {
	const opts = Object.assign({}, defaultOpts, createOptsFromDataSet(oLoadEl));
	const componentRoot = document.createElement("div");

	if (opts.moduleUrl.match(/min\.(.js)?$/)) {
		$script(
			"https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.20.19/system-production.js",
			"system"
		);
	} else {
		$script(
			"https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.20.19/system.js",
			"system"
		);
	}

	$script.ready("system", function(System = window.System) {
		System.config(opts.systemjsOpts);

		if (oLoadEl && oLoadEl.parentNode) {
			return System.import(opts.moduleUrl)
				.then(m => {
					oLoadEl.parentNode.replaceChild(componentRoot, oLoadEl);
					componentRoot.classList.add("o-loaded");
					return m.default(componentRoot);
				})
				.catch(e => {
					console.error(e);
				});
		}
	});
}

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

function createOptsFromDataSet(el) {
	return Object.entries(el.dataset)
		.filter(([key]) => key.startsWith("oLoad"))
		.reduce((acc, [key, value]) => {
			const shorthandKey = key.replace(/^oLoad/, "");
			acc[shorthandKey.charAt(0).toLowerCase() + shorthandKey.slice(1)] = value;
			return acc;
		}, {});
}

export default oLoad;
