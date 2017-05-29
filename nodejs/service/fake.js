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
                            'Sum': 1.25000000,
                            'Total': st + i,
                            'Size (NLG)': 50.00000000,
                            'Ask (EUR)': 0.02500000
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
                            'Buy/Sell': 'buy',
                            'EUR': st + i,
                            'Total Units': 5.00000000,
                            'Total Cost': 5.00000000,
                            'Date': '2017-02-17 01:40:45'}
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
                            'Date': new Date(),
                            'Buy/Sell': 'buy',
                            'EUR': st + i,
                            'Units filled': 5.00000000,
                            'Total Units': 5.00000000,
                            'Total Cost': 5.00000000
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