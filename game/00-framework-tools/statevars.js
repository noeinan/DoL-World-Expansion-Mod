Object.defineProperties(window, {
	V: {
		get: function() {
			return State.variables;
		}
	},
	T: {
		get: function() {
			return State.temporary;
		}
	},
	C: {
		value: {}
	}
});
