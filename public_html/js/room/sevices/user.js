var User = function (data, dataInfoElem) {
    var user_id = data['user_id'] || '';
    activeRoom = data['room'];
    var firstCurrency = data['firstCurrency'] || 0;
    var secondCurrency = (data['secondCurrency']) || 0;
    var market = $(dataInfoElem).attr('data-market');
    var suid = $(dataInfoElem).attr('data-suid');
    var hash = data['hash'];
    
    function updateValueOfCurrences (){
                $('#availableFirst').html(firstCurrency);
                $('#availableSecond').html(secondCurrency);
    };
    
    return  {
        userId: user_id,
        room: activeRoom,
        market: market,
        suid: suid,
        firstCurrency: firstCurrency,
        secondCurrency: secondCurrency,
        hash: hash,

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