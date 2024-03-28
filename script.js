import Platform from "./platform.js";

var config = {
	type: Phaser.AUTO,
	width: 480,
	height: 864,
	backgroundColor: 0xffffff,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 2048},
			debug: true
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
let input;
let platforms;
let player;

function preload(){
	/* Load images. */
	this.load.image("bug", "assets/bug.png");
	this.load.image("friend", "assets/friend.png");
	this.load.image("background", "assets/background.png");
	
	this.load.spritesheet("cube0", "assets/cube0.png", {frameWidth: 200, frameHeight: 200}); 
	
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
	
	/* Initialize input handler. */
	input = this.input.keyboard.addKeys({
		"SPACE": Phaser.Input.Keyboard.KeyCodes.SPACE,
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
		platforms.add(platform);
	}
	
	/* Create player. */
	player = this.physics.add.sprite(50, 0, "bug");
	player.setDisplaySize(32, 32);
	this.physics.add.collider(player, startingPlatform);
	this.physics.add.collider(player, platforms, null, platformCollision, this);
}

function update(time, delta){
	/* Camera and background movement. */
	this.cameras.main.setScroll(-this.game.canvas.width / 2, player.y - this.sys.game.canvas.height / 2);
	
	/* Player input. */
	let direction = 0;
	if(input.A.isDown) direction -= 1;
	if(input.D.isDown) direction += 1;
	if(input.S.isDown) player.setVelocityY(player.body.velocity.y + (delta / 1000) * 4096);
	player.setVelocityX(direction * 512);
	
	if(Phaser.Input.Keyboard.JustDown(input.SPACE) && player.body.touching.down){
		player.setVelocityY(-1024);
		this.sound.play("jump");
	}
}

function platformCollision(player, platform){
	return(player.body.velocity.y > 0 && ! input.S.isDown);
}
