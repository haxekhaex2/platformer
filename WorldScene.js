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
		this.load.spritesheet("idle", "assets/idle.png", {frameWidth: 500, frameHeight: 1000});
		this.load.spritesheet("run", "assets/run.png", {frameWidth: 500, frameHeight: 1000});
		this.load.spritesheet("rise", "assets/rise.png", {frameWidth: 500, frameHeight: 1000});
		this.load.spritesheet("fall", "assets/fall.png", {frameWidth: 500, frameHeight: 1000});
		
		/* Load audio. */
		this.load.audio("jump", "assets/jump.wav");
		this.load.audio("land", "assets/land.wav");
		this.load.audio("boing", "assets/boing.wav");
		
		this.input.on("pointerup", (pointer) => {
			let point = world.cameras.main.getWorldPoint(pointer.x, pointer.y);
			this.processClick(point.x, point.y);
		});
	}

	create(){
		/* Initialize input handler. */
		input = this.input.keyboard.addKeys({
			"SPACE": Phaser.Input.Keyboard.KeyCodes.SPACE,
			"SHIFT": Phaser.Input.Keyboard.KeyCodes.SHIFT,
			"W": Phaser.Input.Keyboard.KeyCodes.W,
			"A": Phaser.Input.Keyboard.KeyCodes.A,
			"S": Phaser.Input.Keyboard.KeyCodes.S,
			"D": Phaser.Input.Keyboard.KeyCodes.D,
			"[": Phaser.Input.Keyboard.KeyCodes.OPEN_BRACKET,
			"]": Phaser.Input.Keyboard.KeyCodes.CLOSED_BRACKET
		}, false);
		
		/* Create starting platform. */
		let startingPlatform = this.physics.add.image(0, 200, "friend");
		startingPlatform.setDisplaySize(this.game.canvas.width, 200);
		startingPlatform.body.immovable = true;
		startingPlatform.body.moves = false;
		
		/* Create player. */
		player = new Player(this, 50, -200);
		this.add.existing(player);
		window.player = player;
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
		
		if(Phaser.Input.Keyboard.JustDown(input["["])) this.cameras.main.setZoom(this.cameras.main.zoom * .5);
		if(Phaser.Input.Keyboard.JustDown(input["]"])) this.cameras.main.setZoom(this.cameras.main.zoom * 2);
	}
	
	async loadPrefab(text){
		let prefab = JSON.parse(text);
		let module = await import(prefab.path);
		let object = module.default.deserialize(this, prefab.data);
		this.add.existing(object);
		return object;
	}
	
	/* Deserialize all entities into world from text. */
	async loadWorld(text){
		let modules = new Map();
		let array = JSON.parse(text);
		let gameObjects = new Array();
		
		for(let element of array){
			if(!modules.has(element.path)) modules.set(element.path, await import(element.path));
			let gameObject = modules.get(element.path).default.deserialize(this, element.data);
			gameObjects.push(gameObject);
			this.add.existing(gameObject);
		}
		
		return gameObjects;
	}
	
	/* Return a text representation of all serializable entities. */
	saveWorld(){
		return JSON.stringify(this.children.getChildren().reduce((accumulator, element) => {
			if(element.serialize) accumulator.push(element.serialize(element));
			else console.warn(element.constructor.name + " is not serializable!");
			return accumulator;
		}, new Array()), null, "\t");
	}
	
	processClick(worldx, worldy){
		let point = {x: worldx, y: worldy};
		this.add.rectangle(point.x, point.y, 4, 4, 0xff0000, 1);
		switch(document.getElementById("spawnMode").value){
			case "spawn":
				let spawnData = document.getElementById("spawnData").value;
				window.world.loadPrefab(spawnData).then((object) => {
					object.setPosition(point.x, point.y);
					object.move(point.x, point.y);
				});
				break;
			case "delete":
				world.children.getChildren().forEach((element) => {
					if(element.body){
						if(point.x >= element.body.x){
							if(point.y >= element.body.y){
								if(point.x <= element.body.x + element.body.width){
									if(point.y <= element.body.y + element.body.height){
										element.destroy();
									}
								}
							}
						}
					}
				});
		}
	}
}
