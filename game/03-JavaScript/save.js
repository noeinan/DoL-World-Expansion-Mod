window.returnSaveDetails = function(){
	return Save.get();
}

window.loadSave = function(saveSlot){
	if(saveSlot === "auto"){
		Save.autosave.load();
	}else{
		Save.slots.load(saveSlot);
	}
}

window.save = function(saveSlot){
	if(saveSlot != undefined){
		Save.slots.save(saveSlot);
		SugarCube.State.variables.currentOverlay = null;
		overlayShowHide("customOverlay");
	}
}

window.deleteSave = function(saveSlot, confirm){
	if(saveSlot === "all"){
		if(confirm === undefined){
			new Wikifier(null, '<<clearSaveMenu>>');
			return;
		}else if(confirm === true){
			Save.clear();
		}
	}else if(saveSlot === "auto"){
		Save.autosave.delete();
	}else{
		Save.slots.delete(saveSlot);
	}
	new Wikifier(null, '<<resetSaveMenu>>');
}

window.importSave = function(saveFile){
	if(!window.FileReader) return; // Browser is not compatible

	var reader = new FileReader();

	reader.onloadend = function(){
		DeserializeGame(this.result);
	}

	reader.readAsText(saveFile[0]);
}

window.SerializeGame = function () { return Save.serialize(); }; window.DeserializeGame = function (myGameState) { return Save.deserialize(myGameState) };

window.getSaveData = function(){
	var input = document.getElementById("saveDataInput");
	input.value = Save.serialize();
}

window.loadSaveData = function(){
	var input = document.getElementById("saveDataInput");
	var result = Save.deserialize(input.value);
	if (result === null) {
		input.value = "Invalid Save."
	}
}

window.clearTextBox = function(id){
	document.getElementById(id).value = "";
}

window.topTextArea = function(id){
	var textArea = document.getElementById(id);
	textArea.scroll(0, 0);
}

window.bottomTextArea = function(id){
	var textArea = document.getElementById(id);
	textArea.scroll(0, textArea.scrollHeight);
}