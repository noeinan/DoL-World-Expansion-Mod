function colourContainerClasses() {
var V = State.variables;
return 'hair-'  + (V.haircolour||'').replace(/ /g,'-') +
' ' + 'eye-'   + (V.eyecolour||'').replace(/ /g,'-') +
' ' + 'upper-' + (V.worn.upper.colour||'').replace(/ /g,'-') +
' ' + 'lower-' + (V.worn.lower.colour||'').replace(/ /g,'-') +
' ' + 'under_lower-' + (V.worn.under_lower.colour||'').replace(/ /g,'-') +
' ' + 'under_upper-' + (V.worn.under_upper.colour||'').replace(/ /g,'-') +
' ' + 'head-' + (V.worn.head.colour||'').replace(/ /g,'-') +
' ' + 'face-' + (V.worn.face.colour||'').replace(/ /g,'-') +
' ' + 'neck-' + (V.worn.neck.colour||'').replace(/ /g,'-') +
' ' + 'legs-' + (V.worn.legs.colour||'').replace(/ /g,'-') +
' ' + 'feet-' + (V.worn.feet.colour||'').replace(/ /g,'-') +
' ' + 'upper_acc-' + (V.worn.upper.accessory_colour||'').replace(/ /g,'-') +
' ' + 'lower_acc-' + (V.worn.lower.accessory_colour||'').replace(/ /g,'-') +
' ' + 'under_lower_acc-' + (V.worn.under_lower.accessory_colour||'').replace(/ /g,'-') +
' ' + 'under_upper_acc-' + (V.worn.under_upper.accessory_colour||'').replace(/ /g,'-') +
' ' + 'head_acc-' + (V.worn.head.accessory_colour||'').replace(/ /g,'-') +
' ' + 'face_acc-' + (V.worn.face.accessory_colour||'').replace(/ /g,'-') +
' ' + 'neck_acc-' + (V.worn.neck.accessory_colour||'').replace(/ /g,'-') +
' ' + 'legs_acc-' + (V.worn.legs.accessory_colour||'').replace(/ /g,'-') +
' ' + 'feet_acc-' + (V.worn.feet.accessory_colour||'').replace(/ /g,'-')
}
window.colourContainerClasses = colourContainerClasses; // export function