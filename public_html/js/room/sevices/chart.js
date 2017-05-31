function ChartMarket() {
    var user;
    var dataTable;

    return {
        init: function (userObject) {
            user = userObject;
        },
        createChart() {
            anychart.onDocumentReady(function () {

                // create a data set
                //  /chart/candle/NLG/30minutes
                dataTable = anychart.data.table(0);
                $.ajax({
                    url: "/chart/candle/" + user.room + "/30minutes",
                    type: "get",
                    dataType: "json"
                })
                        .done(function (json) {
                            console.log(json);
                            dataTable.addData(json['data']);
                            console.log(dataTable);
                        })
                        .fail(function (xhr, status, errorThrown) {
                            console.error("Error: " + errorThrown);
                        })
                        .always(function (xhr, status) {
                            console.log("The request is complete!");
                        });
                //data = anychart.data.set([[Date.UTC(2007, 8, 7), 22.75, 23.7, 22.69, 23.44], [Date.UTC(2007, 8, 6), 23.03, 23.15, 22.44, 22.97], [Date.UTC(2007, 8, 3), 23.2, 23.39, 22.87, 22.92], [Date.UTC(2007, 8, 2), 22.65, 23.7, 22.65, 23.36], [Date.UTC(2007, 8, 1), 23.17, 23.4, 22.85, 23.25], [Date.UTC(2007, 7, 31), 23.88, 23.93, 23.24, 23.25], [Date.UTC(2007, 7, 30), 23.55, 23.88, 23.38, 23.62], [Date.UTC(2007, 7, 27), 23.98, 24.49, 23.47, 23.49], [Date.UTC(2007, 7, 26), 23.2, 23.39, 22.87, 22.92], [Date.UTC(2007, 7, 25), 22.75, 23.7, 22.69, 23.44], [Date.UTC(2007, 7, 24), 22.65, 23.7, 22.65, 23.36], [Date.UTC(2007, 7, 23), 23.55, 23.88, 23.38, 23.62]]);

                // create a chart
                chart = anychart.stock();

//                setTimeout(function () {
//                    console.log('try');
//                    dataTable.addData(
//                            [
//                                {0: "2017-06-04 11:00:00",
//                                    1: "0.03000000",
//                                    2: "0.03000000",
//                                    3: "0.02000000",
//                                    4: "0.01000000"}
//                            ]);
//                }, 5000);
//                setTimeout(function () {
//                    console.log('try');
//                    dataTable.addData([
//                        {0: "2017-06-10 11:00:00",
//                            1: "0.03000000",
//                            2: "0.03000000",
//                            3: "0.07000000",
//                            4: "0.09000000"}
//                    ]);
//                }, 10000);

                // create first plot on the chart
                var plot = chart.plot();
                plot.grid().enabled(true);
                plot.grid(1).enabled(true).layout('vertical');
                plot.minorGrid().enabled(true);
                plot.minorGrid(1).enabled(true).layout('vertical');
                // map the data
                var seriesData = dataTable.mapAs(
                        {
                            'open': 1,
                            'high': 2,
                            'low': 3,
                            'close': 4,
                            'value': {column: 4, type: 'close'}
                        }
                );
                var series = plot.candlestick(seriesData).name('Timeline');
                series.legendItem().iconType('risingfalling');
                chart.container("container_chart").draw();
            });
        },

        stream: function (newData) {
            var array = [];
            array.push(newData);
            dataTable.addData(array);
        }
    };
}

module.exports = ChartMarket;