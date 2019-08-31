window.GenerateNewSlave = (function() {
	"use strict";
	let V;
	let chance;
	/**
	 * @type {App.Entity.SlaveState} */
	let slave;

	function GenerateNewSlave(sex) {
		V = State.variables;
		slave = BaseSlave();
	}
}