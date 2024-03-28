const PLATFORM_WIDTH = 200;
const PLATFORM_HEIGHT = 20;
const CUBE_WIDTH = 200;
const CUBE_HEIGHT = 200;

export default class Platform extends Phaser.Physics.Arcade.Sprite{
	constructor(scene, x, y){
		super(scene, x, y, "cube0");
		scene.add.existing(this);
		scene.physics.world.enableBody(this);
		this.setSize(PLATFORM_WIDTH, PLATFORM_HEIGHT);
		this.setOffset(0, CUBE_HEIGHT / 4);
		if(Math.round(Phaser.Math.Between(0, 2)) === 0) this.flipX = true;
	}
	
	preUpdate(){
		if(this.body.touching.up){
			this.anims.play("cube0_held", true);
			if(!this.held) this.scene.sound.play("land");
			this.held = true;
		}else{
			this.anims.play("cube0_default", true);
			this.held = false;
		}
	}
}
