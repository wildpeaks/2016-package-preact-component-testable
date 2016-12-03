'use strict';
const {Component} = require('preact');

class TestableComponent extends Component {
	componentDidMount(){
		if (typeof this.props.testable === 'function'){
			this.props.testable(this);
		}
	}
}

module.exports = TestableComponent;
