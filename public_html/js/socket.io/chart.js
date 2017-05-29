
//container_chart
function ChartMarket() {
    // console.log(object);
    //var data = object['data'];
    console.log('ChartMarket');


    var data;

    anychart.onDocumentReady(function () {
        console.log('insert');


        // create a data set
        data = anychart.data.set([
            [Date.UTC(2007, 8, 7), 22.75, 23.7, 22.69, 23.44],
            [Date.UTC(2007, 8, 6), 23.03, 23.15, 22.44, 22.97],
            [Date.UTC(2007, 8, 3), 23.2, 23.39, 22.87, 22.92],
            [Date.UTC(2007, 8, 2), 22.65, 23.7, 22.65, 23.36],
            [Date.UTC(2007, 8, 1), 23.17, 23.4, 22.85, 23.25],
            [Date.UTC(2007, 7, 31), 23.88, 23.93, 23.24, 23.25],
            [Date.UTC(2007, 7, 30), 23.55, 23.88, 23.38, 23.62],
            [Date.UTC(2007, 7, 27), 23.98, 24.49, 23.47, 23.49],
            [Date.UTC(2007, 7, 26), 23.2, 23.39, 22.87, 22.92],
            [Date.UTC(2007, 7, 25), 22.75, 23.7, 22.69, 23.44],
            [Date.UTC(2007, 7, 24), 22.65, 23.7, 22.65, 23.36],
            [Date.UTC(2007, 7, 23), 23.55, 23.88, 23.38, 23.62]
        ]);

        // create a chart
        chart = anychart.financial();

//        chart.selectRange('2007-08-02', '2008-08-7');
//        chart.scroller().thumbs(false);
//        chart.scroller().fill('green 0.1');
//        chart.scroller().selectedFill('green 0.5');
//        chart.scroller().allowRangeChange(false);

        // map the data
        var seriesData = data.mapAs({x: [0], open: [1], high: [2], low: [3], close: [4]});

        // create a japanese candlestick series and set the data
        var series = chart.candlestick(seriesData);
        series.pointWidth(10);

        // set the chart title
        chart.title("Japanese Candlestick Chart: Basic Sample");

        // set the interactivity mode
        chart.interactivity("byX");

        chart.container("container_chart");
        chart.draw();

    });


    return {
        stream: function (newData) {
            console.log(newData);
            data.append(newData);

        }
    };
}
;

module.exports = ChartMarket;