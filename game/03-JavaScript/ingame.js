window.mapMove = function (moveTo) {
	var currentPassage = V.passage;
	var destination_table = [];
	for (var i = 1; i < V.link_table.length; i++) {
		var temp = V.link_table[i].split("|")[1];
		if (temp) {
			destination_table[destination_table.length] = temp.split("]]")[0];
		}
	}
	var available = V.map.available;

	if (V.debug == 1 || available[currentPassage].includes(moveTo) && destination_table.includes(moveTo))
	//if(V.debug == 1 || available[currentPassage].includes(moveTo))
	{
		new Wikifier(null, '<<pass 5>>');
		SugarCube.State.display(moveTo);
	}
}

window.shopClothingFilterToggleTrait = function(trait) {
	let traits = V.shopClothingFilter.traits;
	if (traits) {
		let index = traits.indexOf(trait)
		if (index == -1) {
			traits.push(trait)
		} else {
			traits.splice(index, 1)
		}
	}
}

window.shopClothingFilterSortOnDescription = function(traitOne, traitTwo) {
	let descriptionOne = Wikifier.wikifyEval(`<<shopTraitDescription ${traitOne}>>`).textContent.trim();
	let descriptionTwo = Wikifier.wikifyEval(`<<shopTraitDescription ${traitTwo}>>`).textContent.trim();

	return descriptionOne > descriptionTwo
}

window.wikifier = function (widget, arg1, arg2, arg3) {
	if (arg3 !== undefined) {
		new Wikifier(null, '<<' + widget + ' ' + arg1 + ' ' + arg2 + ' ' + arg3 + '>>');
	}
	else if (arg2 !== undefined) {
		new Wikifier(null, '<<' + widget + ' ' + arg1 + ' ' + arg2 + '>>');
	}
	else if (arg1 !== undefined) {
		new Wikifier(null, '<<' + widget + ' ' + arg1 + '>>');
	}
	else if (arg1 === undefined) {
		new Wikifier(null, '<<' + widget + '>>');
	}
}

window.wikifier2 = function (str) {
	new Wikifier(null, str);
}

window.combatListColor = function (name, value, type) {
	var color = "";
	var check = "";
	if (value != undefined) {
		check = value;
	} else {
		check = V[name];
	}
	if (type === "") {
		switch (check) {
			/*leftaction or rightaction*/
			case "steal": case "penwhack": case "freeface": case "leftcovervagina": case "leftcoverpenis": case "leftcoveranus":
			case "rightcovervagina": case "rightcoverpenis": case "rightcoveranus":
			case "leftunderpull": case "leftskirtpull": case "leftlowerpull": case "leftupperpull":
			case "rightunderpull": case "rightskirtpull": case "rightlowerpull": case "rightupperpull": case "rightUndressOther": case "leftUndressOther":
			case "stopchoke":
			case "clench":
			case "shacklewhack":
			/*feetaction*/
			case "run": case "hide": case "confront":
			/*mouthaction*/
			case "pullaway": case "pullawayvagina": case "finish": case "novaginal": case "nopenile": case "noanal": case "scream":
			case "mock": case "breastclosed": case "breastpull": case "pullawaykiss": case "noupper":
			case "up":
			/*penisaction*/
			case "othermouthescape": case "escape": case "otheranusescape":
			/*vaginaaction*/
			case "tribescape":
				color = "brat";
				break;

			/*leftaction or rightaction*/
			case "spray": case "lefthit": case "righthit": case "leftstruggle": case "rightstruggle": case "stopchokenoncon": case "pursuit_grab":
			/*feetaction*/
			case "kick":
			/*mouthaction*/
			case "bite": case "demand": case "breastbite": case "handbite": case "headbutt":
				color = "def";
				break;
			/*leftaction or rightaction*/
			case "behind":
			case "fold":
			case "leftcovervaginameek": case "leftcoverpenismeek": case "leftcoveranusmeek":
			case "rightcovervaginameek": case "rightcoverpenismeek": case "rightcoveranusmeek":
			/*mouthaction*/
			case "grasp": case "plead": case "forgive":
			case "down":
			/*penisaction*/
			case "thighbay": case "bay": case "otheranusbay":
			/*vaginaaction*/
			case "penisthighs":
			/*anusaction*/
			case "bottombay": case "penischeeks": case "penispussy": case "penisanus":
				color = "meek";
				break;

			/*leftaction or rightaction*/
			case "leftplay": case "leftgrab": case "leftstroke": case "leftchest": case "rightplay": case "rightgrab": case "rightstroke": case "rightchest":
			case "leftchest": case "rightchest": case "leftwork": case "rightwork": case "leftclit": case "rightclit":
			case "keepchoke":
			/*feetaction*/
			case "grab": case "vaginagrab": case "grabrub": case "vaginagrabrub": case "rub":
			/*mouthaction*/
			case "peniskiss": case "kiss": case "suck": case "lick": case "moan": case "breastsuck": case "breastlick": case "swallow": case "movetochest":
			case "othervagina": case "mouth": case "kissback": case "vaginalick": case "askchoke": case "anallick": case "analkiss":
			/*penisaction*/
			case "penistovagina": case "penistoanus": case "penisvaginafuck": case "penisanusfuck": case "othermouthtease": case "othermouthrub":
			case "othermouthcooperate": case "tease": case "cooperate": case "otheranustease": case "otheranusrub": case "otheranuscooperate": case "clitrub":
			case "vaginaEdging": case "otheranusEdging":
			/*vaginaaction*/
			case "vaginatopenis": case "vaginapenisfuck": case "othervaginarub": case "vaginatovagina": case "vaginatovaginafuck": case "tribcooperate": case "penisEdging":
			/*anusaction*/
			case "anustopenis": case "anuspenisfuck": case "penistease": case "otherMouthAnusRub": case "otherAnusRub": case "penisEdging":
				color = "sub";
				break;

			default:
				color = "white";
				break;
		}
	}
	else if (type === "Tentacle") {
		switch (check.replace(/\d+/g, '')) {
			/*leftaction or rightaction*/
			case "lefthittentacle": case "righthittentacle":
			case "lefthit": case "righthit":
			/*feetaction*/
			case "feethit":
			/*mouthaction*/
			case "mouthbitetentacle":
				color = "def";
				break;

			/*leftaction or rightaction*/
			case "leftescape": case "rightescape": case "lefthold": case "righthold": case "leftvorefree": case "rightvorefree":
			/*mouthaction*/
			case "mouthpullawaytentacle":
			/*penisaction*/
			case "penispullawaytentacle":
			/*vaginaaction*/
			case "vaginapullawaytentacle":
			/*anusaction*/
			case "anuspullawaytentacle":
				color = "brat";
				break;

			/*leftaction or rightaction*/
			case "leftgrabtentacle": case "rightgrabtentacle": case "leftrubtentacle": case "rightrubtentacle":
			case "showbottomtentacle": case "showthighstentacle": case "showmouthtentacle": case "showpenistentacle": case "showvaginatentacle":
			case "leftgrab": case "rightgrab": case "leftrub": case "rightrub":
			case "showbottom": case "showthighs": case "showmouth":
			/*feetaction*/
			case "feetgrab": case "feetrubtentacle":
			/*mouthaction*/
			case "mouthlicktentacle": case "mouthkisstentacle": case "mouthcooperatetentacle":
			/*penisaction*/
			case "penisrubtentacle": case "peniscooperatetentacle":
			/*vaginaaction*/
			case "vaginarubtentacle": case "vaginacooperatetentacle":
			/*anusaction*/
			case "anusrubtentacle": case "anuscooperatetentacle":
			/*bottomuse*/
			case "bottomrubtentacle":
			/*breastuse*/
			case "chestrubtentacle":
				color = "sub";
				break;
			default:
				color = "white";
				break;
		}
	}
	return color;
}

DefineMacroS("combatListColor", combatListColor);

function combatButtonAdjustments(name, extra) {
	jQuery(document).on('change', '#listbox-' + name, { "name": name, "extra": extra }, function (e) {
		/*console.log(e.data);*/
		new Wikifier(null, '<<replace #' + e.data.name + 'Difficulty>><<' + e.data.name + 'Difficulty' + e.data.extra + '>><</replace>>');
		$('#' + e.data.name + 'Select').removeClass('whiteList bratList meekList defList subList');
		$('#' + e.data.name + 'Select').addClass(combatListColor(e.data.name, undefined, e.data.extra) + "List");
	});
	return "";
}

DefineMacroS("combatButtonAdjustments", combatButtonAdjustments);

function combatDefaults() {
	jQuery(document).on('change', '#listbox--defaultactions', function (e) {
		new Wikifier(null, '<<replace #othersFeelings>><<othersFeelings ' + this.value + '>><</replace>>');
	});
	return "";
}

DefineMacroS("combatDefaults", combatDefaults);

function hairdressersReset() {
	jQuery(document).on('change', '.macro-listbox', function (e) {
		new Wikifier(null, '<<replace #hairDressers>><<hairDressersOptions>><</replace>>');
		new Wikifier(null, '<<replace #currentCost>>To pay: £<<print _currentCost / 100>><</replace>>');
	});
	return "";
}

DefineMacroS("hairdressersReset", hairdressersReset);

function hairdressersResetAlt() {
	jQuery(document).on('click', '.macro-cycle', function (e) {
		new Wikifier(null, '<<replace #hairDressersSydney>><<hairDressersOptionsSydney>><</replace>>');
		new Wikifier(null, '<<replace #currentCost>>To pay: £<<print _currentCost / 100>><</replace>>');
	});
	return "";
}

DefineMacroS("hairdressersResetAlt", hairdressersResetAlt);

function browsDyeReset() {
	jQuery(document).on('change', '.macro-listbox', function (e) {
		new Wikifier(null, '<<replace #browsColourPreview>><<browsColourPreview>><</replace>>');
	});
	return "";
}

DefineMacroS("browsDyeReset", browsDyeReset);

function NPCSettingsReset() {
	jQuery(document).on('change', '#listbox--npcid', function (e) {
		new Wikifier(null, '<<replace #npcSettingsMenu>><<npcSettingsMenu>><</replace>>');
	});
	return "";
}

DefineMacroS("NPCSettingsReset", NPCSettingsReset);

function loveInterestFunction() {
	jQuery(document).on('change', '#listbox-loveinterestprimary', function (e) {
		new Wikifier(null, '<<replace #loveInterest>><<loveInterest>><</replace>>');
	});
	jQuery(document).on('change', '#listbox-loveinterestsecondary', function (e) {
		new Wikifier(null, '<<replace #loveInterest>><<loveInterest>><</replace>>');
	});
	return "";
}

DefineMacroS("loveInterestFunction", loveInterestFunction);

window.between = function(x, min, max){
	return x >= min && x <= max;
}

function featsPointsMenuReset() {
	jQuery(document).on('change', '#listbox--upgradenameid', function (e) {
		new Wikifier(null, '<<updateFeatsPointsMenu>>');
	});
	return "";
}

DefineMacroS("featsPointsMenuReset", featsPointsMenuReset);

function startingPlayerImageReset() {
	jQuery(document).on('change', '#settingsDiv .macro-radiobutton,#settingsDiv .macro-numberslider,#settingsDiv .macro-checkbox', function (e) {
		new Wikifier(null, '<<startingPlayerImageUpdate>>');
	});
	return "";
}

DefineMacroS("startingPlayerImageReset", startingPlayerImageReset);

window.deck = function(){
	var names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	var suits = ['Hearts','Diamonds','Spades','Clubs'];
	var cards = [];

	for( var s = 0; s < suits.length; s++ ) {
		for( var n = 0; n < names.length; n++ ) {
			cards.push( {value:n+2, name:names[n], suits:suits[s]} );
		}
	}

	return cards;
}

window.shuffle = function(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

function updateAskColour() {
	jQuery(document).on('change', '#listbox-askaction', function (e) {
		new Wikifier(null, '<<replaceAskColour>>');
	});
	return "";
}

DefineMacroS("updateAskColour", updateAskColour);


window.generateBabyName = function(name, gender, usedNames) {
	var result = "";
	if(name != undefined && name != null && name != ""){
		var result = name.replace(/[^a-zA-Z ]+/g,"");
		return result.substring(0,30);
	}else{
		var names = [];
		switch(gender){
			case "m":
				names = ['Addison','Algernon','Allan','Alpha','Anton','Axel','Bazza','Benton','Bernard','Brand','Brett','Cale','Calvin','Carol','Chuck','Chucky','Clay','Cornelius','Crofton','Darden','Dax','Den','Deven','Digby','Don','Douglas','Driscoll','Duane','Duke','Edmund','Elsdon','Freeman','Gabby','Garland','George','Godfrey','Graeme','Grier','Hammond','Harlan','Hendrix','Herman','Hewie','Hugh','Indiana','Ingram','Jackie','Jasper','Jaxon','Jaycob','Jere','Kamden','Kelcey','Kendall','Kevin','Kian','Kieran','Kirby','Lanny','Lawson','Laz','Leland','Levi','Lindon','Linton','Lionel','Lonny','Lucas','Manley','Maverick','Merlyn','Michael','Monty','Murphy','Nate','Ned','Nowell','Odell','Ollie','Osbert','Otto','Paget','Pip','Quintin','Raymund','Ricky','Robert','Ross','Rudolph','Sammy','Scotty','Stacey','Thad','Theodore','Tommy','Trey','Tyson','Val','Vernon','Willis','Wilmer','Winton','Wisdom'];
				break;
			case "f":
				names = ['Adelyn','Alene','Alexa','Aliah','Alyson','Angelica','Annalise','Annora','Azaria','Bessie','Betsy','Bettie','Biddy','Brianne','Camellia','Camille','Camryn','Caroline','Chastity','Chelsea','Chelsey','Cindy','Clematis','Darla','Deb','Debby','Dortha','Eleanora','Eliana','Elsabeth','Elyse','Emerson','Emmeline','Erica','Ettie','Eustacia','Evelyn','Gabrielle','Georgiana','Harper','Harrietta','Haylie','Haze','Hunter','Hyacinth','Indiana','Indie','Jacquetta','Janie','Jannine','Jonquil','Kaelyn','Kam','Khloe','Kolleen','Korrine','Kourtney','Krystine','Lavena','Leeann','Lela','Lesleigh','Lindsie','Lorena','Lucile','Luvinia','Lyn','Lyssa','Madeleine','Marian','Maudie','Maureen','Maxine','Melody','Milani','Misti','Nat','Noelle','Ottoline','Paige','Pauline','Payton','Pearl','Perlie','Petronel','Phebe','Posie','Praise','Rexana','Serena','Sharalyn','Sharla','Shauna','Sky','Sybella','Tracy','Tresha','Trudi','Wallis','Wilda','Wren','Yvette'];
				break;
		}
		names.pushUnique('Aaren','Addison','Alex','Alpha','Andie','Arden','Ariel','Artie','Ashton','Aston','Aubrey','Beau','Bernie','Bertie','Beverly','Bobbie','Brooklyn','Caelan','Cameron','Carol','Cary','Casey','Channing','Charley','Cherokee','Cheyenne','Coby','Codie','Collyn','Cyan','Dale','Dallas','Dana','Darby','Dee','Derby','Devan','Devin','Emmerson','Emory','Finley','Flannery','Florence','Gabby','Garnet','Garnett','Gray','Hadyn','Harlow','Hollis','Jackie','Jade','Jae','Jaiden','Johnnie','Joyce','Justice','Kam','Kelcey','Kelsey','Leslie','Lindsey','Lorin','Lyric','Maitland','Marley','McKinley','Merlyn','Murphy','Nicky','Oakley','Odell','Pacey','Paget','Peyton','Presley','Rain','Raleigh','Reagan','Regan','Reilly','Remington','Robbie','Rory','Royale','Sage','Sam','Schuyler','Selby','Shae','Shaye','Shelly','Skylar','Sloan','Stacey','Stacy','Tayler','Tommie','Tracey','Tristen','Tristin','Val');
		names.delete(usedNames);
		result = names[random(0,names.length - 1)];
		return result;
	}
}

DefineMacroS("generateBabyName", generateBabyName);

window.bulkProduceValue = function(plant, quantity = 250) {
	if(plant !== undefined){
		let baseCost = plant.plant_cost * quantity / 2;
		let seasonBoost = !plant.season.includes(V.season) ? 1.1 : 1;
		return Math.floor(baseCost * seasonBoost);
	}
}


window.pregnancyBellyVisible = function(){
	let size = State.variables.sexStats.vagina.pregnancy.bellySize;
	if(size <= 7) return false;
	if(size <= 11 && State.variables.worn.upper.name !== "naked" && State.variables.worn.upper.type.includes("bellyShow")) return false;
	if(size <= 17 && State.variables.worn.upper.type.includes("bellyHide")) return false;

	return true;
}
