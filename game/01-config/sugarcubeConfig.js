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
	"version": "0.2.10.5",
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

(function addFavicon() {
	const link = document.createElement("link");

	link.type = "image/png";
	link.rel = "icon";
	link.sizes = "16x16"
	link.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAGJUExURUdwTM5+RYZPI4BVKoRNH4lQIwAAAHU7H6xoMo1SInlRG4ZMIYNGIa5oNJdaLKtnNK5qNo5VHMJ3QKdkMZ1cMJ5dLqBfLaJgMqRfMJhYKYdQKNGvo6FhM6tkNJRVJ4tGF8B4QZ1cLaliM5FUJ5ZWKPbXxuPBs5NWJ4xSJKhiNJlZKPrp39Krmb2qpKBdLdGom927oo9SI7qHZJpaKbiWiruhmYlRIpVbNtqHTP/u4rVpOqhiMr9xP61jM7FnN7hrO7ttPptbK89+RumaVteFSL90PadbHN2PSKVYHLN1S6ZgMuO7n+3j3P/s34NOI/3p3ZRXKadjNOCPUOOTUsh6Qs59QPCiWsh3O7ZmKrh1Oo9NGMJ2Qp9YJrhqOrBkLtvSz694UpBSIOCUU7CFaNikhKdoOq9ySfHby6OZlHR4f6FvRp9TFpVTIP7o15t7ZqmHbY2YqODEruXEr7K3wC5ejfrNsODi5s+omPTazSJSgb29whxOfvLTxfzk1b+Ma8PEyfPj2+Hm63iNotY+v8UAAAA4dFJOUwD8PQYhfQEEtkkJKhexXbrGEu+WdaXC/rPoRln8+HUL++r0vIX1kPSx4p7s9q7OOP6Y1P1r/av8OyD8ogAAAOZJREFUGBk1wIWWglAUBdCjggzqdHd3N/chpWKP6HR3d3d/ubhcbtjczuIiW4kXeVypQ8oJVFR6YHOXBeelPLPaBUB0SAtLy6FwMBLZaGsAULMYWlldM/374XVlq90Drj4eiJrb5zLbPdrUO1ohMtkfvUjdxGMnB6ra6YLIZO0y9f94fUene0oXIDJZ0xN/Hw9EZ4bWAvj6FZah57d3otvjZh+AEd3I0O+PRbQTqxMA9Kks/fJlvVpzidoq2Jy9k0b6+/N+7LCJL0cO5x2fmX2a4Ad4AQVT01dDw6MoEHoGk0TJ7kbYsoQUMAKQPM6bAAAAAElFTkSuQmCC";

	document.head.appendChild(link);
})();
