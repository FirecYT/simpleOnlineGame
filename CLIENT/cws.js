var ws = new WebSocket("ws://127.0.0.1:8081");

var p = null;
var text = document.getElementById('text');

var log = function(data) {
	text.innerText += data + "\n";
}

ws.onopen = function() {
	log("Соединение установлено.");
	send(4, "Good!");
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