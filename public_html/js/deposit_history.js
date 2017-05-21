$('#switch > li:nth-child(1)').click(function() {
	$('#switch > li:nth-child(1)').css({'background':'#0094bb', 'color':'#fff'});
	$('#switch > li:nth-child(2)').css({'background':'#fff', 'color':'gray'});
	$('ul.deposit_history_records[type="NLG"]').css({'display':'none', 'opacity':0});
	$('ul.deposit_history_records[type="EUR"]').css('display', 'flex');
	$('ul.deposit_history_records[type="EUR"]').animate({
		opacity: 1
	});
})
$('#switch > li:nth-child(2)').click(function() {
	$('#switch > li:nth-child(2)').css({'background':'#0094bb', 'color':'#fff'});
	$('#switch > li:nth-child(1)').css({'background':'#fff', 'color':'gray'});
	$('ul.deposit_history_records[type="EUR"]').css({'display':'none', 'opacity':0});
	$('ul.deposit_history_records[type="NLG"]').css('display', 'flex');
	$('ul.deposit_history_records[type="NLG"]').animate({
		opacity: 1
	});
})