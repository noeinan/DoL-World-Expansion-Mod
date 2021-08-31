/*
 * Usage:
 * <<radiovar VARNAME VALUE [LABEL]>> ONCHANGE <</radiovar>>
 *
 * Will display a radiobutton, optionally labeled, that corresponds
 * to state variable VARNAME having value VALUE.
 *
 * When var value is set to this value, silently execute ONCHANGE
 */
Macro.add("radiovar", {
	tags: null,
	handler: function() {
		if (this.args.length < 2) return this.error("missing <<radiovar>> arguments");
		var varname = this.args[0];
		var value = this.args[1];
		var content = this.payload[0].contents;
		var e = $("<input>")
			.attr({
				name: "radiovar"+Util.slugify(varname),
				id: "radiovar"+Util.slugify(varname)+"-"+Util.slugify(value),
				tabindex: 0,
				type: "radio"
			})
			.prop("checked", State.getVar(varname) ==  value)
			.addClass("macro-radiovar")
			.on('change.macros', function () {
				if (this.checked) {
					State.setVar(varname, value);
					Wikifier.wikifyEval(content);
				}
			});
		if (this.args[2]) e = $("<label>").append(this.args[2], e);
		e.appendTo(this.output);
	}
});