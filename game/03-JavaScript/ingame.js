window.hairdressers = function(type, value){
	switch(type){
		case 1:
			SugarCube.State.variables.money -= 3000;
			SugarCube.State.variables.hairlength = (100 * value);
			SugarCube.State.variables.phase = 1;
			new Wikifier(null, '<<pass 20>>');
			break;
		case 2:
			SugarCube.State.variables.money -= 3000;
			SugarCube.State.variables.fringelength = (200 * value);
			SugarCube.State.variables.phase = 1;
			new Wikifier(null, '<<pass 20>>');
			break;
		case 3:
			SugarCube.State.variables.money -= 6000;
			SugarCube.State.variables.haircolour = SugarCube.State.variables.hairdressersHairColour[value];
			SugarCube.State.variables.phase = 3;
			new Wikifier(null, '<<pass 30>>');
			break;
	}
	SugarCube.State.display(SugarCube.State.variables.passage);
}

window.mapMove = function(moveTo){
	var currentPassage = SugarCube.State.variables.passage;
	var destination_table = [];
	for(var i=1; i < SugarCube.State.variables.link_table.length; i++) {
		var temp = SugarCube.State.variables.link_table[i].split("|")[1];
		if(temp) {
			destination_table[destination_table.length] = temp.split("]]")[0];
		}
	}
	var avaliable = SugarCube.State.variables.map.avaliable;

	if(SugarCube.State.variables.debug == 1 || avaliable[currentPassage].includes(moveTo) && destination_table.includes(moveTo))
	//if(SugarCube.State.variables.debug == 1 || avaliable[currentPassage].includes(moveTo))
	{
		new Wikifier(null, '<<pass 5>>');
		SugarCube.State.display(moveTo);
	}
}

window.wikifier = function(widget, arg1, arg2, arg3){
	if(arg3 !== undefined){
		new Wikifier(null, '<<'+widget+' '+ arg1 +' '+ arg2 +' '+ arg3 +'>>');
	}
	else if(arg2 !== undefined){
		new Wikifier(null, '<<'+widget+' '+ arg1 +' '+ arg2 +'>>');
	}
	else if(arg1 !== undefined){
		new Wikifier(null, '<<'+widget+' '+ arg1 +'>>');
	}
	else if(arg1 === undefined){
		new Wikifier(null, '<<'+widget+'>>');
	}
}