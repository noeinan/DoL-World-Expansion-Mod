/*
 * On caching.
 *
 * I. We want to cache loaded images.
 * For that, there is Renderer.ImageCaches, "url"-><img> mapping
 *
 * II. We want to cache processed images.
 * For that, there is cachedImage and cachedProcessing in the CompositeLayer.
 * cachedProcessing is JSON string of all processing options.
 * We don't use some global "url + processing" cache because of bloat risk.
 * CanvasModel layers are not recreated on render, so rendering same model instance twice uses caching.
 *
 * III. We want to cache identical keyframes of animation, composed of multiple layers.
 * That's done in the animation code.
 *
 * IV. We want caches to persist between passages (if possible).
 * To do that we reuse same CanvasModel between passages.
 *
 * V. We still need to have separate instances of same model and don't want their caches to intersect.
 * For that, CanvasModels are cached by "slot" optional parameter.
 *
 * =======
 * Example
 * =======
 *
 * In the sidebar <<img>> widget, "main" CanvasModel is rendered using "sidebar" cache slot.
 * Whenever it is requested, it is same CanvasModel instance, so image processing is done only for changing layers.
 *
 * If in some test passage we render 10 more "main" CanvasModels without cache slot, they hold no cached layers and
 * are re-composed. (Source images are still cached globally under their url)
 */

/**
 * @typedef {object} CanvasModelLayer
 *
 * @property {boolean} [show] Show this layer, default false (if no show:true or showfn present, needs explicit <<showlayer>>). Do not use undefined/null/0/"" to hide layer!
 * @property {string} [src] Image path. Either `src` or `srcfn` is required
 * @property {number} [z] Z-index (rendering order), higher=above, lower=below. Either `z` of `zfn` is required
 * @property {number} [alpha] Layer opacity, from 0 (invisible) to 1 (opaque, default)
 * @property {boolean} [desaturate] Convert image to grayscale (before recoloring), default false
 * @property {number} [brightness] Adjust brightness, from -1 to +1 (before recoloring), default 0
 * @property {number} [contrast] Adjust contrast (before recoloring), default 1
 * @property {string} [blendMode] Recoloring mode (see docs for globalCompositeOperation; "hard-light", "multiply" and "screen" ), default none
 * @property {string} [blend] Color for recoloring, CSS color string
 * @property {string} [animation] Name of animation to apply, default none
 * @property {number} [frames] Frame numbers used to display static images, array of subsprite indices. For example, if model frame count is 6 but layer has only 3 subsprites, default frames would be [0, 0, 1, 1, 2, 2].
 * @property {string[]} [filters] Names of filters that should be applied to the layer; filters themselves are taken from model options
 * @property {number} [dx] Layer X position on the image, default 0
 * @property {number} [dy] Layer Y position on the image, default 0
 * @property {number} [width] Layer subsprite width, default = model width
 * @property {number} [height] Layer subsprite width, default = model height
 *
 * The following functions can be used instead of constant properties. Theit arguments are (options,V,T) where V=State.variables, T=State.temporary, options are model options provided in render call (from _modeloptions variable for <<rendermodel>>/<<animatemodel>> widget)
 * @property {function} [showfn] (options,V,T)=>boolean Function generating `show` property. Should return boolean, do not use undefined/null/0/"" to hide layer, use of !! (double not) operator recommended.
 * @property {function} [srcfn] (options,V,T)=>string
 * @property {function} [zfn] (options,V,T)=>number
 * @property {function} [alphafn] (options,V,T)=>number
 * @property {function} [desaturatefn] (options,V,T)=>boolean
 * @property {function} [brightnessfn] (options,V,T)=>number
 * @property {function} [contrastftn] (options,V,T)=>number
 * @property {function} [blendModefn] (options,V,T)=>string
 * @property {function} [blendfn] (options,V,T)=>string
 * @property {function} [animationfn] (options,V,T)=>string
 * @property {function} [framesfn] (options,V,T)=>number[]
 * @property {function} [filtersfn] (options,V,T)=>string[]
 * @property {function} [dxfn] (options,V,T)=>number
 * @property {function} [dyfn] (options,V,T)=>number
 * @property {function} [widthfn] (options,V,T)=>number
 * @property {function} [heightfn] (options,V,T)=>number
 */

/**
 * @typedef {object} CanvasModelOptions
 * @property {string} name Model name, for debugging
 * @property {number} width Frame width
 * @property {number} height Frame height
 * @property {number} frames Number of frames for CSS animation
 * @property {object<string,CanvasModelLayer>} layers Layers (by name)
 * @property {function} [generatedOptions] Function ()=>string[] names of generated options
 * @property {function} [defaultOptions] Function ()=>object returning default options
 * @property {function} [preprocess] Preprocessing function (options)=>void to generate temp options
 */

// Consider doing proper class inheritance
/**
 * @property {string} name Model name, for debugging
 * @property {number} width Frame width
 * @property {number} height Frame height
 * @property {number} frames Number of frames for CSS animation
 * @property {function} defaultOptions Function ()=>object returning default options
 * @property {string[]} generatedOptions Names of generated options
 * @property {object<string,CanvasModelLayer>} layers Layers (by name)
 * @property {CanvasModelLayer[]} layerList Layers
 * @property {CanvasRenderingContext2D} canvas
 */
window.CanvasModel = class CanvasModel {
	/**
	 * @param {CanvasModelOptions} options
	 */
	constructor(options) {
		this.name = options.name;
		this.width = options.width;
		this.height = options.height;
		this.frames = options.frames || 1;
		if ('generatedOptions' in options) this.generatedOptions = options.generatedOptions;
		if ('defaultOptions' in options) this.defaultOptions = options.defaultOptions;
		if ('preprocess' in options) this.preprocess = options.preprocess;
		this.layers = clone(options.layers);
		for (let name in this.layers) {
			if (!this.layers.hasOwnProperty(name)) continue;
			let layer = this.layers[name];
			layer.name = name;
			assignDefaults(layer, {
				show: false, // By default, all layers have to be enabled manually
				brightness: 0.0,
				contrast: 1.0,
				blend: '',
				blendMode: '',
				alpha: 1.0,
				desaturate: false
			});
			layer.defaultOptions = clone(layer); // deep copy
		}
		this.layerList = Object.values(this.layers);

		// Last used options
		this.options = { filters: {} };
		this.animated = false;
		this.canvas = null;
		this.rendererListener = null;
	}

	generatedOptions() {
		return [];
	}

	defaultOptions() {
		return {
			filters: {}
		}
	}

	createCanvas(cssAnimated) {
		return Renderer.createCanvas(this.width * (cssAnimated ? this.frames : 1), this.height);
	}

	reset() {
		this.options = {};
		for (let layer of this.layerList) {
			// Reset options
			jQuery.extend(true, layer, layer.defaultOptions);
		}
	}

	showLayer(name, filters) {
		let layer = this.layers[name];
		if (!layer) {
			console.error("Layer not found: " + this.name + "/" + name);
			return;
		}
		layer.show = true;
		for (let filter of filters) {
			if (filter === null || filter === undefined) continue; // null & undefined are allowed as "empty filter"
			if (typeof filter !== 'object') {
				console.error("Invalid layer " + name + " filter " + typeof (filter), filter);
				continue;
			}
			Object.assign(layer, filter);
		}
	}

	/**
	 * Update layers according to options and render them as static image
	 * @param {CanvasRenderingContext2D} canvas Canvas to render on (can be created with {@link createCanvas})
	 * @param {object} options Options to use when rendering model
	 * @param [listener] Listener for Renderer events
	 */
	render(canvas,options,listener) {
		if (typeof options === undefined) options = this.options;
		this.canvas = canvas;
		this.options = options;
		this.listener = listener;
		this.animated = false;
		this.redraw();
	}

	/**
	 * Update layers according to options and animate them
	 * @param {CanvasRenderingContext2D} canvas Canvas to render on (can be created with {@link createCanvas})
	 * @param {object} options Options to use when rendering model
	 * @param [listener] Listener for Renderer events
	 * @return {AnimatingCanvas} AnimatingCanvas object
	 */
	animate(canvas, options, listener) {
		this.canvas = canvas;
		this.options = options;
		this.listener = listener;
		this.animated = true;
		return this.redraw();
	}

	/**
	 * Redraw the model onto same canvas
	 */
	redraw() {
		if (!this.canvas) {
			Errors.report("CanvasModel.redraw() called but model was never rendered!")
			return;
		}
		Renderer.lastModel = this;
		if (this.animated) {
			return Renderer.animateLayers(this.canvas,
				this.compile(this.options),
				Renderer.Animations,
				this.listener,
				true);
		} else {
			return Renderer.composeLayers(this.canvas,
				this.compile(this.options),
				this.canvas.canvas.width/this.width,
				this.listener);
		}
	}

	/**
	 * Pre-process options. Typically you calculate some expression here and store them as generated options
	 * Override in subclass.
	 * @param options Model options
	 * @param V State.variables
	 * @param T State.temporary
	 */
	preprocess(options, V, T) {
	}

	/**
	 * Compile list of layers according to options
	 * @param options Model options
	 * @return {CompositeLayerSpec[]} layers
	 */
	compile(options) {
		const V = State.variables, T = State.temporary;
		const debug = V.debug;
		if (!options) options = {filters: {}};
		if (!('filters' in options)) options.filters = {};
		try {
			this.preprocess(options, V, T);
		} catch (e) {
			console.error(e);
			throw "Error in model preprocessing: "+e.stack
		}
		for (let layer of this.layerList) {
			// Reset some options
			layer.brightness = layer.defaultOptions.brightness;
			layer.contrast = layer.defaultOptions.contrast;
		}

		function propeval(layer, propname) {
			if (propname !== "show" && !debug && !layer.show) {
				// Situation A:
				// layer.srcfn: () => 'img/items/' + V.item.name + '.png'
				// and if V.item is undefined layer is skipped
				// So we don't want to eval skipped layer here
				//
				// Situation B:
				// Layer is skipped by mistake.
				// We want to debug its properties and show manually
				// So we might want to eval it still
				//
				// This is why we eval all properties in debug mode, but ignore their errors
				return;
			}
			let fnkey = propname + "fn";
			if (fnkey in layer) {
				try {
					layer[propname] = layer[fnkey](options, V, T);
				} catch (e) {
					if (layer.show) {
						console.error("Error evaluating layer " + layer.name + " property " + propname,)
					}
				}
			}
		}

		for (let layer of this.layerList) {
			propeval(layer, "show");
			propeval(layer, "src");
			if (!layer.src) {
				layer.src = ''; // force string value
				layer.show = false;
			}
			propeval(layer, "z");
			if (typeof layer.z !== 'number' && layer.show !== false) console.error("Layer " + layer.name + " missing property z");
			propeval(layer, "alpha");
			propeval(layer, "blendMode");
			propeval(layer, "blend");
			propeval(layer, "desaturate");
			propeval(layer, "brightness");
			propeval(layer, "contrast");
			propeval(layer, "animation");
			propeval(layer, "filters");
			propeval(layer, "dx");
			propeval(layer, "dy");
			propeval(layer, "width");
			propeval(layer, "height");
			if (layer.show !== false && layer.filters) {
				for (let filterName of layer.filters) {
					let filter = options.filters[filterName];
					if (!filter) {
						// console.warn("Layer " + layer.name + " needs filter " + filterName + " but it is not provided");
						continue;
					}
					Renderer.mergeLayerData(layer, filter, true);
				}
			}
		}
		return this.layerList;
	}
}

/**
 * @type {object<string,CanvasModelOptions>}
 */
Renderer.CanvasModels = {}
/**
 * @type {object<string,object<string,CanvasModel>>}
 */
Renderer.CanvasModelCaches = {}
/**
 * Find or create new CanvasModel.
 * @param {string} modelName CanvasModel name in Renderer.CanvasModels
 * @param {string} [slot] Cache id to speed up rendering between passages.
 * @return {CanvasModel}
 */
Renderer.locateModel = function(modelName, slot) {
	let options = Renderer.CanvasModels[modelName];
	if (!options) {
		Errors.report("Requested non-existing model "+modelName);
		return new CanvasModel({name:"empty",width:1,height:1,layers:{}});
	}
	if (!slot) {
		return new CanvasModel(options);
	} else {
		let cache = Renderer.CanvasModelCaches[modelName];
		if (!cache) {
			cache = {};
			Renderer.CanvasModelCaches[modelName] = cache;
		}
		let model = cache[slot];
		if (model) return model;
		model = new CanvasModel(options);
		cache[slot] = model;
		return model;
	}
}

/**
 * (Low-level API)
 * Prepare a layer to be rendered.
 *
 * See {@link CompositeLayerSpec} definition for details on options.
 *
 * Arguments are processed depending on their type:
 * * String argument is `src` option (image source)
 * * Number argument is `z` option (z-index)
 * * Object argument is full or partial  CompositeLayerSpec object
 * Leftmost arguments have most priority.
 * @example
 * <<run canvaslayer(10, 'img.png', {blendMode:'hard-light', blend:'#00ff00'});>>
 * <<run canvaslayer({z:10, src:'img.png'}, {blendMode:'hard-light', blend:'#00ff00'});>>
 */
function canvaslayer() {
    var layers = State.temporary.CanvasLayers;
    if (!layers) throw "'canvaslayer()' without 'canvasstart'"

    var theOptions = {};
    for (var i = arguments.length-1; i>=0; i--) {
        var arg = arguments[i];
        switch (typeof arg) {
            case 'object':
                theOptions = Object.assign(theOptions, arg);
                break;
            case 'string':
                theOptions.src = arg;
                break;
            case 'number':
                theOptions.z = arg;
                break;
            default:
                throw "Invalid canvaslayer() argument "+i+": "+(typeof arg);
        }
    }

    if (typeof theOptions.src !== 'string') {
        console.error(arguments);
        throw "canvaslayer() options missing 'src'"
    }
    layers.push(theOptions);
}
window.canvaslayer = canvaslayer;

Renderer.Stats = {
    trace: false,
    traceAnim: false,
    lastLoadTime: 0,
    lastRenderTime: 0,

    logmsgLoad: new ObservableValue(""),
    logmsgRender: new ObservableValue(""),
    logmsgAnimate: new ObservableValue(""),

    nlayers: 0,
    ncached: 0
};
Renderer.defaultListener = {
    composeLayers: function(layers) {
    	Renderer.Stats.loadErrors = 0;
        if (Renderer.Stats.trace) {
            console.log(DOL.Perflog.millitime().toFixed(3), "Composing "+layers.length+" layers...");
        }
    },
	loadError: function(layer, src) {
    	// logged to console by Renderer itself
		Renderer.Stats.loadErrors++;
		Errors.report("Failed to load image "+src+" for layer "+layer);
	},
    loadingDone: function(time, layersLoaded) {
        Renderer.Stats.lastLoadTime = time;
        let msg = "Loaded "+layersLoaded+" images in " + time.toFixed(3) + ' ms';
        if (Renderer.Stats.loadErrors > 0) msg += ' ('+Renderer.Stats.loadErrors+' failed)';
        Renderer.Stats.logmsgLoad.value = msg;
        if (Renderer.Stats.trace) {
            console.log(DOL.Perflog.millitime().toFixed(3), msg);
        }
    },
    beforeRender: function(layers) {
        Renderer.Stats.nlayers = layers.length;
        Renderer.Stats.ncached = 0;
    },
    layerCacheHit: function(layer) {
        Renderer.Stats.ncached++;
    },
    renderingDone: function(time) {
        Renderer.Stats.lastRenderTime = time;
        let msg = "Rendered "+Renderer.Stats.nlayers+" layers"+
            " ("+Renderer.Stats.ncached+" cached)"+
            " in "+time.toFixed(3)+' ms'
        if (Renderer.Stats.trace) {
            console.log(DOL.Perflog.millitime().toFixed(3),msg);
        }
        Renderer.Stats.logmsgRender.value = msg;
    },
    keyframe: function(animation, keyframeIndex, keyframe) {
        if (Renderer.Stats.traceAnim) {
            console.log(DOL.Perflog.millitime().toFixed(3), "animation",animation,"keyframe",keyframeIndex,"frame",keyframe.frame,"duration",keyframe.duration);
        }
    },
    keyframeRender: function(spec, cacheHit, cacheRenderTime) {
        if (Renderer.Stats.traceAnim) {
            console.log(DOL.Perflog.millitime().toFixed(3), "KeyframeRender",spec,cacheHit?"cache hit, render time "+cacheRenderTime.toFixed(3)+" ms":"cache miss");
        }
        if (cacheHit && Renderer.Stats.logmsgAnimate) {
            Renderer.Stats.logmsgAnimate.value = "Cached keyframe rendered in "+cacheRenderTime.toFixed(3)+" ms"
        }
    },
	animationStop: function () {
		if (Renderer.Stats.traceAnim) {
			console.log(DOL.Perflog.millitime().toFixed(3), "Animation stopped");
		}
	}
}
