import Platform from "./Platform.js";
import BouncyPlatform from "./BouncyPlatform.js";
import Player from "./Player.js";

export let input;
let player;

export default class WorldScene extends Phaser.Scene{
	preload(){
		/* Load images. */
		this.load.image("bug", "assets/bug.png");
		this.load.image("friend", "assets/friend.png");
		this.load.image("background", "assets/background.png");
		
		this.load.spritesheet("cube0", "assets/cube0.png", {frameWidth: 200, frameHeight: 200});
		this.load.spritesheet("cube1", "assets/cube1.png", {frameWidth: 200, frameHeight: 200});
		
		/* Load audio. */
		this.load.audio("jump", "assets/jump.wav");
		this.load.audio("land", "assets/land.wav");
		this.load.audio("boing", "assets/boing.wav");
	}

	create(){
		/* Initialize input handler. */
		input = this.input.keyboard.addKeys({
			"SPACE": Phaser.Input.Keyboard.KeyCodes.SPACE,
			"SHIFT": Phaser.Input.Keyboard.KeyCodes.SHIFT,
			"W": Phaser.Input.Keyboard.KeyCodes.W,
			"A": Phaser.Input.Keyboard.KeyCodes.A,
			"S": Phaser.Input.Keyboard.KeyCodes.S,
			"D": Phaser.Input.Keyboard.KeyCodes.D
		});
		
		/* Create starting platform. */
		let startingPlatform = this.physics.add.staticImage(0, 200, "friend");
		startingPlatform.setSize(this.game.canvas.width, 200);
		startingPlatform.setDisplaySize(this.game.canvas.width, 200);
		
		/* Create player. */
		player = new Player(this, 50, -100);
		this.add.existing(player);
	}

	update(time, delta){
		this.physics.world.collide(this.physics.world.bodies.entries.concat(this.physics.world.staticBodies.entries).reduce((acc, current) => {
			if(current.gameObject && current.enable) acc.push(current.gameObject);
			return acc;
		}, new Array()), null, (a, b) => {
			a.onCollide?.(b);
			b.onCollide?.(a);
		}, (a, b) => {
			let ac = a.onOverlap ? a.onOverlap(b) : true;
			let bc = b.onOverlap ? b.onOverlap(a) : true;
			return ac && bc;
		}, this);
		this.children.getChildren().forEach((element) => {element.update(time, delta);});
	}
	
	/* Deserialize all entities into world from text. */
	async loadWorld(text){
		let modules = new Map();
		let array = JSON.parse(text);
		
		for(let element of array){
			if(!modules.has(element.path)) modules.set(element.path, await import(element.path));
			this.add.existing(modules.get(element.path).default.deserialize(this, element.data));
		}
	}
	
	/* Return a text representation of all serializable entities. */
	saveWorld(){
		return JSON.stringify(this.children.getChildren().reduce((accumulator, element) => {
			if(element.serialize) accumulator.push(element.serialize(element));
			else console.warn(element.constructor.name + " is not serializable!");
			return accumulator;
		}, new Array()), null, "\t");
	}
}
