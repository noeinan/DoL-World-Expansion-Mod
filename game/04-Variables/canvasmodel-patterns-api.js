/**
 * GeneratedPattern = (options:object)=>CanvasImageSource
 */
Renderer.GeneratedPatterns = {};

function registerGeneratedPattern(name, generator) {
	Renderer.GeneratedPatterns[name] = generator;
}

function registerImagePattern(name, src) {
	let image = new Image();
	image.onload = function() {
		Renderer.Patterns[name] = Renderer.globalC2D.createPattern(image, "repeat")
	};
	image.src = src;
}


Renderer.PatternProvider = function (spec) {
	// Return named pattern
	if (typeof spec === "string") return Renderer.Patterns[spec]

	// Indexed patterns
	if (spec.type in Renderer.GeneratedPatterns) {
		let image = Renderer.GeneratedPatterns[spec.type](spec);
		return Renderer.globalC2D.createPattern(image, "repeat");
	}

	// Unknown pattern
	console.warn("Unknown pattern spec "+JSON.stringify(spec));
	return null;
}

