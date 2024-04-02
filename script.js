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
