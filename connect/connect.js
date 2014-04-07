var peer = new Peer({key:"nseq4r0rsbtep14i"});

var connection;
var out = [];

var update = function(domfieldname, array) {
	document.getElementById(domfieldname + "amount").innerHTML = array.length;
	var domfield = document.getElementById(domfieldname);
	domfield.innerHTML = "";
	for (i=0; i < array.length; i++) {
		$(domfield).append("<li>" + array[i].stdid + " - " + array[i].time + "</li>");
	}
};

var clear = function(domfieldname) {
	update(domfieldname, []);
	return [];
};

var checkConnect = function(cd) {
	if (cd == true) {
		$("#login").hide();
		$('#connectfailed').hide();
		$('#disconnected').hide();
		$("#buttons").show();
		clear("out");
	} else if (cd == false) {
		$("#buttons").hide();
		$("#login").show();
		$('#disconnected').show();
		clear("out");
	}
};

var connect = function(id) {
	connection = peer.connect(id);
	connection.on('close', function() {checkConnect(false);});
	connection.on('data', function(data) {console.log("Recieved " + data); update("out", JSON.parse(data));});
	checkConnect(true);
	console.log("Connect initiated with " + id);
};

var leave = function(stdid) {
	var uftime = new Date();
	if (uftime.getHours().toString().length == 1) var hours = "0" + uftime.getHours().toString();
	else var hours = uftime.getHours().toString();
	if (uftime.getMinutes().toString().length == 1) var minutes = "0" + uftime.getHours().toString();
	else var minutes = uftime.getHours().toString();
	var time = uftime.getMonth()+1 + "/" + uftime.getDate() + "/" + uftime.getFullYear() + " " + hours + ":" + uftime.getMinutes();
	var send = JSON.stringify({action: true, stdid: stdid, time: time});
	connection.send(send);
	console.log("Sent \"" + send + "\"");
	out.push(send);
	update("out", out);
};

var back = function(stdid) {
	var send = JSON.stringify({action: false, stdid: stdid});
	connection.send(send);
	console.log("Sent \"" + send + "\"");
	for (var i = out.length-1; i >= 0; i--){
		if(out[i].stdid == stdid){
			out.splice(i,1);
			break;
		}
	}
	update("out", out);
};