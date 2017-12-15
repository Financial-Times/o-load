/**
 * @file
 * HTML fixtures for integration tests
 */

let sandboxEl;

function createSandbox() {
	if (document.querySelector('.sandbox')) {
		sandboxEl = document.querySelector('.sandbox');
	} else {
		sandboxEl = document.createElement('div');
		sandboxEl.setAttribute('class', 'sandbox');
		document.body.appendChild(sandboxEl);
	}
}

function reset() {
	sandboxEl.innerHTML = '';
}

function insert(html) {
	createSandbox();
	sandboxEl.innerHTML = html;
}


function htmlCode () {
	const html = `<div>
		<h1>Basic Demo</h1>
			<img src="" class="o-load" data-o-component="o-load" id="element" />
	</div>

		<h1>Demo with stringified config</h1>
			<img
				src=""
				class="o-load"
				data-o-component="o-load"
				id="element-with-config">
				data-o-load-config="{&#x22;configIsWorking&#x22;:true}"
			</div>
	`;
	insert(html);
}

export {
	htmlCode,
	reset,
};
