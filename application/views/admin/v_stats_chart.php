<div id="chartContainer"></div>

<script>
	$( function() {
    	$( ".datepicker" ).datepicker({ dateFormat: 'yy-mm-dd' }).val();
  	} );

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