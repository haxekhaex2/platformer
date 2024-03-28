import Platform from "./platform.js";
import Player from "./player.js";

var config = {
	type: Phaser.AUTO,
	width: 864,
	height: 480,
	backgroundColor: 0xffffff,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 2048},
			//debug: true
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};

/* Globals. */
let game = new Phaser.Game(config);
let grid;
export let input;
let platforms;
let player;

function preload(){
	/* Load images. */
	this.load.image("bug", "assets/bug.png");
	this.load.image("friend", "assets/friend.png");
	this.load.image("background", "assets/background.png");
	
	this.load.spritesheet("cube0", "assets/cube0.png", {frameWidth: 200, frameHeight: 200});
	this.load.spritesheet("cube1", "assets/cube1.png", {frameWidth: 200, frameHeight: 200});
	
	/* Load audio. */
	this.load.audio("jump", "assets/jump.wav");
	this.load.audio("land", "assets/land.wav");
}

function create(){
	/* Initialize animations. */
	this.anims.create({
		key: "cube0_default",
		frames: this.anims.generateFrameNumbers("cube0", {start: 0, end: 1}),
		frameRate: 4,
		repeat: -1
	});
	
	this.anims.create({
		key: "cube0_held",
		frames: this.anims.generateFrameNumbers("cube0", {start: 2, end: 3}),
		frameRate: 2,
		repeat: -1
	});
	
	this.anims.create({
		key: "cube1_default",
		frames: this.anims.generateFrameNumbers("cube1", {start: 0, end: 1}),
		frameRate: 4,
		repeat: -1
	});
	
	this.anims.create({
		key: "cube1_held",
		frames: this.anims.generateFrameNumbers("cube1", {start: 2, end: 3}),
		frameRate: 2,
		repeat: -1
	});
	
	/* Initialize input handler. */
	input = this.input.keyboard.addKeys({
		"SPACE": Phaser.Input.Keyboard.KeyCodes.SPACE,
		"SHIFT": Phaser.Input.Keyboard.KeyCodes.SHIFT,
		"W": Phaser.Input.Keyboard.KeyCodes.W,
		"A": Phaser.Input.Keyboard.KeyCodes.A,
		"S": Phaser.Input.Keyboard.KeyCodes.S,
		"D": Phaser.Input.Keyboard.KeyCodes.D
	});
	
	platforms = this.physics.add.group({
		allowDrag: false,
		allowGravity: false,
		allowRotation: false,
		immovable: true
	});
	
	
	/* Add background. */
	grid = this.add.grid(0, 0, 1000, 1000, 100, 100, 0x000000, 0, 0xff0000, 0);
	
	/* Create starting platform. */
	let startingPlatform = this.physics.add.staticImage(0, 200, "friend");
	startingPlatform.setSize(this.game.canvas.width, 200);
	startingPlatform.setDisplaySize(this.game.canvas.width, 200);
	
	/* Create platforms. */
	for(let index = 0; index < 100; index++){
		let platform = new Platform(this, Phaser.Math.Between(-this.game.canvas.width / 2, this.game.canvas.width / 2), index * -200);
		this.add.existing(platform);
		platforms.add(platform);
	}
	
	/* Create player. */
	player = new Player(this, 50, -100);
	this.add.existing(player);
}

function update(time, delta){
	this.physics.world.collide(this.children.getChildren(), null, null, (a, b) => {return a.collide?.(b) && b.collide?.(a);}, this);
	this.children.getChildren().forEach((element) => {element.update(time, delta);});
}
