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
	}
	
	preUpdate(time, delta){
		super.preUpdate(time, delta);
		if(this.body.touching.up){
			this.anims.play(this.resource + "_held", true);
			if(!this.held) this.scene.sound.play("land");
			this.held = true;
		}else{
			this.anims.play(this.resource + "_default", true);
			this.held = false;
		}
	}
	
	/* Called when colliding with another object. Return true if a collision should occur. */
	collide(object){
		return true;
	}
	
	update(){
	}
}
