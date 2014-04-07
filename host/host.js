var peer = new Peer({key: 'nseq4r0rsbtep14i'});

var id;
var connection;
var stats = {
	out: {
		current: [],
		day: []
	}
}

var save = function(variable) {
	var saveFile = prompt("Filename?", "default");
	localStorage.setItem(saveFile, JSON.stringify(variable));
	update("out", stats.out.current);
	updateDay("outday", stats.out.day);
	alert("Saved data '" + JSON.stringify(variable) + "' to file " + saveFile + ".");
}

var load = function() {
	var saveFile = prompt("Filename?", "default");
	stats = JSON.parse(localStorage.getItem(saveFile));
	update("out", stats.out.current);
	updateDay("outday", stats.out.day);
	alert("Loaded data '" + localStorage.getItem(saveFile) + "' from file " + saveFile + ".");
}

var update = function(domfieldname, array) {
	document.getElementById(domfieldname + "amount").innerHTML = array.length;
	var domfield = document.getElementById(domfieldname);
	domfield.innerHTML = "";
	for (i=0; i < array.length; i++) {
		$(domfield).append("<li>" + array[i].stdid + " - " + array[i].time + "</li>");
	}
	if (domfieldname == "out") connection.send(JSON.stringify(array));
};

var updateDay = function(domfieldname, array) {
	document.getElementById(domfieldname + "amount").innerHTML = array.length;
	var domfield = document.getElementById(domfieldname);
	domfield.innerHTML = "";
	for (i=0; i < array.length; i++) {
		$(domfield).append("<li>" + array[i].stdid + " - " + array[i].time + " Back: " + array[i].timeBack + "</li>");
	}
	if (domfieldname == "out") connection.send(JSON.stringify(array));
};

var clear = function() {
	stats.out = {current: [], day: []};
	update("out", stats.out.current);
	updateDay("outday", stats.out.day);
};

var open = function(idIn) {
	id = idIn;
	document.getElementById("connectionID").innerHTML = id;
};

var input = function(data) {
	console.log("Recieved data " + data);
	var din = JSON.parse(data);
	if (din.action == true) {
		stats.out.current.push({stdid: din.stdid, time: din.time, timeBack: "Ignore this"});
		stats.out.day.push({stdid: din.stdid, time: din.time, timeBack: "Not yet!"});
	} else if (din.action == false) {
		for (var i = stats.out.current.length-1; i >= 0; i--){
			if (stats.out.current[i].stdid == din.stdid){
				stats.out.current.splice(i,1);
				for (var i = stats.out.day.length-1; i >= 0; i--){
					if (stats.out.day[i].stdid == din.stdid){
						var current = new Date().getTime();
						var prev = new Date(stats.out.day[i].time).getTime();
						var diff = new Date();
						diff.setTime(current-prev)
						stats.out.day[i].timeBack = diff.getUTCHours() + " hours " + diff.getUTCMinutes() + " minutes";
						break;
					}
				}
				break;
			}
		}
	}
	update("out", stats.out.current);
	updateDay("outday", stats.out.day);
};

var close = function() {
	document.getElementById("connection").className = "alert alert-danger";
	document.getElementById("connection").innerHTML = "<strong>Not connected!</strong> (Table cleared)";
	connection = null;
	clearCurrent();
};

var connect = function(con) {
	connection = con;
	connection.on('data', input);
	connection.on('close', close);
	document.getElementById("connection").className = "alert alert-success";
	document.getElementById("connection").innerHTML = "Connected to " + connection.peer + ". To disconnect, refresh/close either window/tab.";
};

peer.on('open', open);
peer.on('connection', connect);