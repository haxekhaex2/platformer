import Entity from "/Entity.js";

export default class Background extends Entity{
	constructor(scene){
		super(scene, 0, 0);
		scene.physics.world.enableBody(this);
		this.proportion(32, 32, 0, 0, 1, 1, "friend");
		
		this.tileSprite = new Phaser.GameObjects.TileSprite(scene, 50, 50, 200, 200, "friend");	
		scene.add.existing(this.tileSprite);
		console.log("FOO");
	}
	
	update(time, delta){
		super.update(time, delta);
		let camera = this.scene.cameras.main;
		let point = camera.getWorldPoint(camera.x, camera.y);
		this.tileSprite.setTilePosition(point.x, point.y);
	}
	
	serialize(object){
		return {
			path: "/Background.js",
			data: {
			}
		};
	}
	
	static deserialize(scene, data){
		return new Background(scene);
	}
}
