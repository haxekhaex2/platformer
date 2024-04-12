import Entity from "/Entity.js";

export default class FragilePlatform extends Entity{
	constructor(scene, x, y){
		super(scene, x, y, "cube0");
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
		
		this.touched = 0;
		this.counter = 0;
	}
	
	preUpdate(time, delta){
		super.preUpdate(time, delta);
	}
	
	update(){
		if(this.touched) this.counter += 1;
		if(this.counter > 60 * 2){
			this.scene.sound.play("land");
			this.destroy();
		}
	}
	
	
	onOverlap(object){
		return true;
	}
	
	onCollide(object){
		if(!this.touched) this.scene.sound.play("land");
		this.touched = true;
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
		return new FragilePlatform(scene, data.x, data.y);
	}
	
}
