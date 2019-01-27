function colourContainerClasses() {
var V = State.variables;
return 'hair-'  + (V.haircolour||'').replace(/ /g,'-') +
' ' + 'eye-'   + (V.eyecolour||'').replace(/ /g,'-') +
' ' + 'upper-' + (V.uppercolour||'').replace(/ /g,'-') +
' ' + 'lower-' + (V.lowercolour||'').replace(/ /g,'-') +
' ' + 'under-' + (V.undercolour||'').replace(/ /g,'-')
}
window.colourContainerClasses = colourContainerClasses; // export function