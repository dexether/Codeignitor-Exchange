$(function () {
    var cdata; 
    $.getJSON('https://exchange.guldentrader.com/gulden/chart_data_zar', function (data) {
        cdata = data;
    });
    anychart.onDocumentReady(function () {
    // The data used in this sample can be obtained from the CDN
    // http://cdn.anychart.com/csv-data/csco-daily.js

    // create data table on loaded data
    var dataTable = anychart.data.table();
    dataTable.addData(get_csco_daily_data());

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
    scrollerMapping.addField('value', 5);

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
    chart.selectRange('2001-06-05', '2002-09-26');

    // initiate chart drawing
    chart.draw();

    // create range picker
    //.rangePicker = anychart.ui.rangePicker();
    // init range picker
    //rangePicker.render(chart);

    // create range selector
    //rangeSelector = anychart.ui.rangeSelector();
    // init range selector
    //rangeSelector.render(chart);
});
});