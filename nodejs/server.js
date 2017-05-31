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
    //io.sockets.in(req.body.room).emit('message', req.body);
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


//for the local development
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://exchange-dev');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});


//Add socket service
var io = require('./service/io.service');
io.create(server);
//An example of send data to only one user by user's ID
//io.sendToId('749720331715e45c1bd35c775d492095', 'test'); 


//Add router for the POST requests via AJAX
var router = require('./service/router.service');
router(app);
