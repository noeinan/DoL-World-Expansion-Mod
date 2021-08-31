
/*
twine expression conversion (simple cases only):
replace (?<!["'\w])\$(?=\w) with V.
replace (?<!["'\w])_(?=\w) with T.
"to", "is", "gte" etc - fix manually
*/
// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
/**
 * MODEL OPTIONS
 * =============
 * See also defaultOptions()
 * Be careful searching for option usages in this file: there's a lot of computed-name property accesses
 * like options["arm_"+arm] or options["arm_"+arm]
 *
 * GROUP TOGGLES:
 * -------------
 * "show_face": boolean, default true
 * "show_hair": boolean, default true
 * "show_tanlines": boolean, default true
 * "show_writings": boolean, default true
 * "show_tf": boolean, default true
 * "show_clothes": boolean, default true
 *
 * BODY OPTIONS:
 * -------------
 * "mannequin":boolean - use mannequin images
 * "breasts":""|"default"|"cleavage" - visible breasts
 * "breast_size":number - breast size tier 1..6
 * "crotch_visible":boolean - display crotch layers
 * "crotch_exposed":boolean - render crotch layers above clothes (unzipped)
 * "penis":""|"default"|"virgin" - has penis
 * "penis_size":number - penis size tier -1..5
 * "penis_parasite":""|"urchin"|"slime" - from $parasite.penis.name
 * "balls":boolean - has balls
 * "nipples_parasite":""|"urchin"|"slime" - from $parasite.nipples.name
 * "clit_parasite":""|"urchin"|"slime" - from $parasite.clit.name
 * "arm_left":"none"|"idle"|"cover" - left arm position ("cover" = covering breasts)
 * "arm_right":"none"|"idle"|"cover" - right arm position ("cover" = covering crotch)
 *
 * SKIN OPTIONS:
 * -------------
 * "skin_type": "custom"|"light"|"medium"|"dark"|"gyaru"|"light"|"medium"|"dark"|"gyaru" -
 *              key of setup.colours.skin_gradients.
 *              "custom" means that skin filters have to be configured manually
 * "skin_tone": 0..1, default tan value
 * Following options configure tanlines, value 0..1 overrides skin tone for that slot,
 * and any negative value or undefined means "no tanlines":
 *  - "skin_tone_breasts"
 *  - "skin_tone_penis"
 *  - "skin_tone_swimshorts"
 *  - "skin_tone_swimsuitTop"
 *  - "skin_tone_swimsuitBottom"
 *  - "skin_tone_bikiniTop"
 *  - "skin_tone_bikiniBottom"
 *
 * HAIR OPTIONS:
 * -------------
 * "hair_colour":string - key from setup.colours.hair_map,
 *                        or "custom" (need to configure "hair" filter manually)
 * "hair_sides_type":string - side hair style or "" for no sides
 * "hair_sides_length":string - visible side hair length stage, "short".."feet"
 * "hair_sides_position":"front"|"back"
 * "hair_fringe_type":string - fringe style or "" for no fringe
 * "hair_fringe_length":string - visible fringe length stage, "short".."feet"
 * "brows_colour":string - key rom setup.colours.hair_map,
 *                         or "custom" (need to configure "brows" filter manually)
 *                         or "" (same as hair_colour) - this is the default
 * "pbhair_colour":string - pubic hair colour, key from setup.colours.hair_map,
 *                          or "custom" (need to configure "brows" filter manually)
 *                          or "" (same as hair_colour) - this is the default
 * "pbhair_level":number - pubic hair level, 0..9, 0 for none
 * "pbhair_strip":number - pubic hair strip level, 0..3. 0 for none
 * "pbhair_balls":number - pubic hair balls level, 0..9, 0 for none
 *
 * FACE OPTIONS:
 * -------------
 * "facestyle": "default" - $facestyle variable, the img/face/XXXX one.
 * "freckles": boolean
 * "trauma": boolean - traumatised state (empty eyes, less blinking)
 * "blink": boolean - blinking enabled
 * "eyes_half": boolean - eyes half closed
 * "eyes_bloodshot":boolean - bloodshot sclera
 * "eyes_colour":string - key from setup.colours.eyes_map
 *                        or "custom" (need to configure "eyes" filter manually)
 * "brows": "none"|"top"|"low"|"orgasm"|"mid"
 * "mouth": "none"|"neutral"|"cry"|"frown"|"smile"
 * "tears":number - tears level, 0..4, 0 is "no tears"
 * "blush":number - blush level, 0..5, 0 is "no blush"
 * "lipstick_colour": "" (none), key from setup.colours.lipstick_map, or "custom" ("lipstick" filter required)
 * "eyeshadow_colour": "" (none), key from setup.colours.eyeshadow_map, or "custom" ("eyeshadow" filter required)
 * "mascara_colour": "" (none), key from setup.colours.mascara_map, or "custom" ("mascara" filter required)
 *
 * TF OPTIONS: ("disabled" & "hidden" types hide the layer)
 * ----------
 * "angel_wings_type": "disabled"|"hidden"|"default"
 * "angel_wing_right": "idle"|"cover"
 * "angel_wing_left": "idle"|"cover"
 * "angel_halo_type": "disabled"|"hidden"|"default"
 * "fallen_wings_type": "disabled"|"hidden"|"default"
 * "fallen_wing_right": "idle"|"cover"
 * "fallen_wing_left": "idle"|"cover"
 * "fallen_halo_type": "disabled"|"hidden"|"default"
 * "demon_wings_type": "disabled"|"hidden"|"default"
 * "demon_wings_state": "idle"|"cover"|"flaunt"
 * "demon_tail_type": "disabled"|"hidden"|"default"|"classic"
 * "demon_tail_state": "idle"|"cover"|"flaunt"
 * "demon_horns_type": "disabled"|"hidden"|"default"|"classic"
 * "wolf_tail_type": "disabled"|"hidden"|"default"|"feral"
 * "wolf_ears_type": "disabled"|"hidden"|"default"|"feral"
 * "wolf_pits_type": "disabled"|"hidden"|"default"
 * "wolf_pubes_type": "disabled"|"hidden"|"default"
 * "wolf_cheeks_type": "disabled"|"hidden"|"feral"
 * "cat_tail_type": "disabled"|"hidden"|"default"
 * "cat_ears_type": "disabled"|"hidden"|"default"
 * "cow_horns_type": "disabled"|"hidden"|"default"
 * "cow_tail_type": "disabled"|"hidden"|"default"
 * "cow_ears_type": "disabled"|"hidden"|"default"
 * "bird_wings_type": "disabled"|"hidden"|"default"
 * "bird_wing_right": "idle"|"cover"
 * "bird_wing_left": "idle"|"cover"
 * "bird_tail_type": "disabled"|"hidden"|"default"
 * "bird_eyes_type": "disabled"|"hidden"|"default"
 * "bird_malar_type": "disabled"|"hidden"|"default"
 * "bird_plumage_type": "disabled"|"hidden"|"default"
 * "bird_pubes_type": "disabled"|"hidden"|"default"
 *
 * BODY WRITING OPTIONS:
 * --------------------
 * For each body writing SLOT (key in $skin):
 * - "writing_SLOT" - key in setup.bodywwriting, "" for no writing
 *
 * DRIPPING FLUIDS OPTIONS:
 * -----------------------
 * "drip_vaginal": ""|"Start"|"VerySlow"|"Slow"|"Fast"|"VeryFast"
 * "drip_anal"   : ""|"Start"|"VerySlow"|"Slow"|"Fast"|"VeryFast"
 * "drip_mouth"  : ""|"Start"|"VerySlow"|"Slow"|"Fast"|"VeryFast"
 *
 * CLOTHING OPTIONS:
 * ----------------
 * For each clothing SLOT (key in $worn)
 * - "worn_SLOT":number - index of the worn item; 0 for no item
 * - "worn_SLOT_alpha":0..1 - opacity, default 1
 * - "worn_SLOT_integrity":"tattered"|"torn|"frayed"|"full" - integrity suffix attached to file name
 * - "worn_SLOT_colour":string - colour name, key from setup.colours.clothes_map
 *                               or "custom" (need to configure "worn_SLOT_custom" filter manually)
 * - "worn_SLOT_acc_colour":string - accessory colour name, key from setup.colours.clothes_map
 *                                   or "custom" (need to configure "worn_SLOT_acc_custom" filter manually)
 *
 * MISC OPTIONS:
 * -------------
 * "upper_tucked":boolean - $worn.upper tucked in $worn.lower
 * "hood_down":boolean - hood is pulled down
 *
 * GENERATED OPTIONS (temp variables configured by the model itself in preprocess())
 * ------------------
 * "genitals_chastity":boolean - $worn.genitals type has 'chastity'
 * "blink_animation":string - "blink"|"blink-trauma"|null
 * "worn_XXXX_setup":object - whole setup.clothes.XXXX object
 * "ztan_XXXX":number - Z-index of tanline level to keep brighter skin above
 * "zarms":number - Z-index of arms
 * "zupper":number - Z-index of "upper" clothing
 *
 * =============
 * MODEL FILTERS
 * =============
 * Following filters are required if related colour option is "custom",
 *  - "hair_custom"
 *  - "pbhair_custom"
 *  - "brows_custom"
 *  - "eyes_custom"
 *  - "eyeshadow_custom"
 *  - "mascara_custom"
 *  - "lipstick_custom"
 * Following filters are generated by applying sprite prefilter to custom or predefined colour
 *  - "hair"
 *  - "pbhair"
 *  - "brows"
 *  - "eyes"
 *  - "eyeshadow"
 *  - "mascara"
 *  - "lipstick"
 *
 * SKIN FILTERS - required if "skin_type" option is "custom", otherwise auto-generated from setup.colours.getSkinFilter
 * ------------
 * "body": skin filter for body
 * "breasts": skin filter for breasts
 * "penis": skin filter for penis
 * "swimshorts": skin filter for penis
 * "swimsuitTop": skin filter for penis
 * "swimsuitBottom": skin filter for penis
 * "bikiniTop": skin filter for penis
 * "bikiniBottom": skin filter for penis
 *
 * CLOTHING COLOUR FILTERS
 * -----------------------
 * For each clothing SLOT:
 * - "worn_SLOT_custom" - required is options.worn_SLOT_colour is "custom"
 * - "worn_SLOT_acc_custom" - required is options.worn_SLOT_acc_colour is "custom"
 * - "worn_SLOT" - generated from sprite prefilter and custom or predefined colour
 * - "worn_SLOT_acc" - generated from sprite prefilter and custom or predefined colour
 */
Renderer.CanvasModels["main"] = {
	name: "main",
	width: 256,
	height: 256,
	frames: 2,
	generatedOptions() {
		return [
			"blink_animation",
			"genitals_chastity",
			"zarms",
			...setup.clothes_all_slots.flatMap(key => [
				"worn_" + key + "_setup"
			])
		]
	},
	defaultOptions() {
		return {
			// group toggles
			"show_face": true,
			"show_hair": true,
			"show_tanlines": true,
			"show_writings": true,
			"show_tf": true,
			"show_clothes": true,
			// body
			"mannequin": false,
			"breasts": "",
			"breast_size": 1,
			"crotch_visible": false,
			"crotch_exposed": false,
			"penis": "",
			"penis_size": -1,
			"penis_parasite": "",
			"balls": false,
			"nipples_parasite": "",
			"clit_parasite": "",
			"arm_left": "idle",
			"arm_right": "idle",
			// Skin & tan
			"skin_type": "light",
			"skin_tone": 0,
			"skin_tone_breasts": -0.01,
			"skin_tone_penis": -0.01,
			"skin_tone_swimshorts": -0.01,
			"skin_tone_swimsuitTop": -0.01,
			"skin_tone_swimsuitBottom": -0.01,
			"skin_tone_bikiniTop": -0.01,
			"skin_tone_bikiniBottom": -0.01,
			// Hair
			"hair_colour": "red",
			"hair_sides_type": "default",
			"hair_sides_length": "short",
			"hair_sides_position": "back",
			"hair_fringe_type": "default",
			"hair_fringe_length": "short",
			"brows_colour": "",
			"pbhair_colour": "",
			"pbhair_level": 0,
			"pbhair_strip": 0,
			"pbhair_balls": 0,
			// Face
			"facestyle": "default",
			"freckles": false,
			"trauma": false,
			"blink": true,
			"eyes_half": false,
			"eyes_bloodshot": false,
			"eyes_colour": "purple",
			"brows": "none",
			"mouth": "none",
			"tears": 0,
			"blush": 0,
			"lipstick_colour": "",
			"eyeshadow_colour": "",
			"mascara_colour": "",
			// tf
			"angel_wings_type": "disabled",
			"angel_wing_right": "idle",
			"angel_wing_left": "idle",
			"angel_halo_type": "disabled",
			"fallen_wings_type": "disabled",
			"fallen_wing_right": "idle",
			"fallen_wing_left": "idle",
			"fallen_halo_type": "disabled",
			"demon_wings_type": "disabled",
			"demon_wings_state": "idle",
			"demon_tail_type": "disabled",
			"demon_tail_state": "idle",
			"demon_horns_type": "disabled",
			"wolf_tail_type": "disabled",
			"wolf_ears_type": "disabled",
			"wolf_pits_type": "disabled",
			"wolf_pubes_type": "disabled",
			"wolf_cheeks_type": "disabled",
			"cat_tail_type": "disabled",
			"cat_ears_type": "disabled",
			"cow_horns_type": "disabled",
			"cow_tail_type": "disabled",
			"cow_ears_type": "disabled",
			"bird_wings_type": "disabled",
			"bird_wing_right": "idle",
			"bird_wing_left": "idle",
			"bird_tail_type": "disabled",
			"bird_eyes_type": "disabled",
			"bird_malar_type": "disabled",
			"bird_plumage_type": "disabled",
			"bird_pubes_type": "disabled",
			/*noeinan mod START*/
			"fox_ears_type": "disabled",
			"fox_tail_type": "disabled",
			"sheep_horns_type": "disabled",
			"sheep_ears_type": "disabled",
			"sheep_tail_type": "disabled",
			"bee_ears_type": "disabled",
			"bee_tail_type": "disabled",
			"bee_wings_type": "disabled",
			"bee_wings_right": "idle",
			"bee_wings_left": "idle",
			/*noeinan mod END*/
			// body writings
			"writing_forehead": "",
			"writing_left_cheek": "",
			"writing_right_cheek": "",
			"writing_breasts": "",
			"writing_left_shoulder": "",
			"writing_right_shoulder": "",
			"writing_pubic": "",
			"writing_left_thigh": "",
			"writing_right_thigh": "",
			// fluids
			"drip_vaginal": "",
			"drip_anal": "",
			"drip_mouth": "",
			// clothing
			"worn_upper": 0,
			"worn_upper_alpha": 1,
			"worn_upper_integrity": "full",
			"worn_upper_colour": "white",
			"worn_upper_acc_colour": "white",
			"worn_upper_setup": {type:[]}, // generated option
			"worn_over_upper": 0,
			"worn_over_upper_alpha": 1,
			"worn_over_upper_integrity": "full",
			"worn_over_upper_colour": "white",
			"worn_over_upper_acc_colour": "white",
			"worn_over_upper_setup": {type:[]}, // generated option
			"worn_genitals": 0,
			"worn_genitals_alpha": 1,
			"worn_genitals_integrity": "full",
			"worn_genitals_colour": "white",
			"worn_genitals_acc_colour": "white",
			"worn_genitals_setup": {type:[]}, // generated option
			"worn_lower": 0,
			"worn_lower_alpha": 1,
			"worn_lower_integrity": "full",
			"worn_lower_colour": "white",
			"worn_lower_acc_colour": "white",
			"worn_lower_setup": {type:[]}, // generated option
			"worn_over_lower": 0,
			"worn_over_lower_alpha": 1,
			"worn_over_lower_integrity": "full",
			"worn_over_lower_colour": "white",
			"worn_over_lower_acc_colour": "white",
			"worn_over_lower_setup": {type:[]}, // generated option
			"worn_under_lower": 0,
			"worn_under_lower_alpha": 1,
			"worn_under_lower_integrity": "full",
			"worn_under_lower_colour": "white",
			"worn_under_lower_acc_colour": "white",
			"worn_under_lower_setup": {type:[]}, // generated option
			"worn_under_upper": 0,
			"worn_under_upper_alpha": 1,
			"worn_under_upper_integrity": "full",
			"worn_under_upper_colour": "white",
			"worn_under_upper_acc_colour": "white",
			"worn_under_upper_setup": {type:[]}, // generated option
			"worn_hands": 0,
			"worn_hands_alpha": 1,
			"worn_hands_integrity": "full",
			"worn_hands_colour": "white",
			"worn_hands_acc_colour": "white",
			"worn_hands_setup": {type:[]}, // generated option
			"worn_head": 0,
			"worn_head_alpha": 1,
			"worn_head_integrity": "full",
			"worn_head_colour": "white",
			"worn_head_acc_colour": "white",
			"worn_head_setup": {type:[]}, // generated option
			"worn_over_head": 0,
			"worn_over_head_alpha": 1,
			"worn_over_head_integrity": "full",
			"worn_over_head_colour": "white",
			"worn_over_head_acc_colour": "white",
			"worn_over_head_setup": {type:[]}, // generated option
			"worn_face": 0,
			"worn_face_alpha": 1,
			"worn_face_integrity": "full",
			"worn_face_colour": "white",
			"worn_face_acc_colour": "white",
			"worn_face_setup": {type:[]}, // generated option
			"worn_neck": 0,
			"worn_neck_alpha": 1,
			"worn_neck_integrity": "full",
			"worn_neck_colour": "white",
			"worn_neck_acc_colour": "white",
			"worn_neck_setup": {type:[]}, // generated option
			"worn_legs": 0,
			"worn_legs_alpha": 1,
			"worn_legs_integrity": "full",
			"worn_legs_colour": "white",
			"worn_legs_acc_colour": "white",
			"worn_legs_setup": {type:[]}, // generated option
			"worn_feet": 0,
			"worn_feet_alpha": 1,
			"worn_feet_integrity": "full",
			"worn_feet_colour": "white",
			"worn_feet_acc_colour": "white",
			"worn_feet_setup": {type:[]}, // generated option
			// misc
			"genitals_chastity": false, // generated option
			"upper_tucked": false,
			"hood_down": false,
			"head_mask_src": "", // generated option
			"blink_animation": "", // generated option
			"ztan_swimshorts": ZIndices.base, // generated option
			"ztan_swimsuitTop": ZIndices.base, // generated option
			"ztan_swimsuitBottom": ZIndices.base, // generated option
			"ztan_bikiniTop": ZIndices.breasts, // generated option
			"ztan_bikiniBottom": ZIndices.base, // generated option
			"zarms": ZIndices.armsidle, // generated options
			"zupper": ZIndices.upper, // generated options
			"zupperleft": ZIndices.upper_arms, // generated options
			"zupperright": ZIndices.upper_arms, // generated options
			// filters
			"filters": {}
		}
	},
	preprocess(options) {
		options.blink_animation = options.blink ? options.trauma ? "blink-trauma" : "blink" : "";

		// Generate skin tone & tanlines filters
		if (options.skin_type !== "custom") {
			options.filters.body = setup.colours.getSkinFilter(options.skin_type, options.skin_tone);
			options.filters.breasts = options.filters.body
			options.filters.penis = options.filters.body
			if (options.show_tanlines) {
				let tanslots = [
					'breasts', 'penis',
					'swimshorts',
					'swimsuitTop', 'swimsuitBottom',
					'bikiniTop', 'bikiniBottom'
				].map(slotname=>[slotname, options['skin_tone_'+slotname]]).
					filter(slot=>slot[1] >= 0); // [slotname, tanvalue], only for tanvalue >= 0
				// Brightest on top
				tanslots.sort((a, b) => b[1] - a[1]);
				tanslots.forEach((slot, i) => {
					options.filters[slot[0]] = setup.colours.getSkinFilter(options.skin_type, slot[1]);
					options['ztan_'+slot[0]] = options['ztan_'+slot[0]] + 0.01*i;
				});
			}
		}
		// Generate filters for colour-by-name properties
		/**
		 * For colour name, lookup its canvas filter and merge with sprite prefilter.
		 * @param key colour name
		 * @param dict map in setup.colours to lookup in
		 * @param debugName used when reporting errors
		 * @param customFilterName key in options.filters
		 * @param prefilterName name of prefilter to apply
		 * @return {CompositeLayerParams}
		 */
		function lookupColour(dict, key, debugName, customFilterName, prefilterName) {
			let filter;
			if (key === "custom") {
				filter = clone(options.filters[customFilterName]);
				if (!filter) {
					console.error("custom "+debugName+" colour not configured");
					return {};
				}
			} else {
				let record = dict[key];
				if (!record) {
					console.error("unknown " + debugName + " colour: " + key);
					return {};
				}
				filter = clone(record.canvasfilter);
			}
			if (prefilterName) {
				Renderer.mergeLayerData(filter,
					setup.colours.sprite_prefilters[prefilterName],
					true
				);
			}
			return filter
		}

		options.filters.eyes = lookupColour(setup.colours.eyes_map, options.eyes_colour, "eyes", "eyes_custom", "eyes");
		options.filters.hair = lookupColour(setup.colours.hair_map, options.hair_colour, "hair", "hair_custom", "hair");
		options.filters.brows = lookupColour(setup.colours.hair_map, options.brows_colour||options.hair_colour, "brows", "brows_custom", "brows");
		options.filters.pbhair = lookupColour(setup.colours.hair_map, options.pbhair_colour||options.hair_colour, "pbhair", "pbhair_custom", "pbhair");
		if (options.lipstick_colour) {
			options.filters.lipstick = lookupColour(setup.colours.lipstick_map, options.lipstick_colour, "lipstick", "lipstick_custom", "lipstick");
		} else {
			options.filters.lipstick = Renderer.emptyLayerFilter();
		}
		if (options.eyeshadow_colour) {
			options.filters.eyeshadow = lookupColour(setup.colours.eyeshadow_map, options.eyeshadow_colour, "eyeshadow", "eyeshadow_custom", "eyeshadow");
		} else {
			options.filters.eyeshadow = Renderer.emptyLayerFilter();
		}
		if (options.mascara_colour) {
			options.filters.mascara = lookupColour(setup.colours.mascara_map, options.mascara_colour, "mascara", "mascara_custom", "mascara");
		} else {
			options.filters.mascara = Renderer.emptyLayerFilter();
		}
		// Clothing filters and options
		for (let slot of setup.clothes_all_slots) {
			let index = options["worn_" + slot];
			if (index > 0) {
				/**
				 * @type {ClothesItem}
				 */
				let setupobj = setup.clothes[slot][index];
				options["worn_" + slot + "_setup"] = setupobj;

				if (setupobj.colour_sidebar) {
					options.filters["worn_" + slot] = lookupColour(
						setup.colours.clothes_map,
						options["worn_" + slot + "_colour"],
						slot + " clothing",
						"worn_" + slot + "_custom",
						setupobj.prefilter
					);
				} else {
					options.filters["worn_" + slot] = Renderer.emptyLayerFilter();
				}

				if (setupobj.accessory_colour_sidebar) {
					options.filters["worn_" + slot + "_acc"] = lookupColour(
						setup.colours.clothes_map,
						options["worn_" + slot + "_acc_colour"],
						slot + " accessory",
						"worn_" + slot + "_acc_custom",
						setupobj.prefilter
					);
				} else {
					options.filters["worn_" + slot + "_acc"] = Renderer.emptyLayerFilter();
				}
			}
		}

		// Show arm and hand just below outermost clothes layer to fully show its main/breasts layer and hide others
		// -0.1 is to move arms behind sleeves; to display gloves above sleeves they get +0.2 in hand layer decls
		if (options.worn_over_upper) {
			options.zarms = ZIndices.over_upper_arms - 0.1;
		} else if (options.worn_upper) {
			if (options.upper_tucked) {
				options.zarms = ZIndices.upper_arms_tucked - 0.1;
			} else {
				options.zarms = ZIndices.upper_arms - 0.1;
			}
		} else if (options.worn_under_upper) {
			options.zarms = ZIndices.under_upper_arms - 0.1;
		} else {
			options.zarms = ZIndices.armsidle
		}
		// Do not put skin above sleeves
		if (options.worn_under_upper_setup.sleeve_img === 1) {
			options.zarms = ZIndices.under_upper_arms - 0.1;
		} else if (options.worn_upper_setup.sleeve_img === 1) {
			if (options.upper_tucked) {
				options.zarms = ZIndices.upper_arms_tucked - 0.1;
			} else {
				options.zarms = ZIndices.upper_arms - 0.1;
			}
		}

		if (options.upper_tucked) {
			options.zupper = ZIndices.upper_tucked;
			options.zupperleft = ZIndices.upper_arms_tucked;
			options.zupperright = ZIndices.upper_arms_tucked;
		} else {
			options.zupper = ZIndices.upper;
			options.zupperleft = ZIndices.upper_arms;
			options.zupperright = ZIndices.upper_arms;
		}
		if (options.arm_right === "cover") options.zupperright = ZIndices.upper_arms_cover;
		if (options.arm_left === "cover") options.zupperleft = ZIndices.upper_arms_cover;

		// Generate mask images
		if (options.worn_over_head_setup.mask_img === 1 &&
			!(options.hood_down && options.worn_over_head_setup.hood && options.worn_over_head_setup.outfitSecondary !== undefined)) {
			options.head_mask_src = "img/clothes/head/"+options.worn_over_head_setup.variable+"/mask.png";
		} else if (options.worn_head_setup.mask_img === 1 &&
			!(options.hood_down && options.worn_head_setup.hood && options.worn_head_setup.outfitSecondary !== undefined)) {
			options.head_mask_src = "img/clothes/head/"+options.worn_head_setup.variable+"/mask.png";
		} else {
			options.head_mask_src = null;
		}

		options.genitals_chastity = options.worn_genitals_setup.type.includes("chastity");
	},
	layers: {
		// banner comments generated in http://patorjk.com/software/taag/#p=display&c=c&f=ANSI%20Regular&t=base
		/***
		 *    ██████   █████  ███████ ███████
		 *    ██   ██ ██   ██ ██      ██
		 *    ██████  ███████ ███████ █████
		 *    ██   ██ ██   ██      ██ ██
		 *    ██████  ██   ██ ███████ ███████
		 *
		 *
		 */
		"base": {
			srcfn(options) {
				if (options.mannequin) return "img/body/mannequin/basenoarms.png"
				return "img/body/basenoarms.png"
			},
			show: true,
			filters: ["body"],
			z: ZIndices.base,
			animation: "idle"
		},
		"basehead": {
			srcfn(options) {
				if (options.mannequin) return "img/body/mannequin/basehead.png"
				return "img/body/basehead.png"
			},
			show: true,
			filters: ["body"],
			z: ZIndices.basehead,
			animation: "idle"
		},
		"breasts": {
			srcfn(options) {
				if (options.mannequin) {
					return "img/body/mannequin/breasts/" +
						(options.breast_size - 1) +
						(options.breasts === "cleavage" && options.breast_size >= 4 ? "_clothed" : "") + ".png"
				} else {
					let fn = "breasts" + options.breast_size + (options.breasts === "cleavage" && options.breast_size >= 3 ? "_clothed" : "") + ".png";
					if (fn === "breasts5_clothed.png") fn = "breasts6_clothed.png";
					return "img/body/breasts/" + fn;
				}
			},
			showfn(options) {
				return !!options.breasts;
			},
			filters: ["breasts"],
			z: ZIndices.breasts,
			animation: "idle"
		},
		"nipples_parasite": {
			srcfn(options) {
				switch (options.nipples_parasite) {
					case "urchin":
						return 'img/body/breasts/chestparasite'+options.breast_size+'.png'
					case "slime":
						return 'img/body/breasts/chestslime'+options.breast_size+'.png'
					default:
						return "";
				}
			},
			showfn(options) {
				return !!options.nipples_parasite;
			},
			z: ZIndices.breasts,
			animation: "idle"
		},
		"leftarm": {
			srcfn(options) {
				if (options.mannequin) {
					return "img/body/mannequin/leftarmidle.png"
				} else if (options.arm_left === "cover") {
					return "img/body/leftarm.png"
				} else {
					return "img/body/leftarmidle.png"
				}
			},
			showfn(options) {
				return options.arm_left !== "none"
			},
			filters: ["body"],
			zfn(options) {
				if (options.arm_left === "cover") return ZIndices.arms_cover;
				return options.zarms;
			},
			animation: "idle"
		},
		"rightarm": {
			srcfn(options) {
				if (options.mannequin) {
					return "img/body/mannequin/rightarmidle.png"
				} else if (options.arm_right === "cover") {
					return "img/body/rightarm.png"
				} else {
					return "img/body/rightarmidle.png"
				}
			},
			showfn(options) {
				return options.arm_right !== "none"
			},
			filters: ["body"],
			zfn(options) {
				if (options.arm_right === "cover") return ZIndices.arms_cover;
				return options.zarms;
			}
		},

		/***
		 *    ████████  █████  ███    ██ ██      ██ ███    ██ ███████ ███████
		 *       ██    ██   ██ ████   ██ ██      ██ ████   ██ ██      ██
		 *       ██    ███████ ██ ██  ██ ██      ██ ██ ██  ██ █████   ███████
		 *       ██    ██   ██ ██  ██ ██ ██      ██ ██  ██ ██ ██           ██
		 *       ██    ██   ██ ██   ████ ███████ ██ ██   ████ ███████ ███████
		 *
		 *
		 */
		"tan_swimshorts": {
			src: "img/body/tan/under_lower/swimshorts.png",
			showfn(options) {
				return !options.mannequin && options.show_tanlines &&
					options.skin_tone_swimshorts >= 0 &&
					options.skin_tone_swimshorts !== options.skin_tone
			},
			filters: ["swimshorts"],
			zfn(options) {
				return options.ztan_swimshorts
			},
			animation: "idle"
		},
		"tan_swimsuitTop": {
			src: "img/body/tan/under_upper/swimsuit/swimsuit.png",
			showfn(options) {
				return !options.mannequin && options.show_tanlines &&
					options.skin_tone_swimsuitTop >= 0 &&
					options.skin_tone_swimsuitTop !== options.skin_tone
			},
			filters: ["swimsuitTop"],
			zfn(options) {
				return options.ztan_swimsuitTop
			},
			animation: "idle"
		},
		"tan_swimsuitBottom": {
			src: "img/body/tan/under_lower/swimsuit.png",
			showfn(options) {
				return !options.mannequin && options.show_tanlines &&
					options.skin_tone_swimsuitBottom >= 0 &&
					options.skin_tone_swimsuitBottom !== options.skin_tone
			},
			filters: ["swimsuitBottom"],
			zfn(options) {
				return options.ztan_swimsuitBottom
			},
			animation: "idle"
		},
		"tan_bikiniTop": {
			srcfn(options) {
				return "img/body/tan/under_upper/bikini/" + options.breast_size + ".png"
			},
			showfn(options) {
				return !options.mannequin && options.show_tanlines && options.breasts &&
					options.skin_tone_bikiniTop >= 0 &&
					options.skin_tone_bikiniTop !== options.skin_tone
			},
			filters: ["bikiniTop"],
			zfn(options) {
				return options.ztan_bikiniTop
			},
			animation: "idle"
		},
		"tan_bikiniBottom": {
			src: "img/body/tan/under_lower/bikini.png",
			showfn(options) {
				return !options.mannequin && options.show_tanlines &&
					options.skin_tone_bikiniBottom >= 0 &&
					options.skin_tone_bikiniBottom !== options.skin_tone
			},
			filters: ["bikiniBottom"],
			zfn(options) {
				return options.ztan_bikiniBottom
			},
			animation: "idle"
		},

		/***
		 *    ███████  █████   ██████ ███████
		 *    ██      ██   ██ ██      ██
		 *    █████   ███████ ██      █████
		 *    ██      ██   ██ ██      ██
		 *    ██      ██   ██  ██████ ███████
		 *
		 *
		 */
		"facebase": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/base.png'
			},
			showfn(options) {
				return options.show_face
			},
			filters: ["body"],
			z: ZIndices.facebase,
			animation: "idle"
		},
		"freckles": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/freckles.png'
			},
			showfn(options) {
				return options.show_face && !!options.freckles
			},
			filters: ["body"],
			z: ZIndices.freckles
		},
		"eyes": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/eyes.png'
			},
			showfn(options) {
				return options.show_face;
			},
			filters: ["body"],
			z: ZIndices.eyes
		},
		"sclera": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/' + (options.eyes_bloodshot?"sclerabloodshot":"sclera") + '.png'
			},
			showfn(options) {
				return options.show_face;
			},
			z: ZIndices.sclera
		},
		"iris": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/' + (options.trauma?"irisempty":"iris") + (options.eyes_half ? "_halfclosed" : "") + '.png'
			},
			showfn(options) {
				return options.show_face;
			},
			filters: ["eyes"],
			z: ZIndices.iris,
			animation: "idle"
		},
		"eyelids": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/eyelids' + (options.eyes_half ? "_halfclosed" : "") + '.png'
			},
			show: true,
			animationfn(options) {
				return options.blink_animation
			},
			filters: ["body"],
			z: ZIndices.eyelids
		},
		"lashes": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/lashes' + (options.eyes_half ? "_halfclosed" : "") + '.png'
			},
			showfn(options) {
				return options.show_face;
			},
			animationfn(options) {
				return options.blink_animation
			},
			z: ZIndices.lashes
		},
		"makeup_eyeshadow": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/makeup/eyeshadows' + (options.eyes_half ? "_halfclosed" : "") + '.png'
			},
			animationfn(options) {
				return options.blink_animation
			},
			showfn(options) {
				return options.show_face && !!options.eyeshadow_colour
			},
			filters: ["eyeshadow"],
			z: ZIndices.eyelids
		},
		"makeup_mascara": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/makeup/mascara' + (options.eyes_half ? "_halfclosed" : "") + '.png'
			},
			showfn(options) {
				return options.show_face && !!options.mascara_colour
			},
			filters: ["mascara"],
			z: ZIndices.lashes
		},
		"brows": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/brow' + options.brows + '.png'
			},
			showfn(options) {
				return options.show_face && options.brows !== "none"
			},
			filters: ["brows"],
			z: ZIndices.brow
		},
		"mouth": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/mouth' + options.mouth + '.png'
			},
			showfn(options) {
				return options.show_face && options.mouth !== "none"
			},
			filters: ["body"],
			z: ZIndices.mouth
		},
		"makeup_lipstick": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/makeup/lipstick_' + options.mouth + '.png'
			},
			showfn(options) {
				return options.show_face && !!options.lipstick_colour
			},
			filters: ["lipstick"],
			z: ZIndices.mouth
		},
		"blush": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/blush' + options.blush + '.png'
			},
			showfn(options) {
				return options.show_face && options.blush > 0
			},
			filters: ["body"],
			z: ZIndices.blush
		},
		"tears": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/' + 'tear' + options.tears + '.png'
			},
			showfn(options) {
				return options.show_face && options.tears > 0
			},
			z: ZIndices.tears,
			animation: "idle"
		},
		"makeup_mascara_tears": {
			srcfn(options) {
				return 'img/face/' + options.facestyle + '/' + 'makeup/mascara' + options.tears + '.png'
			},
			showfn(options) {
				return options.show_face && options.tears > 0 && !!options.mascara_colour
			},
			filters: ["mascara"],
			z: ZIndices.lashes
		},
		/***
		 *    ██   ██  █████  ██ ██████
		 *    ██   ██ ██   ██ ██ ██   ██
		 *    ███████ ███████ ██ ██████
		 *    ██   ██ ██   ██ ██ ██   ██
		 *    ██   ██ ██   ██ ██ ██   ██
		 *
		 *
		 */
		"hair_sides": {
			srcfn(options) {
				return 'img/hair/sides/' + options.hair_sides_type + '/' + options.hair_sides_length + '.png'
			},
			zfn(options) {
				if (options.hair_sides_position === "front") {
					return ZIndices.hairforwards
				} else {
					return ZIndices.backhair
				}
			},
			masksrcfn(options) {
				return options.head_mask_src;
			},
			showfn(options) {
				return !!options.show_hair && !!options.hair_sides_type
			},
			filters: ["hair"],
			animation: "idle"
		},
		"hair_fringe": {
			srcfn(options) {
				return 'img/hair/fringe/' + options.hair_fringe_type + '/' + options.hair_fringe_length + '.png'
			},
			showfn(options) {
				return !!options.show_hair && !!options.hair_fringe_type
			},
			masksrcfn(options) {
				return options.head_mask_src;
			},
			filters: ["hair"],
			z: ZIndices.fronthair,
			animation: "idle"
		},
		"hair_extra": { // Extra layer for thighs+ long hair in default style
			srcfn(options) {
				if (options.hair_sides_length === "thighs" && options.hair_sides_type === "default") {
					return "img/hair/red/backhairthighsred.png"
				} else if (options.hair_sides_length === "feet" && options.hair_sides_type === "default") {
					return"img/hair/red/backhairfeetred.png"
				} else {
					return ""
				}
			},
			masksrcfn(options) {
				return options.head_mask_src;
			},
			showfn(options) {
				return !!options.show_hair && !!options.hair_sides_type
			},
			filters: ["hair"],
			z: ZIndices.backhair,
			animation: "idle"
		},
		/***
		 *     ██████ ██████   ██████  ████████  ██████ ██   ██
		 *    ██      ██   ██ ██    ██    ██    ██      ██   ██
		 *    ██      ██████  ██    ██    ██    ██      ███████
		 *    ██      ██   ██ ██    ██    ██    ██      ██   ██
		 *     ██████ ██   ██  ██████     ██     ██████ ██   ██
		 *
		 *
		 */
		"pbhair": {
			srcfn(options) {
				return 'img/hair/phair/pb' + options.pbhair_level + '.png'
			},
			showfn(options) {
				return options.crotch_visible &&
					options.pbhair_level > 1 &&
					options.pbhair_level !== 4 // $pblevel 4 does not exist
			},
			filters: ["pbhair"],
			z: ZIndices.pbhair,
			animation: "idle"
		},
		"pbhair_strip": {
			srcfn(options) {
				return 'img/hair/phair/pbstrip' + options.pbhair_strip + '.png'
			},
			showfn(options) {
				return options.crotch_visible && options.pbhair_strip >= 1
			},
			filters: ["pbhair"],
			z: ZIndices.pbhair,
			animation: "idle"
		},
		"pbhair_balls": {
			srcfn(options) {
				return 'img/hair/phair/balls/' + options.penis_size + '_pb' + options.pbhair_balls + '.png'
			},
			showfn(options) {
				return options.crotch_visible &&
					options.pbhair_balls > 1 &&
					options.balls &&
					!options.genitals_chasity
			},
			filters: ["pbhair"],
			zfn(options) {
				return options.crotch_exposed ? ZIndices.pbhairballs : ZIndices.pbhairballsunderclothes
			},
			animation: "idle"
		},
		"penis": {
			srcfn(options) {
				if (options.mannequin) {
					return "img/body/mannequin/penis.png"
				} else if (options.genitals_chastity) {
					return "img/body/penis/penis_chastity.png"
				} else {
					return "img/body/" +
						(options.balls ? 'penis/':'penisnoballs/') +
						(options.penis === "virgin" ? "penis_virgin" : "penis") +options.penis_size + ".png"
				}
			},
			showfn(options) {
				return options.crotch_visible && !!options.penis
			},
			filters: ["penis"],
			zfn(options) {
				if (options.crotch_exposed) {
					if (options.genitals_chastity) {
						return ZIndices.penis_chastity
					} else {
						return ZIndices.penis
					}
				} else {
					return ZIndices.penisunderclothes
				}
			},
			animation: "idle"
		},
		"penis_parasite": {
			srcfn(options) {
				switch (options.penis_parasite) {
					case "urchin":
						return 'img/body/penis/penisparasite'+options.penis_size+'.png'
					case "slime":
						return 'img/body/penis/penisslime'+options.penis_size+'.png'
					default:
						return "";
				}
			},
			showfn(options) {
				return options.crotch_visible && !!options.penis && !!options.penis_parasite && !options.genitals_chastity;
			},
			zfn(options){
				if (options.crotch_exposed) {
					return ZIndices.parasite
				} else {
					return ZIndices.underParasite
				}
			},
			animation: "idle"
		},
		"clit_parasite": {
			srcfn(options) {
				switch (options.clit_parasite) {
					case "urchin":
						return 'img/body/clitparasite.png'
					case "slime":
						return 'img/body/clitparasite.png'
					default:
						return "";
				}
			},
			showfn(options) {
				return options.crotch_visible && !!options.clit_parasite && !options.chastity;
			},
			zfn(options){
				if (options.crotch_exposed) {
					return ZIndices.parasite
				} else {
					return ZIndices.underParasite
				}
			},
			animation: "idle"
		},
		/***
		 *    ████████ ███████ ███████
		 *       ██    ██      ██
		 *       ██    █████   ███████
		 *       ██    ██           ██
		 *       ██    ██      ███████
		 *
		 *
		 */

		/***
		 *     █████  ███    ██  ██████  ███████ ██
		 *    ██   ██ ████   ██ ██       ██      ██
		 *    ███████ ██ ██  ██ ██   ███ █████   ██
		 *    ██   ██ ██  ██ ██ ██    ██ ██      ██
		 *    ██   ██ ██   ████  ██████  ███████ ███████
		 *
		 *
		 */
		"angel_wings_right": {
			srcfn(options) {
				return 'img/transformations/angel/rightwing/'+options.angel_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.angel_wings_type) && options.angel_wing_right === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"angel_wings_rightcover": {
			srcfn(options) {
				return 'img/transformations/angel/rightcover/'+options.angel_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.angel_wings_type) && options.angel_wing_right === "cover"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"angel_wings_left": {
			srcfn(options) {
				return 'img/transformations/angel/leftwing/'+options.angel_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.angel_wings_type) && options.angel_wing_left === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"angel_wings_leftcover": {
			srcfn(options) {
				return 'img/transformations/angel/leftcover/'+options.angel_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.angel_wings_type) && options.angel_wing_left === "cover"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"angel_halo_back": {
			srcfn(options) {
				return 'img/transformations/angel/backhalo/'+options.angel_halo_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.angel_halo_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"angel_halo_front": {
			srcfn(options) {
				return 'img/transformations/angel/fronthalo/'+options.angel_halo_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.angel_halo_type)
			},
			z: ZIndices.parasite,
			animation: "idle"
		},

		/***
		 *    ███████  █████  ██      ██      ███████ ███    ██
		 *    ██      ██   ██ ██      ██      ██      ████   ██
		 *    █████   ███████ ██      ██      █████   ██ ██  ██
		 *    ██      ██   ██ ██      ██      ██      ██  ██ ██
		 *    ██      ██   ██ ███████ ███████ ███████ ██   ████
		 *
		 *
		 */
		"fallen_wings_right": {
			srcfn(options) {
				return 'img/transformations/fallen/rightwing/'+options.fallen_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fallen_wings_type) && options.fallen_wing_right === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"fallen_wings_rightcover": {
			srcfn(options) {
				return 'img/transformations/fallen/rightcover/'+options.fallen_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fallen_wings_type) && options.fallen_wing_right === "cover"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"fallen_wings_left": {
			srcfn(options) {
				return 'img/transformations/fallen/leftwing/'+options.fallen_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fallen_wings_type) && options.fallen_wing_left === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"fallen_wings_leftcover": {
			srcfn(options) {
				return 'img/transformations/fallen/leftcover/'+options.fallen_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fallen_wings_type) && options.fallen_wing_left === "cover"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"fallen_halo_back": {
			srcfn(options) {
				return 'img/transformations/fallen/backbrokenhalo/'+options.fallen_halo_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fallen_halo_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"fallen_halo_front": {
			srcfn(options) {
				return 'img/transformations/fallen/frontbrokenhalo/'+options.fallen_halo_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fallen_halo_type)
			},
			z: ZIndices.parasite,
			animation: "idle"
		},

		/***
		 *    ██████  ███████ ███    ███  ██████  ███    ██
		 *    ██   ██ ██      ████  ████ ██    ██ ████   ██
		 *    ██   ██ █████   ██ ████ ██ ██    ██ ██ ██  ██
		 *    ██   ██ ██      ██  ██  ██ ██    ██ ██  ██ ██
		 *    ██████  ███████ ██      ██  ██████  ██   ████
		 *
		 *
		 */
		"demon_wings": {
			srcfn(options) {
				return 'img/transformations/demon/wings/'+options.demon_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.demon_wings_type) && options.demon_wings_state === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"demon_wings_flaunt": {
			srcfn(options) {
				return 'img/transformations/demon/flauntwings/'+options.demon_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.demon_wings_type) && options.demon_wings_state === "flaunt"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"demon_wings_cover": {
			srcfn(options) {
				return 'img/transformations/demon/leftcover/'+options.demon_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.demon_wings_type) && options.demon_wings_state === "cover"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"demon_tail": {
			srcfn(options) {
				return 'img/transformations/demon/tail/'+options.demon_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.demon_tail_type) && options.demon_tail_state === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"demon_tail_flaunt": {
			srcfn(options) {
				return 'img/transformations/demon/flaunttail/'+options.demon_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.demon_tail_type) && options.demon_tail_state === "flaunt"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"demon_tail_cover": {
			srcfn(options) {
				return 'img/transformations/demon/rightcover/'+options.demon_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.demon_tail_type) && options.demon_tail_state === "cover"
			},
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"demon_horns": {
			srcfn(options) {
				return 'img/transformations/demon/horns/'+options.demon_horns_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.demon_horns_type)
			},
			z: ZIndices.horns,
			animation: "idle"
		},
		/***
		 *    ██     ██  ██████  ██      ███████
		 *    ██     ██ ██    ██ ██      ██
		 *    ██  █  ██ ██    ██ ██      █████
		 *    ██ ███ ██ ██    ██ ██      ██
		 *     ███ ███   ██████  ███████ ██
		 *
		 *
		 */
		"wolf_tail": {
			srcfn(options) {
				return 'img/transformations/wolf/tail/'+options.wolf_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.wolf_tail_type)
			},
			filters: ["hair"],
			z: ZIndices.backhair,
			animation: "idle"
		},
		"wolf_ears": {
			srcfn(options) {
				return 'img/transformations/wolf/ears/'+options.wolf_ears_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.wolf_ears_type)
			},
			masksrcfn(options) {
				return options.head_mask_src;
			},
			filters: ["hair"],
			z: ZIndices.backhair,
			animation: "idle"
		},
		"wolf_pits": {
			srcfn(options) {
				return 'img/transformations/hirsute/pits/'+options.wolf_pits_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.wolf_pits_type)
			},
			filters: ["hair"],
			z: ZIndices.hirsute,
			animation: "idle"
		},
		"wolf_pubes": {
			srcfn(options) {
				return 'img/transformations/hirsute/pubes/'+options.wolf_pubes_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.wolf_pubes_type)
			},
			filters: ["hair"],
			z: ZIndices.hirsute,
			animation: "idle"
		},
		"wolf_cheeks": {
			srcfn(options) {
				return 'img/transformations/wolf/cheeks/'+options.wolf_cheeks_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.wolf_cheeks_type)
			},
			filters: ["hair"],
			z: ZIndices.hirsute,
			animation: "idle"
		},
		/***
		 *     ██████  █████  ████████
		 *    ██      ██   ██    ██
		 *    ██      ███████    ██
		 *    ██      ██   ██    ██
		 *     ██████ ██   ██    ██
		 *
		 *
		 */

		"cat_tail": {
			srcfn(options) {
				return 'img/transformations/cat/tail/'+options.cat_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.cat_tail_type)
			},
			filters: ["hair"],
			z: ZIndices.backhair,
			animation: "idle"
		},
		"cat_ears": {
			srcfn(options) {
				return 'img/transformations/cat/ears/'+options.cat_ears_type+'.png'
			},
			masksrcfn(options) {
				return options.head_mask_src;
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.cat_ears_type)
			},
			filters: ["hair"],
			z: ZIndices.backhair,
			animation: "idle"
		},
		/***
		 *     ██████  ██████  ██     ██
		 *    ██      ██    ██ ██     ██
		 *    ██      ██    ██ ██  █  ██
		 *    ██      ██    ██ ██ ███ ██
		 *     ██████  ██████   ███ ███
		 *
		 *
		 */
		"cow_horns": {
			srcfn(options) {
				return 'img/transformations/cow/horns/'+options.cow_horns_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.cow_horns_type)
			},
			z: ZIndices.horns,
			animation: "idle"
		},
		"cow_ears": {
			srcfn(options) {
				return 'img/transformations/cow/ears/'+options.cow_ears_type+'.png'
			},
			masksrcfn(options) {
				return options.head_mask_src;
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.cow_ears_type)
			},
			z: ZIndices.horns,
			animation: "idle"
		},
		"cow_tag": {
			srcfn(options) {
				return "img/transformations/cow/tag.png"
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.cow_ears_type)
			},
			z: ZIndices.face,
			animation: "idle"
		},
		"cow_tail": {
			srcfn(options) {
				return 'img/transformations/cow/tail/'+options.cow_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.cow_tail_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		/***
		 *    ██████  ██ ██████  ██████
		 *    ██   ██ ██ ██   ██ ██   ██
		 *    ██████  ██ ██████  ██   ██
		 *    ██   ██ ██ ██   ██ ██   ██
		 *    ██████  ██ ██   ██ ██████
		 *
		 *
		 */

		"bird_wings_right": {
			srcfn(options) {
				return 'img/transformations/bird/rightwing/'+options.bird_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_wings_type) && options.bird_wing_right === "idle"
			},
			filters: ["hair"],
			z: ZIndices.backhair,
			animation: "idle"
		},
		"bird_wings_rightcover": {
			srcfn(options) {
				return 'img/transformations/bird/rightcover/'+options.bird_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_wings_type) && options.bird_wing_right === "cover"
			},
			filters: ["hair"],
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"bird_wings_left": {
			srcfn(options) {
				return 'img/transformations/bird/leftwing/'+options.bird_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_wings_type) && options.bird_wing_left === "idle"
			},
			filters: ["hair"],
			z: ZIndices.backhair,
			animation: "idle"
		},
		"bird_wings_leftcover": {
			srcfn(options) {
				return 'img/transformations/bird/leftcover/'+options.bird_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_wings_type) && options.bird_wing_left === "cover"
			},
			filters: ["hair"],
			z: ZIndices.tailPenisCover,
			animation: "idle"
		},
		"bird_tail": {
			srcfn(options) {
				return 'img/transformations/bird/tail/'+options.bird_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_tail_type)
			},
			filters: ["hair"],
			z: ZIndices.lower,
			animation: "idle"
		},
		"bird_eyes": {
			srcfn(options) {
				return 'img/transformations/bird/eyes/'+options.bird_eyes_type+'.png'
			},
			showfn(options) {
				return options.show_tf && options.show_face && tf_enabled(options.bird_eyes_type)
			},
			z: ZIndices.irisacc,
			animation: "idle"
		},
		"bird_malar": {
			srcfn(options) {
				return 'img/transformations/bird/malar/'+options.bird_malar_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_malar_type)
			},
			filters: ["hair"],
			z: ZIndices.lower,
			animation: "idle"
		},
		"bird_plumage": {
			srcfn(options) {
				return 'img/transformations/bird/plumage/'+options.bird_plumage_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_plumage_type)
			},
			filters: ["hair"],
			z: ZIndices.lower,
			animation: "idle"
		},
		"bird_pubes": {
			srcfn(options) {
				return 'img/transformations/bird/pubes/'+options.bird_pubes_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bird_pubes_type)
			},
			filters: ["hair"],
			z: ZIndices.hirsute,
			animation: "idle"
		},

		/*noeinan mod START*/
		/***
        *    ███████  ██████  ██    ██
        *    ██      ██    ██  ██  ██
        *    ████    ██    ██    ██
        *    ██      ██    ██  ██  ██
        *    ██       ██████  ██    ██
        *
        *
        */
		"fox_ears_type": {
			srcfn(options) {
				return 'img/transformations/fox/ears/'+options.fox_ears_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fox_ears_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"fox_tail_type": {
			srcfn(options) {
				return 'img/transformations/fox/tail/'+options.fox_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.fox_tail_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		/***
         *     █████   ██   ██  ███████  ███████  ██████
         *    ██       ██   ██  ██       ██       ██   ██
         *     █████   ███████  ██████   ██████   ██████
         *         ██  ██   ██  ██       ██       ██
         *     █████   ██   ██  ███████  ███████  ██
         *
         *
         */
		"sheep_horns_type": {
			srcfn(options) {
				return 'img/transformations/sheep/horns/'+options.sheep_horns_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.sheep_horns_type)
			},
			z: ZIndices.horns,
			animation: "idle"
		},
		"sheep_ears_type": {
			srcfn(options) {
				return 'img/transformations/sheep/ears/'+options.sheep_ears_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.sheep_ears_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"sheep_tail_type": {
			srcfn(options) {
				return 'img/transformations/sheep/tail/'+options.sheep_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.sheep_tail_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		/***
         *    ██████    ███████  ███████
         *    ██    ██  ██       ██
         *    ██████    ██████   ██████
         *    ██    ██  ██       ██
         *    ██████    ███████  ███████
         *
         *
         */
		"bee_ears_type": {
			srcfn(options) {
				return 'img/transformations/bee/ears/'+options.bee_ears_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bee_ears_type) && V.worn.head.name != "hoodie hood"
			},
			z: ZIndices.fronthair,
			animation: "idle"
		},
		"bee_tail_type": {
			srcfn(options) {
				return 'img/transformations/bee/tail/'+options.bee_tail_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bee_tail_type)
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"bee_wings_right": {
			srcfn(options) {
				return 'img/transformations/bee/rightwing/'+options.bee_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bee_wings_type) && options.bee_wing_right === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		"bee_wings_left": {
			srcfn(options) {
				return 'img/transformations/bee/leftwing/'+options.bee_wings_type+'.png'
			},
			showfn(options) {
				return options.show_tf && tf_enabled(options.bee_wings_type) && options.bee_wing_left === "idle"
			},
			z: ZIndices.backhair,
			animation: "idle"
		},
		/*noeinan mod END*/

		/***
		 *    ██     ██ ██████  ██ ████████ ██ ███    ██  ██████  ███████
		 *    ██     ██ ██   ██ ██    ██    ██ ████   ██ ██       ██
		 *    ██  █  ██ ██████  ██    ██    ██ ██ ██  ██ ██   ███ ███████
		 *    ██ ███ ██ ██   ██ ██    ██    ██ ██  ██ ██ ██    ██      ██
		 *     ███ ███  ██   ██ ██    ██    ██ ██   ████  ██████  ███████
		 *
		 *
		 */
		"writing_forehead": {
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_forehead];
				if (writing.type === "text") {
					return "img/bodywriting/forehead.png"
				} else if (writing.type === "object"){
					return 'img/bodywriting/' + writing.writing + '/forehead.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_forehead;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_left_cheek": {
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_left_cheek];
				if (writing.type === "text") {
					return "img/bodywriting/left_cheek.png"
				} else if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/left_cheek.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_left_cheek;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_right_cheek":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_right_cheek];
				if (writing.type === "text") {
					if (writing.arrow === 1) {
						return "img/bodywriting/right_cheek_arrow.png"
					} else {
						return "img/bodywriting/right_cheek.png"
					}
				} else if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/right_cheek.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_right_cheek;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_breasts":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_breasts];
				if (writing.type === "text") {
					return 'img/bodywriting/breasts1.png' // See also layer "writing_breasts_extra"
				} else if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/breasts'+options.breast_size+'.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_breasts;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_breasts_extra":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_breasts];
				if (writing.type === "text" && options.breast_size >= 2) {
					return 'img/bodywriting/breasts' + options.breast_size + '.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_breasts;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_left_shoulder":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_left_shoulder];
				if (writing.type === "text") {
					return "img/bodywriting/left_shoulder.png"
				} else if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/left_shoulder.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_left_shoulder;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_right_shoulder":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_right_shoulder];
				if (writing.type === "text") {
					return "img/bodywriting/right_shoulder.png"
				} else if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/right_shoulder.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_right_shoulder;
			},
			zfn(options) {
				if (options.arm_right === "cover") {
					return ZIndices.arms_cover + 0.1
				} else {
					return ZIndices.armsidle + 0.1
				}
			},
			animation: "idle"
		},
		"writing_pubic":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_pubic];
				if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/pubic.png'
				} else if (writing.arrow === 1) {
					return "img/bodywriting/pubic_arrow.png"
				} else if (writing.type === "text") {
					return "img/bodywriting/pubic.png"
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_pubic;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_left_thigh":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_left_thigh];
				if (writing.arrow === 1) {
					return "img/bodywriting/left_thigh_arrow.png"
				} else if (writing.type === "text") {
					return "img/bodywriting/left_thigh.png"
				} else if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/left_thigh.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return options.show_writings && !!options.writing_left_thigh;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"writing_right_thigh":{
			srcfn(options) {
				let writing = setup.bodywriting[options.writing_right_thigh];
				if (writing.arrow === 1) {
					return "img/bodywriting/right_thigh_arrow.png"
				} else if (writing.type === "text") {
					return "img/bodywriting/right_thigh.png"
				} else if (writing.type === "object") {
					return 'img/bodywriting/' + writing.writing + '/right_thigh.png'
				} else {
					return '';
				}
			},
			showfn(options) {
				return !!options.writing_right_thigh;
			},
			z: ZIndices.skin,
			animation: "idle"
		},
		"drip_vaginal": {
			srcfn(options) {
				return "img/body/cum/VaginalCumDrip"+options.drip_vaginal+".png"
			},
			showfn(options) {
				return !!options.drip_vaginal;
			},
			z: ZIndices.tears,
			animationfn(options) {
				return "VaginalCumDrip" + options.drip_vaginal;
			}
		},
		"drip_anal": {
			srcfn(options) {
				return "img/body/cum/AnalCumDrip"+options.drip_anal+".png"
			},
			showfn(options) {
				return !!options.drip_anal;
			},
			z: ZIndices.tears,
			animationfn(options) {
				return "AnalCumDrip" + options.drip_anal;
			}
		},
		"drip_mouth": {
			srcfn(options) {
				return "img/body/cum/MouthCumDrip"+options.drip_mouth+".png"
			},
			showfn(options) {
				return options.show_face && !!options.drip_mouth;
			},
			dxfn(options) {
				return options.facestyle === "small-eyes" ? 2 : 0;
			},
			z: ZIndices.tears,
			animationfn(options) {
				return "MouthCumDrip" + options.drip_mouth;
			}
		},
		/***
		 *     ██████ ██       ██████  ████████ ██   ██ ███████ ███████
		 *    ██      ██      ██    ██    ██    ██   ██ ██      ██
		 *    ██      ██      ██    ██    ██    ███████ █████   ███████
		 *    ██      ██      ██    ██    ██    ██   ██ ██           ██
		 *     ██████ ███████  ██████     ██    ██   ██ ███████ ███████
		 *
		 *
		 */
		/***
		 *    ██    ██ ██████  ██████  ███████ ██████
		 *    ██    ██ ██   ██ ██   ██ ██      ██   ██
		 *    ██    ██ ██████  ██████  █████   ██████
		 *    ██    ██ ██      ██      ██      ██   ██
		 *     ██████  ██      ██      ███████ ██   ██
		 *
		 *
		 */
		"upper_main": genlayer_clothing_main('upper', {
			zfn(options) {
				return options.zupper
			}
		}),
		"upper_breasts": genlayer_clothing_breasts("upper", {
			zfn(options) {
				return options.zupper
			}
		}),
		"upper_acc": genlayer_clothing_accessory("upper", {
			zfn(options) {
				return options.zupper
			}
		}),
		"upper_breasts_acc": genlayer_clothing_breasts_acc("upper", {
			zfn(options) {
				return options.zupper
			}
		}),
		"upper_rightarm": genlayer_clothing_arm("right", "upper", {
			zfn(options) {
				return options.zupperright
			}
		}),
		"upper_leftarm": genlayer_clothing_arm("left", "upper", {
			zfn(options) {
				return options.zupperleft
			}
		}),
		"upper_rightarm_acc": genlayer_clothing_arm_acc("right", "upper", {
			zfn(options) {
				return options.zupperright
			}
		}),
		"upper_leftarm_acc": genlayer_clothing_arm_acc("left", "upper", {
			zfn(options) {
				return options.zupperleft
			}
		}),
		/***
		 *     ██████  ██    ██ ███████ ██████  ██    ██ ██████  ██████  ███████ ██████
		 *    ██    ██ ██    ██ ██      ██   ██ ██    ██ ██   ██ ██   ██ ██      ██   ██
		 *    ██    ██ ██    ██ █████   ██████  ██    ██ ██████  ██████  █████   ██████
		 *    ██    ██  ██  ██  ██      ██   ██ ██    ██ ██      ██      ██      ██   ██
		 *     ██████    ████   ███████ ██   ██  ██████  ██      ██      ███████ ██   ██
		 *
		 *
		 */
		"over_upper_main": genlayer_clothing_main('over_upper'),
		"over_upper_breasts": genlayer_clothing_breasts("over_upper"),
		"over_upper_acc": genlayer_clothing_accessory('over_upper'),
		"over_upper_rightarm": genlayer_clothing_arm("right", "over_upper", {
			zfn(options) {
				return options.arm_right === "cover" ? ZIndices.over_upper_arms_cover : ZIndices.over_upper_arms;
			}
		}),
		"over_upper_leftarm": genlayer_clothing_arm("left", "over_upper", {
			zfn(options) {
				return options.arm_left === "cover" ? ZIndices.over_upper_arms_cover : ZIndices.over_upper_arms;
			}
		}),
		/***
		 *     ██████  ███████ ███    ██ ██ ████████  █████  ██      ███████
		 *    ██       ██      ████   ██ ██    ██    ██   ██ ██      ██
		 *    ██   ███ █████   ██ ██  ██ ██    ██    ███████ ██      ███████
		 *    ██    ██ ██      ██  ██ ██ ██    ██    ██   ██ ██           ██
		 *     ██████  ███████ ██   ████ ██    ██    ██   ██ ███████ ███████
		 *
		 *
		 */

		"genitals": genlayer_clothing_main('genitals', {
			srcfn(options) {
				if (options.worn_genitals_setup.variable === "chastitycage" && options.penis_parasite === "urchin") {
					return 'img/clothes/genitals/' + options.worn_genitals_setup.variable + '/' + options.worn_genitals_integrity + '_urchin.png'
				} else if (options.worn_genitals_setup.variable === "chastitycage" && options.penis_parasite === "slime") {
					return 'img/clothes/genitals/' + options.worn_genitals_setup.variable + '/' + options.worn_genitals_integrity + '_slime.png'
				} else {
					return 'img/clothes/genitals/' + options.worn_genitals_setup.variable + '/' + options.worn_genitals_integrity + '.png'
				}
			},
			showfn(options) {
				return options.worn_genitals > 0 &&
					options.worn_genitals_setup.mainImage !== 0 &&
					!options.worn_genitals_setup.hideUnderLower.includes(options.worn_under_lower.name)
			}
		}),
		/***
		 *    ██       ██████  ██     ██ ███████ ██████
		 *    ██      ██    ██ ██     ██ ██      ██   ██
		 *    ██      ██    ██ ██  █  ██ █████   ██████
		 *    ██      ██    ██ ██ ███ ██ ██      ██   ██
		 *    ███████  ██████   ███ ███  ███████ ██   ██
		 *
		 *
		 */
		"lower": genlayer_clothing_main('lower', {
			zfn(options) {
				return options.worn_lower_setup.high_img ? ZIndices.lower_high : ZIndices.lower;
			}
		}),
		"lower_acc": genlayer_clothing_accessory('lower'),
		"lower_back": genlayer_clothing_back_img('lower', {
			z: ZIndices.back_lower
		}),
		/***
		 *     ██████  ██    ██ ███████ ██████  ██       ██████  ██     ██ ███████ ██████
		 *    ██    ██ ██    ██ ██      ██   ██ ██      ██    ██ ██     ██ ██      ██   ██
		 *    ██    ██ ██    ██ █████   ██████  ██      ██    ██ ██  █  ██ █████   ██████
		 *    ██    ██  ██  ██  ██      ██   ██ ██      ██    ██ ██ ███ ██ ██      ██   ██
		 *     ██████    ████   ███████ ██   ██ ███████  ██████   ███ ███  ███████ ██   ██
		 *
		 *
		 */
		"over_lower": genlayer_clothing_main('over_lower'),
		"over_lower_acc": genlayer_clothing_accessory('over_lower'),
		"over_lower_back": genlayer_clothing_back_img('over_lower'),
		/***
		 *    ██    ██ ███    ██ ██████  ███████ ██████  ██       ██████  ██     ██ ███████ ██████
		 *    ██    ██ ████   ██ ██   ██ ██      ██   ██ ██      ██    ██ ██     ██ ██      ██   ██
		 *    ██    ██ ██ ██  ██ ██   ██ █████   ██████  ██      ██    ██ ██  █  ██ █████   ██████
		 *    ██    ██ ██  ██ ██ ██   ██ ██      ██   ██ ██      ██    ██ ██ ███ ██ ██      ██   ██
		 *     ██████  ██   ████ ██████  ███████ ██   ██ ███████  ██████   ███ ███  ███████ ██   ██
		 *
		 *
		 */
		"under_lower": genlayer_clothing_main('under_lower', {
			zfn(options) {
				return options.worn_lower_setup.high_img ? ZIndices.under_lower_high : ZIndices.under_lower;
			}
		}),
		"under_lower_acc": genlayer_clothing_accessory('under_lower'),
		"under_lower_penis": {
			srcfn(options) {
				let path = 'img/clothes/under_lower/' + options.worn_under_lower_setup.variable + '/' + 'penis.png';
				return gray_suffix(path, options.filters['worn_under_lower'])
			},
			showfn(options) {
				return options.show_clothes &&
					options.worn_under_lower > 0 &&
					options.worn_under_lower_setup.penis_img === 1 &&
					!!options.penis;
			},
			z: ZIndices.under_lower_top,
			filters: ["worn_under_lower"],
			animation: "idle"
		},
		"under_lower_penis_acc": {
			srcfn(options) {
				let path = 'img/clothes/under_lower/' + options.worn_under_lower_setup.variable + '/' + 'acc_penis.png';
				return gray_suffix(path, options.filters['worn_under_lower_acc'])
			},
			showfn(options) {
				return options.show_clothes &&
					options.worn_under_lower > 0 &&
					options.worn_under_lower_setup.penis_img === 1 &&
					options.worn_under_lower_setup.accessory === 1 &&
					!!options.penis;
			},
			z: ZIndices.under_lower_top,
			filters: ["worn_under_lower_acc"],
			animation: "idle"
		},
		/***
		 *    ██    ██ ███    ██ ██████  ███████ ██████  ██    ██ ██████  ██████  ███████ ██████
		 *    ██    ██ ████   ██ ██   ██ ██      ██   ██ ██    ██ ██   ██ ██   ██ ██      ██   ██
		 *    ██    ██ ██ ██  ██ ██   ██ █████   ██████  ██    ██ ██████  ██████  █████   ██████
		 *    ██    ██ ██  ██ ██ ██   ██ ██      ██   ██ ██    ██ ██      ██      ██      ██   ██
		 *     ██████  ██   ████ ██████  ███████ ██   ██  ██████  ██      ██      ███████ ██   ██
		 *
		 *
		 */
		"under_upper": genlayer_clothing_main('under_upper'),
		"under_upper_breasts": genlayer_clothing_breasts("under_upper"),
		"under_upper_acc": genlayer_clothing_accessory('under_upper'),
		"under_upper_breasts_acc": genlayer_clothing_breasts_acc('under_upper'),
		"under_upper_back": genlayer_clothing_back_img('under_upper'),
		"under_upper_rightarm": genlayer_clothing_arm("right", "under_upper", {
			zfn(options) {
				return options.arm_right === "cover" ? ZIndices.under_upper_arms_cover : ZIndices.under_upper_arms;
			}
		}),
		"under_upper_leftarm": genlayer_clothing_arm("left", "under_upper", {
			zfn(options) {
				return options.arm_left === "cover" ? ZIndices.under_upper_arms_cover : ZIndices.under_upper_arms;
			}
		}),
		/***
		 *    ██   ██  █████  ███    ██ ██████  ███████
		 *    ██   ██ ██   ██ ████   ██ ██   ██ ██
		 *    ███████ ███████ ██ ██  ██ ██   ██ ███████
		 *    ██   ██ ██   ██ ██  ██ ██ ██   ██      ██
		 *    ██   ██ ██   ██ ██   ████ ██████  ███████
		 *
		 *
		 */
		"hands": genlayer_clothing_main('hands'),
		"hands_left": {
			srcfn(options) {
				let path = 'img/clothes/hands/' +
					options.worn_hands_setup.variable + '/' +
					(options.arm_left === "cover" ? "left_cover" : "left" ) + '.png';
				return gray_suffix(path, options.filters['worn_hands']);
			},
			showfn(options) {
				return options.show_clothes &&
					options.worn_hands > 0 &&
					options.worn_hands_setup.leftImage === 1 &&
					options.arm_left !== "none"
			},
			zfn(options) {
				return options.arm_left === "cover" ? ZIndices.hands : (options.zarms+0.2);
			},
			filters: ["worn_hands"],
			animation: "idle"
		},
		"hands_left_acc": {
			srcfn(options) {
				let path = 'img/clothes/hands/' +
					options.worn_hands_setup.variable + '/' +
					(options.arm_left === "cover" ? "left_cover" : "left" ) + '_acc.png';
				return gray_suffix(path, options.filters['worn_hands_acc']);
			},
			showfn(options) {
				return options.show_clothes &&
					options.worn_hands > 0 &&
					options.worn_hands_setup.leftImage === 1 &&
					options.worn_hands_setup.accessory === 1 &&
					options.arm_left !== "none"
			},
			zfn(options) {
				return options.arm_left === "cover" ? ZIndices.hands : (options.zarms+0.2);
			},
			filters: ["worn_hands_acc"],
			animation: "idle"
		},
		"hands_right": {
			srcfn(options) {
				let path = 'img/clothes/hands/' +
					options.worn_hands_setup.variable + '/' +
					(options.arm_right === "cover" ? "right_cover" : "right" ) + '.png';
				return gray_suffix(path, options.filters['worn_hands']);
			},
			showfn(options) {
				return options.show_clothes &&
					options.worn_hands > 0 &&
					options.worn_hands_setup.rightImage === 1 &&
					options.arm_right !== "none"
			},
			zfn(options) {
				return options.arm_right === "cover" ? ZIndices.hands : (options.zarms+0.2);
			},
			filters: ["worn_hands"],
			animation: "idle"
		},
		"hands_right_acc": {
			srcfn(options) {
				let path = 'img/clothes/hands/' +
					options.worn_hands_setup.variable + '/' +
					(options.arm_right === "cover" ? "right_cover" : "right" ) + '_acc.png';
				return gray_suffix(path, options.filters['worn_hands_acc']);
			},
			showfn(options) {
				return options.show_clothes &&
					options.worn_hands > 0 &&
					options.worn_hands_setup.rightImage === 1 &&
					options.worn_hands_setup.accessory === 1 &&
					options.arm_right !== "none"
			},
			zfn(options) {
				return options.arm_right === "cover" ? ZIndices.hands : (options.zarms+0.2);
			},
			filters: ["worn_hands_acc"],
			animation: "idle"
		},
		/***
		 *    ██   ██ ███████  █████  ██████
		 *    ██   ██ ██      ██   ██ ██   ██
		 *    ███████ █████   ███████ ██   ██
		 *    ██   ██ ██      ██   ██ ██   ██
		 *    ██   ██ ███████ ██   ██ ██████
		 *
		 *
		 */
		"head": genlayer_clothing_main('head'),
		"head_acc": genlayer_clothing_accessory('head'),
		"head_back": genlayer_clothing_back_img('head'),
		/***
		 *     ██████  ██    ██ ███████ ██████          ██   ██ ███████  █████  ██████
		 *    ██    ██ ██    ██ ██      ██   ██         ██   ██ ██      ██   ██ ██   ██
		 *    ██    ██ ██    ██ █████   ██████          ███████ █████   ███████ ██   ██
		 *    ██    ██  ██  ██  ██      ██   ██         ██   ██ ██      ██   ██ ██   ██
		 *     ██████    ████   ███████ ██   ██ ███████ ██   ██ ███████ ██   ██ ██████
		 *
		 *
		 */
		"over_head": genlayer_clothing_main('over_head'),
		"over_head_acc": genlayer_clothing_accessory('over_head'),
		"over_head_back": genlayer_clothing_back_img('over_head'),
		/***
		 *    ███████  █████   ██████ ███████
		 *    ██      ██   ██ ██      ██
		 *    █████   ███████ ██      █████
		 *    ██      ██   ██ ██      ██
		 *    ██      ██   ██  ██████ ███████
		 *
		 *
		 */
		"face": genlayer_clothing_main('face'),
		"face_acc": genlayer_clothing_accessory('face'),
		"face_back": genlayer_clothing_back_img('face'),
		/***
		 *    ███    ██ ███████  ██████ ██   ██
		 *    ████   ██ ██      ██      ██  ██
		 *    ██ ██  ██ █████   ██      █████
		 *    ██  ██ ██ ██      ██      ██  ██
		 *    ██   ████ ███████  ██████ ██   ██
		 *
		 *
		 */
		"neck": genlayer_clothing_main('neck', {
			srcfn(options) {
				let path = 'img/clothes/neck/' +
					options.worn_neck_setup.variable + '/' +
					options.worn_neck_integrity + (options.worn_neck_setup.name === "necktie" && options.worn_upper_setup.has_collar === 1 ? '_nocollar' : '') + '.png';
				return gray_suffix(path, options.filters['worn_neck']);
			}
		}),
		"neck_acc": genlayer_clothing_accessory('neck'),
		/***
		 *    ██      ███████  ██████  ███████
		 *    ██      ██      ██       ██
		 *    ██      █████   ██   ███ ███████
		 *    ██      ██      ██    ██      ██
		 *    ███████ ███████  ██████  ███████
		 *
		 *
		 */
		"legs": genlayer_clothing_main('legs'),
		"legs_acc": genlayer_clothing_accessory('legs'),
		"legs_back": genlayer_clothing_back_img('legs'),
		/***
		 *    ███████ ███████ ███████ ████████
		 *    ██      ██      ██         ██
		 *    █████   █████   █████      ██
		 *    ██      ██      ██         ██
		 *    ██      ███████ ███████    ██
		 *
		 *
		 */
		"feet": genlayer_clothing_main('feet'),
		"feet_acc": genlayer_clothing_accessory('feet'),
		"feet_back": genlayer_clothing_back_img('feet'),

		// new layer template
		/*
		"": {
			srcfn(options) {
				return ""
			},
			z: ZIndices.,
			animation: "idle"
		},
		*/
	}
}

// Utility functions
function tf_enabled(type) { return type !== "disabled" && type !== "hidden" }

// If the filter has hard-light blending, add _gray to path
function gray_suffix(path, filter) {
	if (!filter || filter.blendMode !== "hard-light" || !filter.blend) return path;
	return path.replace('.png','_gray.png');
}

// Layer generating functions.

function genlayer_clothing_main(slot, overrideOptions) {
	return Object.assign({
		srcfn(options) {
			let isHoodDown = options.hood_down &&
				options["worn_"+slot+"_setup"].hood &&
				options["worn_"+slot+"_setup"].outfitSecondary !== undefined;
			let path = 'img/clothes/' +
				slot + '/' +
				options["worn_" + slot + "_setup"].variable + '/' +
				options["worn_" + slot + "_integrity"] + (isHoodDown ? '_down' : '') + '.png';
			return gray_suffix(path, options.filters['worn_'+slot]);
		},
		showfn(options) {
			return options.show_clothes &&
				options["worn_"+slot] > 0 &&
				options["worn_"+slot+"_setup"].mainImage !== 0
		},
		alphafn(options) {
			return options["worn_"+slot+"_alpha"]
		},
		z: ZIndices[slot],
		filters: ["worn_"+slot],
		animation: "idle"
	}, overrideOptions)
}
function genlayer_clothing_accessory(slot, overrideOptions) {
	return Object.assign({
		srcfn(options) {
			let setup = options["worn_"+slot+"_setup"];
			let isHoodDown = options.hood_down &&
				setup.hood &&
				setup.outfitSecondary !== undefined;
			let path = 'img/clothes/' +
				slot + '/' +
				setup.variable + '/' +
				'acc' +
				(setup.accessory_integrity_img ? '_' + options["worn_" + slot + "_integrity"] : '') +
				(isHoodDown ? '_down' : '') + '.png';
			return gray_suffix(path, options.filters['worn_'+slot+'_acc']);
		},
		showfn(options) {
			return options.show_clothes &&
				options["worn_"+slot] > 0 &&
				options["worn_"+slot+"_setup"].accessory === 1
		},
		alphafn(options) {
			return options["worn_"+slot+"_alpha"]
		},
		z: ZIndices[slot],
		filters: ["worn_"+slot+"_acc"],
		animation: "idle"
	}, overrideOptions)
}
function genlayer_clothing_breasts(slot, overrideOptions) {
	return Object.assign({
		srcfn(options) {
			let path = 'img/clothes/'+
				slot+'/' +
				options["worn_"+slot+"_setup"].variable + '/' +
				(Math.min(options.breast_size, 5)) + '.png';
			return gray_suffix(path, options.filters['worn_'+slot]);
		},
		z: ZIndices[slot],
		showfn(options) {
			return options.show_clothes &&
				options["worn_"+slot] > 0 &&
				options["worn_"+slot+"_setup"].breast_img === 1
		},
		alphafn(options) {
			return options["worn_"+slot+"_alpha"]
		},
		filters: ["worn_"+slot],
		animation: "idle"
	}, overrideOptions)
}
function genlayer_clothing_breasts_acc(slot, overrideOptions) {
	return Object.assign({
		srcfn(options) {
			let path = 'img/clothes/'+
				slot+'/' +
				options["worn_"+slot+"_setup"].variable + '/' +
				(Math.min(options.breast_size, 5)) + '_acc.png';
			return gray_suffix(path, options.filters['worn_'+slot+'_acc']);
		},
		z: ZIndices[slot],
		showfn(options) {
			return options.show_clothes &&
				options["worn_"+slot] > 0 &&
				options["worn_"+slot+"_setup"].breast_acc_img === 1
		},
		alphafn(options) {
			return options["worn_"+slot+"_alpha"]
		},
		filters: ["worn_"+slot+"_acc"],
		animation: "idle"
	}, overrideOptions)
}
function genlayer_clothing_back_img(slot, overrideOptions) {
	return Object.assign({
		srcfn(options) {
			let path = 'img/clothes/' +
				slot + '/' +
				options["worn_" + slot + "_setup"].variable + '/' +
				'back.png';
			return gray_suffix(path, options.filters[this.filtersfn(options)[0]]);
		},
		showfn(options) {
			if (!options.show_clothes) return false;
			let isHoodDown = options.hood_down &&
				options["worn_"+slot+"_setup"].hood &&
				options["worn_"+slot+"_setup"].outfitSecondary !== undefined;
			return options["worn_"+slot] > 0 && options["worn_"+slot+"_setup"].back_img === 1 && !isHoodDown;
		},
		alphafn(options) {
			return options["worn_"+slot+"_alpha"]
		},
		z: ZIndices[slot+'_back'],
		filtersfn(options) {
			switch (options["worn_"+slot+"_setup"].back_img_colour) {
				case "none":
					return [];
				case "":
				case undefined:
				case "primary":
					return ["worn_"+slot];
				case "secondary":
					return ["worn_"+slot+"_acc"]
			}
		},
		animation: "idle"
	}, overrideOptions)
}

/**
 * Does not setup z-index, it should be in overrideOptions
 *
 * @param {"left"|"right"} arm
 * @param {string} slot
 * @param {object?} overrideOptions
 */
function genlayer_clothing_arm(arm, slot, overrideOptions) {
	return Object.assign({
		srcfn(options) {
			let path = 'img/clothes/'+
				slot+'/' +
				options["worn_"+slot+"_setup"].variable + '/' +
				(options["arm_"+arm] === "cover" ? (arm+'_cover.png') : (arm+".png"));
			return gray_suffix(path, options.filters[this.filtersfn(options)[0]]);
		},
		showfn(options) {
			return options.show_clothes &&
				options["worn_"+slot] > 0 &&
				options["worn_"+slot+"_setup"].sleeve_img === 1 &&
				options["arm_"+arm] !== "none"
		},
		alphafn(options) {
			return options["worn_"+slot+"_alpha"]
		},
		filtersfn(options) {
			switch (options["worn_"+slot+"_setup"].sleeve_colour) {
				case undefined:
				case "":
				case "primary":
					return ["worn_"+slot];
				case "secondary":
					return ["worn_"+slot+"_acc"];
				case "no":
				default:
					return [];
			}
		},
		animation: "idle"
	}, overrideOptions)
}
/**
 * Does not setup z-index, it should be in overrideOptions
 *
 * @param {"left"|"right"} arm
 * @param {string} slot
 * @param {object?} overrideOptions
 */
function genlayer_clothing_arm_acc(arm, slot, overrideOptions) {
	return Object.assign({
		srcfn(options) {
			let path = 'img/clothes/'+
				slot+'/' +
				options["worn_"+slot+"_setup"].variable + '/' +
				(options["arm_"+arm] === "cover" ? (arm+'_cover_acc.png') : (arm+"_acc.png"));
			return gray_suffix(path, options.filters[this.filtersfn(options)[0]]);
		},
		showfn(options) {
			return options.show_clothes &&
				options["worn_"+slot] > 0 &&
				options["worn_"+slot+"_setup"].sleeve_img === 1 &&
				options["worn_"+slot+"_setup"].sleeve_acc_img === 1 &&
				options["arm_"+arm] !== "none"
		},
		alphafn(options) {
			return options["worn_"+slot+"_alpha"]
		},
		filtersfn(options) {
			switch (options["worn_"+slot+"_setup"].accessory_colour_sidebar) {
				case undefined:
				case "":
				case "primary":
					return ["worn_"+slot];
				case "secondary":
					return ["worn_"+slot+"_acc"];
				case "no":
				default:
					return [];
			}
		},
		animation: "idle"
	}, overrideOptions)
}
