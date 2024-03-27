var config = {
	type: Phaser.AUTO,
	width: 480,
	height: 864,
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
let background;
let grid;
let input;
let platforms;
let player;

function preload(){
	this.load.image("bug", "assets/bug.png");
	this.load.image("friend", "assets/friend.png");
	this.load.image("background", "assets/background.png");
}

function create(){
	input = this.input.keyboard.addKeys({
		"SPACE": Phaser.Input.Keyboard.KeyCodes.SPACE,
		"W":  Phaser.Input.Keyboard.KeyCodes.W,
		"A":  Phaser.Input.Keyboard.KeyCodes.A,
		"S": Phaser.Input.Keyboard.KeyCodes.S,
		"D": Phaser.Input.Keyboard.KeyCodes.D
	});
	
	platforms = this.physics.add.staticGroup();
	
	/* Add background. */
	background = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, "background");
	grid = this.add.grid(0, 0, 1000, 1000, 100, 100, 0x000000, 0, 0xff0000, 1);
	
	/* Create platforms. */
	let startingPlatform = platforms.create(0, 200, "friend");
	startingPlatform.setSize(this.game.canvas.width, 200);
	startingPlatform.setDisplaySize(this.game.canvas.width, 200);
	for(let index = 0; index < 100; index++){
		createPlatform(Phaser.Math.Between(-this.game.canvas.width / 2, this.game.canvas.width / 2), index * -100);
	}
	
	player = this.physics.add.sprite(50, 0, "bug");
	player.setDisplaySize(32, 32);
	this.physics.add.collider(player, platforms);
}

function update(time, delta){
	/* Camera and background movement. */
	this.cameras.main.setScroll(-this.game.canvas.width / 2, player.y - this.sys.game.canvas.height / 2);
	background.setTilePosition(this.cameras.main.scrollX, this.cameras.main.scrollY);	
	background.setPosition(this.cameras.main.scrollX + this.sys.game.canvas.width / 2, this.cameras.main.scrollY + this.sys.game.canvas.height / 2);
	grid.setPosition(Math.round(background.x / grid.cellWidth) * grid.cellWidth, Math.round(background.y / grid.cellHeight) * grid.cellHeight);
	
	/* Player input. */
	let direction = 0;
	if(input.A.isDown) direction -= 1;
	if(input.D.isDown) direction += 1;
	if(Phaser.Input.Keyboard.JustDown(input.SPACE) && player.body.touching.down) player.setVelocityY(-1024);
	if(input.S.isDown) player.setVelocityY(player.body.velocity.y + (delta / 1000) * 2048);
	player.setVelocityX(direction * 512);
	
	/* Keep player in bounds. */
}

/* Utility functions. */
function createPlatform(x, y){
	const PLATFORM_WIDTH = 200;
	const PLATFORM_HEIGHT = 20;
	let platform = platforms.create(x, y, "friend");
	platform.setSize(PLATFORM_WIDTH, PLATFORM_HEIGHT);
	platform.setDisplaySize(PLATFORM_WIDTH, PLATFORM_HEIGHT);
}
