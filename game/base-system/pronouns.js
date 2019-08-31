App.Utils.Pronouns = class {

	constructor(npc) {
		this._pronouns = npc;
	}

	get pronoun() { return this._pronouns.pronoun; }
	get possessivePronoun() { return this._pronouns.possessivePronoun; }
	get possessive() { return this._pronouns.possessive; }
	get object() { return this._pronouns.object; }
	get objectReflexive() { return this._pronouns.objectReflexive; }
	get noun() { return this._pronouns.noun; }

	get Pronoun() { return capFirstChar(this.pronoun); }
	get PossessivePronoun() { return capFirstChar(this.possessivePronoun); }
	get Possessive() { return capFirstChar(this.possessive); }
	get Object() { return capFirstChar(this.object); }
	get ObjectReflexive() { return capFirstChar(this.objectReflexive); }
	get Noun() { return capFirstChar(this.noun); }

	get he() { return this.pronoun; }
	get him() { return this.object; }
	get his() { return this.possessive; }
	get himself() { return this.objectReflexive; }
	get boy() { return this.noun; }

	get He() { return this.Pronoun; }
	get Him() { return this.Object; }
	get His() { return this.Possessive; }
	get Himself() { return this.ObjectReflexive; }
	get Boy() { return this.Noun; }

	get man() { return this.noun === "girl" ? "woman" : "man"; }
	get men() { return this.noun === "girl" ? "women" : "men"; }
	get shota() { return this.noun === "girl" ? "loli" : "shota"; }

	get Man() { return capFirstChar(this.man); }
	get Men() { return capFirstChar(this.men); }
	get Shota() { return capFirstChar(this.shota); }

	get son() { return this.noun === "girl" ? "daughter" : "son"; }
	get Son() { return capFirstChar(this.son); }

	get brother() { return this.noun === "girl" ? "sister" : "brother"; }
	get Brother() { return capFirstChar(this.brother); }

	get husband() { return this.noun === "girl" ? "wife" : "husband"; }
	get Husband() { return capFirstChar(this.husband); }
	get husbands() { return this.noun === "girl" ? "wives" : "husbands"; }
	get Husbands() { return capFirstChar(this.husbands); }

};
window.getPronouns = function(obj) {
	return new App.Utils.Pronouns(obj);
};
App.Utils.setLocalPronouns = function(npc, suffix, pronouns) {
	const ps = getPronouns(npc);
	/** @type {string} */
	const pSuffix = suffix !== undefined ? suffix.toString() : '';
	pronouns = pronouns || [ // Object.getOwnPropertyNames(ps) ?
		'he', 'him', 'his', 'himself', 'boy',
		'He', 'Him', 'His', 'Himself', 'Boy',
		'man', 'men', 'shota', 'son', 'brother', 'husband', 'husbands',
		'Men', 'Man', 'Shota', 'Son', 'Brother', 'Husband', 'Husbands',
		'she', 'her', 'hers', 'herself', 'girl',
		'She', 'Her', 'Hers', 'Herself', 'Girl',
		'woman', 'women', 'loli', 'daughter', 'sister', 'wife', 'wives',
		'Woman', 'Women', 'Loli', 'Daughter', 'Sister', 'Wife', 'Wives'
	];

	const scope = pSuffix.length === 0 ? State.variables : State.temporary;
	pronouns.forEach(p => {
		scope[p + pSuffix] = ps[p];
	});
};