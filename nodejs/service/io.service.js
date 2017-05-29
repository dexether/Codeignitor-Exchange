//Connect the lib for the SOCKET
var iosocket = require('../../node_modules/socket.io/lib/');
//List of the rooms
var rooms = ['EUR-NLG', 'GTS-NLG'];

//DEVELOPMENT: Add a module and create the object to have the fake data
var Fake = require('./fake');
var fakeData = new Fake();


module.exports = {

    create: function (app) {
        //Init the iosocket via the main module server.js
        var io = iosocket(app);

        //The event when user was connected
        io.on('connection', function (socket) {
            //Object.keys(io.engine.clients) - the object of all connected users

            //change the room
            socket.on('room', function (room) {
                socket.leave(socket.room);  // the user leaves the old room 
                socket.join(room);          //             and connect to needed room
                socket.room = room;         // update the socket room

                io.sockets.in(room).emit('message', "New one is in room " + room); // send the message about new one in the room to all users in this room
            });


            //---------Send the fake data via socket----------------------------------------------------------
            // there musr be next :
            //         io.sockets.in(room).emit('ask', {'count': 105, 'first': fakeData.fake(50, 1, 105)});
            // but for development I don't use room and send to all the connections
            var i0 = true;
            setInterval(function () {
                i0 = !i0;
                io.emit('ask', {'count': 105, 'first': fakeData.fake(50, 1, 105)});
            }, 25500);

            var i = true;
            setInterval(function () {
                i = !i;
                io.emit('bids', {'count': 85, 'first': fakeData.fake(50, 1, 85)});
            }, 22500);

         //   io.emit('trade_history', {'count': 65, 'first': fakeData.fakeMarket(50, 1, 100)});
            io.emit('order_open', {'count': 65, 'first': fakeData.fakeOpen(50, 1, 100)});
            io.emit('order_history', {'count': 65, 'first': fakeData.fakeOrderHistory(50, 1, 100)});
            //---------------------------------------------------------------------------------------

            //create the stream for the chart
            socket.on('data_to_chart', function (msg) {
                var data = require('../chart');
                io.emit('data_to_chart', data);

//                setTimeout(function () {
//                    io.emit('chart_stream', {'array': [
//                            "1990-05-19",
//                            0.0868,
//                            0.0868,
//                            0.0859,
//                            0.0868,
//                            6595200
//                        ]});
//                    //dataTable.addData(rawData.data, true);
//                }, 10500);
            });


            //The event when user leaves the room
            socket.on('unsubscribe', function (room) {
                socket.leave(room);
            });


            //The event when client is disconnect
            socket.on('disconnect', function () {
                //  console.log('user disconnected');
            });
        });
    }

};