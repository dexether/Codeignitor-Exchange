function Route(server) {
    //Init the server from the main module server.js
    var app = server;

    //DEVELOPMENT: Add a module and create the object to have the fake data
    var Fake = require('./fake');
    var fakeData = new Fake();


    //POST request from the pagination
    app.post('/get_next_records', function (req, res) {
        //Object of the request body: 
        //req.body = {
        //  'room'      : 'EUR-NLG'', - this is the room where a user is logging,
        //  'table'     : 'tableID',  - the ID of the table whose records are requested,
        //  'fromNumber': 20,         - from which number the records are requested,
        //  'count'     : 20,         - how many records are requested
        //}

        var object = {}; //A object of the response

        //DEVELOPMENT: return fake data via res.send(object);
        if (req.body.table === 'table-bids') {
            object = {
                'value': fakeData.fake(req.body.count, req.body.fromNumber, 485),
                'count': 485
            };
        } else {
            if (req.body.table === 'table-ask') {
                object = {
                    'value': fakeData.fake(req.body.count, req.body.fromNumber, 205),
                    'count': 205
                };
            } else {
                if (req.body.table === 'market-history') {
                    object = {
                        'value': fakeData.fakeMarket(req.body.count, req.body.fromNumber, 100),
                        'count': 100
                    };
                } else {
                    if (req.body.table === 'table-open') {
                        object = {
                            'value': fakeData.fakeOpen(req.body.count, req.body.fromNumber, 100),
                            'count': 100
                        };
                    } else {
                        if (req.body.table === 'chart_stream') {
                            object = {
                                'value': fakeData.fakeOrderHistory(req.body.count, req.body.fromNumber, 100),
                                'count': 100
                            };
                        } else
                            object = {
                                'status': 200
                            };
                    }
                }

            }
        }
        ;

        //on front-end side next object of the response is expected : 
        //        {
        //            'value': [{}, {}, ... , {}], //array of the records 
        //            'count': 50 // size table (amount of the records)
        //        }
        res.send(object);
    });


    //POST request to get init data for the room
    app.post('/order-history', function (req, res) {
        if(req.body.action === 'delete'){
            // ... do something
            //if the action have successful finish
            res.send({
                'status': 'success',
                'value': {'hhh': 'kjk'} //if a count of rows is more then 200
            });
        }
    });
    
    //POST request to get init data for the room
    app.get('/get_init_data', function (req, res) {
        //Object of the request body: 
        //req.body = {
        //  'room'      : 'EUR-NLG'', - this is the room where a user is,
        //}
        
        
        //on front-end side next object of the response is expected : 
        //        {
        //           'user': {                       //the info about the user and this session
        //                'user_id': 'u123/45',      // the ID of this user if he/she is loggined
        //                'room': room,              // the name of the room
        //                'firstCurrency': 200.25,   // The amount of available first currency on the page, for example EUR  
        //                'secondCurrency': 1000     // The amount of available second currency on the page, for example NLG  
        //            },
        //            'tables': {                    // the initial data for this room in the next form 
        //                       ...
        //                       'ID of the table' : {
        //                                  'keys': ['sum', 'total', 'size(ngl)', 'bid(btc)'],  //The name of columns from thead in the order
        //                                  'count': 85,  // MAX count of the records
        //                                  'first': fakeData.fake(50, 1, 85) // first 50 records
        //                                             },
        //                       ....
        //                      }
        //        }
        //DEVELOPMENT: return fake data
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
                    'count': 485,
                    'first': fakeData.fake(200, 1, 485)
                },
                'table-ask': {
                    'keys': ['sum', 'total', 'size(ngl)', 'bid(btc)'],
                    'count': 205,
                    'first': fakeData.fake(200, 1, 205)
                },
                'market-history': {
                    'keys': ['date', 'buy/sell', 'gts', 'total units', 'total cost'],
                    'count': 65,
                    'first': fakeData.fakeMarket(50, 1, 100)
                },
                'table-open': {
                    'keys': ['date', 'buy/sell', 'gts', 'units filled', 'total units', 'total cost'],
                    'count': 65,
                    'first': fakeData.fakeOpen(50, 1, 65)
                },
                'order-history': {
                    'keys': ['Date', 'Buy/Sell', 'EUR', 'Units filled', 'Total Units', 'Total Cost'],
                    'count': 65,
                    'first': fakeData.fakeOrderHistory(50, 1, 65)
                }
            }
        });
    });
}

module.exports = Route;