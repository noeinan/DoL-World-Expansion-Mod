function colourContainerClasses() {
	var V = State.variables;
	return 'hair-' + (V.haircolour || '').replace(/ /g, '-') +
		' ' + 'eye-' + (V.eyecolour || '').replace(/ /g, '-') +
		' ' + 'upper-' + (V.upperwet > 100 ? 'wet' : '') + (V.worn.upper.colour || '').replace(/ /g, '-') +
		' ' + 'lower-' + (V.lowerwet > 100 ? 'wet' : '') + (V.worn.lower.colour || '').replace(/ /g, '-') +
		' ' + 'under_lower-' + (V.underlowerwet > 100 ? 'wet' : '') + (V.worn.under_lower.colour || '').replace(/ /g, '-') +
		' ' + 'under_upper-' + (V.underupperwet > 100 ? 'wet' : '') + (V.worn.under_upper.colour || '').replace(/ /g, '-') +
		' ' + 'head-' + (V.worn.head.colour || '').replace(/ /g, '-') +
		' ' + 'face-' + (V.worn.face.colour || '').replace(/ /g, '-') +
		' ' + 'neck-' + (V.worn.neck.colour || '').replace(/ /g, '-') +
		' ' + 'legs-' + (V.worn.legs.colour || '').replace(/ /g, '-') +
		' ' + 'feet-' + (V.worn.feet.colour || '').replace(/ /g, '-') +
		' ' + 'upper_acc-' + (V.worn.upper.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'lower_acc-' + (V.worn.lower.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'under_lower_acc-' + (V.worn.under_lower.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'under_upper_acc-' + (V.worn.under_upper.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'head_acc-' + (V.worn.head.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'face_acc-' + (V.worn.face.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'neck_acc-' + (V.worn.neck.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'legs_acc-' + (V.worn.legs.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'feet_acc-' + (V.worn.feet.accessory_colour || '').replace(/ /g, '-')
}
window.colourContainerClasses = colourContainerClasses; // export function

function limitedColourContainerClasses() {
	var V = State.variables;
	return 'hair-' + (V.haircolour || '').replace(/ /g, '-') +
		' ' + 'eye-' + (V.eyecolour || '').replace(/ /g, '-')
}
window.limitedColourContainerClasses = limitedColourContainerClasses; // export function

function debugColourContainerClasses(color) {
	var V = State.variables;
	return 'hair-' + (color.hair || '').replace(/ /g, '-') +
		' ' + 'eye-' + (color.eyes || '').replace(/ /g, '-') +
		' ' + 'upper-' + (color.upper[0] || '').replace(/ /g, '-') +
		' ' + 'lower-' + (color.lower[0] || '').replace(/ /g, '-') +
		' ' + 'under_lower-' + (color.under_lower[0] || '').replace(/ /g, '-') +
		' ' + 'under_upper-' + (color.under_upper[0] || '').replace(/ /g, '-') +
		' ' + 'head-' + (color.head[0] || '').replace(/ /g, '-') +
		' ' + 'face-' + (color.face[0] || '').replace(/ /g, '-') +
		' ' + 'neck-' + (color.neck[0] || '').replace(/ /g, '-') +
		' ' + 'legs-' + (color.legs[0] || '').replace(/ /g, '-') +
		' ' + 'feet-' + (color.feet[0] || '').replace(/ /g, '-') +
		' ' + 'upper_acc-' + (color.upper[1] || '').replace(/ /g, '-') +
		' ' + 'lower_acc-' + (color.lower[1] || '').replace(/ /g, '-') +
		' ' + 'under_lower_acc-' + (color.under_lower[1] || '').replace(/ /g, '-') +
		' ' + 'under_upper_acc-' + (color.under_upper[1] || '').replace(/ /g, '-') +
		' ' + 'head_acc-' + (color.head[1] || '').replace(/ /g, '-') +
		' ' + 'face_acc-' + (color.face[1] || '').replace(/ /g, '-') +
		' ' + 'neck_acc-' + (color.neck[1] || '').replace(/ /g, '-') +
		' ' + 'legs_acc-' + (color.legs[1] || '').replace(/ /g, '-') +
		' ' + 'feet_acc-' + (color.feet[1] || '').replace(/ /g, '-')
}
window.debugColourContainerClasses = debugColourContainerClasses; // export function
