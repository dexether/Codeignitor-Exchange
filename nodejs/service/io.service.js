//Connect the lib for the SOCKET
var iosocket = require('../../node_modules/socket.io/lib/');
//List of the rooms
var rooms = ['EUR-NLG', 'GTS-NLG'];

//DEVELOPMENT: Add a module and create the object to have the fake data
var Fake = require('./fake');
var fakeData = new Fake();

var users = {}; //contains the objects of the connected users like next:
//{
//  idOfConnection: {
//      room: roomName,
//      id: userID,
//      hash: userHash
//  }
//}
var ioClients = [];
var io;

//Retucn the connection of the user with ID
function isOnline(id) {
    for (var i = 0; i < ioClients.length; i++) {
        if (users[ioClients[i]]['id'] === id) {
            return ioClients[i];
            //ioClients[i] - a connection of the user with this ID
        }
    }
    ;
    return 0;
}
;

module.exports = {

    create: function (appIo, socketConnections, worker) {
        //Init the iosocket via the main module server.js

        //io = iosocket(app);
        io = appIo;

        //The event when user was connected
        io.on('connection', function (socket) {
            ioClients = Object.keys(io.engine.clients); //- the object of all connected users


            //change the room
            socket.on('market', function (msg) {
                // console.log('a user ' + msg.userId + ' connected');
                process.send({
                    type: 'addConnection',
                    body: {
                        socketId: [socket.id],
                        data: {'id': msg['userId'], 'room': msg['room'], 'hash': msg['hash'], worker: worker}
                    }
                });

                var room = msg['room'];
                if (room) {
                    socket.leave(socket.room);  // the user leaves the old room 
                    socket.join(room);          //             and connect to needed room
                    socket.room = room;         // update the socket room
                }
                ;
            });

            //The event when user leaves the room
            socket.on('unsubscribe', function (room) {
                socket.leave(room);
            });


            //The event when client is disconnect
            socket.on('disconnect', function () {
                process.send({
                    type: 'disconnect',
                    body: {
                        socketId: [socket.id]
                    }
                });
                // console.log('a user ' + users[socket.id] + ' disconnected');
            });
        });


    },
    sendToId: function (id, msg) {
        var t = isOnline(id);//ID of the socket connection
        if (io.sockets.connected[t]) {
            //Send a data to the user with this ID
            io.sockets.connected[t].emit('market', msg);
        }
    }

};