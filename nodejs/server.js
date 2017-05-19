var server = require('http').createServer();


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


//Add socket service
var io = require('./service/io.service');
io.create(server);
