var app = require('http').createServer(handler)
var io = require('../node_modules/socket.io')(app);
var fs = require('fs');

io.on('connection', function (socket) {
    
    //Rooms
    socket.on('subscribe', function(data) { socket.join(data.room); })
    socket.on('unsubscribe', function(data) { socket.leave(data.room); })
  
    socket.on('send', function(data) { //data.room, data.message
    });
});