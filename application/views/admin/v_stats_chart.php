<div id="chartContainer"></div>
<script>
  	window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer",
    {

      title:{
      text: <?= $text; ?>
      },
       data: [
      {
        type: "line",

        dataPoints: [
        <?= $js; ?>
        ]
      }
      ]
    });

    chart.render();
  }
</script>