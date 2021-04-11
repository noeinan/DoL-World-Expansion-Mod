window.getIntegrityInfo = function (integrity) {
	if (integrity >= 900)
		return [7, "green"];
	if (integrity >= 500)
		return [6, "teal"];
	if (integrity >= 200)
		return [5, "lblue"];
	if (integrity >= 100)
		return [4, "blue"];
	if (integrity >= 50)
		return [3, "purple"];
	if (integrity >= 20)
		return [2, "pink"];
    return [1, "red"];
}

window.getRevealInfo = function (reveal) {
	if (reveal >= 900)
		return [7, "red"];
	if (reveal >= 700)
		return [6, "pink"];
	if (reveal >= 500)
		return [5, "purple"];
	if (reveal >= 300)
		return [4, "blue"];
	if (reveal >= 200)
		return [3, "lblue"];
	if (reveal >= 100)
		return [2, "teal"];
    return [1, "green"];
}

window.getWarmthInfo = function (warmth) {
	if (warmth >= 75)
		return [5, "warm-4"];
	if (warmth >= 50)
		return [4, "warm-3"];
	if (warmth >= 25)
		return [3, "warm-2"];
	if (warmth >= 10)
		return [2, "warm-1"];
    return [1, "warm-0"];
}

// for outfits it adds the lower piece's warmth too
window.getTrueWarmth = function (item) {
    let warmth = item.warmth || 0;
    
    if (item.outfitPrimary) {
        // sum of warmth of every secondary piece
        // outfitPrimary looks like this {'lower': 'item_name', 'head': 'item_name'}
        warmth += Object.keys(item.outfitPrimary) // loop through secondary items list
        .filter(x => item.outfitPrimary[x] != "broken") // filter out broken pieces
        .map(x => setup.clothes[x].find(z => z.name == item.outfitPrimary[x])) // find items in setup.clothes
        .reduce((sum, x) => sum + (x.warmth || 0), 0); // calculate sum of their warmth field
    }
    
    if (item.outfitSecondary) {
        if (item.outfitSecondary.length % 2 != 0)
            console.log("WARNING: " + item.name + " has bad .outfitSecondary data!");
        
        // outfitSecondary looks like this ['upper', 'item_name', 'head', 'item_name']
        item.outfitSecondary.forEach((x, i) => {
            if (i % 2 == 0 && item.outfitSecondary[i + 1] != "broken") {
                warmth += setup.clothes[x].find(z => z.name == item.outfitSecondary[i + 1]).warmth || 0;
            }
        });
    }

    return warmth;
}

window.clothingSlotToIconName = function (slotName, outfits) {
    switch (slotName) {
        case "over_upper":
            return "overoutfit";
        case "upper":
            return outfits ? "outfit" : "upper";
        case "under_upper":
            return outfits ? "underoutfit" : "underupper";
        case "under_lower":
            return "underlower";
        default:
            return slotName;
    }
}

// Make .divs-links clickable as if they're anchors
window.linkifyDivs = function (parentSelector = "") {
    $(document).ready(() => { $(parentSelector + " .div-link").click(function (e) { $(this).find('a').first().click(); }) });
    $(document).ready(() => { $(parentSelector + " .div-link a").click(function (e) { e.stopPropagation(); }) });
}

// Hook custom colour sliders and preset dropdowns
window.attachCustomColourHooks = function (slot = "") {
    $(() => {
        $('.custom-colour-sliders.primary > .colour-slider:nth-child(1) > div > input').on('input change', (e) => { updateCustomColour('primary'); updateMannequin(slot); });
        $('.custom-colour-sliders.primary > .colour-slider:nth-child(2) > div > input').on('input change', (e) => { updateCustomColour('primary'); updateMannequin(slot); });
        $('.custom-colour-sliders.primary > .colour-slider:nth-child(3) > div > input').on('input change', (e) => { updateCustomColour('primary'); updateMannequin(slot); });
        $('.custom-colour-sliders.primary > .colour-slider:nth-child(4) > div > input').on('input change', (e) => { updateCustomColour('primary'); updateMannequin(slot); });

        $('.custom-colour-sliders.secondary > .colour-slider:nth-child(1) > div > input').on('input change', (e) => { updateCustomColour('secondary'); updateMannequin(slot); });
        $('.custom-colour-sliders.secondary > .colour-slider:nth-child(2) > div > input').on('input change', (e) => { updateCustomColour('secondary'); updateMannequin(slot); });
        $('.custom-colour-sliders.secondary > .colour-slider:nth-child(3) > div > input').on('input change', (e) => { updateCustomColour('secondary'); updateMannequin(slot); });
        $('.custom-colour-sliders.secondary > .colour-slider:nth-child(4) > div > input').on('input change', (e) => { updateCustomColour('secondary'); updateMannequin(slot); });

        $('.custom-colour.primary > .custom-colour-presets > .presets-dropdown > select').on('change', () => { loadCustomColourPreset('primary'); new Wikifier(null, '<<updateclotheslist>>'); });
        $('.custom-colour.secondary > .custom-colour-presets > .presets-dropdown > select').on('change', () => { loadCustomColourPreset('secondary'); new Wikifier(null, '<<updateclotheslist>>'); });
        
        $('.custom-colour-sliders.primary > .colour-slider > div > input').on('input', (e) => { State.variables.customColors.sepia.primary = 0; });
        $('.custom-colour-sliders.secondary > .colour-slider > div > input').on('input', (e) => { State.variables.customColors.sepia.secondary = 0; });
    });
}

window.updateCustomColour = function(type) {
    $('.colour-options-div.' + type + ' > .colour-button > .bg-custom').css('filter', getCustomColourStyle(type, true));
}

window.updateMannequin = function(slot = "") {
    new Wikifier(null, '<<updatemannequin "' + slot + '">>');
}

window.getCustomColourStyle = function (type, valueOnly = false) {
    if (type != 'primary' && type != 'secondary')
        return;
    return (valueOnly ? '' : 'filter: ') + 'hue-rotate(' + State.variables.customColors.color[type] + 'deg) saturate(' + State.variables.customColors.saturation[type] + ') brightness(' + State.variables.customColors.brightness[type] + ') contrast(' + State.variables.customColors.contrast[type] + ')' + (valueOnly ? '' : ';');
}

window.saveCustomColourPreset = function (slot = "primary") {
    let setName = prompt("Enter new colour preset name", "New preset");
    if (setName != null) {
        if (Object.keys(State.variables.customColors.presets).contains(setName)) {
            alert('Preset "' + setName + '" already exists!');
            return;
        }
        
        State.variables.customColors.presets[setName] = { 
            ver: 2, 
            color: State.variables.customColors.color[slot],
            brightness: State.variables.customColors.brightness[slot],
            saturation: State.variables.customColors.saturation[slot],
            contrast: State.variables.customColors.contrast[slot]
        };
    }
}

window.loadCustomColourPreset = function (slot = "primary") {
    let setName = State.temporary.preset_choice[slot];
    let preset = State.variables.customColors.presets[setName];
    if (preset) {
        // new version of preset (has only one set of colour parameters and doesn't have sepia)
        if (preset.ver >= 2) {
            State.variables.customColors.color[slot] = preset.color;
            State.variables.customColors.brightness[slot] = preset.brightness;
            State.variables.customColors.saturation[slot] = preset.saturation;
            State.variables.customColors.contrast[slot] = preset.contrast;
            State.variables.customColors.sepia[slot] = 0;
        }
        // legacy preset (has both primary and secondary colours information)
        else {
            State.variables.customColors.color.primary = preset.color.primary;
            State.variables.customColors.brightness.primary = preset.brightness.primary;
            State.variables.customColors.saturation.primary = preset.saturation.primary;
            State.variables.customColors.contrast.primary = preset.contrast.primary;
            State.variables.customColors.sepia.primary = preset.sepia.primary;

            State.variables.customColors.color.secondary = preset.color.secondary;
            State.variables.customColors.brightness.secondary = preset.brightness.secondary;
            State.variables.customColors.saturation.secondary = preset.saturation.secondary;
            State.variables.customColors.contrast.secondary = preset.contrast.secondary;
            State.variables.customColors.sepia.secondary = preset.sepia.secondary;
        }
    }
}

// adjusts available options for reveal dropdowns (makes sure upper bound is not below lower bound and vice versa)
window.getFilterRevealOptions = function (type) {
    let optionsFrom = { unassuming: 0, smart: 100, tasteful: 200, comfy: 300, seductive: 500, risqué: 700, lewd: 900 };
    let optionsTo = { unassuming: 100, smart: 200, tasteful: 300, comfy: 500, seductive: 700, risqué: 900, lewd: 9999 };

    if (type == 'from') {
        // this line removes values that are larger than reveal.to
        return Object.keys(optionsFrom).filter(x => optionsFrom[x] < State.variables.shopClothingFilter.reveal.to).reduce((res, key) => (res[key] = optionsFrom[key], res), {})
    }
    else {
        // this line removes values that are smaller than reveal.from
        return Object.keys(optionsTo).filter(x => optionsTo[x] > State.variables.shopClothingFilter.reveal.from).reduce((res, key) => (res[key] = optionsTo[key], res), {})
    }
}

// toggles checkboxes in filters menu
window.toggleAllTraitsFilter = function () {
    let chboxes = $('#filter-traits input:not(:checked)');
    if (chboxes.length > 0)
        chboxes.click();
    else
        $('#filter-traits input:checked').click();
}

// accepts a list of clothes, returns a filtered list of clothes
window.applyClothingShopFilters = function (items) {
    let f = State.variables.shopClothingFilter;
    if (!f.active)
        return items;

    // (example) turns f.gender object {female: true, neutral: true, male: false} into ["f", "n"], ready to compare with gender in items
    let allowedGenders = Object.keys(f.gender).filter(x => f.gender[x]).map(x => x.first());
    
    return items.filter(x => allowedGenders.contains(x.gender) 
        && x.reveal >= f.reveal.from && x.reveal < f.reveal.to
        && x.warmth >= f.warmth.from && x.warmth < f.warmth.to
        && (f.traits.length == 0 || f.traits.containsAny(x.type))
    );
}

window.getWarmthScaleData = function(newWarmth) {
    let maxWarmth = Math.max(260, State.variables.warmth * 1.04);
    if (newWarmth)
        maxWarmth = Math.max(maxWarmth, newWarmth * 1.04);
    let chill = State.variables.chill;
    let cold = chill - 90;
    let warm = chill * 1.3 + 70;
    let hot = chill * 1.3 + 150;
    let minW = Math.min(State.variables.warmth, newWarmth);
    let maxW = Math.max(State.variables.warmth, newWarmth);
    
    return { 
        cold: cold / maxWarmth * 100 + '%',
        chill: (chill - Math.max(cold, 0)) / maxWarmth * 100 + '%',
        ok: (Math.min(warm, maxWarmth) - chill) / maxWarmth * 100 + '%',
        warm: (Math.min(hot, maxWarmth) - Math.min(warm, maxWarmth)) / maxWarmth * 100 + '%',
        hot: (maxWarmth - hot) / maxWarmth * 100 + '%',
        nowarm: warm > maxWarmth ? 'nowarm' : '',
        nohot: hot > maxWarmth ? 'nohot' : '',
        nocold: cold < 0 ? 'nocold' : '',
        player: State.variables.warmth / maxWarmth * 100 + '%',
        playerNew: (State.variables.warmth > newWarmth ? minW : maxW) / maxWarmth * 100 + '%',
        diffUpDown: (State.variables.warmth > newWarmth ? 'down' : 'up'),
        diffStart: minW / maxWarmth * 100 + '%',
        diffWidth: (maxW - minW) / maxWarmth * 100 + '%'
    };
}

window.getWarmthWithOtherClothing = function(slot, clothingId) {
    let newClothing = setup.clothes[slot][clothingId];
    let worn = State.variables.worn;

    let newWarmth = State.variables.warmth + getTrueWarmth(newClothing);
    
    // subtract warmth of all clothes that would be taken off
    if (newClothing.outfitPrimary) {
        //newWarmth -= Object.keys(newClothing.outfitPrimary).reduce((sum, x) => sum + (worn[x].warmth || 0), 0);
        
        // compile a list of all primary clothes to be removed. It implies that item may have only one primary piece
        let clothesToRemove = [slot, ...Object.keys(newClothing.outfitPrimary)].map(x => (worn[x].outfitSecondary && worn[x].outfitSecondary[1] != "broken") ? setup.clothes[worn[x].outfitSecondary[0]].find(z => z.name == worn[x].outfitSecondary[1]) : worn[x])
        let removedClothes = new Set();
        
        clothesToRemove.forEach(x => {
            if (!removedClothes.has(x.name)) {
                newWarmth -= getTrueWarmth(x);
                removedClothes.add(x.name);
            }
        });
    }
    else
        newWarmth -= worn[slot].warmth;

    return newWarmth;
}