const PLATFORM_WIDTH = 200;
const PLATFORM_HEIGHT = 20;
const CUBE_WIDTH = 200;
const CUBE_HEIGHT = 200;

export default class Platform extends Phaser.Physics.Arcade.Sprite{
	constructor(scene, x, y){
		super(scene, x, y, "cube0");
		scene.physics.world.enableBody(this);
		this.setSize(PLATFORM_WIDTH, PLATFORM_HEIGHT);
		this.setOffset(0, CUBE_HEIGHT / 4);
		this.body.moves = false;
		this.body.immovable = true;
		if(Phaser.Math.Between(0, 1) === 0) this.flipX = true;
		this.resource = "cube" + Phaser.Math.Between(0, 1);
		
		this.anims.create({
			key: "default",
			frames: this.anims.generateFrameNumbers(this.resource, {start: 0, end: 1}),
			frameRate: 4,
			repeat: -1
		});
		
		this.anims.create({
			key: "held",
			frames: this.anims.generateFrameNumbers(this.resource, {start: 2, end: 3}),
			frameRate: 2,
			repeat: -1
		});
	}
	
	preUpdate(time, delta){
		super.preUpdate(time, delta);
		if(this.body.touching.up){
			this.anims.play("held", true);
			if(!this.held) this.scene.sound.play("land");
			this.held = true;
		}else{
			this.anims.play("default", true);
			this.held = false;
		}
	}
	
	update(){
	}
	
	onOverlap(object){
		return true;
	}
	
	/* Return an object with three properties:
		path - path to the module wherein this class is defined.
		data - arbitrary written object to be deserialized later. */ 
	serialize(object){
		return {
			path: "/Platform.js",
			data: {
				x: this.x,
				y: this.y
			}
		};
	}
	
	static deserialize(scene, data){
		return new Platform(scene, data.x, data.y);
	}
}
