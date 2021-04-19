/*
 * Usage:
 *
 * 1. Registering events - should be done in [widget]-tagged passage!
 * <<registerevent EVENT_NAME>>
 *   (Event content)
 * <</registerevent>>
 * 
 * 2. Calling events
 * 
 * <<cleareventpool>>
 * <<addevent NAME [WEIGHT]>>
 * <<addevent[NAME [WEIGHT]>>
 * <<runeventpool>> 
 * - will pick a weighted random event and execute its content
 */

/**
 * Return a weighted random item, that is, probability of each item is proportional to their weight,
 * P(x_i) = weight_i / sum_of_weights
 * 
 * items - array of objects with optional 'weight' key - a number or a no-arg function returning number. Default 1.
 * Weight of Infinity means "return this item, ignore others"
 */
function rollWeightedRandomFromArray(items) {
    if (!Array.isArray(items)) throw new Error("Not an array: " + items);
    // convert items to array of {weight:number, item:original_item} and filter out bad elements
    items = items.map(function (el) {
        if (!el || typeof el !== 'object') return null;
        var w = el.weight;
        if (typeof w === 'function') w = w();
        if (typeof w === 'string') w = parseFloat(w);
        if (typeof w !== 'number') w = 1;
        return { weight: w, item: el };
    }).filter(function (el) {
        if (!el || !(el.weight > 0)) {
            if (StartConfig.debug) {
                console.debug("Filtered out ",el);
            }
            return false;
        }
        return true;
    });
    if (StartConfig.debug) {
        console.debug("Picking from random pool",items);
    }
    if (items.length == 0) return null; // Or could throw an exception (no items with positive weight)
    var sum = 0;
    for (var i = 0; i < items.length; i++) {
        if (!isFinite(items[i].weight)) {
            if (StartConfig.debug) {
                console.debug("Returning infinite-weighted",items[i].item);
            }
            return items[i].item;
        }
        sum += items[i].weight;
    }
    var roll = randomFloat(sum), roll0 = roll;
    for (i = 0; i < items.length; i++) {
        roll -= items[i].weight;
        if (roll <= 0) {
            if (StartConfig.debug) {
                console.debug("Roll = ",roll0,"sum = ",sum,"returning ",items[i].item);
            }        
            return items[i].item;
        }
    }
    // Should never happen
    console.warn('Weighted random math went wrong', roll0, sum, items);
    return items[0].item;
}

var EventLib = {};
Macro.add("registerevent", {
    tags: null,
    handler: function () {
        var name = this.args[0];
        if (this.args.length !== 1 || typeof name !== 'string') {
            throw new Error("Invalid registerevent argumens: "+JSON.stringify(this.args));
        }
        if (name in EventLib) console.warn("Duplicate event name '"+name,"' will be overwritten")
        EventLib[name] = this.payload[0].contents;
    }
});


Macro.add("cleareventpool", {
    skipArgs: true,
    handler: function () {
        State.temporary.eventpool = [];
    }
});

Macro.add("addevent", {
    handler: function () {
        var name = this.args[0];
        if (this.args.length < 1 || this.args.length > 2 || typeof name !== 'string') {
            throw new Error("Invalid addevent arguments: "+JSON.stringify(this.args));
        }
        var event = EventLib[name];
        if (!event) {
            throw new Error("Unknown event '"+name+"'");
        }
        State.temporary.eventpool.push({
            name: name,
            weight: this.args.length == 2 ? this.args[1] : 1.0,
            content: event
        });
    }
});

Macro.add("runeventpool", {
    skipArgs: true,
    handler: function () {
        var pick = rollWeightedRandomFromArray(State.temporary.eventpool);
        if (!pick) throw new Error("Event pool is empty");
        jQuery(this.output).wiki(pick.content);
    }
});

