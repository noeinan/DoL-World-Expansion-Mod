
window.Dynamic = window.Dynamic || {};

/**
 * Re-renders all dynamic elements in the current passage
 */
Dynamic.render = () => {
	Object.entries(Dynamic.liveIds).forEach(([id, content]) => {
		Dynamic.renderAt(id, content);
	});
	Links.generate();
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
	setTimeout(() => Dynamic.renderAt(id, content), 0);
	return id;
}
/** 
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
 */
Dynamic.eventBinder = (...valuesToInject) => {
	const id = Dynamic.getNewId();
	setTimeout(() => {
		const elm = document.getElementById(id);
		Dynamic.bindEvents(elm, ...valuesToInject)
	})
	return id;
}

/** #####################################################
 * Dynamic tools (you probably don't need to use these) 
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
		new SugarCube.Wikifier(elm, content);
	}
}
const SUGARCUBE_IDENTIFIER = /(.*?)\$([A-Za-z0-9_]+)/g;
Dynamic.bindEvents = (elm, ...valuesToInject) => {
	if (elm.onclick) {
		const handler = elm.onclick.toString();
		let handlerContents = handler.slice(handler.search(/\{/g) + 1, handler.length - 1);
		SUGARCUBE_IDENTIFIER.lastIndex = 0;
		let lastMatch = SUGARCUBE_IDENTIFIER.exec(handlerContents);
		while (lastMatch) {
			const newContent = `SugarCube.State.variables.${lastMatch[2]}`;
			handlerContents = lastMatch[1] + newContent
				+ handlerContents.slice(SUGARCUBE_IDENTIFIER.lastIndex)
			SUGARCUBE_IDENTIFIER.lastIndex = lastMatch.index + newContent.length;
			lastMatch = SUGARCUBE_IDENTIFIER.exec(handlerContents);
		}
		const newHandler = new Function(`return (${handlerContents})`)()
		elm.onclick = () => {
			newHandler(...valuesToInject); Dynamic.render();
		}
	}
}
