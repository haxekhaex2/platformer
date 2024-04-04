import WorldScene from "./WorldScene.js";

var config = {
	type: Phaser.AUTO,
	width: 1280,
	height: 720,
	backgroundColor: 0xeeeeee,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 2048},
			debug: true
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
