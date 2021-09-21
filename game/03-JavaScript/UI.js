window.overlayShowHide = function (elementId) {
	var div = document.getElementById(elementId);
	if (div != undefined) {
		div.classList.toggle("hidden");
		if (elementId === "debugOverlay") {
			V.debugMenu[0] = !V.debugMenu[0];
		}
	}
}

window.overlayMenu = function (elementId, type) {
	switch (type) {
		case "debug":
			var debug = ["debugMain", "debugCharacter", "debugEvents"]
			for (var i = 0, l = debug.length; i < l; i++) {
				var div = document.getElementById(debug[i]);
				if (div != undefined) {
					V.debugMenu[1] = elementId;
					if (elementId === debug[i]) {
						div.classList.remove("hidden");
					} else {
						div.classList.add("hidden");
					}
				}
			}
			break;
	}
}

/*Sidebar swipe*/
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
	return evt.touches ||			 // browser API
		evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
	var firstTouch = getTouches(evt)[0];
	xDown = firstTouch.clientX;
	yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
	if (!xDown || !yDown) {
		return;
	}

	/**
	 * Activate the swipe only when finger near the UI Bar.
	 * 50px - +/- width of unstowed UI Bar
	 * 280px - +/- width of unstowed UI bar
	 */
	if (isUIBarStowed()) {
		if (xDown > 50) {
			return;
		}
	} else {
		if (xDown > 280) {
			return;
		}
	}

	var xUp = evt.touches[0].clientX;
	var yUp = evt.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
		if (xDiff > 0) {
			UIBar.stow();/* left swipe */
		} else {
			UIBar.unstow();/* right swipe */
		}
	} else {
		if (yDiff > 0) {
			/* up swipe */
		} else {
			/* down swipe */
		}
	}
	/* reset values */
	xDown = null;
	yDown = null;
};

function isUIBarStowed() {
	return $('#ui-bar').hasClass('stowed');
}

var disableNumberifyInVisibleElements = [
	'#passage-testing-room',
];

// Number-ify links
window.Links = window.Links || {};
Links.currentLinks = [];

function getPrettyKeyNumber(counter) {
	var str = "";

	if (counter > 30)
		str = "Ctrl + ";
	else if (counter > 20)
		str = "Alt + ";
	else if (counter > 10)
		str = "Shift + ";

	if (counter % 10 === 0)
		str += "0";
	else if (counter < 10)
		str += counter;
	else {
		var c = Math.floor(counter / 10);
		str += (counter - (10 * c)).toString();
	}

	return str;
}

$(document).on(':passagerender', function (ev) {
	Links.currentLinks = [];

	if (passage() == "GiveBirth") {
		$(ev.content).find("[type=checkbox]").on('propertychange change', function () {
			new Wikifier(null, '<<resetPregButtons>>');
			Links.generateLinkNumbers(ev.content);
		});
	}

	Links.generateLinkNumbers(ev.content);
});

Links.keyNumberMatcher = /^\([^\)]+\)/

Links.generateLinkNumbers = function generateLinkNumbers(content) {
	if (!V.numberify_enabled || !StartConfig.enableLinkNumberify)
		return;

	for (var i = 0; i < disableNumberifyInVisibleElements.length; i++) {
		if ($(content).find(disableNumberifyInVisibleElements[i]).length || $(content).is(disableNumberifyInVisibleElements[i]))
			return; // simply skip this render
	}

	// wanted to use .macro-link, but wardrobe and something else doesn't get selected, lmao
	Links.currentLinks = $(content)
		.find(".link-internal")
		.not(".no-numberify *, .no-numberify");

	$(Links.currentLinks).each(function (i, el) {
		if (Links.keyNumberMatcher.test(el.innerHTML)) {
			el.innerHTML = el.innerHTML.replace(Links.keyNumberMatcher, `(${getPrettyKeyNumber(i + 1)})`)
		} else {
			$(el).html("(" + getPrettyKeyNumber(i + 1) + ") " + $(el).html());
		}
	});
}
Links.generate = () => Links.generateLinkNumbers(document.getElementsByClassName("passage")[0] || document);

$(document).on('keyup', function (ev) {
	if (!V.numberify_enabled || !StartConfig.enableLinkNumberify || V.tempDisable)
		return;

	if (document.activeElement.tagName === "INPUT" && document.activeElement.type !== "radio"
		&& document.activeElement.type !== "checkbox")
		return;

	if ((ev.keyCode >= 48 && ev.keyCode <= 57) || (ev.keyCode >= 96 && ev.keyCode <= 105)) {
		var fixedKeyIndex = (ev.keyCode < 60 ? ev.keyCode - 48 : ev.keyCode - 96);

		var requestedLinkIndex = [
			9,
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8
		][fixedKeyIndex];

		if (ev.ctrlKey)
			requestedLinkIndex += 30;
		else if (ev.altKey)
			requestedLinkIndex += 20;
		else if (ev.shiftKey)
			requestedLinkIndex += 10;

		if ($(Links.currentLinks).length >= requestedLinkIndex + 1)
			$(Links.currentLinks[requestedLinkIndex]).click();
	}
});

var defaultSkinColorRanges = {
	"hStart": 45, "hEnd": 45,
	"sStart": 0.2, "sEnd": 0.4,
	"bStart": 4.5, "bEnd": 0.7,
};

window.skinColor = function (enabled, percent, overwrite) {
	if (enabled === "f") {
		return "";
	}

	var ranges = ensureIsArray(overwrite || defaultSkinColorRanges);
	var totalProgress = percent / 100;

	var scaledProgress = ranges.length * totalProgress;
	var rangeIndex = totalProgress === 1
		? ranges.length - 1
		: Math.floor(scaledProgress);
	var progress = totalProgress === 1
		? 1
		: scaledProgress - rangeIndex;

	var { hStart, hEnd, sStart, sEnd, bStart, bEnd } = ranges[rangeIndex];

	var hue = (hEnd - hStart) * progress + hStart;
	var saturation = (sEnd - sStart) * progress + sStart;
	var brightness = (bEnd - bStart) * progress + bStart;

	var hueCss = `hue-rotate(${hue}deg)`;
	var saturationCss = `saturate(${saturation.toFixed(2)})`;
	var brightnessCss = `brightness(${brightness.toFixed(2)})`;

	return `${hueCss} ${saturationCss} ${brightnessCss}`;
}

window.closeFeats = function (id) {
	var div1 = document.getElementById("feat-" + id);
	var div2 = document.getElementById("closeFeat-" + id);
	div1.style.display = "none";
	div2.style.display = "none";
}

window.filterFeats = function () {
	new Wikifier(null, '<<replace #featsList>><<featsList>><</replace>>');
}

window.getTimeNumber = function (t) {
	var time = new Date(t);
	var result = time.getTime();
	if (isNaN(result)) {
		return 9999999999999999;
	}
	return result;
}

window.extendStats = function () {
	V.extendedStats = !V.extendedStats;
	var captionDiv = document.getElementById('storyCaptionDiv'),
		statsDiv = document.getElementById('stats');
	if (V.extendedStats === true) {
		captionDiv.classList.add("storyCaptionDivExtended");
		statsDiv.classList.add("statsExtended");
	} else {
		captionDiv.classList.remove("storyCaptionDivExtended");
		statsDiv.classList.remove("statsExtended");
	}
	new Wikifier(null, '<<replace #stats>><<statsCaption>><</replace>>');
}

window.customColour = function (color, saturation, brightness, contrast, sepia) {
	return 'filter: hue-rotate(' + color + 'deg) saturate(' + saturation + ') brightness(' + brightness + ') contrast(' + contrast + ') sepia(' + sepia + ')';
}

window.zoom = function (size, set) {
	if (size === undefined) {
		size = document.getElementById("numberslider-input-zoom").value;
	}
	var parsedSize = parseInt(size);
	var body = document.getElementsByTagName("body")[0];
	if (parsedSize >= 50 && parsedSize <= 200 && parsedSize !== 100) {
		body.style.zoom = size + "%";
		if (set === true) {
			V.zoom = size;
		}
	} else {
		body.style.zoom = "";
		if (set === true) {
			V.zoom = 100;
		}
	}
}

// Checks if image was loaded with errors, input is the id: '#idOfImg'
window.isImageOk = function (id) {
	return jQuery(id).naturalWidth !== 0 || true;
}

window.beastTogglesCheck = function () {
	T.beastVars = [
		"bestialitydisable",
		"swarmdisable",
		"parasitedisable",
		"analpregdisable",
		"tentacledisable",
		"slimedisable",
		"voredisable",
		"spiderdisable",
		"slugdisable",
		"waspdisable",
		"beedisable",
		"lurkerdisable",
		"horsedisable"
	];
	T.anyBeastOn = T.beastVars.some(x => V[x] == 'f');
}

window.settingsAsphyxiation = function () {
	let updateText = () => {
		let val = V.asphyxiaLvl;
		let text = null;
		switch (val) {
			case 0:
				text = "Don't touch my neck!"; break;
			case 1:
				text = "NPCs may <span class='blue' style='margin-left: unset; min-width: unset;'>grab</span> you by the neck. Doesn't impede breathing."; break;
			case 2:
				text = "NPCs may try to <span class='purple' style='margin-left: unset; min-width: unset;'>choke</span> you during consensual intercourse."; break;
			case 3:
				text = "NPCs may try to <span class='red' style='margin-left: unset; min-width: unset;'>strangle</span> you during non-consensual intercourse."; break;
			case 4:
				text = "NPCs will <span class='red' style='margin-left: unset; min-width: unset;'>often</span> try to <span class='red' style='margin-left: unset; min-width: unset;'>strangle</span> you during non-consensual intercourse."; break;

			default:
				text = "Error: bad value: " + val;
				val = 0;
		}
		jQuery('#numberslider-value-asphyxialvl').text('').append(text).addClass('small-description')
												 .css('text-align', 'left')
												 .css('margin-left', '-7em');
	};
	jQuery(document).ready(() => {
		updateText();
		jQuery('#numberslider-input-asphyxialvl').on('input change', function (e) { updateText(); })
												 .css('width', '83%')
												 .css('min-height', 'unset')
												 .css('height', '0.75em')
												 .css('margin-left', '1em');
	});
}

window.settingsNamedNpcBreastSize = function () {
	const breastSizes = ["nipple","budding","tiny","small","pert","modest","full","large","ample","massive","huge","gigantic","enormous"];

	let updateText = () => {
		const npcId = T.npcId;
		const npc = V.NPCName[npcId];
		const val = npc.breastsize;

		const text = breastSizes[val];

		if (val > 0) {
			npc.breastdesc = text + " breast";
			npc.breastsdesc = text + " breasts";
		} else {
			npc.breastdesc = text;
			npc.breastsdesc = text + "s";
		}

		jQuery('#numberslider-value-npcname-npcidbreastsize').text('').append(npc.breastsdesc);
	};

	jQuery(document).ready(() => {
		updateText();
		jQuery('#numberslider-input-npcname-npcidbreastsize').on('input change', function (e) { updateText(); });
	});
}
