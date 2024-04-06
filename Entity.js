export default class Entity extends Phaser.Physics.Arcade.Sprite{
	constructor(scene, x, y){
		super(scene, x, y);
	}
	
	/* Modify origin, offset, and scaling to move the given texture with the body as its basis.
		w - width of the body.
		h - height of the body.
		tx - x of texture in relation to body.
		ty - y of texture in relation to body.
		tw - width of texture in relation to body.
		ty - height of texture in relation to body. */
	proportion(w, h, tx, ty, tw, th, texture){
		let x = this.body.center.x;
		let y = this.body.center.y;
		
		this.setTexture(texture);
		this.setOrigin(.5, .5);
		this.setScale(1 / this.frame.width, 1 / this.frame.height);
		this.body.setSize(1 / this.scaleX, 1 / this.scaleY, false);
		
		/* Move origin to where it should be relative to texture. */
		this.setDisplayOrigin(-1 * tx / this.scaleX / tw, -1 * ty / this.scaleY / th);
		
		/* Move top left of body to origin center. */
		this.body.setOffset(-1 * tx / this.scaleX, -1 * ty / this.scaleY);
		
		/* Scale texture width and height. */
		this.setScale(this.scaleX * tw, this.scaleY * th);
		this.body.setSize(this.body.width / tw, this.body.height / th, false);
		this.body.setOffset(this.body.offset.x / tw, this.body.offset.y / th);
		
		/* Scale by body width and height. */
		this.setScale(this.scaleX * w, this.scaleY * h);
	}
}
