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
        },
        
        fakeChart: [
            {0: "2017-06-01 10:00:00",
                            1: "0.03000000", 2: "0.07000000", 3: "0.07000000", 4: "0.05000000"},
            {0: "2017-06-03 10:00:00",
                            1: "0.03000000", 2: "0.03000000", 3: "0.06000000", 4: "0.02000000"},
            {0: "2017-06-06 10:00:00",
                            1: "0.03000000", 2: "0.03000000", 3: "0.05000000", 4: "0.03000000"},
            {0: "2017-06-10 10:00:00",
                            1: "0.03000000", 2: "0.03000000", 3: "0.04000000", 4: "0.04000000"},
            {0: "2017-06-14 10:00:00",
                            1: "0.03000000", 2: "0.03000000", 3: "0.03000000", 4: "0.02000000"},
            {0: "2017-06-18 10:00:00",
                            1: "0.03000000", 2: "0.03000000", 3: "0.02000000", 4: "0.05000000"},
            {0: "2017-06-20 10:00:00",
                            1: "0.03000000", 2: "0.04000000", 3: "0.07000000", 4: "0.04000000"},
            {0: "2017-06-24 10:00:00",
                            1: "0.03000000", 2: "0.04000000", 3: "0.07000000", 4: "0.03000000"},
            {0: "2017-06-28 10:00:00",
                            1: "0.03000000", 2: "0.04000000", 3: "0.07000000", 4: "0.02000000"},
            {0: "2017-07-01 10:00:00",
                            1: "0.03000000", 2: "0.04000000", 3: "0.03000000", 4: "0.01000000"},
            {0: "2017-07-03 10:00:00",
                            1: "0.03000000", 2: "0.06000000", 3: "0.02000000", 4: "0.05000000"},
            {0: "2017-07-06 10:00:00",
                            1: "0.03000000", 2: "0.05000000", 3: "0.03000000", 4: "0.05000000"},
            {0: "2017-07-10 10:00:00",
                            1: "0.03000000", 2: "0.04000000", 3: "0.03000000", 4: "0.05000000"},
            {0: "2017-07-14 10:00:00",
                            1: "0.03000000", 2: "0.03000000", 3: "0.04000000", 4: "0.05000000"},
            {0: "2017-07-18 10:00:00",
                            1: "0.03000000", 2: "0.02000000", 3: "0.04000000", 4: "0.05000000"},
            {0: "2017-07-20 10:00:00",
                            1: "0.03000000", 2: "0.01000000", 3: "0.03000000", 4: "0.05000000"},
            {0: "2017-07-24 10:00:00",
                            1: "0.02000000", 2: "0.07000000", 3: "0.03000000", 4: "0.05000000"},
            {0: "2017-07-28 10:00:00",
                            1: "0.01000000", 2: "0.07000000", 3: "0.03000000", 4: "0.05000000"}
            
        ]
    };
}

module.exports = Fake;