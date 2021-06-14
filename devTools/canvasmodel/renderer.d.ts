/// <reference path="model.d.ts" />
/// <reference types="tinycolor2" />
declare namespace Renderer {
    interface LayerImageLoader {
        loadImage(src: string, layer: CompositeLayer, successCallback: (src: string, layer: CompositeLayer, image: HTMLImageElement) => any, errorCallback: (src: string, layer: CompositeLayer, error: any) => any): any;
    }
    const DefaultImageLoader: LayerImageLoader;
    let ImageLoader: LayerImageLoader;
    interface RendererListener {
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
    let lastCall: any[] | undefined;
    /**
     * Last arguments to animateLayers
     */
    let lastAnimateCall: any[] | undefined;
    /**
     * Last result of animateLayers
     */
    let lastAnimation: AnimatingCanvas | undefined;
    function emptyLayerFilter(): CompositeLayerParams;
    /**
     * 0 -> "#000000", 0.5 -> "#808080", 1.0 -> "#FFFFFF"
     */
    function gray(value: number): string;
    function createCanvas(w: number, h: number, fill?: string): CanvasRenderingContext2D;
    /**
     * Creates a cutout of color in shape of sourceImage
     */
    function cutout(sourceImage: CanvasImageSource, color: string, canvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Cuts out from base a shape in form of stencil.
     * Modifies and returns base.
     */
    function cutoutFrom(base: CanvasRenderingContext2D, stencil: CanvasImageSource): CanvasRenderingContext2D;
    /**
     * Paints sourceImage over cutout of it filled with color.
     */
    function composeOverCutout(sourceImage: CanvasImageSource, color: string, blendMode?: string, canvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Paints sourceImage over same-sized canvas filled with color
     */
    function composeOverRect(sourceImage: CanvasImageSource, color: string, blendMode: string, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Paints over sourceImage a cutout of it filled with color.
     */
    function composeUnderCutout(sourceImage: CanvasImageSource, color: string, blendMode?: string, canvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Paints over sourceImage a same-sized canvas filled with color
     */
    function composeUnderRect(sourceImage: CanvasImageSource, color: string, blendMode?: string, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    let ImageCaches: {
        [index: string]: HTMLImageElement;
    };
    let ImageErrors: {
        [index: string]: boolean;
    };
    /**
     * Switch between compose(Over|Under)(Rect|Cutout)
     */
    function compose(composeOver: boolean, doCutout: boolean, sourceImage: CanvasImageSource, color: string, blendMode: string, targetCanvas?: CanvasRenderingContext2D): CanvasRenderingContext2D;
    /**
     * Fills properties in `target` from `source`.
     * If `overwrite` is false, only missing properties are copied.
     * In both cases, brightness is added, contrast is multiplied.
     * Returns target
     */
    function mergeLayerData(target: CompositeLayerSpec, source: CompositeLayerParams, overwrite?: boolean): CompositeLayerSpec;
    function encodeProcessing(spec: CompositeLayerSpec): string;
    function composeLayersAgain(): void;
    function desaturateImage(image: CanvasImageSource, resultCanvas?: CanvasRenderingContext2D, doCutout?: boolean): HTMLCanvasElement;
    function filterImage(image: CanvasImageSource, filter: string, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    function adjustBrightness(image: CanvasImageSource, brightness: number, resultCanvas?: CanvasRenderingContext2D, doCutout?: boolean): HTMLCanvasElement;
    function adjustLevels(image: CanvasImageSource, 
    /**
     * scale factor, 1 - no change, >1 - higher contrast, <1 - lower contrast.
     */
    factor: number, 
    /**
     * shift, 0 - no change, >0 - brighter, <0 - darker
     */
    shift: number, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    function adjustContrast(image: CanvasImageSource, factor: number, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    function adjustBrightnessAndContrast(image: CanvasImageSource, brightness: number, contrast: number, resultCanvas?: CanvasRenderingContext2D): HTMLCanvasElement;
    function processLayer(layer: CompositeLayer, listener: RendererListener): CanvasImageSource;
    function composeProcessedLayer(layer: CompositeLayer, targetCanvas: CanvasRenderingContext2D, frameCount?: number): void;
    function composeLayers(targetCanvas: CanvasRenderingContext2D, layerSpecs: CompositeLayerSpec[], frameCount: number, listener: RendererListener): void;
    interface AnimationInfo {
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
    interface AnimatingCanvas {
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
    function invalidateLayerCaches(layers: CompositeLayer[]): void;
    function animateLayersAgain(): any;
    function animateLayers(targetCanvas: CanvasRenderingContext2D, layerSpecs: CompositeLayerSpec[], animations: Dict<AnimationSpec>, listener: RendererListener, autoStop?: boolean): AnimatingCanvas;
    /**
     * Linear interpolation.
     *
     * f(0) = min,
     * f(1) = max.
     */
    function lint(value: number, min: number, max: number, allowOverflow?: boolean): number;
    function lintArray(value: number, mins: number[], maxes: number[], allowOverflow?: boolean): number[];
    function lintStaged(value: number, points: number[]): number;
    function lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance;
    function lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance;
}
interface Window {
    lint(value: number, min: number, max: number, allowOverflow?: boolean): number;
    lintArray(value: number, mins: number[], maxes: number[], allowOverflow?: boolean): number[];
    lintStaged(value: number, points: number[]): number;
    lintRgb(value: number, min: tinycolor.ColorInput, max: tinycolor.ColorInput): tinycolor.Instance;
    lintRgbStaged(value: number, points: tinycolor.ColorInput[]): tinycolor.Instance;
}
