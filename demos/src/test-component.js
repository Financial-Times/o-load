/**
 * @file
 * This demo component bootstraps the component using SystemJS.
 * It's kind of sub-optimal because we're using SystemJS from globals, but
 * this is meant more as a demonstration than anything.
 *
 * @TODO Convert this into separate component, maybe g-preact-jsx-component...?
 */

// SystemJS is provided via global from $script.
// This is sub-optimal, but works for demo purposes.
/* global System */

System.config({
	map: {
		"plugin-babel": "https://unpkg.com/systemjs-plugin-babel@0.0.25",
		"systemjs-babel-build":
			"https://unpkg.com/systemjs-plugin-babel@0.0.25/systemjs-babel-browser.js",
		preact: "https://unpkg.com/preact@8.2.7"
	},
	packages: {
		"plugin-babel": {
			main: "plugin-babel.js"
		}
	},
	transpiler: "plugin-babel",
	meta: {
		"*.js": {
			babelOptions: {
				react: true
			}
		}
	}
});

export default (el, opts) =>
	System.import(
		"https://rawgit.com/Financial-Times/o-load/HEAD/demos/src/party-parrot.js"
	).then(m => {
		return m.default(el, opts);
	});
