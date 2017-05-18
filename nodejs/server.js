var server = require('http').createServer();
var io = require('../node_modules/socket.io/lib/')(server);

var express = require('../node_modules/express');
var bodyParser = require('../node_modules/body-parser');

var app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//get request from php
app.post('/post', function (req, res) {
    console.log(req.body.room);
    io.sockets.in(req.body.room).emit('message', req.body);
    res.status(200);
    res.end();
});

//set port
app.set('port', 7777);
var serverpost = app.listen(7777, function () {
    console.log('info', "Web server successfully started at port " + serverpost.address().port);
});

server.listen(8080, function () {
    console.log('info', 'Listening at: http://localhost:8080');
});

io.on('connection', function (socket) {
    var clients = io.sockets.sockets;
//    Object.keys(io.sockets.sockets).forEach(function (id) {
//        console.log("ID:", id)  // socketId
//    });

    console.log('new connection is add at ', new Date());
    console.log(Object.keys(io.engine.clients));

    socket.on('disconnect', function () {
        console.log('user disconnected');
        console.log(Object.keys(io.engine.clients));
    });

//SUM	TOTAL	SIZE (NLG)	BID (BTC)
    var i0 = true;

    var dif0 = 0;
    setInterval(function () {
        if (i) {
            dif0 = 0.2;
        } else {
            dif0 = -0.2;
        }
        ;
        i0 = !i0;
        
        io.emit('ask', [
            {'sum': 0.0015+dif0/200, 'total': 0.0015+dif0/200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
            {'sum': 0.4985+dif0/100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
            {'sum': 0.4990+dif0/160, 'total': 0.5670+dif0/200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
            {'sum': 0.4990+dif0/160, 'total': 0.5670+dif0/200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
            {'sum': 0.4990+dif0/50, 'total': 0.5670+dif0/200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
            {'sum': 0.4990+dif0/100, 'total': 0.5670, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594}
        ]);
    }, 1500);
    
    var i = true;
    var dif = 0;
    setInterval(function () {
        if (i) {
            dif = 0.2;
        } else {
            dif = -0.2;
        }
        ;
        i = !i;
        
        io.emit('bids', [
            {'sum': 0.0015+dif/200, 'total': 0.0015+dif/200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
            {'sum': 0.4985+dif/100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
            {'sum': 0.4990+dif/160, 'total': 0.5670+dif/200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
            {'sum': 0.4990+dif/160, 'total': 0.5670+dif/200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
            {'sum': 0.4990+dif/50, 'total': 0.5670+dif/200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
            {'sum': 0.4990+dif/100, 'total': 0.5670, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594}
        ]);
    }, 2500);

    //we will only recieve
    socket.on('room', function (room) {
        console.log('joining room', room);
        socket.join(room);
    });

    socket.on('message', function (message) {
        console.log('получено сообщение ' + message);
        io.emit('message', 'hi' + message);

//        for (var key in clients) {
//            clients[key].send(message);
//        }
    });

    socket.on('unsubscribe', function (room) {
        console.log('leaving room', room);
        socket.leave(room);
    })

    socket.on('send', function (data) {
        console.log('sending message to' + data.room);
        io.sockets.in(data.room).emit('message', data);
    });

});