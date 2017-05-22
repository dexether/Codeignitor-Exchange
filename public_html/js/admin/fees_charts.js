$(document).ready(function() {
    var period = parseInt($('#period').val(), 10);
    var ctx = document.getElementById('open-fees-chart'),
        openFeesChart;

    showOpenFeesData(period);

    $('#period').on('change', function(e) {
        var period = parseInt($(this).val(), 10);
        showOpenFeesData(period);
    })


    function showOpenFeesData(period) {
        $.ajax({
            type: 'POST',
            url: '/admin/get_open_fees_data',
            data: {period: period},
            dataType: 'json',
            success: function(r) {
                console.log(r);
                if (r.status && r.status === 'ok') {
                    var labels = Object.keys(r.data);
                    var data = labels.map(function(e) {
                        return r.data[e].fee ? r.data[e].fee : 0;
                    });
                    // console.log('labels', labels);
                    // console.log('data', data);
                    drawOpenFeesChart(labels, data);
                } else {
                    if (r.msg) {
                        alert(r.msg);
                    }
                }
            },
            error: function(e) {
                alert(e.message);
            }
        });
    }



    function drawOpenFeesChart(labels, data) {
        if (openFeesChart) {
            openFeesChart.destroy();
        }

        openFeesChart = new Chart(
            ctx,
            {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'open fees',
                        data: data,
                        backgroundColor: 'rgba(128, 225, 128, 1)',
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            }
        );
    } // drawOpenFeesChart()...

});