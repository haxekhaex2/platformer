import Entity from "/Entity.js";

export default class Background extends Entity{
	constructor(scene, width, height, animation, parallax, depth){
		super(scene, 0, 0);
		scene.physics.world.enableBody(this);
		
		this.tileWidth = width;
		this.tileHeight = height;
		this.animation = animation;
		this.parallax = parallax;
		this.depth = depth;
		this.tileSprite = new Phaser.GameObjects.TileSprite(scene, 0, 0, this.scene.cameras.main.width * 1.5, this.scene.cameras.main.height * 1.5, animation);
		this.tileSprite.setDepth(depth);
		
		scene.add.existing(this.tileSprite);
	}
	
	update(time, delta){
		super.update(time, delta);
		let camera = this.scene.cameras.main;
		let point = camera.getWorldPoint(camera.x, camera.y);
		this.tileSprite.setTilePosition((this.tileSprite.x - point.x) * camera.width / camera.displayWidth, (this.tileSprite.y - point.y) * camera.height / camera.displayHeight);
		this.tileSprite.setScale(camera.displayWidth / camera.width, camera.displayHeight / camera.height);
		this.tileSprite.setPosition(point.x + camera.displayWidth / 2, point.y + camera.displayHeight / 2);
		//this.tileSprite.setTileScale(this.tileWidth / this.tileSprite.frame.width, this.tileHeight / this.tileSprite.frame.height);
		console.log(this.tileWidth / this.tileSprite.frame.width * this.tileSprite.frame.width);
	}
	
	serialize(){
		return {
			path: "/Background.js",
			data: {
				tileWidth: this.tileWidth,
				tileHeight: this.tileHeight,
				animation: this.animation,
				parallax: this.parallax,
				depth: this.depth
			}
		};
	}
	
	static deserialize(scene, data){
		return new Background(scene, data.tileWidth, data.tileHeight, data.animation, data.parallax, data.depth);
	}
}
