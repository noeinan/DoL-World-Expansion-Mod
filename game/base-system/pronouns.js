App.Utils.Pronouns = class {

	constructor(npc) {
		this._pronouns = npc;
	}

	get he() { return this._pronouns.he; }
	get hers() { return this._pronouns.hers; }
	get his() { return this._pronouns.his; }
	get him() { return this._pronouns.him; }
	get himself() { return this._pronouns.himself; }
	get boy() { return this._pronouns.boy; }

	get He() { return capFirstChar(this.pronoun); }
	get Hers() { return capFirstChar(this.hers); }
	get His() { return capFirstChar(this.his); }
	get Him() { return capFirstChar(this.him); }
	get Himself() { return capFirstChar(this.himself); }
	get Boy() { return capFirstChar(this.boy); }

	get man() { return this.boy === "girl" ? "woman" : "man"; }
	get men() { return this.boy === "girl" ? "women" : "men"; }
	get shota() { return this.boy === "girl" ? "loli" : "shota"; }

	get Man() { return capFirstChar(this.man); }
	get Men() { return capFirstChar(this.men); }
	get Shota() { return capFirstChar(this.shota); }

	get son() { return this.boy === "b" ? "daughter" : "son"; }
	get Son() { return capFirstChar(this.son); }

	get brother() { return this.boy === "girl" ? "sister" : "brother"; }
	get Brother() { return capFirstChar(this.brother); }

	get husband() { return this.boy === "girl" ? "wife" : "husband"; }
	get Husband() { return capFirstChar(this.husband); }
	get husbands() { return this.boy === "girl" ? "wives" : "husbands"; }
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