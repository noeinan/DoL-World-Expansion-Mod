/**
 * As part of my various refactors, I ended up introducing a bunch of
 * global namespace-esk variables.
 *
 * Having a single spot to document them makes sense. By convention,
 * if you need to make a new top-level namespace, declare it here.
 */

/**
 * Declare everything in a root namespace, so that things can still be found
 * if shadowed, and for "documentation" purposes
 */
window.DOL = {
	// In pseudo-load order
	/**
	 * Mini application reporter app
	 * helps get detailed error messages to devs
	 * {@link ./01-error/error.js
	 */
	Errors: {},
	/**
	 * Registry of state schema, used for migrating Dol to new versions
	 * {@link ./02-version/.init.js
	 */
	Versions: {},
	Perflog: {},

	/** Patch to make javascript execution more consistent (see comment below) */
	State: State,
	/** Patch to make javascript execution more consistent (see comment below) */
	setup: setup,
	/** Patch to make javascript execution more consistent (see comment below) */
	Wikifier: Wikifier,
}
/* Make each of these namespaces available at the top level as well */
window.defineGlobalNamespaces = (namespaces) => {
	Object.entries(namespaces).forEach(([name, namespaceObject]) => {
		try {
			if (window[name] && window[name] !== namespaceObject) {
				console.warn(`Attempted to set ${name} in the global namespace, but it's already in use. Skipping this assignment. Existing Object:`, window[name])
			} else {
				/* Make it more difficult to shadow/overwrite things (users can still Object.defineProperty if they really mean it) */
				Object.defineProperty(window, name, { value: namespaceObject, writeable: false });
			}
		} catch (e) {
			if (window[name] !== namespaceObject) {
				console.error(`Failed to setup global namespace object ${name}. Attempting to continue. Source Error:`, e);
			}
		}
	});
}
defineGlobalNamespaces(DOL);

/**
 * Patches to make javascript execution more consistent
 * OR: Why we alias SugarCube.State as State:
 *
 *
 * When sugarcube executes code, it makes the global value `State`
 * the sugarcube state, but other globals like `SugarCube.State` don't exist
 *
 * By making this alias, if you simply use `State` to refer to state, it does not
 * matter if your code is executing inside of sugarcube or not. It'll always just work
 *
 * To elaborate further, we don't use `SugarCube.State` here as global initialisation is considered
 * sugarcube execution. `SugarCube.State` (currently) does not exist, but `State` (note, *not* window.State)
 * exists.
 */
/** Uncomment the following lines to get a better idea about how sugarcube makes certain globals available */
/*
function sugarCubeGlobals() {
	return {
		"State": typeof State !== 'undefined' ? State : '',
		"SugarCube": typeof SugarCube !== 'undefined' ? SugarCube : '',
		"SugarCube.State": typeof SugarCube !== 'undefined' ? (SugarCube || {}).State || '' : '',
		"window.State": window.State || '',
		"window.SugarCube": window.SugarCube || '',
		"window.SugarCube.State": (window.SugarCube || {}).State || ''
	}
}
$(document).on(':passageinit', () => {
	console.log(`:passageinit:`, sugarCubeGlobals());
});
$(document).on(':passageend', () => {
	console.log(`:passageend:`, sugarCubeGlobals());
	setTimeout(() => {
		console.log(`:passageend [after]:`, sugarCubeGlobals());
	})
})
*/
