function setfemininitymultiplierfromgender(gender) {
	if (gender === "f") {
		T.femininity_multiplier = 1;
	} else if (gender === "m") {
		T.femininity_multiplier = -1;
	} else {
		T.femininity_multiplier = 0;
	}
}
DefineMacro("setfemininitymultiplierfromgender", setfemininitymultiplierfromgender);

function addfemininityfromfactor(femininity_boost, factor_description, no_overwear_check) {
	if (no_overwear_check) {
		T.gender_appearance_factors_noow.push({
			femininity: femininity_boost,
			factor: factor_description
		});
		T.apparent_femininity_noow += femininity_boost;
	} else {
		T.apparent_femininity += femininity_boost;
		T.gender_appearance_factors.push({
			femininity: femininity_boost,
			factor: factor_description
		});
	}
}
DefineMacro("addfemininityfromfactor", addfemininityfromfactor);

function addfemininityofclothingarticle(clothing_article, no_overwear_check) {
	if (clothing_article.femininity) {
		addfemininityfromfactor(clothing_article.femininity, clothing_article.name_cap, no_overwear_check);
	}
}
DefineMacro("addfemininityofclothingarticle", addfemininityofclothingarticle);

/** Calculate the player's gender appearance */
function genderappearancecheck() {
	/* Calculate bulge size */
	T.penis_compressed = V.penisexist && V.worn.genitals.type.includes("hidden");
	if (V.worn.genitals.type.includes("cage")) {
		T.bulge_size = Math.clamp(V.penissize, 0, Infinity);
	} else {
		if (!V.penisexist) {
			T.erection_state = 0;
		} else if (T.penis_compressed) {
			T.erection_state = 0;
		} else if (V.arousal < 6000) {
			T.erection_state = 0;
		} else if (V.arousal < 8000) {
			T.erection_state = 1;
		} else {
			T.erection_state = 2;
		}
		T.bulge_size = Math.clamp(V.penissize * T.erection_state, 0, Infinity);
	}
	/* Determine how visible the player's bottom is */
	if ((V.worn.lower.skirt === 1 && V.worn.lower.skirt_down === 1 && V.worn.lower.state === "waist") ||
		(V.worn.over_lower.skirt === 1 && V.worn.over_lower.skirt_down === 1 && V.worn.over_lower.state === "waist")) {
		T.bottom_visibility = 0;
	} else {
		T.bottom_visibility = 1;
	}
	/* Gender appearance factors */
	T.gender_appearance_factors = [];
	T.apparent_femininity = 0;
	T.breast_indicator = 0;
	/* Head clothing */
	addfemininityofclothingarticle(V.worn.over_head);
	addfemininityofclothingarticle(V.worn.head);
	/* Always visible clothing */
	addfemininityofclothingarticle(V.worn.face);
	addfemininityofclothingarticle(V.worn.neck);
	addfemininityofclothingarticle(V.worn.legs);
	addfemininityofclothingarticle(V.worn.feet);
	/* Hair length */
	if (V.worn.over_head.hood !== 1 && V.worn.head.hood !== 1 && V.hoodDown !== 1) {
		addfemininityfromfactor(Math.trunc((V.hairlength - 200) / 2), "Hair length");
	}
	/* Makeup */
	addfemininityfromfactor(V.makeup.lipstick == 0 ? 0 : 50, "Lipstick");
	addfemininityfromfactor(V.makeup.eyeshadow == 0 ? 0 : 50, "Eye shadow");
	addfemininityfromfactor(V.makeup.mascara == 0 ? 0 : 50, "Mascara");
	/* Body structure */
	addfemininityfromfactor(Math.trunc(V.bottomsize * T.bottom_visibility * 50), "Bottom size (" + Math.trunc(T.bottom_visibility * 100) + "% visible)");
	setfemininitymultiplierfromgender(V.player.gender_body);
	addfemininityfromfactor(T.femininity_multiplier * 200, "Natural features");
	addfemininityfromfactor(Math.trunc((-1 * (V.physique + V.physiquesize / 2) / V.physiquesize) * 100), "Toned muscles");
	/* Behaviour */
	setfemininitymultiplierfromgender(V.player.gender_posture);
	T.acting_multiplier = V.englishtrait + 1;
	addfemininityfromfactor(T.femininity_multiplier * 100 * T.acting_multiplier, "Posture (x" + T.acting_multiplier + " effectiveness due to English skill)");
	/* Special handling for calculating topless gender */
	T.over_lower_protected = V.worn.over_lower.exposed < 2;
	T.lower_protected = V.worn.lower.exposed < 2;
	T.under_lower_protected = !V.worn.under_lower.exposed;
	T.apparent_femininity_noow = T.apparent_femininity;
	T.gender_appearance_factors_noow = clone(T.gender_appearance_factors);
	T.over_lower_femininity = (V.worn.over_lower.femininity ? V.worn.over_lower.femininity : 0);
	T.lower_femininity = (V.worn.lower.femininity ? V.worn.lower.femininity : 0);
	T.under_lower_femininity = (V.worn.under_lower.femininity ? V.worn.under_lower.femininity : 0);;
	/* find maximum possible femininity of the last lower piece you can strip down to, and add it to the counter */
	addfemininityfromfactor(Math.max(T.over_lower_femininity, T.lower_femininity, T.under_lower_femininity), "Lower clothes", "noow");
	/* bulge and genitals checks for topless gender */
	if (T.under_lower_protected) {
		addfemininityfromfactor(-T.bulge_size * 100, "Bulge visible through underwear", "noow");
	} else if (T.over_lower_protected || T.lower_protected) {
		addfemininityfromfactor(-Math.clamp((T.bulge_size - 3) * 100, 0, Infinity), "Bulge visible through clothing", "noow");
	} else if (V.worn.genitals.exposed) {
		addfemininityfromfactor(V.vaginaexist * 100000 - V.penisexist * 100000, "Genitals exposed", "noow");
	}
	/* plain breasts factor */
	addfemininityfromfactor((V.breastsize - 0.5) * 100, "Exposed breasts", "noow");
	/* Lower clothing, bulge, and genitals */
	addfemininityofclothingarticle(V.worn.over_lower);
	if (!T.over_lower_protected) {
		addfemininityofclothingarticle(V.worn.lower);
	}
	if (!T.over_lower_protected && !T.lower_protected) {
		/* Lower underwear is visible */
		addfemininityofclothingarticle(V.worn.under_lower);
		if (!T.under_lower_protected) {
			/* Genitals slot is visible */
			addfemininityofclothingarticle(V.worn.genitals);
			if (V.worn.genitals.exposed) {
				/* Bare genitals are visible */
				if (V.penisexist) {
					addfemininityfromfactor(-100000, "Penis visible");
				}
				if (V.vaginaexist) {
					addfemininityfromfactor(100000, "Vagina visible");
				}
			}
		} else {
			/* Bottom visible through underwear */
			T.bottom_visibility *= 0.75;
			/* Bulge visible through underwear */
			addfemininityfromfactor(-T.bulge_size * 100, "Bulge visible through underwear");
		}
	} else {
		/* Bottom covered by lower clothes */
		T.bottom_visibility *= 0.75;
		/* Bulge covered by lower clothes */
		addfemininityfromfactor(-Math.clamp((T.bulge_size - 3) * 100, 0, Infinity), "Bulge visible through clothing");
	}
	/* Upper clothing and breasts */
	addfemininityofclothingarticle(V.worn.over_upper);
	if (V.worn.over_upper.exposed >= 2) {
		addfemininityofclothingarticle(V.worn.upper);
	}
	if (V.worn.over_upper.exposed >= 2 && V.worn.upper.exposed >= 2) {
		/* Upper underwear is visible */
		addfemininityofclothingarticle(V.worn.under_upper);
		if (V.worn.under_upper.exposed >= 1) {
			/* Exposed breasts */
			T.breast_indicator = 1;
			addfemininityfromfactor((V.breastsize - 0.5) * 100, "Exposed breasts");
		} else if (!V.worn.under_upper.type.includes("chest_bind")) {
			/* Breasts covered by only underwear */
			addfemininityfromfactor(Math.clamp(
				(V.breastsize - 2) * 100, 0, Infinity
			), "Breast size visible through underwear");
		}
	} else if (!V.worn.under_upper.type.includes("chest_bind")) {
		/* Breast fully covered */
		addfemininityfromfactor(Math.clamp(
			(V.breastsize - 4) * 100, 0, Infinity
		), "Breast size visible through clothing");
	}
	/* Body writing */
	Wikifier.wikifyEval("<<bodywriting_exposure_check>>"); // TODO convert to JS when possible
	T.skinValue = 0;
	T.skinValue_noow = 0;
	Object.keys(V.skin).forEach(label=>{
		let value = V.skin[label];
		if (T.skin_array.includes(label)) {
			if (value.gender === "m") {
				T.skinValue -= 50 * (value.pen !== "pen"?2:1);
			} else if (value.gender === "f") {
				T.skinValue += 50 * (value.pen !== "pen"?2:1);
			}
		} else {
			if (value.gender === "m") {
				T.skinValue_noow -= 50 * (value.pen !== "pen"?2:1);
			} else if (V.skin.breasts.gender === "f") {
				T.skinValue_noow += 50 * (value.pen !== "pen"?2:1);
			}
		}
	});
	addfemininityfromfactor(T.skinValue, "Visible skin markings");
	addfemininityfromfactor(T.skinValue + T.skinValue_noow, "Visible skin markings", "noow");
	if (T.apparent_femininity > 0) {
		T.gender_appearance = "f";
	} else if (T.apparent_femininity < 0) {
		T.gender_appearance = "m";
	} else {
		T.gender_appearance = V.player.gender;
	}
	if (T.apparent_femininity_noow > 0) {
		T.gender_appearance_noow = "f";
	} else if (T.apparent_femininity_noow < 0) {
		T.gender_appearance_noow = "m";
	} else {
		T.gender_appearance_noow = V.player.gender;
	}
}
DefineMacro("genderappearancecheck", genderappearancecheck);

function updatehistorycontrols(){
	if (V.maxStates === undefined || V.maxStates > 20) {
		/* initiate new variable based on engine config and limit it to 20 */
		V.maxStates = Math.clamp(1, 20, Config.history.maxStates);
	}
	if (V.maxStates == 1) {
		/* when disabled, irreversibly delete history controls the way sugarcube intended */
		Config.history.maxStates = 1;
		jQuery('#ui-bar-history').remove();
	} else {
		/* set actual maxStates in accordance with our new variable */
		Config.history.maxStates = V.maxStates;
		/* ensure that controls are enabled so sugarcube won't destroy them on reload */
		Config.history.controls = true;
		/* if irreversibly deleted, restore #ui-bar-history from oblivion and pop it after #ui-bar-toggle */
		if (jQuery("#ui-bar-history").length == 0){
			jQuery("#ui-bar-toggle").after(`
				<div id="ui-bar-history">
					<button id="history-backward" tabindex="0" title="'+t+'" aria-label="'+t+'">\uE821</button>
					<button id="history-jumpto" tabindex="0" title="'+r+'" aria-label="'+r+'">\uE839</button>
					<button id="history-forward" tabindex="0" title="'+n+'" aria-label="'+n+'">\uE822</button>
				</div>`);
			/* make buttons active/inactive based on the available history states */
			jQuery(document).on(':historyupdate.ui-bar', (($backward, $forward) => () => {
					$backward.ariaDisabled(State.length < 2);
					$forward.ariaDisabled(State.length === State.size);
				})(jQuery('#history-backward'), jQuery('#history-forward')));
			/* update uibar to accept it's new masters */
			UIBar.start();
		}
		jQuery("#ui-bar-history").show();
	}
}
DefineMacro("updatehistorycontrols", updatehistorycontrols);
