Config.history.controls = false;

Config.history.maxStates = 1;

State.initPRNG();

window.versionUpdateCheck = true;

Config.saves.onLoad = function (save) {
  window.versionUpdateCheck = true;
}

Config.saves.onSave = function (save) {
  new Wikifier(null, '<<updateFeats>>');
}

/*LinkNumberify and images will enable or disable the feature completely*/
/*debug will enable or disable the feature only for new games*/
window.StartConfig = {
	"debug": false,
	"enableImages": true,
	"enableLinkNumberify": true,
	"version": "0.2.11.1",
}

config.saves.autosave = "autosave";

Config.saves.isAllowed = function () {
  if (tags().contains("nosave")) {
    return false;
  }
  return true;
};

importStyles("style.css")
.then(function () {
  console.log("External Style Sheet Active")
})
.catch(function (err) {
  console.log("External Style Sheet Missing");
});

console.log("Game Version:", StartConfig.version);

l10nStrings.errorTitle = StartConfig.version + " Error";

/**
 * Not a configuration, but we are overriding a basic part of sugarcube
 * 
 * Provides a magic variable `$_` that creates a custom scope for the current
 * widget invocation
 * 
 * NOTE: we basically steal sugarcube code as code reuse is more difficult 
 * than it's worth in this instance. Be advised that updating sugarcube
 * may break this
 */
const VIRTUAL_CURRENT = "_";
const VIRTUAL_STACK = "VIRTUAL_STACK"
function widgetHandler(widgetName, contents) {
  let argsCache;
  return function () {
    // Custom code
    const newFrame = {};
    State.variables[VIRTUAL_STACK] = State.variables[VIRTUAL_STACK] || []
    State.variables[VIRTUAL_STACK].push(newFrame);
    State.variables[VIRTUAL_CURRENT] = newFrame;
    // End custom code


    // Cache the existing value of the `$args` variable, if necessary.
    if (State.variables.hasOwnProperty('args')) {
      argsCache = State.variables.args;
    }
    State.variables.args = [...this.args];
    State.variables.args.raw = this.args.raw;
    State.variables.args.full = this.args.full;
    this.addShadow('$args');

    try {
      // Set up the error trapping variables.
      const resFrag = document.createDocumentFragment();
      const errList = [];

      // Wikify the widget contents.
      new Wikifier(resFrag, contents);

      // Carry over the output, unless there were errors.
      Array.from(resFrag.querySelectorAll('.error')).forEach(errEl => {
        errList.push(errEl.textContent);
      });

      if (errList.length === 0) {
        this.output.appendChild(resFrag);
      }
      else {
        console.error(`Error rendering widget ${widgetName}`, errList);
        return this.error(`error${errList.length > 1 ? 's' : ''} within widget contents (${errList.join('; ')})`);
      }
    }
    catch (ex) {
      console.error(`Error executing widget ${widgetName}`, ex);
      return this.error(`cannot execute widget: ${ex.message}`);
    }
    finally {
      // Custom code
      State.variables[VIRTUAL_STACK].pop();
      State.variables[VIRTUAL_CURRENT] = State.variables[VIRTUAL_STACK][State.variables[VIRTUAL_STACK].length - 1]
      // End custom code
      if (typeof argsCache !== 'undefined') {
        State.variables.args = argsCache;
      }
      else {
        delete State.variables.args;
      }
    }
  };
}
Macro.delete('widget');
Macro.add('widget', {
  tags : null,

  handler() {
    if (this.args.length === 0) {
      return this.error('no widget name specified');
    }

    const widgetName = this.args[0];

    if (Macro.has(widgetName)) {
      if (!Macro.get(widgetName).isWidget) {
        return this.error(`cannot clobber existing macro "${widgetName}"`);
      }

      // Delete the existing widget.
      Macro.delete(widgetName);
    }

    try {
      Macro.add(widgetName, {
        isWidget : true,
        handler  : widgetHandler(widgetName, this.payload[0].contents)
      });

      // Custom debug view setup.
      if (Config.debug) {
        this.createDebugView(
          this.name,
          `${this.source + this.payload[0].contents}<</${this.name}>>`
        );
      }
    }
    catch (ex) {
      return this.error(`cannot create widget macro "${widgetName}": ${ex.message}`);
    }
  }
});
