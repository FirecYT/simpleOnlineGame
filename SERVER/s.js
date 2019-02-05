var wsmodule = new require('ws');
var fs = new require('fs');

var logFileName = "log" + +(new Date()) + ".txt";

var pIDs = 0;
var bIDs = 0;

var clients = {};
var objects = {players: {}, blocks: {}};

// Objects
var player = function (x, y) {
	this.type="player",
	this.x=x;
	this.y=y;
	this.name="Name";
	this.hp=100;
	this.speed=5;
}
var block = function (x, y) {
	this.type = "block"
	this.x=x;
	this.y=y;
}

// For something

// Console interface
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

// Функции для сервера
var wss = new wsmodule.Server({port: 8081});
wss.on('connection', function(ws) {
	var id = pIDs;
	// Функции
	ws.on('message', function(message) {
		var mData = JSON.parse(message);
		switch(mData.type){
			case 0:
				for (var key in clients) {
					send(clients[key], 0, mData.data);
				}

				log(id + " send \"" + mData.data);
				break;
			case 1:
				if(~mData.data.x) objects.players[id].x = mData.data.x;
				if(~mData.data.y) objects.players[id].y = mData.data.y;
				if(~mData.data.name) objects.players[id].name = mData.data.name;
				if(~mData.data.hp) objects.players[id].hp = mData.data.hp;
				if(~mData.data.speed) objects.players[id].speed = mData.data.speed;
				updateObjects();

				//log(id + " send \"" + message + "\"\r\n");
				break;
			case 3:
				objects.blocks[++bIDs]=new block(objects.players[id].x, objects.players[id].y);
				updateObjects();

				log(id + " place new block");
				break;
			case 4:
				id = ++pIDs;
				clients[id] = ws;
				objects.players[id] = new player(random(0, 20)*5, random(0, 20)*5);

				log(id + " connect");

				send(ws, 0, "Ваш id " + id);
				send(ws, 1, objects.players[id]);
				updateObjects();
				break;
			case 5:
				switch(mData.data){
					case 0: // Up
						objects.players[id].y-=objects.players[id].speed;
						break;
					case 1: // Down
						objects.players[id].y+=objects.players[id].speed;
						break;
					case 2: // Left
						objects.players[id].x-=objects.players[id].speed;
						break;
					case 3: // Right
						objects.players[id].x+=objects.players[id].speed;
						break;
				}
				updateObjects();
				break;
			case 10000:
				break;
		}
		gui();
	});
	ws.on('close', function() {
		delete objects.players[id];
		delete clients[id];
		updateObjects();
		log(id + " disconnect");
		gui();
	});
});

// Чтение из консоли
var stdin = process.openStdin();
stdin.on('data', function(chunk) {
	var text = ""+chunk;
	var pars = text.split(" ");
	pars[pars.length-1]=pars[pars.length-1].replace("\r\n", "");
	switch(pars[0]){
		case "players":
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
		case "blocks":
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
		case "objects":
			console.log(Object.keys(objects));
			break;
		case "stop":
			log("Server stop");
			process.exit(0);
			break;
		case "clear":
			objects.blocks={};
			updateObjects();
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

var log = function(data) {
	var date = new Date();
	fs.appendFileSync(logFileName, "[" + date.getDate() + "." + +(date.getMonth())+1 + "." + date.getFullYear() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "] - " + data + "\r\n");
}