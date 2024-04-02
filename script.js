import WorldScene from "./WorldScene.js";

var config = {
	type: Phaser.AUTO,
	width: 864,
	height: 480,
	backgroundColor: 0xffffff,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 2048},
		}
	},
	scene: window.world = new WorldScene(),
	render: {
		antialias: false
	}
};

/* Globals. */
let game = new Phaser.Game(config);
window.game = game;

(async function fucker(){
	let map = new Map();
	let foo = await import("./Platform.js");
	let bar = await import("./Platform.js");
	map.set("foo", foo);
	map.set("bar", bar);
	console.dir(foo === bar);
})();
