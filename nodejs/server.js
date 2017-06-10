var cluster = require('cluster');
var numCPUs = require("os").cpus().length;
var port = parseInt(process.argv[2]);
var workers = [];
var io = [];

// Include Express
var express = require('express');

//--------------------------------


var server = require('http').createServer();
var express = require('../node_modules/express');
var bodyParser = require('../node_modules/body-parser');


var ioService = require('./service/io.service');
var router = require('./service/router.service');
var socketConnections = require('./service/socket.connection'); //- object of all users that are connected
//var ioClients = socketConnections.getAll();

//An example of send data to only one user by user's ID
//var numberOfWorker = socketConnections.isOnline('749720331715e45c1bd35c775d492095').worker;
//if(numberOfWorker) io[numberOfWorker].sendToId('749720331715e45c1bd35c775d492095', 'test'); 


//---------------------------------------------------------------------------------------

if (cluster.isMaster) {

    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();

        //Listen messanges from a worker
        worker.on('message', function (data) {
            switch (data.type) {
                case 'addConnection':
                    socketConnections.add(data.body);
                    //show all users that are connected
                    console.log('now there are ', socketConnections.getAll());
                    break;
                case 'disconnect':
                    socketConnections.remove(data.body);
                    console.log('now there are ', socketConnections.getAll());
                    break;
                case 'pushToClients':
                    for (var j in workers) {
                        workers[j].send(data.body);
                    }
                    break;
                default:
                    console.log('Sorry, we are out of ' + data.type + '.');
            }
            ;
        });
        //Add an object of worker in array
        workers.push(worker);
    }

    cluster.on("exit", function (worker, code, signal) {
        cluster.fork();
    });


// Code to run if we're in a worker process
} else {
    var app = express();
    //----------------------------------------------------
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    //-----set port---------------------------------------
    app.set('port', 7777);

    //get request from php
    app.post('/post', function (req, res) {
        console.log(req.body.room);
        res.status(200);
        res.end();
    });

    var serverpost = app.listen(7777, function () {
        console.log('info', "Web server successfully started at port " + serverpost.address().port);
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

    //Add router for the POST requests via AJAX
    router(app, worker);


    //Example of sending fake dat to all Clients
    if (cluster.worker.id === 2) {
        var Fake = require('./service/fake');
        var fakeData = new Fake();
        var k = 0;
        var fakeChart = fakeData.fakeChart;
        var chartInt = setInterval(function () {
            process.send({
                type: 'pushToClients',
                body: {
                    'table': 'chart', 'data': fakeChart[k]
                            //'table': 'table-bids', 'data': fakeChart[k]
                            //'table': 'table-ask', 'data': fakeChart[k]
                }
            });
            k++;
            if (k >= fakeChart.length)
                clearInterval(chartInt);
        }, 5500);
    }

    //------------------SOCKET-----------------------------------------------------------------
    var worker_id = cluster.worker.id;

    io[worker_id] = require('socket.io')(server);
    server.listen(8080, function () {
        console.log('info', 'Listening at: http://localhost:8080');
    });

    //--------Example: How to send a message to common service----------------
    //    process.send({'table': 'table-ask', 'worker': worker,
    //        'data': {'count': 205, 'first': 'fakeData.fake(200, 1, 205)'}});

    //Add socket service
    ioService.create(io[worker_id], socketConnections, cluster.worker.id);

    //-------Processing of the message from a common service----------------------------//
    //-------Send msg to all users----------------------------//
    process.on('message', function (msg) {
        io[worker_id].sockets.in('EUR-NLG').emit('market', msg);
    });

//    console.log('Worker %d running!', cluster.worker.id);
//    console.log('Application running!');

}
