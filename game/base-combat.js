function isSameTarget(a, b) {
	// Some targets are strings, other objects
	if(typeof(a) !== typeof(b)) {
		return false;
	}
	// If strings, compare as-is
	if(typeof(a) === "string") {
		return a === b;
	}
	// If objects, compare all components
	return a.action === b.action &&
		a.entity === b.entity &&
		a.part === b.part;
}
window.isSameTarget = isSameTarget; // export function

// Finds tentacle with head set to tentacleState
function findTentacleHead(tentacleState) {
	var allTentacles = SugarCube.State.variables["alltentacles"];
	for(var i = 0; i < allTentacles.length; i++) {
		if(allTentacles[i].head === tentacleState) {
			return i;
		}
	}
	return -1;
}
window.findTentacleHead = findTentacleHead;