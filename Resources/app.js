// this sets the background color of the master UIView (when there are no windows/tab groups on it)
// this is the iPhone version

Titanium.UI.setBackgroundColor('#000');

var ortc = require('co.realtime.ortc');

ortc.addEventListener('onException', function(e) {	
	addRowToEvents('Exception: '+e.info);
});

ortc.addEventListener('onConnected', function(e) {
	addRowToEvents('Connected');
	btConnect.title = 'Disconnect';
});

ortc.addEventListener('onDisconnected', function(e) {
	addRowToEvents('Disconnected');
	btConnect.title ='Connect';
});

ortc.addEventListener('onSubscribed', function(e) { 
	addRowToEvents('Subscribed to channel: '+e.channel);
});

ortc.addEventListener('onUnsubscribed', function(e) { 
	addRowToEvents('Unsubscribed from: '+e.channel);
});

ortc.addEventListener('onMessage', function(e) {
	addRowToEvents('(Channel: '+e.channel+') Message received: '+e.message);
});

ortc.addEventListener('onPresence', function(e) {
	if (e.error != ""){
		addRowToEvents('(Channel: '+e.channel+') Presence error: ' + e.error);
	} else {
		addRowToEvents('(Channel: '+e.channel+') Presence: '+e.result);
	}
});

var win = Titanium.UI.createWindow({  
    title:'ORTC example',
    backgroundColor:'#fff'
});

var tableview = Ti.UI.createTableView({
  data: [],
  height: '57%',
  //top: '43%'
  top: '53%'
});
win.add(tableview);

var btConnect = Titanium.UI.createButton({
	title:'Connect',
	top: '3%',
	left: '3%',
	width: '30%',
	height: '8%'
});
btConnect.addEventListener('click', function(e) {
	if(btConnect.title == 'Connect') {
		ortc.connectionMetadata = 'Titanium example';
		ortc.clusterUrl = 'http://ortc-developers.realtime.co/server/2.1';
		if(taAuthToken.value != '') {
			ortc.connect(taAppKey.value, taAuthToken.value);
		} else {
			ortc.connect(taAppKey.value);
		}
	} else {
		ortc.disconnect();
	}
});
win.add(btConnect);

var taAppKey= Titanium.UI.createTextArea({
	//value: 'yourApplicationKey',
	value: 'MbJHdZ',
	backgroundColor:'#ffffdd',
	borderRadius: 5,
	borderWidth: 1,
	borderColor: '#bbb',
	top: '3%',
	left:'35%',
	width: '62%',
	height:'8%',
	font: {fontSize:14},
	editable: false
});
win.add(taAppKey);

var taChannel= Titanium.UI.createTextArea({
	value: 'MeditationChannel',
	backgroundColor:'#ffffdd',
	borderRadius: 5,
	borderWidth: 1,
	borderColor: '#bbb',
	top: '13%',
	left:'3%',
	width: '46%',
	height:'8%',
	font: {fontSize:14},
	editable: false
});
taChannel._hint = taChannel.value;
taChannel.addEventListener('focus', function(e){
	if(e.source.value == e.source._hint){
		e.source.value = "";
	}
});
taChannel.addEventListener('blur', function(e){
	if(e.source.value == ""){
		e.source.value = e.source.value._hint;
	}
});
win.add(taChannel);


var taAuthToken= Titanium.UI.createTextArea({
	//value: 'AuthenticationToken',
	value: 'a511afd422e54c2797a5d58f0a8545a6',
	backgroundColor:'#ffffdd',
	borderRadius: 5,
	borderWidth: 1,
	borderColor: '#bbb',
	top: '13%',
	left:'51%',
	width: '46%',
	height:'8%',
	font: {fontSize:14},
	editable: false
});
taAuthToken._hint = taAuthToken.value;
taAuthToken.addEventListener('focus', function(e){
	if(e.source.value == e.source._hint){
		e.source.value = "";
	}
});
taAuthToken.addEventListener('blur', function(e){
	if(e.source.value == ""){
		e.source.value = e.source.value._hint;
	}
});
win.add(taAuthToken);

var btSubscribe = Titanium.UI.createButton({
	title:'Subscribe',
	top: '23%',
	left: '3%',
	width: '30%',
	height: '8%'
});
btSubscribe.addEventListener('click', function(e) {
	ortc.subscribe(taChannel.value, true);
});
win.add(btSubscribe);

var btUnsubscribe = Titanium.UI.createButton({
	title:'Unsubscribe',
	top: '23%',
	left: '35%',
	width: '30%',
	height: '8%'
});
btUnsubscribe.addEventListener('click', function(e) {
	ortc.unsubscribe(taChannel.value);
});
win.add(btUnsubscribe);

var btPresence = Titanium.UI.createButton({
	title:'Presence',
	top: '23%',
	left: '67%',
	width: '30%',
	height: '8%'
});
btPresence.addEventListener('click', function(e) {
	ortc.presence(taChannel.value);
});
win.add(btPresence);

// Cannot enable and disable Presence options here
// because this is client side code and is not secure to send private 
// key from here
// http://docs.xrtml.org/pubsub/overview/2-1-0/presence.htm
// enabling presence allows you to know how many users are subscribed to each channel
// and who they are
// Every Realtime.co Pub/Sub API implements the presence services methods 
// (enable, disable and presence) so you can use the one that’s more suited 
// for your applications’ stack. The only exception is the JavaScript API that doesn’t 
// implement the enable and disable API calls since they would expose your private key.

var btCheckin = Ti.UI.createButton({
	title: 'Checkin',
	top: '33%',
	left: '3%',
	width: '46%',
	height: '8%'
});
btCheckin.addEventListener('click', function(e) {
	//alert('Clicked Checkin');
	ortc.subscribe(taChannel.value, true);
	ortc.send(taChannel.value, '----User Subscribed to Channel');
});
win.add(btCheckin);

var btCheckout = Ti.UI.createButton({
	title: 'Checkout',
	top: '33%',
	left: '51%',
	width: '46%',
	height: '8%'
});
btCheckout.addEventListener('click', function(e) {
	//alert('Clicked Checkout');
	// either put a timer here or add a callback somehow
	setTimeout(function(){ortc.send(taChannel.value, '----User Unsubscribed to Channel')}, 1000);
	setTimeout(function(){ortc.unsubscribe(taChannel.value)}, 3000);
	//ortc.send(taChannel.value, '----User Unsubscribed to Channel');
	//ortc.unsubscribe(taChannel.value);
});
win.add(btCheckout);

var btSend = Titanium.UI.createButton({
	title:'Send',
	//top: '33%',
	top: '43%',
	left: '3%',
	width: '30%',
	height: '8%'
});
btSend.addEventListener('click', function(e) {
	ortc.send(taChannel.value, taMessage.value);
});
win.add(btSend);

var taMessage= Titanium.UI.createTextArea({
	value: 'Message from Titanium',
	backgroundColor:'#ffffdd',
	borderRadius: 5,
	borderWidth: 1,
	borderColor: '#bbb',
	//top: '33%',
	top: '43%',
	left:'35%',
	width: '62%',
	height:'8%',
	font: {fontSize:14}
});
win.add(taMessage);


win.open();

function addRowToEvents(text){
	var row = Ti.UI.createTableViewRow();
	var now = new Date();
	var h = now.getHours();
	var m = now.getMinutes();
	var s = now.getSeconds();
	if(h<10) h = '0' + h;
	if(m<10) m = '0' + m;
	if(s<10) s = '0' + s;
	var time = h+':'+m+':'+s;
	var lTime = Ti.UI.createLabel({
		text: time,
		font: {fontSize:11},
		top: 3,
		left: 5,
		//color: '#aaa'
		color: 'black'
	});
	var lText = Ti.UI.createLabel({
		text: text,
		font: {fontSize:13},
		top: 18,
		left:5,
		color: 'black'
	});
	row.add(lTime);
	row.add(lText);
	tableview.appendRow(row);
}