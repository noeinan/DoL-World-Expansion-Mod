function DefineMacro(macroName, macroFunction) {
	Macro.add(macroName, { isWidget: true, handler: function() {
		var oldArgs = State.variables.args;
		State.variables.args = this.args.slice();
		macroFunction.apply(this, this.args);
		if (typeof oldArgs === 'undefined') {
			delete State.variables.args;
		} else {
			State.variables.args = oldArgs;
		}
	} });
}

/**
 * Define macro, where macroFunction returns text to wikify & print
 */
function DefineMacroS(macroName, macroFunction) {
	DefineMacro(macroName, function() {
		$(this.output).wiki(macroFunction.apply(null,this.args))
	});
}