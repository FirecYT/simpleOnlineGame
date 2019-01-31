var wsmodule = new require('ws');
var fs = new require('fs');

var logFileName = "log" + +(new Date()) + ".txt";

var pIDs = 0;
var bIDs = 0;

var clients = {};
var objects = {players: {}, blocks: {}};

var player = function (x, y) {
	this.type="player",
	this.x=x;
	this.y=y;
	this.name="Name";
	this.hp=100;
}
var block = function (x, y) {
	this.type = "block"
	this.x=x;
	this.y=y;
}

var gui = function () {
	console.log("\033c");
	console.log(fs.readFileSync(logFileName, "utf8"));
	console.log("\
│== Status ==================================\n\
│ Players: "+Object.keys(objects.players).length+"\n\
│ Lust connect: "+pIDs+"\n\
│\n\
│\n\
│============================================");
}

fs.writeFileSync(logFileName, "");
gui();

var stdin = process.openStdin();
var wss = new wsmodule.Server({port: 8081});
// Функции для сервера
wss.on('connection', function(ws) {
	var id = ++pIDs;
	clients[id] = ws;
	objects.players[id] = new player(random(0, 20)*5, random(0, 20)*5);

	fs.appendFileSync(logFileName, id + " connect\r\n");
	gui();

	send(ws, 0, "Ваш id " + id);
	send(ws, 1, objects.players[id]);
	updateObjects();
	
	// Функции
	ws.on('message', function(message) {
		var mData = JSON.parse(message);
		switch(mData.type){
			case 0:
				for (var key in clients) {
					send(clients[key], 0, mData.data);
				}

				fs.appendFileSync(logFileName, id + " send \"" + message + "\"\r\n");
				break;
			case 1:
				if(~mData.data.x) objects.players[id].x = mData.data.x;
				if(~mData.data.y) objects.players[id].y = mData.data.y;
				if(~mData.data.name) objects.players[id].name = mData.data.name;
				if(~mData.data.hp) objects.players[id].hp = mData.data.hp;
				updateObjects();

				//fs.appendFileSync(logFileName, id + " send \"" + message + "\"\r\n");
				break;
			case 3:
				objects.blocks[++bIDs]=new block(mData.data.x, mData.data.y);
				updateObjects();

				fs.appendFileSync(logFileName, id + " place new block\r\n");
				break;
		}
		gui();
	});
	ws.on('close', function() {
		delete objects.players[id];
		delete clients[id];
		updateObjects();
		fs.appendFileSync(logFileName, id + " disconnect\r\n");
		gui();
	});
});

// Чтение из консоли
stdin.on('data', function(chunk) {
	var text = ""+chunk;
	var pars = text.split(" ");
	pars[pars.length-1]=pars[pars.length-1].replace("\r\n", "");
	switch(pars[0]){
		case "p":
			if (pars[1]) {
				if (pars[2]) {
					console.log(objects.players[pars[1]][pars[2]]);
				} else {
					console.log(objects.players[pars[1]]);
				}
			} else {
				console.log(Object.keys(objects.players));
			}
			break;
		case "b":
			if (pars[1]) {
				if (pars[2]) {
					console.log(objects.blocks[pars[1]][pars[2]]);
				} else {
					console.log(objects.blocks[pars[1]]);
				}
			} else {
				console.log(Object.keys(objects.blocks));
			}
			break;
		case "o":
			console.log(Object.keys(objects));
			break;
	}
});

// Разные функции
var random = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}
var send = function(ws, type, data) {
	ws.send(JSON.stringify({"type": type, "data": data}));
}

var updateObjects = function() {
	for (var key in clients) {
		send(clients[key], 2, objects);
	}
}