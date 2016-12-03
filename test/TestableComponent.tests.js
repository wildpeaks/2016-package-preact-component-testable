'use strict';
/* eslint-env mocha, browser */
/* eslint-disable no-invalid-this */
const {strictEqual, ok} = require('assert');
const {h, render, Component} = require('preact');
const {spy} = require('sinon');
const TestableComponent = require('..');


function test_invalid_callback(testable, done){
	document.body.innerHTML = '';

	class MyComponent extends Component {
		constructor(){
			super();
			this.state = {
				hello: 'Initially'
			};
		}
		render(props, state){
			return h('h1', null, state.hello);
		}
	}

	const element = h(MyComponent, {testable});
	render(element, document.body);
	setTimeout(() => {
		ok(true, 'No exception thrown');
		done();
	}, 100);
}


function test_not_testable(done){
	document.body.innerHTML = '';

	class MyComponent extends Component {
		constructor(){
			super();
			this.state = {
				hello: 'Initially'
			};
		}
		render(props, state){
			return h('h1', null, state.hello);
		}
	}

	const testable = spy();
	const element = h(MyComponent, {testable});
	render(element, document.body);
	setTimeout(() => {
		strictEqual(testable.callCount, 0, 'testable is never called');
		done();
	}, 100);
}


function test_default_mount(done){
	document.body.innerHTML = '';

	class MyComponent extends TestableComponent {
		constructor(){
			super();
			this.state = {
				hello: 'Initially'
			};
		}
		render(props, state){
			return h('h1', null, state.hello);
		}
	}

	const element = h(MyComponent, {
		testable: component => {
			strictEqual(component.state.hello, 'Initially');
			strictEqual(document.body.firstChild.childNodes[0].nodeValue, 'Initially');

			component.setState({hello: 'Updated'});

			setTimeout(() => {
				strictEqual(component.state.hello, 'Updated');
				strictEqual(document.body.firstChild.childNodes[0].nodeValue, 'Updated');
				done();
			});
		}
	});
	render(element, document.body);
}


function test_overriden_mount(done){
	document.body.innerHTML = '';

	class MyComponent extends TestableComponent {
		constructor(){
			super();
			this.state = {
				hello: 'Initially',
				mounted: false
			};
		}
		componentDidMount(){
			this.setState({
				mounted: true
			});
			super.componentDidMount();
		}
		render(props, state){
			return h('h1', null, state.hello);
		}
	}

	const element = h(MyComponent, {
		testable: component => {
			strictEqual(component.state.hello, 'Initially');
			strictEqual(document.body.firstChild.childNodes[0].nodeValue, 'Initially');

			component.setState({hello: 'Updated'});

			setTimeout(() => {
				strictEqual(component.state.hello, 'Updated');
				strictEqual(document.body.firstChild.childNodes[0].nodeValue, 'Updated');
				done();
			});
		}
	});
	render(element, document.body);
}


describe('@wildpeaks/preact-component-testable', function(){
	this.slow(300);
	this.timeout(400);
	it(`Component doesn't call testable`, test_not_testable);
	it(`Invalid testable (true)`, test_invalid_callback.bind(null, true));
	it(`Invalid testable (false)`, test_invalid_callback.bind(null, false));
	it(`Invalid testable (null)`, test_invalid_callback.bind(null, null));
	it(`Invalid testable (0)`, test_invalid_callback.bind(null, 0));
	it(`Invalid testable (1)`, test_invalid_callback.bind(null, 1));
	it(`Invalid testable ({})`, test_invalid_callback.bind(null, {}));
	it(`Invalid testable (Function)`, test_invalid_callback.bind(null, Function));
	it('Valid testable, without componentDidMount', test_default_mount);
	it('Valid testable, with componentDidMount', test_overriden_mount);
});
