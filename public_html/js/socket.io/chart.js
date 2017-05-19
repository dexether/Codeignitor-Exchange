function ChartMarket() {
    var data = [];
    
    function createChart () {
            var cdata = data;
            anychart.onDocumentReady(function () {
                // The data used in this sample can be obtained from the CDN
                // http://cdn.anychart.com/csv-data/csco-daily.js

                // create data table on loaded data
                var dataTable = anychart.data.table();
                dataTable.addData(data);

                var stage = anychart.graphics.create('container_chart');
                // map loaded data for the ohlc series
                var mapping = dataTable.mapAs({
                    'open': 1,
                    'high': 2,
                    'low': 3,
                    'close': 4,
                    'value': {column: 4, type: 'close'}
                });

                // map loaded data for the scroller
                var scrollerMapping = dataTable.mapAs();
                scrollerMapping.addField('value', 10);

                // create stock chart
                chart = anychart.stock();

                // create first plot on the chart
                var plot = chart.plot();
                plot.grid().enabled(true);
                plot.grid(1).enabled(true).layout('vertical');
                plot.minorGrid().enabled(true);
                plot.minorGrid(1).enabled(true).layout('vertical');

                var series = plot.candlestick(mapping).name('CSCO');
                series.legendItem().iconType('risingfalling');

                // create BBands indicator with period 20
                var bBandsIndicator = plot.bbands(mapping);
                bBandsIndicator.deviation(2.5);

                var indicatorPlot = chart.plot(1);
                indicatorPlot.height('30%');

                // create BBands Width indicator with period 20
                var bBandsWidthIndicator = indicatorPlot.bbandsWidth(mapping).series('splineArea');
                bBandsWidthIndicator.deviation(2.5);

                var indicatorSeries = bBandsWidthIndicator.series();
                indicatorSeries.stroke('1.5 #F18126');
                indicatorSeries.fill(anychart.color.lighten(indicatorSeries.stroke().color, 0.5));

                // create scroller series with mapped data
                chart.scroller().candlestick(mapping);

                // set container id for the chart
                chart.container(stage);

                // set chart selected date/time range
                chart.selectRange('1990-04-18', '1990-05-17');

                // initiate chart drawing
                chart.draw();
            });
        };
        
    return {
        loadData: function (object) {
            data = object['data'];
            createChart ();
        }
    };
}
;

module.exports = ChartMarket();