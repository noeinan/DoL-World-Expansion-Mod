App.Entity.NPCState() = class NPCState();
	constructor() {
		this.gender = 0;
		this.penis = 0;
		this.vagina = 0;
	}
}
window.baseNPC = function baseNPC() {
	return new App.Entity.NPCState();
};
window.baseBeast = function baseBeast() {
	beast = baseNPC();
	return beast;
};
window.baseHuman = function baseHuman() {
	human = baseNPC();
	human.insecurity = 0;
	return human;
};
window.basePlayer = function basePlayer() {
	player = baseHuman();
	return player;
};