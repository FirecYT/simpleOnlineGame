var wsmodule = new require('ws');

var clients = {};
var data = {};
var player = function () {
	this.x=0;
	this.y=0;
	this.name="Name";
	this.hp=100;
}

var stdin = process.openStdin();
var wss = new wsmodule.Server({port: 8081});
// Функции для сервера
wss.on('connection', function(ws) {
	var id = random(0, 1000);
	clients[id] = ws;
	data[id] = new player();
	data[id].x = random(5, 95);
	data[id].y = random(5, 95);

	console.log("Новое соединение " + id);

	send(ws, 0, "Ваш id " + id);
	send(ws, 1, data[id]);
	updatePlayers();
	
	// Функции
	ws.on('message', function(message) {
		var mData = JSON.parse(message);
		console.log(id + " " + message);
		switch(mData.type){
			case 0:
				for (var key in clients) {
					clients[key].send(mData);
				}
				break;
			case 1:
				if(~mData.data.x) data[id].x = mData.data.x;
				if(~mData.data.y) data[id].y = mData.data.y;
				if(~mData.data.name) data[id].name = mData.data.name;
				if(~mData.data.hp) data[id].hp = mData.data.hp;
				updatePlayers();
				break;
		}
	});
	ws.on('close', function() {
		console.log('Соединение закрыто ' + id);
		delete data[id];
		delete clients[id];
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
					console.log(data[pars[1]][pars[2]]);
				} else {
					console.log(data[pars[1]]);
				}
			} else {
				console.log(Object.keys(data));
			}
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

var updatePlayers = function() {
	for (var key in clients) {
		send(clients[key], 2, data);
	}
}