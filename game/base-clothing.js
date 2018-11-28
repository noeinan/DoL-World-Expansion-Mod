function underintegrity(){
	var output='';
	var V = State.variables;
	if (V.underintegritymax !== 0) {
		if (V.underintegrity <= (V.underintegritymax / 10) * 2) {
			output += "tattered \t";
		} else if (V.underintegrity <= (V.underintegritymax / 10) * 5) {
			output += "torn \t";
		} else if (V.underintegrity <= (V.underintegritymax / 10) * 9) {
			output += "frayed \t";
		} else {
		}
	}
	return output;
}
DefineMacroS("underintegrity", underintegrity);

function lowerintegrity(){
	var output='';
	var V = State.variables;
	if (V.lowerintegritymax !== 0) {
		if (V.lowerintegrity <= (V.lowerintegritymax / 10) * 2) {
			output += "tattered \t";
		} else if (V.lowerintegrity <= (V.lowerintegritymax / 10) * 5) {
			output += "torn \t";
		} else if (V.lowerintegrity <= (V.lowerintegritymax / 10) * 9) {
			output += "frayed \t";
		} else {
		}
	}
	return output;
}
DefineMacroS("lowerintegrity", lowerintegrity);

function upperintegrity(){
	var output='';
	var V = State.variables;
	if (V.upperintegritymax !== 0) {
		if (V.upperintegrity <= (V.upperintegritymax / 10) * 2) {
			output += "tattered \t";
		} else if (V.upperintegrity <= (V.upperintegritymax / 10) * 5) {
			output += "torn \t";
		} else if (V.upperintegrity <= (V.upperintegritymax / 10) * 9) {
			output += "frayed \t";
		} else {
		}
	}
	return output;
}
DefineMacroS("upperintegrity", upperintegrity);

