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


var up = 0,
	down = 1,
	left = 2,
	right = 3;
window.addEventListener('keydown', function(e){
	var code = e.keyCode;
	switch (code) {
		case 37: move(left); break;
		case 38: move(up); break;
		case 39: move(right); break;
		case 40: move(down); break;
		case 32: send(3, "Good"); break;
		default: log(code); //Everything else
	}
}, false);

var send = function(type, data) {
	ws.send(JSON.stringify({"type": type, "data": data}));
}

var move = function(direction) {
	send(5, direction);
}