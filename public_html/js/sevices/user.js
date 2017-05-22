var User = function (data) {
    var user_id = data['user_id'] || '';
    activeRoom = data['room'];
    var EUR = data['EUR'] || 0;
    var NGL = (data['NGL']) || 0;

    return  {
        userId: user_id,
        room: activeRoom,
        eurAvalaible: EUR,
        nglAvalaible: NGL
    };
};


module.exports = User;