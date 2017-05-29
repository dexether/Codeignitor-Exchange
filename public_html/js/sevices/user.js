var User = function (data) {
    var user_id = data['user_id'] || '';
    activeRoom = data['room'];
    var firstCurrency = data['firstCurrency'] || 0;
    var secondCurrency = (data['secondCurrency']) || 0;
    
    function updateValueOfCurrences (){
                $('#availableFirst').html(firstCurrency);
                $('#availableSecond').html(secondCurrency);
    };
    
    return  {
        userId: user_id,
        room: activeRoom,
        firstCurrency: firstCurrency,
        secondCurrency: secondCurrency,

        setCurrencies: function (currencies) {
            if (currencies[firstCurrency]) {
                firstCurrency = currencies[firstCurrency];
            }
            ;
            if (currencies[secondCurrency]) {
                secondCurrency = currencies[secondCurrency];
            }
            updateValueOfCurrences();
        }
    };
};


module.exports = User;