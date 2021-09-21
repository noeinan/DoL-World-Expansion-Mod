function colourContainerClasses() {
	return 'hair-' + (V.haircolour || '').replace(/ /g, '-') +
		' ' + 'eye-' + (V.makeup.eyelenses != 0 ? V.makeup.eyelenses : (V.eyecolour || '')).replace(/ /g, '-') +
		' ' + 'upper-' + (V.upperwet > 100 ? 'wet' : '') + (V.worn.upper.colour_combat || V.worn.upper.colour || '').replace(/ /g, '-') +
		' ' + 'lower-' + (V.lowerwet > 100 ? 'wet' : '') + (V.worn.lower.colour_combat || V.worn.lower.colour || '').replace(/ /g, '-') +
		' ' + 'under_lower-' + (V.underlowerwet > 100 ? 'wet' : '') + (V.worn.under_lower.colour || '').replace(/ /g, '-') +
		' ' + 'under_upper-' + (V.underupperwet > 100 ? 'wet' : '') + (V.worn.under_upper.colour || '').replace(/ /g, '-') +
		' ' + 'head-' + (V.worn.head.colour_combat || V.worn.head.colour || '').replace(/ /g, '-') +
		' ' + 'face-' + (V.worn.face.colour_combat || V.worn.face.colour || '').replace(/ /g, '-') +
		' ' + 'neck-' + (V.worn.neck.colour_combat || V.worn.neck.colour || '').replace(/ /g, '-') +
		' ' + 'hands-' + (V.worn.hands.colour_combat || V.worn.hands.colour || '').replace(/ /g, '-') +
		' ' + 'legs-' + (V.worn.legs.colour_combat || V.worn.legs.colour || '').replace(/ /g, '-') +
		' ' + 'feet-' + (V.worn.feet.colour_combat || V.worn.feet.colour || '').replace(/ /g, '-') +
		' ' + 'upper_acc-' + (V.worn.upper.accessory_colour_combat || V.worn.upper.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'lower_acc-' + (V.worn.lower.accessory_colour_combat || V.worn.lower.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'under_lower_acc-' + (V.worn.under_lower.accessory_colour_combat || V.worn.under_lower.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'under_upper_acc-' + (V.worn.under_upper.accessory_colour_combat || V.worn.under_upper.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'head_acc-' + (V.worn.head.accessory_colour_combat || V.worn.head.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'face_acc-' + (V.worn.face.accessory_colour_combat || V.worn.face.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'neck_acc-' + (V.worn.neck.accessory_colour_combat || V.worn.neck.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'hands_acc-' + (V.worn.hands.accessory_colour_combat || V.worn.hands.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'legs_acc-' + (V.worn.legs.accessory_colour_combat || V.worn.legs.accessory_colour || '').replace(/ /g, '-') +
		' ' + 'feet_acc-' + (V.worn.feet.accessory_colour_combat || V.worn.feet.accessory_colour || '').replace(/ /g, '-')
}
window.colourContainerClasses = colourContainerClasses; // export function

function limitedColourContainerClasses() {
	return 'hair-' + (V.haircolour || '').replace(/ /g, '-') +
		' ' + 'eye-' + (V.makeup.eyelenses != 0 ? V.makeup.eyelenses : (V.eyecolour || '')).replace(/ /g, '-')
}
window.limitedColourContainerClasses = limitedColourContainerClasses; // export function

function debugColourContainerClasses(color) {
	return 'hair-' + (color.hair || '').replace(/ /g, '-') +
		' ' + 'eye-' + (color.eyes || '').replace(/ /g, '-') +
		' ' + 'upper-' + (color.upper[0] || '').replace(/ /g, '-') +
		' ' + 'lower-' + (color.lower[0] || '').replace(/ /g, '-') +
		' ' + 'under_lower-' + (color.under_lower[0] || '').replace(/ /g, '-') +
		' ' + 'under_upper-' + (color.under_upper[0] || '').replace(/ /g, '-') +
		' ' + 'head-' + (color.head[0] || '').replace(/ /g, '-') +
		' ' + 'face-' + (color.face[0] || '').replace(/ /g, '-') +
		' ' + 'neck-' + (color.neck[0] || '').replace(/ /g, '-') +
		' ' + 'hands-' + (color.hands[0] || '').replace(/ /g, '-') +
		' ' + 'legs-' + (color.legs[0] || '').replace(/ /g, '-') +
		' ' + 'feet-' + (color.feet[0] || '').replace(/ /g, '-') +
		' ' + 'upper_acc-' + (color.upper[1] || '').replace(/ /g, '-') +
		' ' + 'lower_acc-' + (color.lower[1] || '').replace(/ /g, '-') +
		' ' + 'under_lower_acc-' + (color.under_lower[1] || '').replace(/ /g, '-') +
		' ' + 'under_upper_acc-' + (color.under_upper[1] || '').replace(/ /g, '-') +
		' ' + 'head_acc-' + (color.head[1] || '').replace(/ /g, '-') +
		' ' + 'face_acc-' + (color.face[1] || '').replace(/ /g, '-') +
		' ' + 'neck_acc-' + (color.neck[1] || '').replace(/ /g, '-') +
		' ' + 'hands_acc-' + (color.hands[1] || '').replace(/ /g, '-') +
		' ' + 'legs_acc-' + (color.legs[1] || '').replace(/ /g, '-') +
		' ' + 'feet_acc-' + (color.feet[1] || '').replace(/ /g, '-')
}
window.debugColourContainerClasses = debugColourContainerClasses; // export function

window.getClothingCost = function (item) {
	let cost = item.cost * V.clothesPrice;

	if (setup.clothes.under_lower.findIndex(x => x.name == item.name) >= 0 || setup.clothes.under_upper.findIndex(x => x.name == item.name) >= 0)
		cost *= V.clothesPriceUnderwear;
	else if (item.type.includes('school'))
		cost *= V.clothesPriceSchool;

	// the lewder item is, the more affected by the multiplier it is
	let lewdness = Math.clamp((item.reveal - 400) / 500, 0, 1);
	let lewdCoef = 1 + (V.clothesPriceLewd - 1) * lewdness;
	cost *= lewdCoef;

	if (V.passage === "School Library Shop"){
		cost *= 1.4 + (((V.delinquency - 500) / 5000) + ((V.NPCName[V.NPCNameList.indexOf("Sydney")].love - 50) / -500))
	}

	return Math.round(cost);
}

// makes all existing specified upper/lower clothes to be over_upper/over_lower
// it assumes that over_xxx equipment slots are empty, otherwise it will overwrite anything in those slots
// use this function in version update widget when over clothes will be ready
window.convertNormalToOver = function () {
	let clothesToConvert = ['bathrobe', 'bathrobe bottom', 'peacoat', 'shadbelly coat', 'puffer jacket', 'brown leather jacket', 'black leather jacket', 'vampire jacket'];

	// function that converts a clothing item
	let convertItem = (item) => {
		console.log('converting ' + item.name);

		if (item.outfitPrimary) {
			Object.keys(item.outfitPrimary).forEach(slot => {
				if (slot == 'upper' || slot == 'lower') {
					item.outfitPrimary['over_' + slot] = item.outfitPrimary[slot];
					delete item.outfitPrimary[slot];
				}
			});
		}
		else if (item.outfitSecondary) {
			for (let i = 0; i < item.outfitSecondary.length; i += 2) {
				if (item.outfitSecondary[i] == 'upper' || item.outfitSecondary[i] == 'lower') {
					item.outfitSecondary[i] = 'over_' + item.outfitSecondary[i];
				}
			}
		}
		if (item.set == 'upper' || item.set == 'lower')
			item.set = 'over_' + item.set;

		return item;
	};

	for (let index in clothesToConvert) {
		let itemName = clothesToConvert[index];

		// convert clothing sets
		V.outfit.forEach(outf => {
			if (outf.upper == itemName) {
				outf.upper = "naked";
				outf.over_upper = itemName;
				if (outf.colors) {
					outf.colors.over_upper = outf.colors.upper;
					outf.colors.upper = [0, 0];
				}
			}
			if (outf.lower == itemName) {
				outf.lower = "naked";
				outf.over_lower = itemName;
				if (outf.colors) {
					outf.colors.over_lower = outf.colors.lower;
					outf.colors.lower = [0, 0];
				}
			}
		});

		// convert clothes in wardrobe
		for (let i = V.wardrobe.upper.length - 1; i >= 0; i--) {
			if (V.wardrobe.upper[i].name == itemName) {
				V.wardrobe.over_upper.push(convertItem(V.wardrobe.upper[i]));
				V.wardrobe.upper.splice(i, 1);
			}
		}
		for (let i = V.wardrobe.lower.length - 1; i >= 0; i--) {
			if (V.wardrobe.lower[i].name == itemName) {
				V.wardrobe.over_lower.push(convertItem(V.wardrobe.lower[i]));
				V.wardrobe.lower.splice(i, 1);
			}
		}

		// convert worn clothes
		if (V.worn.upper.name == itemName) {
			V.worn.over_upper = convertItem(V.worn.upper);
			V.worn.upper = clone(setup.clothes.upper[0]);
		}
		if (V.worn.lower.name == itemName) {
			V.worn.over_lower = convertItem(V.worn.lower);
			V.worn.lower = clone(setup.clothes.lower[0]);
		}

		// convert carried clothes
		if (V.carried.upper.name == itemName) {
			V.carried.over_upper = convertItem(V.carried.upper);
			V.carried.upper = clone(setup.clothes.upper[0]);
		}
		if (V.carried.lower.name == itemName) {
			V.carried.over_lower = convertItem(V.carried.lower);
			V.carried.lower = clone(setup.clothes.lower[0]);
		}

		// convert stripped stored clothes
		for (let i = V.store.upper.length - 1; i>= 0; i--) {
			if (V.store.upper[i].name == itemName) {
				V.store.over_upper.push(convertItem(V.store.upper[i]));
				V.store.upper.splice(i, 1);
			}
		}
		for (let i = V.store.lower.length - 1; i>= 0; i--) {
			if (V.store.lower[i].name == itemName) {
				V.store.over_lower.push(convertItem(V.store.lower[i]));
				V.store.lower.splice(i, 1);
			}
		}

		// convert try on stored
		if (V.tryOn.ownedStored.upper.name == itemName) {
			V.tryOn.ownedStored.over_upper = convertItem(V.tryOn.ownedStored.upper);
			V.tryOn.ownedStored.upper = clone(setup.clothes.upper[0]);
		}
		if (V.tryOn.ownedStored.lower.name == itemName) {
			V.tryOn.ownedStored.over_lower = convertItem(V.tryOn.ownedStored.lower);
			V.tryOn.ownedStored.lower = clone(setup.clothes.lower[0]);
		}

		// convert try on equipped
		if (V.tryOn.tryingOn.upper && V.tryOn.tryingOn.upper.name == itemName) {
			V.tryOn.tryingOn.over_upper = convertItem(V.tryOn.tryingOn.upper);
			V.tryOn.tryingOn.upper = null;
		}
		if (V.tryOn.tryingOn.lower && V.tryOn.tryingOn.lower.name == itemName) {
			V.tryOn.tryingOn.over_lower = convertItem(V.tryOn.tryingOn.lower);
			V.tryOn.tryingOn.lower = null;
		}
	}
}
