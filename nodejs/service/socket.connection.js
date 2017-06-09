var ioClients = {};
var users;

module.exports = {

    add: function (data) {
        ioClients[data.socketId] = data.data;
    },

    getAll: function () {
        return ioClients;
    },

    remove: function (data) {
        delete ioClients[data.socketId];
    },

    isOnline(id) {
        if (ioClients[id] > 0) {
                return ioClients[id];
                // a info about connection of the user with this ID
            };
        return 0;
    }
};