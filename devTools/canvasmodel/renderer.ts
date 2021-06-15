///<reference path="model.d.ts"/>

/*
 * Created by aimozg on 29.08.2020.
 */
namespace Renderer {
	const millitime = (typeof performance === 'object' && typeof performance.now === 'function') ?
		function () {
			return performance.now()
		} : function () {
			return new Date().getTime()
		};

	export interface LayerImageLoader {
		loadImage(src: string,
		          layer: CompositeLayer,
		          successCallback: (src: string, layer: CompositeLayer, image: HTMLImageElement) => any,
		          errorCallback: (src: string, layer: CompositeLayer, error: any) => any
		);
	}
	export const DefaultImageLoader: LayerImageLoader = {
		loadImage(src: string,
		          layer: CompositeLayer,
		          successCallback: (src: string, layer: CompositeLayer, image: HTMLImageElement) => any,
		          errorCallback: (src: string, layer: CompositeLayer, error: any) => any) {
			const image = new Image();
			image.onload = () => {
				successCallback(src, layer, image);
			}
			image.onerror = (event) => {
				errorCallback(src, layer, event);
			}
			image.src = src;
		}
	}
	export let ImageLoader: LayerImageLoader = DefaultImageLoader;

	export interface RendererListener {
		error?: (layer: string, prop: string, error: Error) => any;

		composeLayers?: (layers: CompositeLayer[]) => any;
		loaded?: (layer: string, src: string) => any;
		loadError?: (layer: string, src: string) => any;
		loadingDone?: (time: number, count: number) => any;

		beforeRender?: (layers: CompositeLayer[]) => any;
		layerCacheMiss?: (layer: CompositeLayer) => any;
		layerCacheHit?: (layer: CompositeLayer) => any;
		processingStep?: (layer: string, processing: string, canvas: HTMLCanvasElement) => any;
		composition?: (layer: string, result: HTMLCanvasElement) => any;
		renderingDone?: (time: number) => any;

		keyframe?: (animation: string, keyframeIndex: number, keyframe: KeyframeSpec) => any;
		keyframeRender?: (spec: string, cacheHit: boolean, cacheRenderTime: number) => any;
		animationStop?: () => any;
	}

	/**
	 * Last arguments to composeLayers
	 */
	export let lastCall: any[] | undefined = undefined;
	/**
	 * Last arguments to animateLayers
	 */
	export let lastAnimateCall: any[] | undefined = undefined;
	/**
	 * Last result of animateLayers
	 */
	export let lastAnimation: AnimatingCanvas | undefined = undefined;

	export function emptyLayerFilter():CompositeLayerParams {
		return {
			desaturate: false,
			blend: "",
			blendMode: "",
			brightness: 0.0,
			contrast: 1.0
		}
	}

	/**
	 * 0 -> "#000000", 0.5 -> "#808080", 1.0 -> "#FFFFFF"
	 */
	export function gray(value:number): string {
		value = Math.min(1, Math.max(0, value));
		value = Math.round(value*255);
		let s = value.toString(16);
		if (value < 16) s = '0' + s;
		return '#'+s+s+s;
	}

	export function createCanvas(w: number, h: number, fill?: string): CanvasRenderingContext2D {
		let c = document.createElement("canvas");
		c.width = w;
		c.height = h;
		let c2d = c.getContext('2d')!!
		if (fill) {
			c2d.fillStyle = fill;
			c2d.fillRect(0, 0, w, h);
		}
		return c2d;
	}

	/**
	 * Creates a cutout of color in shape of sourceImage
	 */
	export function cutout(sourceImage: CanvasImageSource,
	                       color: string,
	                       canvas: CanvasRenderingContext2D = createCanvas(sourceImage.width as number, sourceImage.height as number)): CanvasRenderingContext2D {
		let sw = sourceImage.width as number;
		let sh = sourceImage.height as number;
		canvas.clearRect(0, 0, sw, sh);
		// Fill with target color
		canvas.globalCompositeOperation = 'source-over';
		canvas.fillStyle = color;
		canvas.fillRect(0, 0, sw, sh);

		return cutoutFrom(canvas, sourceImage);
	}

	/**
	 * Cuts out from base a shape in form of stencil.
	 * Modifies and returns base.
	 */
	export function cutoutFrom(base: CanvasRenderingContext2D,
	                           stencil: CanvasImageSource): CanvasRenderingContext2D {
		base.globalCompositeOperation = 'destination-atop';
		base.drawImage(stencil, 0, 0);
		return base;
	}

	/**
	 * Paints sourceImage over cutout of it filled with color.
	 */
	export function composeOverCutout(sourceImage: CanvasImageSource,
	                                  color: string,
	                                  blendMode: string = 'multiply',
	                                  canvas: CanvasRenderingContext2D = createCanvas(sourceImage.width as number, sourceImage.height as number)
	): CanvasRenderingContext2D {
		canvas = cutout(sourceImage, color, canvas);
		// Multiply cutout with original
		canvas.globalCompositeOperation = blendMode;
		canvas.drawImage(sourceImage, 0, 0);

		return canvas;
	}

	/**
	 * Paints sourceImage over same-sized canvas filled with color
	 */
	export function composeOverRect(sourceImage: CanvasImageSource,
	                                color: string,
	                                blendMode: string,
	                                targetCanvas: CanvasRenderingContext2D = createCanvas(sourceImage.width as number,
		                                sourceImage.height as number)
	): CanvasRenderingContext2D {
		// Fill with target color
		targetCanvas.globalCompositeOperation = 'source-over';
		targetCanvas.fillStyle = color;
		targetCanvas.fillRect(0, 0, sourceImage.width as number, sourceImage.height as number);

		targetCanvas.globalCompositeOperation = blendMode;
		targetCanvas.drawImage(sourceImage, 0, 0);
		return targetCanvas
	}

	/**
	 * Paints over sourceImage a cutout of it filled with color.
	 */
	export function composeUnderCutout(sourceImage: CanvasImageSource,
	                                   color: string,
	                                   blendMode: string = 'multiply',
	                                   canvas: CanvasRenderingContext2D =
		                                   createCanvas(sourceImage.width as number, sourceImage.height as number)) {
		const cut = cutout(sourceImage, color);
		// Create a copy of sourceImage
		canvas.globalCompositeOperation = 'source-over';
		canvas.drawImage(sourceImage, 0, 0);
		// Multiply with cutout
		canvas.globalCompositeOperation = blendMode;
		canvas.drawImage(cut.canvas, 0, 0);

		return canvas;
	}

	/**
	 * Paints over sourceImage a same-sized canvas filled with color
	 */
	export function composeUnderRect(sourceImage: CanvasImageSource,
	                                   color: string,
	                                   blendMode: string = 'multiply',
	                                   targetCanvas: CanvasRenderingContext2D =
		                                   createCanvas(sourceImage.width as number, sourceImage.height as number)): CanvasRenderingContext2D {
		let fill = createCanvas(sourceImage.width as number, sourceImage.height as number, color);
		targetCanvas.globalCompositeOperation = 'source-over';
		targetCanvas.drawImage(sourceImage, 0, 0);
		targetCanvas.globalCompositeOperation = blendMode;
		targetCanvas.drawImage(fill.canvas, 0, 0);
		return targetCanvas
	}

	export let ImageCaches: {
		[index: string]: HTMLImageElement
	} = {};
	export let ImageErrors: {
		[index: string]: boolean
	} = {};

	/**
	 * Switch between compose(Over|Under)(Rect|Cutout)
	 */
	export function compose(
		composeOver: boolean,
		doCutout: boolean,
		sourceImage: CanvasImageSource,
		color: string,
		blendMode: string,
		targetCanvas: CanvasRenderingContext2D = createCanvas(
			sourceImage.width as number,
			sourceImage.height as number)
	): CanvasRenderingContext2D {
		if (doCutout) {
			if (composeOver) {
				return composeOverCutout(sourceImage, color, blendMode, targetCanvas);
			} else {
				return composeUnderCutout(sourceImage, color, blendMode, targetCanvas);
			}
		} else {
			if (composeOver) {
				return composeOverRect(sourceImage, color, blendMode, targetCanvas);
			} else {
				return composeUnderRect(sourceImage, color, blendMode, targetCanvas);
			}
		}
	}

	/**
	 * Fills properties in `target` from `source`.
	 * If `overwrite` is false, only missing properties are copied.
	 * In both cases, brightness is added, contrast is multiplied.
	 * Returns target
	 */
	export function mergeLayerData(target: CompositeLayerSpec, source: CompositeLayerParams, overwrite: boolean = false): CompositeLayerSpec {
		for (let k of Object.keys(source)) {
			if (k === 'brightness' && 'brightness' in target) {
				target.brightness += source.brightness;
			} else if (k === 'contrast' && 'contrast' in target) {
				target.contrast *= source.contrast;
			} else if (overwrite || !(k in target)) {
				target[k] = source[k];
			}
		}
		return target;
	}

	export function encodeProcessing(spec: CompositeLayerSpec): string {
		return JSON.stringify({
			// z, alpha, show, and frames regulate how layer is rendered onto target canvas
			src: spec.src,
			blend: spec.blend,
			blendMode: spec.blendMode,
			desaturate: spec.desaturate,
			brightness: spec.brightness,
			contrast: spec.contrast,
			prefilter: spec.prefilter
		});

	}

	export function composeLayersAgain() {
		composeLayers.apply(Renderer, lastCall);
	}

	export function desaturateImage(image: CanvasImageSource,
	                                resultCanvas?: CanvasRenderingContext2D,
	                                doCutout: boolean = true): HTMLCanvasElement {
		return compose(false, doCutout, image, '#000000', 'saturation', resultCanvas).canvas;
	}

	export function filterImage(image: CanvasImageSource, filter: string, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement {
		if (!resultCanvas) {
			resultCanvas = createCanvas(image.width as number, image.height as number);
		}
		resultCanvas.filter = filter;
		resultCanvas.globalCompositeOperation = 'source-over';
		resultCanvas.drawImage(image, 0, 0);
		resultCanvas.filter = '';
		return resultCanvas.canvas;
	}

	export function adjustBrightness(image: CanvasImageSource,
	                                 brightness: number,
	                                 resultCanvas?: CanvasRenderingContext2D,
	                                 doCutout: boolean = true): HTMLCanvasElement {
		if (brightness > 0) {
			const value = gray(brightness);
			// color-dodge by X% gray adjusts levels 0%-(100-X)% to 0%-100%
			return compose(false, doCutout, image, value, 'color-dodge', resultCanvas).canvas;
			// Other option:
			// screen by X% gray adjust levels 0%-100% to X%-100%
			// return composeUnderCutout(image, value, 'screen').canvas;
		} else {
			// multiply by X% gray adjusts levels 0%-100% to 0%-X%
			const value = gray(1+brightness);
			return compose(false, doCutout, image, value, 'multiply', resultCanvas).canvas;
			// Other option:
			// color-burn by X% gray adjusts levels (100-X)%-100% to 0%-100%
		}
	}

	export function adjustLevels(image: CanvasImageSource,
	                             /**
	                              * scale factor, 1 - no change, >1 - higher contrast, <1 - lower contrast.
	                              */
	                             factor: number,
	                             /**
	                              * shift, 0 - no change, >0 - brighter, <0 - darker
	                              */
	                             shift: number,
	                             resultCanvas?: CanvasRenderingContext2D
	                             ): HTMLCanvasElement {
		if (factor >= 1) {
			/*
			 color-dodge ( color, X ) = color / (1 - X) ; 0..(1-X) -> 0..1, (1-X) and brighter become white
			 color-burn ( color, Y ) = 1 - (1 - color) / Y ; (1-Y)..1 -> 0..1, (1-Y) and darker become black
			 color-burn ( color-dodge ( color, X ), Y ) = (1-1/Y) + color / (Y-X*Y)
														= shift   + color * factor
			 given (shift, factor), solving for (X, Y):
			 X = 1-(1-shift)/factor
			 Y = 1/(1 - shift)
			 */
			const x = 1 - (1 - shift) / factor;
			const y = 1 / (1 - shift);

			const c1 = compose(false, false, image, gray(x), 'color-dodge');
			const c2 = compose(false, false, c1.canvas, gray(y), 'color-burn', resultCanvas);
			return c2.canvas;
		} else {
			/*
			 multiply ( color, X ) = color * X ; 0..1 -> 0..X
			 screen ( color, Y ) = 1 - (1 - color) * (1 - Y) ; 0..1 -> Y..1
			 screen ( multiply ( color, X ), Y ) = 1 - (1 - color * X ) * (1 - Y)
			                                     = Y     + color * X*(1-Y)
			                                     = shift + color * factor
			 solving for (X, Y):
			 Y = shift
			 X = factor/(1-shift)
			 */
			const x = factor/(1-shift);
			const y = shift;
			const c1 = compose(false, false, image, gray(x), 'multiply');
			const c2 = compose(false, false, c1.canvas, gray(y), 'screen');
			return c2.canvas;
		}
	}

	export function adjustContrast(image: CanvasImageSource,
	                               factor: number,
	                               resultCanvas?: CanvasRenderingContext2D
	): HTMLCanvasElement {
		/*
		 contrast is scale by F with origin at 0.5
		*/
		const shift = 0.5*(1-factor);
		return adjustLevels(image, factor, shift, resultCanvas);
	}

	export function adjustBrightnessAndContrast(
		image: CanvasImageSource,
		brightness: number,
		contrast: number,
		resultCanvas?: CanvasRenderingContext2D
	): HTMLCanvasElement {
		// = adjustContrast (color + brightness, contrast)
		const shift = brightness*contrast + 0.5*(1-contrast);
		return adjustLevels(image, contrast, shift, resultCanvas);
	}

	export function processLayer(
		layer: CompositeLayer,
		listener: RendererListener
	) {
		let name = layer.name || layer.src;
		let image = layer.image!!;
		let needsCutout = false;
		if (layer.desaturate) {
			image = desaturateImage(image, undefined, false);
			needsCutout = true;
			if (listener && listener.composition) {
				listener.processingStep(name, "desaturate", image);
			}
		}
		if (layer.prefilter && layer.prefilter !== 'none') {
			image = filterImage(image, layer.prefilter);
			if (listener && listener.processingStep) {
				listener.processingStep(name, "prefilter", image);
			}
		}
		if (typeof layer.brightness === 'number' && layer.brightness !== 0) {
			image = adjustBrightness(image, layer.brightness, undefined, false);
			needsCutout = true;
			if (listener && listener.composition) {
				listener.processingStep(name, "brightness", image);
			}
		}
		if (typeof layer.contrast === 'number' && layer.contrast !== 1) {
			image = adjustContrast(image, layer.contrast, undefined);
			needsCutout = true;
			if (listener && listener.composition) {
				listener.processingStep(name, "contrast", image);
			}
		}
		if (layer.blend && layer.blendMode) {
			needsCutout = true;
			image = composeOverRect(image, layer.blend, layer.blendMode).canvas;
			if (listener && listener.processingStep) {
				listener.processingStep(name, "blend", image);
			}
		}
		if (needsCutout) {
			image = cutoutFrom((image as HTMLCanvasElement).getContext('2d'), layer.image!!).canvas;
		}
		return image;
	}

	export function composeProcessedLayer(layer: CompositeLayer,
	                                      targetCanvas: CanvasRenderingContext2D,
	                                      frameCount: number = 1) {
		const image = layer.cachedImage;
		targetCanvas.filter = 'none';
		if (typeof layer.alpha === 'number') {
			targetCanvas.globalAlpha = layer.alpha;
		} else {
			targetCanvas.globalAlpha = 1.0;
		}

		const frameWidth = targetCanvas.canvas.width / frameCount;
		const subspriteWidth = layer.width || frameWidth;
		const subspriteHeight = layer.height || targetCanvas.canvas.height;
		const dx = layer.dx || 0;
		const dy = layer.dy || 0;
		const imageFrameCount = (image.width as number) / subspriteWidth;
		if (imageFrameCount === frameCount && !layer.frames) {
			targetCanvas.drawImage(image, dx, dy);
		} else {
			for (let i = 0; i < frameCount; i++) {
				const imageFrameIndex = Math.min(imageFrameCount - 1,
					layer.frames ? layer.frames[i] : Math.floor(i * imageFrameCount / frameCount));
				targetCanvas.drawImage(image,
					imageFrameIndex * subspriteWidth, 0, subspriteWidth, subspriteHeight,
					dx + i * frameWidth, dy, subspriteWidth, subspriteHeight);
			}
		}
	}

	export function composeLayers(targetCanvas: CanvasRenderingContext2D,
	                              layerSpecs: CompositeLayerSpec[],
	                              frameCount: number,
	                              listener: RendererListener) {
		lastCall = [targetCanvas, layerSpecs, frameCount, listener];
		const t0 = millitime();
		// Sort layers by z-index, then array index
		const layers: CompositeLayer[] = layerSpecs
			.filter(layer =>
				layer.show !== false
				&& !(typeof layer.alpha === 'number' && layer.alpha <= 0.0)
			)
			.map((layer, i) => {
				if (isNaN(layer.z)) {
					console.error("Layer "+(layer.name||layer.src)+" has z-index NaN")
					layer.z = 0;
				}
				return [layer, i] as [CompositeLayerSpec, number];
			}) // map to pairs [element, index]
			.sort((a, b) => {
				if (a[0].z === b[0].z) return a[1] - b[1];
				else return a[0].z!! - b[0].z!!;
			})
			.map(e => e[0] as CompositeLayer); // unwrap values;
		if (listener && listener.composeLayers) listener.composeLayers(layers);

		// Tricky part.
		// We add <img> elements and hook on their onload event.
		// When image loads, we put it into layer 'image' property and kick maybeRenderResult
		// When all images are loaded, we call renderResult

		let rendered = false;
		let layersLoaded = 0;

		function renderResult() {
			rendered = true;
			targetCanvas.clearRect(0, 0, targetCanvas.canvas.width, targetCanvas.canvas.height);
			if (listener && listener.beforeRender) {
				listener.beforeRender(layers);
			}
			const t1 = millitime();
			for (const layer of layers) {
				if (layer.show === false) continue; // Could be disabled due to load error
				let name = layer.name || layer.src;
				let image = layer.image!!;
				let currentProcessing = encodeProcessing(layer);
				if (layer.cachedProcessing && layer.cachedImage && currentProcessing === layer.cachedProcessing) {
					if (listener && listener.layerCacheHit) {
						listener.layerCacheHit(layer);
					}
					image = layer.cachedImage;
				} else {
					if (listener && listener.layerCacheMiss) {
						listener.layerCacheMiss(layer);
					}
					image = processLayer(layer, listener);
					layer.cachedProcessing = currentProcessing;
					layer.cachedImage = image;
				}
				composeProcessedLayer(layer, targetCanvas, frameCount);
				if (listener && listener.composition) {
					listener.composition(name, targetCanvas.canvas);
				}
			}
			if (listener && listener.renderingDone) listener.renderingDone(millitime() - t1);
		}

		function maybeRenderResult() {
			if (rendered) return;
			for (const layer of layers) {
				if (layer.show !== false && !layer.image) return;
			}
			if (listener && listener.loadingDone) listener.loadingDone(millitime() - t0, layersLoaded);
			renderResult();
		}

		function enqueueLayer(layer: CompositeLayer) {
			ImageLoader.loadImage(
				layer.src,
				layer,
				(src,layer,image)=>{
					layersLoaded++;
					if (listener && listener.loaded) {
						listener.loaded(layer.name || 'unnamed', src);
					}
					layer.image = image;
					layer.imageSrc = src;
					ImageCaches[src] = image;
					maybeRenderResult();
				},
				(src,layer,error)=>{
					// Mark this src as erroneous to avoid blinking due to reload attempts
					ImageErrors[src] = true;
					if (listener && listener.loadError) {
						listener.loadError(layer.name || 'unnamed', src);
					} else {
						console.error('Failed to load image ' + src + (layer.name ? ' for layer ' + layer.name : ''));
					}
					layer.show = false;
					maybeRenderResult();
				}
			)
		}

		for (const layer of layers) {
			if (layer.image) {
				if (layer.imageSrc === layer.src) {
					continue;
				} else {
					// Layer was loaded in previous render, but then its src was changed - purge cache
					delete layer.image;
					delete layer.imageSrc;
				}
			}
			if (ImageErrors[layer.src]) {
				layer.show = false;
			} else if (layer.src in ImageCaches) {
				layer.image = ImageCaches[layer.src];
				layer.imageSrc = layer.src;
			} else {
				enqueueLayer(layer);
			}
		}

		maybeRenderResult();
	}

	export interface AnimationInfo {
		spec: KeyframeAnimationSpec;
		/**
		 * Affected layers
		 */
		layers: CompositeLayerSpec[];
		name: string;
		/**
		 * id from setTimeout
		 */
		timeoutId: number;
		/**
		 * Current keyframe index
		 */
		keyframeIndex: number;
		/**
		 * Current keyframe
		 */
		keyframe: KeyframeSpec;
		/**
		 * Time of current keyframe start, milliseconds
		 */
		time: number;
	}

	export interface AnimatingCanvas {
		playing: boolean;
		time: number;
		target: CanvasRenderingContext2D;
		keyframeCaches: Dict<CanvasRenderingContext2D>;
		animations: AnimationInfo[];

		redraw(): void;

		invalidateCaches(): void;

		start(): void;

		stop(): void;
	}

	export function invalidateLayerCaches(layers: CompositeLayer[]) {
		for (let layer of layers) {
			delete layer.cachedImage;
			delete layer.cachedProcessing;
		}
	}

	export function animateLayersAgain() {
		return animateLayers.apply(Renderer, lastAnimateCall);
	}

	const animatingCanvases = new WeakMap<CanvasRenderingContext2D, AnimatingCanvas>();

	export function animateLayers(targetCanvas: CanvasRenderingContext2D,
	                              layerSpecs: CompositeLayerSpec[],
	                              animations: Dict<AnimationSpec>,
	                              listener: RendererListener,
	                              autoStop: boolean = true): AnimatingCanvas {
		lastAnimateCall = [targetCanvas, layerSpecs, animations, listener, autoStop];
		const keyframeCaches: Dict<CanvasRenderingContext2D> = {};

		function invalidateCaches() {
			for (let key in keyframeCaches) delete keyframeCaches[key];
		}

		let schedule: {
			[index: number]: Function[]
		} = {};
		// this mess should become a class already
		const animatingCanvas: AnimatingCanvas = {
			target: targetCanvas,
			keyframeCaches: keyframeCaches,
			animations: [],
			playing: false,
			start() {
				if (this.playing) this.stop();
				this.playing = true;
				// stop previous animation on this targetCanvas, if present
				let oldAnimation = animatingCanvases.get(targetCanvas);
				if (oldAnimation != null) {
					oldAnimation.stop();
				}
				animatingCanvases.set(targetCanvas, this);
				let usedAnimations: Dict<AnimationInfo> = {};
				for (let layer of layerSpecs) {
					if (!layer.src || layer.show === false) continue;
					if (layer.animation) {
						let spec = animations[layer.animation];
						if (!spec) {
							console.error("Layer '" + (layer.name || layer.src) + "' animation '" + layer.animation + "' not found");
							continue;
						}
						if ('frames' in spec) {
							let frames = spec.frames, duration = spec.duration;
							spec = {
								keyframes: []
							};
							for (let i = 0; i < frames; i++) {
								spec.keyframes.push({frame: i, duration: duration});
							}
						}
						let animation = usedAnimations[layer.animation];
						if (!animation) {
							animation = usedAnimations[layer.animation] = {
								name: layer.animation,
								spec: spec,
								timeoutId: 0,
								keyframeIndex: 0,
								keyframe: spec.keyframes[0],
								layers: [],
								time: 0
							};
						}
						animation.layers.push(layer);
						layer.frames = [animation.keyframe.frame];
					} else {
						layer.frames = [0];
					}
				}
				this.animations = Object.values(usedAnimations);
				for (let animation of this.animations) {
					scheduleNextKeyframe(animation);
					if (listener && listener.keyframe) listener.keyframe(animation.name, animation.keyframeIndex, animation.keyframe);
				}
				compose();
			},
			stop() {
				if (!this.playing) return;
				this.playing = false;
				animatingCanvases.delete(targetCanvas);
				for (let info of this.animations) {
					if (info.timeoutId) clearTimeout(info.timeoutId);
				}
				schedule = {};
				this.animations.splice(0);
				invalidateCaches();
				if (listener && listener.animationStop) listener.animationStop();
			},
			invalidateCaches,
			time: 0,
			redraw() {
				compose();
			}
		}

		function genAnimationSpec(): string {
			let j = {};
			for (let animation of animatingCanvas.animations) {
				j[animation.name] = animation.keyframe.frame;
			}
			return JSON.stringify(j);
		}

		function scheduleNextKeyframe(animation: AnimationInfo) {
			if (animation.keyframe.duration <= 0) return;
			let t1 = animation.time + animation.keyframe.duration;
			let tasks = schedule[t1];
			if (!tasks) {
				schedule[t1] = tasks = [];
				animation.timeoutId = window.setTimeout(() => {
					delete schedule[t1];
					animatingCanvas.time = Math.max(t1, animatingCanvas.time);
					for (let task of tasks) task();
					compose();
				}, animation.keyframe.duration);
			} else {
				animation.timeoutId = 0;
			}
			tasks.push(() => {
				animation.time = t1;
				nextKeyframe(animation)
			});
		}

		function nextKeyframe(animation: AnimationInfo) {
			let keyframes = animation.spec.keyframes;
			animation.keyframeIndex = (animation.keyframeIndex + 1) % keyframes.length;
			animation.keyframe = keyframes[animation.keyframeIndex];
			for (let layer of animation.layers) {
				layer.frames = [animation.keyframe.frame];
			}
			scheduleNextKeyframe(animation);
			if (listener && listener.keyframe) listener.keyframe(animation.name, animation.keyframeIndex, animation.keyframe);
		}

		function compose() {
			if (autoStop && animatingCanvas.time > 0 && !(document.body.contains(targetCanvas.canvas))) {
				/* the canvas was removed from DOM. we exclude frame 0 because it might not yet be added */
				animatingCanvas.stop();
				return;
			}
			requestAnimationFrame(() => {
				let spec = genAnimationSpec();
				let cachedCanvas = keyframeCaches[spec];
				if (cachedCanvas) {
					const t0 = millitime();
					targetCanvas.clearRect(0, 0, targetCanvas.canvas.width, targetCanvas.canvas.height);
					targetCanvas.globalAlpha = 1.0;
					targetCanvas.drawImage(cachedCanvas.canvas, 0, 0);
					if (listener && listener.keyframeRender) {
						listener.keyframeRender(spec, true, millitime() - t0);
					}
				} else {
					if (listener && listener.keyframeRender) {
						listener.keyframeRender(spec, false, 0);
					}
					const myListener = Object.assign({}, listener, {
						renderingDone(time) {
							let canvas = createCanvas(targetCanvas.canvas.width, targetCanvas.canvas.height);
							canvas.drawImage(targetCanvas.canvas, 0, 0);
							keyframeCaches[genAnimationSpec()] = canvas;
							if (listener && listener.renderingDone) listener.renderingDone.apply(listener, arguments);
						}
					})
					try {
						composeLayers(targetCanvas, layerSpecs, 1, myListener);
					} catch (e) {
						console.error(e);
						animatingCanvas.stop();
					}
				}
			});
		}

		animatingCanvas.start();

		return (lastAnimation = animatingCanvas)
	}

	/**
	 * Linear interpolation.
	 *
	 * f(0) = min,
	 * f(1) = max.
	 */
	export function lint(value: number, min: number, max: number, allowOverflow = false): number {
		if (!allowOverflow) value = Math.min(1, Math.max(0, value));
		return value * (max - min) + min;
	}

	export function lintArray(value: number, mins: number[], maxes: number[], allowOverflow = false): number[] {
		return mins.map((min, i) => lint(value, min, maxes[i], allowOverflow));
	}

	export function lintStaged(value: number, points: number[]): number {
		value = Math.min(1, Math.max(0, value));
		const n = points.length - 1;
		let i = (value * n) | 0;
		if (i === n) i = n - 1;
		return lint(value * n - i, points[i], points[i + 1]);
	}

	export function lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance {
		min = tinycolor(min).toRgb();
		max = tinycolor(max).toRgb();
		return tinycolor({
			r: lint(value, min.r, max.r),
			g: lint(value, min.g, max.g),
			b: lint(value, min.b, max.b)
		});
	}

	export function lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance {
		value = Math.min(1, Math.max(0, value));
		const n = points.length - 1;
		let i = (value * n) | 0;
		if (i === n) i = n - 1;
		return lintRgb(value * n - i, points[i], points[i + 1]);
	}

	window.Renderer = Renderer;
	// Expose library functions needed by model evaluation, to global ns
	window.lint = Renderer.lint;
	window.lintArray = Renderer.lintArray;
	window.lintStaged = Renderer.lintStaged;
	window.lintRgb = Renderer.lintRgb;
	window.lintRgbStaged = Renderer.lintRgbStaged;
}

interface Window {
	lint(value: number, min: number, max: number, allowOverflow?: boolean): number;

	lintArray(value: number, mins: number[], maxes: number[], allowOverflow?: boolean): number[];

	lintStaged(value: number, points: number[]): number;

	lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance;

	lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance;
}
