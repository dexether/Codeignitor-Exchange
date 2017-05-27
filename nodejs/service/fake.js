function Fake() {
    return {
        fake: function (count, start, max) {
            var k = parseInt(count);
            var st = parseInt(start);
            var arr = [];
            var maxNumber = parseInt(max);
            for (var i = 0; ((i < k) && (i + st - 1 < maxNumber)); i++) {
                arr.push(
                        {
                            'sum': new Date(),
                            'total': st + i,
                            'size(ngl)': 42.30000279,
                            'bid(btc)': 0.00003597
                        }
                );
            }
            ;
            return arr;
        }
        ,
        fakeMarket: function (count, start, max) {
            var k = parseInt(count);
            var st = parseInt(start);
            var arr = [];
            var maxNumber = parseInt(max);
            for (var i = 0; ((i < k) && (i + st - 1 < maxNumber)); i++) {
                arr.push(
                        {
                            'buy/sell': 'buy',
                            'gts': st + i,
                            'total units': 5.00000000,
                            'total cost': 5.00000000,
                            'date': '2017-02-17 01:40:45'}
                );
            }
            ;
            return arr;
        },
        fakeOpen: function (count, start, max) {
            var k = parseInt(count);
            var st = parseInt(start);
            var arr = [];
            var maxNumber = parseInt(max);
            for (var i = 0; ((i < k) && (i + st - 1 < maxNumber)); i++) {
                arr.push(
                        {
                            'date': new Date(),
                            'buy/sell': 'buy',
                            'gts': st + i,
                            'units filled': 5.00000000,
                            'total units': 5.00000000,
                            'total cost': 5.00000000
                        }
                );
            }
            ;
            return arr;
        },
        fakeOrderHistory: function (count, start, max) {
            var k = parseInt(count);
            var st = parseInt(start);
            var arr = [];
            var maxNumber = parseInt(max);
            for (var i = 0; ((i < k) && (i + st - 1 < maxNumber)); i++) {
                arr.push(
                        {
                            'date': new Date(),
                            'buy/sell': 'buy',
                            'gts': st + i,
                            'total units': 5.00000000,
                            'total cost': 5.00000000,
                            'fee': 5.00000000
                        }
                );
            }
            ;
            return arr;
        }
    };
}

module.exports = Fake;