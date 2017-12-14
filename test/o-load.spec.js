/**
 * Spec for o-load
 */

import chai from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import chaiAsPromised from 'chai-as-promised';
import component from "../main";
import * as fixtures from "./helpers/fixtures";

const should = chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("oLoad", () => {
	it("is defined", () => {
		should.exist(component);
	});

	it("has a static init method", () => {
		component.init.should.be.a("function");
	});

	it("should autoinitialize", done => {
		const initSpy = sinon.spy(component, "init");
		document.dispatchEvent(new CustomEvent("o.DOMContentLoaded"));
		setTimeout(function() {
			initSpy.should.have.been.called;
			initSpy.restore();
			done();
		}, 100);
	});

	it("should not autoinitialize when the event is not dispached", () => {
		const initSpy = sinon.spy(component, "init");
		initSpy.should.not.have.been.called;
	});

	// This is broken for some reason
	describe("should create a new", () => {
		beforeEach(() => {
			fixtures.htmlCode();
		});

		afterEach(() => {
			fixtures.reset();
		});

		it("component array when initialized", () => {
			const componentItems = component.init();
			componentItems.should.be.an("array");
			componentItems[0].should.eventually.be.an.instanceof(component);
		});

		it("single component when initialized with a root element", () => {
			const componentItem = component.init("#element");
			componentItem.should.eventually.be.an.instanceof(component);
		});
	});
});
