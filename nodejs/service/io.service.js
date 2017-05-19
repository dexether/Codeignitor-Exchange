var iosocket = require('../../node_modules/socket.io/lib/');
var rooms = ['EUR-NLG', 'GTS-NLG'];

function returnFakeData(i) {
    var dif;
    (i) ? dif = 0.2 : dif = -0.2;
    i = !i;
    return [
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 50, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 200, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 180, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 145, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 400, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 500, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 220, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 190, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 120, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 850, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 270, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 110, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 165, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 505, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 230, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 120, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 45, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 58, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 850, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 270, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 110, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 165, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 160, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 505, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.0015 + dif / 230, 'total': 0.0015 + dif / 200, 'size(ngl)': 42.30000279, 'bid(btc)': 0.00003597},
        {'sum': 0.4985 + dif / 100, 'total': 0.4970, 'size(ngl)': 13824.21101540, 'bid(btc)': 0.00003595},
        {'sum': 0.4990 + dif / 120, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 45, 'total': 0.5670 + dif / 200, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594},
        {'sum': 0.4990 + dif / 80, 'total': 0.5670, 'size(ngl)': 28824.21101540, 'bid(btc)': 0.00003594}
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
            var i0 = true;
            setInterval(function () {
                i0 = !i0;
                io.emit('ask', returnFakeData(i0));
            }, 3500);

            var i = true;
            setInterval(function () {
                i = !i;
                io.emit('bids', returnFakeData(i).splice(0, 25));
            }, 4500);

            //change the room
            socket.on('room', function (room) {
                console.log('joining room', room);
                socket.leave(socket.room);
                socket.join(room);
                socket.room = room;
                io.sockets.in(room).emit('message', "New one is in room " + room);
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