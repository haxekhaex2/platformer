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
		this.setTexture(texture);
		this.body.setSize(this.width / tw, this.height / th);
		this.setDisplayOrigin(-(tx * this.width / tw) + this.body.width / 2, -(ty * this.height / th) + this.body.height / 2);
		this.body.setOffset(this.width * this.originX - this.body.halfWidth, this.height * this.originY - this.body.halfHeight);
		this.setScale(tw * w / this.frame.width, th * h / this.frame.height);
	}
}
