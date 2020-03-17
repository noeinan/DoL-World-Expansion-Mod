Config.history.controls = false;

Config.history.maxStates = 1;

State.initPRNG();

window.versionUpdateCheck = true;

Config.saves.onLoad = function (save) {
	window.versionUpdateCheck = true;
}

Config.saves.onSave = function (save) {
	new Wikifier(null, '<<updateFeats>>');
}

/*LinkNumberify and images will enable or disable the feature completely*/
/*debug will enable or disable the feature only for new games*/
window.StartConfig = {
	"debug": false,
	"enableImages": true,
	"enableLinkNumberify": true,
	"version": "0.2.10.3",
}

config.saves.autosave = "autosave";

Config.saves.isAllowed = function () {
	if (tags().contains("nosave")) {
		return false;
	}
	return true;
};

importStyles("style.css")
.then(function () {
	console.log("External Style Sheet Active")
})
.catch(function (err) {
	console.log("External Style Sheet Missing");
});

console.log("Game Version:", StartConfig.version);

l10nStrings.errorTitle = StartConfig.version + " Error";