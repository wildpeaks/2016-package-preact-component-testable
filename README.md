# Testable Component

[![Build Status](https://travis-ci.org/wildpeaks/package-preact-component-testable.svg?branch=master)](https://travis-ci.org/wildpeaks/package-preact-component-testable)

**Preact component that optionally exposes the component instance.**

When a callback is provided in prop `testable`, it is called by `componentDidMount`
(so you can call functions like `.setState` or read `.props` in your tests).


Install:

	npm install @wildpeaks/preact-component-testable


Example:

	const TestableComponent = require('@wildpeaks/preact-component-testable');

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
			// Initial state
			strictEqual(component.state.hello, 'Initially');
			strictEqual(document.body.firstChild.childNodes[0].nodeValue, 'Initially');

			// The change being tested
			component.setState({hello: 'Updated'});

			// Updated state
			setTimeout(() => {
				strictEqual(component.state.hello, 'Updated');
				strictEqual(document.body.firstChild.childNodes[0].nodeValue, 'Updated');
				done();
			});
		}
	});
	render(element, document.body);


The only requirement (**only if your component implements `componentDidMount`**)
is to call `super.componentDidMount()` at the end of your function.

