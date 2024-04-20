import Entity from "/Entity.js";

export default class Coin extends Entity{
	constructor(scene, x, y){
		super(scene, x, y);
		this.proportion(32, 32, 0, 0, 1, 1, "friend");
	}
	
	update(){
	}
	
	onOverlap(object){
		if(object.constructor.name === "Player"){
			console.log("player touched coin!");
			this.destroy();
			return false;
		}
		return true;
	}
	
	serialize(object){
		return {
			path: "/Coin.js",
			data: {
				x: this.x,
				y: this.y
			}
		};
	}
	
	static deserialize(scene, data){
		return new Coin(scene, data.x, data.y);
	}
}
