window.Dynamic = window.Dynamic || {};

/**
 * Re-renders all dynamic elements in the current passage
 */
Dynamic.render = () => {
	Object.entries(Dynamic.liveIds).forEach(([id, content]) => {
		Dynamic.task(() => Dynamic.renderAt(id, content), `Dynamic.renderAt(${id}, ${content})`);
	});
	Dynamic.task(() => Links.generate(), `Links.generate()`);
	Dynamic.processTasks();
}

/**
 * Dynamic.eventBinder
 *
 * Will cause events on the bound element to re-render dynamic elements on the current passage.
 * Also allows you to immediately evaluate SugarCube variables, and use those value in the event handler
 * (manual string concat is no longer required)
 *
 * Note: currently only supports onclick events.
 * Note: events must *not* use the `@` notation. If you need to use it, then don't use this
 * Note: `@id="Dynamic.eventBinder()"` is required, even if not injecting values
 *
 * Example usage:
 *
 * <div
 * 	@id="Dynamic.eventBinder(_valueToBeInjected1, $anotherVar)"
 * 	onclick="(injectedValue1, injectedValue2) => { $var1 = injectedValue1; $var2 = injectedValue2; }"
 * ></div>"
 *
 * As the eventBinder is slightly complex, let me explain the issues with *not* using a utility like eventBinder.
 *
 * #### Without eventBinder
 *
 * Even in the simplest case, using something like `@onclick="$var=1; Dynamic.render()"` does not perform as expected (nor does the non-`@` version). In order to correctly reference `$var`, you must either refer to `SugarCube.State.variables.var` in the literal `onclick=` handler, OR build an explicit string version using `@onclick=`. For reference, the `@onclick=` version is as follows
 * ```@onclick="return 'SugarCube.State.variables.var=1; Dynamic.render()'"```
 *
 * The reason one might need to use the `@onclick` version is, some variables (for example, temporary ones) may not be available or overwritten when the click is evaluated. For example, if instead we wanted `$var = _myName`, in order to express this, we'd have to do:
 * ```@onclick="return 'SugarCube.State.variables.var=\'' + _myName + '\'; Dynamic.render()'"```
 *
 * This is both error prone and difficult to read (missing one of the `'` will result in an error, as will adding an extra `'`).
 *
 * #### With eventBinder
 *
 * With event binder, we allow users to naturally write events, without having to build strings.
 *
 * For the above example, we write:
 * ```onclick="(myName) => $var = myName"```
 * Note that `Dynamic.render()` will automatically be invoked after handling the value.
 *
 * For those unfamiliar with ES6, we could alternatively write this as...
 * ```onclick="function doit(myName) { $var = myName; }"```
 *
 * In order to correctly bind `myName` (the function argument) to `_myName` the SugarCube value, we use the `Dynamic.eventBinder` utility, which is used by assigning to the `id` attribute.
 * ```@id="Dynamic.eventBinder(_myName)"```
 *
 * Note that multiple arguments may be passed. Their values will be supplied to the event handler in the same order.
 * ```@id="Dynamic.eventBinder(_var1, _var3, _var2)" onclick="(var1, var3, var2) => ..."```
 */
Dynamic.eventBinder = (...valuesToInject) => {
	return Dynamic.eventBinderWithId(Dynamic.getNewId(), ...valuesToInject);
}
Dynamic.eventBinderWithId = (id, ...valuesToInject) => {
	/** We must let SugarCube finish rendering. Our element won't exist yet */
	Dynamic.task(() => {
		const elm = document.getElementById(id);
		if (!elm) {
			console.warn(`Unable to find Dynamic id ${id} on page. Page maybe rendered incorrectly`);
		} else {
			Dynamic.bindEvents(elm, {}, valuesToInject)
		}
	}, `Dynamic.bindEvents(${id}, {}, ${JSON.stringify(valuesToInject)})`)
	return id;
}

/**
 * Underlying implementation of the <<dynamic>> widget. You probably want to use that instead.
 * Slightly more powerful in that any arbitrary sugarcube content is allowed.
 *
 * Usage: <div id="Dynamic.bind('Any sugarcube content can go here, and will be manually be evaluated. <<myDynamicContent>>')></div>"
 */
Dynamic.bind = (content, customId) => {
	const id = customId || Dynamic.getNewId();
	Dynamic.bindTo(id, content);
	Dynamic.task(() => Dynamic.renderAt(id, content), `Dynamic.renderAt(${id}, ${content})`);
	return id;
}

/** ################
 * Sugarcube lifecycle
 */
$(document).on(':passageinit', function (ev) {
	// cleanup existing IDs and usages before we start rendering the next passage
	Dynamic.dispose();
	Dynamic.stage = Dynamic.Stage.SugarCubeRender;
});
$(document).on(':passagedisplay', function (ev) {
	Dynamic.processTasks();
});

/** ################
 * Dynamic lifecycle
 */
Dynamic.Stage = {
	Settled: 'Settled',
	UpdateQueued: 'UpdateQueued',
	SugarCubeRender: 'SugarCubeRender',
};
Dynamic.stage = Dynamic.Stage.Rendering;
Dynamic.tasks = [];

Dynamic.MAX_IN_LOOP_TASKS = 1000000;
Dynamic.processTasks = () => {
	const errors = [];
	let inLoopTasks = 0;
	while (Dynamic.tasks.length > 0) {
		Dynamic.stage = Dynamic.Stage.UpdateQueued;
		const task = Dynamic.tasks.pop()
		try {
			task()
		} catch (e) {
			errors.push([task, e]);
		}

		if (inLoopTasks++ > Dynamic.MAX_IN_LOOP_TASKS) {
			console.error(`Too many dynamic tasks, likely an infinite recursion occurred. Quitting.`);
			break;
		}
	}
	Dynamic.stage = Dynamic.Stage.Settled;
	if (errors.length) {
		console.warn(`Encountered errors while finishing a Dynamic render:`, errors.map(([task, error]) => {
			return [task.toString(), error]
		}))
	}
}
Dynamic.task = (fn, name) => {
	fn.toString = () => name;
	if (Dynamic.stage === Dynamic.Stage.Settled) {
		try {
			fn()
		} catch (e) {
			console.warn(`Encountered a unexpected critical error while performing a dynamic render task`, fn.toString(), e);
		}
	} else {
		Dynamic.tasks.push(fn);
	}
}

/** ############################################################
 * Dynamic internal tools (you probably don't need to use these)
 */

Dynamic.nextGlobalId = 0
Dynamic.liveIds = {}
Dynamic.getNewId = () => `dynamic-${Dynamic.nextGlobalId++}`
/** Used to cleanup ids. Should be called occasionally, when confident that no ids are currently in use (ideally between passages) */
Dynamic.dispose = () => { Dynamic.liveIds = {}; Dynamic.nextGlobalId = 0; }
Dynamic.bindTo = (id, content) => {
	Dynamic.liveIds[id] = content;
}
Dynamic.renderAt = (id, content) => {
	const elm = document.getElementById(id);
	if (elm) {
		while (elm.hasChildNodes()) { elm.removeChild(elm.lastChild); }
		const priorStage = Dynamic.stage;
		Dynamic.stage = Dynamic.Stage.SugarCubeRender;
		new Wikifier(elm, content);
		Dynamic.stage = priorStage;
	} else {
		console.warn(`Unable to locate element {#${id}} for rendering content:`, content);
	}
}
const SUGARCUBE_IDENTIFIER = /(.*?)\$([A-Za-z0-9_]+)(.*)/g;
const LITERAL_EVENTS = Object.getOwnPropertyNames(window)
	.filter(g => g.startsWith("HTML"))
	.map(k => window[k])
	.map(c => Object.getOwnPropertyNames(c.prototype).filter(p => p.startsWith("on")))
	.reduce((acc, n) => new Set([...acc].concat(n)), [])
Dynamic.bindEvents = (elm, options, valuesToInject) => {
	const handlersToBind = options.customHandlers ? [...options.customHandlers, ...LITERAL_EVENTS] : LITERAL_EVENTS;
	handlersToBind.forEach(handlerName => {
		if (elm[handlerName]) {
			elm[handlerName] = Dynamic.createBoundHandler(elm[handlerName], ...valuesToInject);
		}
	});
}
Dynamic.createBoundHandler = (sourceHandler, ...valuesToInject) => {
	const handlerText = sourceHandler.toString();
	let handlerContents, lastMatch;
	try {
		handlerContents = handlerText.slice(handlerText.search(/\{/) + 1, handlerText.length - 1);
		SUGARCUBE_IDENTIFIER.lastIndex = 0;
		lastMatch = SUGARCUBE_IDENTIFIER.exec(handlerContents);
		while (lastMatch) {
			const newContent = `SugarCube.State.variables.${lastMatch[2]}`;
			handlerContents = handlerContents.slice(0, lastMatch.index) + lastMatch[1] + newContent + lastMatch[3]
			SUGARCUBE_IDENTIFIER.lastIndex = lastMatch.index + lastMatch[1].length + newContent.length;
			lastMatch = SUGARCUBE_IDENTIFIER.exec(handlerContents);
		}
		const newHandler = new Function(`return (${handlerContents})`)()
		return () => {
			newHandler(...valuesToInject); Dynamic.render();
		}
	} catch (e) {
		console.error(
			`Failed to create bound handler from raw handler:`, handlerText,
			`\nLast contents / match:`, handlerContents, lastMatch,
			`\nError encountered:`, e
		);
		throw e;
	}
}
