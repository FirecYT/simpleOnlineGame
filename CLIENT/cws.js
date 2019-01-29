var ws = new WebSocket("ws://localhost:8081");

var p = null;
var text = document.getElementById('text');

var log = function(data) {
	text.innerText += data + "\n";
}

ws.onopen = function() {
	log("Соединение установлено.");
};
ws.onclose = function(event) {
	if (event.wasClean) {
		log('Соединение закрыто чисто');
	} else {
		log('Обрыв соединения');
	}
	log('Код: ' + event.code + ' причина: ' + event.reason);
};
ws.onmessage = function(event) {
	var data = JSON.parse(event.data);
	switch(data.type){
		case 0:
			log(data.data);
			break;
		case 1:
			p = data.data;
			start();
			break;
		case 2:
			updateObjects(data.data);
			break;
	}
};
ws.onerror = function(error) {
	log("Ошибка " + error.message);
};

var send = function(type, data) {
	ws.send(JSON.stringify({"type": type, "data": data}));
}

var move = function(x, y) {
	p.x=x;
	p.y=y;
	send(1, p);
}