import {input} from "./WorldScene.js";
import BouncyPlatform from "./BouncyPlatform.js"
import Platform from "./Platform.js"
import Entity from "./Entity.js"

export default class Player extends Entity{
	constructor(scene, x, y){
		super(scene, x, y);
		scene.physics.world.enableBody(this);
		this.proportion(25, 50, -1/3, -1/8, 5/3, 10/8, "idle");
		
		this.setDepth(1);
		scene.cameras.main.startFollow(this, true, .5, .5, 0, 0);
		
		this.dashTime = 0;
		this.abilityAvailable = false;
		this.setInteractive();
		
		/* Load animations. */
		this.anims.create({
			key: "idle",
			frames: this.anims.generateFrameNumbers("idle", {start: 0, end: 1}),
			frameRate: 4,
			repeat: -1 
		});
		
		this.anims.create({
			key: "run",
			frames: this.anims.generateFrameNumbers("run", {start: 0, end: 7}),
			frameRate: 15,
			repeat: -1
		});
		
		this.anims.play("idle");
	}
	
	/* Called when colliding with another object. Return true if a collision should occur. */
	onOverlap(object){
		if(object.constructor === Platform || object.constructor === BouncyPlatform){
			if(this.body.velocity.y < 0) return false;
		}
		return true;
	}
	
	onCollide(object){
	}
	
	preUpdate(time, delta){
		super.preUpdate(time, delta);
	}
	
	update(time, delta){
		/* Input handling. */
		let direction = 0;
		if(input.A.isDown) direction -= 1;
		if(input.D.isDown) direction += 1;
		let desiredVelocity = direction * 512;
		if(this.dashTime <= 0) this.setVelocityX(this.body.velocity.x + Math.sign(desiredVelocity - this.body.velocity.x) * Math.min(Math.abs(desiredVelocity - this.body.velocity.x), 8192 * (delta / 1000)));
		this.dashTime -= delta / 1000;
		if(this.dashTime < 0) this.dashTime = 0;
		
		if(this.body.touching.down || this.body.blocked.down){
			if(direction){
				this.anims.play("run", true);
				if(direction < 0) this.setFlipX(true);
				else this.setFlipX(false);
			}else{
				this.anims.play("idle", true);
			}
		}else{
			if(direction < 0) this.setFlipX(true);
			else this.setFlipX(false);
			if(this.body.velocity.y < 0) this.setTexture("rise");
			else this.setTexture("fall");
		}
		
		if(input.S.isDown) this.setVelocityY(this.body.velocity.y + (delta / 1000) * 4096);
		
		if(Phaser.Input.Keyboard.JustDown(input.SPACE) && (this.body.touching.down || this.body.blocked.down)){
			this.setVelocityY(-1024);
			this.scene.sound.play("jump");
		}
		
		if(Phaser.Input.Keyboard.JustDown(input.SHIFT) && this.abilityAvailable && direction){
			this.setVelocityX(direction * 2048);
			this.dashTime = .1;
			this.abilityAvailable = false;
			this.scene.sound.play("jump");
		}
		
		if(this.body.touching.down || this.body.blocked.down) this.abilityAvailable = true;
		
		if(this.abilityAvailable) this.tint = 0xffffff;
		else this.tint = 0xffeeee;
	}
}
