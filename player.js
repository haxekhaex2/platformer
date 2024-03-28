import {input} from "./script.js";

export default class Player extends Phaser.Physics.Arcade.Sprite{
	constructor(scene, x, y){
		super(scene, x, y, "bug");
		scene.physics.world.enableBody(this);
		this.setDisplaySize(50, 50);
		
		this.dashTime = 0;
		this.abilityAvailable = false;
	}
	
	/* Called when colliding with another object. Return true if a collision should occur. */
	collide(object){
		if(object.constructor.name === "Platform"){
			if(this.body.velocity.y < 0) return false;
		}
		
		return true;
	}
	
	update(time, delta){
		/* Move camera. */
		this.scene.cameras.main.setScroll(this.x - this.scene.game.canvas.width / 2, this.y - this.scene.game.canvas.height / 2);
		
		/* Input handling. */
		let direction = 0;
		if(input.A.isDown) direction -= 1;
		if(input.D.isDown) direction += 1;
		let desiredVelocity = direction * 512;
		if(this.dashTime <= 0) this.setVelocityX(this.body.velocity.x + Math.sign(desiredVelocity - this.body.velocity.x) * Math.min(Math.abs(desiredVelocity - this.body.velocity.x), 8192 * (delta / 1000)));
		this.dashTime -= delta / 1000;
		if(this.dashTime < 0) this.dashTime = 0;
		
		if(input.S.isDown) this.setVelocityY(this.body.velocity.y + (delta / 1000) * 4096);
		
		if(Phaser.Input.Keyboard.JustDown(input.SPACE) && this.body.touching.down){
			this.setVelocityY(-1024);
			this.scene.sound.play("jump");
		}
		
		if(input.SHIFT.isDown && this.abilityAvailable && direction){
			this.setVelocityX(direction * 2048);
			this.dashTime = .1;
			this.abilityAvailable = false;
			this.scene.sound.play("jump");
		}
		
		if(this.body.touching.down) this.abilityAvailable = true;
	}
}
