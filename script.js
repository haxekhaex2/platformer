import WorldScene from "./WorldScene.js";

var config = {
	type: Phaser.CANVAS,
	backgroundColor: 0xeeeeee,
	physics: {
		default: "arcade",
		arcade: {
			gravity: {y: 2048},
			debug: true,
			overlapBias: 32
		}
	},
	scene: window.world = new WorldScene(),
	render: {
		antialias: false
	},
	canvas: document.getElementById("canvas")
};

/* Globals. */
let game = new Phaser.Game(config);
window.game = game;

let spawnMode;

document.querySelector("canvas").addEventListener("click", (event) => {
		let point = world.cameras.main.getWorldPoint(event.clientX, event.clientY);
	switch(document.getElementById("spawnMode").value){
		case "spawn":
			let spawnData = document.getElementById("spawnData").value;
			window.world.loadPrefab(spawnData).then((object) => {
				object.setPosition(point.x, point.y);
			});
			break;
		case "delete":
			world.children.getChildren().forEach((element) => {
				if(element.body){
					if(point.x >= element.body.x){
						if(point.y >= element.body.y){
							if(point.x <= element.body.x + element.body.width){
								if(point.y <= element.body.y + element.body.height){
									element.destroy();
								}
							}
						}
					}
				}
			});
	}
});
