import oLoad from "./src/js/o-load";

const constructAll = () => {
	oLoad.init();
	document.removeEventListener("o.DOMContentLoaded", constructAll);
};

document.addEventListener("o.DOMContentLoaded", constructAll);

export { constructAll as init };
export default oLoad;
