declare interface AnyDict {
	[index: string]: any;
}
declare interface Dict<T> {
	[index: string]: T;
}

declare interface CompositeLayerParams {
	/**
	 * Render the layer. Default true, only exact `false` value disables rendering
	 */
	show?: boolean;
	/**
	 * Z-index, bigger is above, default 0
	 */
	z?: number;
	/**
	 * Blend color, CSS color string
	 */
	blend?: string;
	/**
	 * Blend mode.
	 */
	blendMode?: string;
	/**
	 * Desaturate the image before processing.
	 */
	desaturate?: boolean;
	/**
	 * Adjust brightness before processing. -1..+1, 0 is don't change
	 */
	brightness?: number;
	/**
	 * Adjust contrast before processing. >=0, 1 is don't change
	 */
	contrast?: number;
	/**
	 * Alpha, 0-1. Default 1
	 */
	alpha?: number;
	/**
	 * Canvas CSS filter. Default "none". Not recommended to use (experimental feature, low support in browsers)
	 */
	prefilter?: string;
	/**
	 * For CSS-animated canvases:
	 * Override animation frames generation, array of animation frame index to subsprite index.
	 * Ex. defaults for 4-sprite 4-frame are [0, 1, 2, 3], for 2-sprite 4-frame are [0, 0, 1, 1].
	 *
	 * For animated canvases: one-element array of current subsprite index
	 */
	frames?: number[];
	/**
	 * Subsprite size
	 */
	width?: number;
	height?: number;
	/**
	 * Subsprite position on target canvas
	 */
	dx?: number;
	dy?: number;
	/**
	 * Animation name
	 */
	animation?: string;
}
declare interface CompositeLayerSpec extends CompositeLayerParams {
	name?: string;
	/**
	 * Image URL
	 */
	src: string;
}

declare interface KeyframeSpec {
	/**
	 * Index of frame (=subsprite) to display, base 0
	 */
	frame: number;
	/**
	 * Duration of this keyframe, milliseconds (= delay before next keyframe)
	 */
	duration: number;
}

declare type AnimationSpec = KeyframeAnimationSpec | IsochronousAnimationSpec;
declare interface KeyframeAnimationSpec {
	keyframes: KeyframeSpec[];
}
declare interface IsochronousAnimationSpec {
	frames: number;
	duration: number;
}

declare interface CompositeLayer extends CompositeLayerSpec {
	/**
	 * Cached image src
	 */
	imageSrc?: string;
	/**
	 * Cached image to render
	 */
	image?: CanvasImageSource;
	/**
	 * Encoded processing options used to display cachedImage
	 */
	cachedProcessing?: string;
	/**
	 * Last displayed image
	 */
	cachedImage?: CanvasImageSource;
}
