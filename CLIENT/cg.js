// Какие то константы
var bgColor = "#333",
	plColor = "#FA0",
	blColor = "#FAA",
	speed=5;
//


var cnv = document.getElementById('cnv'),
	ctx = cnv.getContext('2d');

var start = function() {
	console.log("START!");
	ctx.fillStyle=bgColor;
	ctx.fillRect(0, 0, cnv.width, cnv.height);
}
var updateObjects = function(obj) {
	ctx.fillStyle=bgColor;
	ctx.fillRect(0, 0, cnv.width, cnv.height);
	for(key in obj.blocks){
		ctx.fillStyle=blColor;
		ctx.fillRect(obj.blocks[key].x, obj.blocks[key].y, 5, 5);
	}
	for(key in obj.players){
		ctx.fillStyle=plColor;
		ctx.fillRect(obj.players[key].x, obj.players[key].y, 5, 5);
	}
}

window.addEventListener('keydown', function(e){
	var code = e.keyCode;
	switch (code) {
		case 37: move(p.x-=speed, p.y); break;
		case 38: move(p.x, p.y-speed); break;
		case 39: move(p.x+=speed, p.y); break;
		case 40: move(p.x, p.y+=speed); break;
		case 32: send(3, {x: p.x, y: p.y}); break;
		default: log(code); //Everything else
	}
}, false);