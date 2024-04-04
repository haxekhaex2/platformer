import Entity from "/Entity.js";

const PLATFORM_WIDTH = 200;
const PLATFORM_HEIGHT = 20;
const CUBE_WIDTH = 200;
const CUBE_HEIGHT = 200;

export default class BouncyPlatform extends Entity{
	constructor(scene, x, y){
		super(scene, x, y, "cube0");
		scene.physics.world.enableBody(this);
		this.proportion(200, 20, 0, -2.5, 1, 10, "cube0");
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
		/* if(this.body.touching.up){
			this.anims.play("held", true);
			if(!this.held) this.scene.sound.play("land");
			this.held = true;
		}else{
			this.anims.play("default", true);
			this.held = false;
		} */
	}
	
	update(){
	}
	
	
	onOverlap(object){
		return true;
	}
	
	onCollide(object){
		if(object.body !== null && object.body.constructor.name === "Body"){
			if(!object.body.immovable && object.body.moves){
				if(object.body.velocity.y >= 0){
					object.body.setVelocityY(-2048);
					this.scene.sound.play("boing");
				}
			}
		}
	}
	
	serialize(object){
		return {
			path: "/BouncyPlatform.js",
			data: {
				x: this.x,
				y: this.y
			}
		};
	}
	
	static deserialize(scene, data){
		return new BouncyPlatform(scene, data.x, data.y);
	}
	
}
