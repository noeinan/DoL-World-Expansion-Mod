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
	var layers = T.CanvasLayers;
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

// use 2x2 pixels in generated images
Renderer.pixelSize = 2;

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
	error: function(error) {
		// strip source data
		let msg = (error.stack||error.message||(''+error))
			.replace(/\(?[^( )]*:\d+:\d+\)?/mg,'')
			.replace(/\(?eval at [\w.]+/mg,'');
		Errors.report(msg);
	},
	composeLayers: function(layers) {
		Renderer.Stats.loadErrors = 0;
		if (Renderer.Stats.trace) {
			console.log(DOL.Perflog.millitime().toFixed(3), "Composing "+layers.length+" layers...");
		}
	},
	processingStep: function(layer, processing, canvas, dt) {
		DOL.Perflog.logWidgetTime("_render:"+processing, dt);
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
