var initData = function (data) {
    var bids = data['order_books']['bids'] || [];
    var asks = data['order_books']['asks'] || [];
    var market_history = (data['market_history']) || [];
    var open_orders = (data['open_orders']) || [];
    var order_history = (data['order_history']) || [];
    
    function bidsT (){
        for (var i = 0; i < 10; i++) {
            if (bids[i]) {
                var bid = '<tr><td>' + Math.round(bids[i]['sum'] * 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(bids[i]['total'] * 10000) / 10000 + '</td>\n\
                        <td>' + bids[i]['size(ngl)'] + '</td>\n\
                        <td>' + bids[i]['bid(btc)'] + '</td></tr>';
            } else {
                var bid = '<tr><td></td>\n\
                        <td></td>\n\
                        <td></td>\n\
                        <td></td></tr>';
            }
            ;
            $('#table-bids').find('tbody').append(bid);

        }
        ;
    }

    return function () {
        bidsT();
        console.log(bids, asks, market_history, open_orders, order_history);
        console.log('initData is working!');
    };
};


module.exports = initData;