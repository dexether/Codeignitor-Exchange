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

function fake(count, start) {
    var k = parseInt(count);
    var st = parseInt(start);
    var arr = [];
    for (var i = 0; i < k; i++) {
        arr.push(
                {'sum': st + i, 'total': 0.0015, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597}
        );
    }
    ;
    return arr;
}

app.post('/get_next_records', function (req, res) {
    //req.body.room - this is the room where a user is logging
    console.log(req.body);
    if ((req.body.table === 'table-bids') || (req.body.table === 'table-ask')) {
        res.send({'value': fake(req.body.count, req.body.fromNumber)});
    } else
        res.send({'status': 200});
});

app.post('/get_init_data', function (req, res) {
    //req.body.room - this is the room where a user is logging
    console.log(req.body);
    res.send({
        'user': {
            'user_id': 'u123/45',
            'room': req.body.room,
            'firstCurrency': 200.25,
            'secondCurrency': 1000
        },
        'tables': {
            'table-bids': {
                'keys': ['sum', 'total', 'size(ngl)', 'bid(btc)'],
                'count': 105,
                'first': fake(50, 1)
            },
            'table-ask': {
                'keys': ['sum', 'total', 'size(ngl)', 'bid(btc)'],
                'count': 65,
                'first': fake(50, 1)
            },
            'market-history': {
                'keys': ['date', 'buy/sell', 'gts', 'total units', 'total cost'],
                'count': 65,
                'first': [
                    {'buy/sell': 'buy', 'gts': '12', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:45'},
                    {'buy/sell': 'buy', 'gts': '12', 'total units': 1.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:34'},
                    {'buy/sell': 'buy', 'gts': '256', 'total units': 30.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:18'},
                    {'buy/sell': 'buy', 'gts': '300', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'buy', 'gts': '300', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'buy', 'gts': '300', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'buy', 'gts': '300', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'sell', 'gts': '100', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
                    {'buy/sell': 'buy', 'gts': '1000', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
                    {'buy/sell': 'buy', 'gts': '50', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-15 07:14:46'},
                    {'buy/sell': 'buy', 'gts': '24', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'sell', 'gts': '259', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
                    {'buy/sell': 'buy', 'gts': '756', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
                    {'buy/sell': 'buy', 'gts': '150', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-15 07:14:46'}
                ]
            },
            'table-open': {
                'keys': ['date', 'buy/sell', 'gts', 'total units', 'total cost'],
                'count': 65,
                'first': [
                    {'buy/sell': 'buy', 'gts': '12', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:45'},
                    {'buy/sell': 'buy', 'gts': '12', 'total units': 1.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:34'},
                    {'buy/sell': 'buy', 'gts': '256', 'total units': 30.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:18'},
                    {'buy/sell': 'buy', 'gts': '300', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'sell', 'gts': '100', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
                    {'buy/sell': 'buy', 'gts': '1000', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
                    {'buy/sell': 'buy', 'gts': '50', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-15 07:14:46'},
                    {'buy/sell': 'buy', 'gts': '24', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'sell', 'gts': '259', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
                    {'buy/sell': 'buy', 'gts': '756', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
                ]
            },
            'order-history': {
                'keys': ['date', 'buy/sell', 'gts', 'total units', 'total cost'],
                'count': 65,
                'first': [
                    {'buy/sell': 'buy', 'gts': '12', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:45'},
                    {'buy/sell': 'buy', 'gts': '12', 'total units': 1.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:34'},
                    {'buy/sell': 'buy', 'gts': '256', 'total units': 30.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:18'},
                    {'buy/sell': 'buy', 'gts': '300', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'sell', 'gts': '100', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
                    {'buy/sell': 'buy', 'gts': '1000', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
                    {'buy/sell': 'buy', 'gts': '50', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-15 07:14:46'},
                    {'buy/sell': 'buy', 'gts': '24', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
                    {'buy/sell': 'sell', 'gts': '259', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
                    {'buy/sell': 'buy', 'gts': '756', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
                ]
            }
        }
    });
});
//Add socket service
var io = require('./service/io.service');
io.create(server);
