var iosocket = require('../../node_modules/socket.io/lib/');
var rooms = ['EUR-NLG', 'GTS-NLG'];

function returnFakeTradeHistory(cond) {
    return [
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:45'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 1.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:34'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 30.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:18'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-15 07:14:46'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:45'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 1.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:34'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 30.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:18'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-15 07:14:46'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:45'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 1.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:34'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 30.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:40:18'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 5.00000000, 'total cost': 5.00000000, 'date': '2017-02-15 07:14:46'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 48.00000000, 'total cost': 5.00000000, 'date': '2017-02-17 01:39:28'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:20:27'},
        {'buy/sell': 'buy', 'gts': 'NLG', 'total units': 100.00000000, 'total cost': 5.00000000, 'date': '2017-02-13 05:24:27'}
    ];
}
;

function returnFakeData(i) {
    var dif;
    (i) ? dif = 0.2 : dif = -0.2;
    i = !i;
    if (i) return [
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 50, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 50, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 145, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 400, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 50, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 50, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 145, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 400, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 145, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 400, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 500, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594}
    ]; else
        return [
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 50, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 50, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 145, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 400, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 500, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 145, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 400, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 500, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 145, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 400, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 500, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594}
    ]; 
}
;


module.exports = {

    create: function (app) {
        var io = iosocket(app);

        io.on('connection', function (socket) {
            console.log('new connection is add at ', new Date());
            console.log(Object.keys(io.engine.clients));


            //Send the fake data
//            var i0 = true;
//            setInterval(function () {
//                i0 = !i0;
//                io.emit('ask', {'count': 55, 'first' :returnFakeData(i0)});
//            }, 10500);
//
//            var i = true;
//            setInterval(function () {
//                i = !i;
//                io.emit('bids', {'count': 100, 'first' : returnFakeData(i).splice(0, 25)});
//            }, 12500);

            //change the room
            socket.on('room', function (room) {
                socket.leave(socket.room);
                socket.join(room);
                socket.room = room;
                io.sockets.in(room).emit('message', "New one is in room " + room);

                //Send the fake data
                io.sockets.in(room).emit('trade_history', {'count': 65, 'first' :returnFakeTradeHistory()});
                io.sockets.in(room).emit('order_open', {'count': 100, 'first' :returnFakeTradeHistory()});
                io.sockets.in(room).emit('order_history', {'count': 100, 'first' :returnFakeTradeHistory()});

            });


            socket.on('data_to_chart', function (msg) {
                var data = require('../chart');
                io.emit('data_to_chart', data);
            });


            socket.on('unsubscribe', function (room) {
                socket.leave(room);
            });


            //When client is disconnect
            socket.on('disconnect', function () {
                console.log('user disconnected');
                // console.log(Object.keys(io.engine.clients));
            });
        });
    }

};