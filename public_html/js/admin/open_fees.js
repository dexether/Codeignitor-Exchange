$(document).ready(function() {

    var payBtn;

    // check if we need to show 'Pay' button
    $.ajax({
        type: 'POST',
        url: '/admin/is_pay_button_showed',
        dataType: 'json',
        success: function(r) {
            if (r.status && r.status === 'ok') {
                if (r.data === true) {
                    showPayButton();
                } else {
                    hidePayButton();
                }
            }
        },
        error: function(r) {
            alert('Pay button checking AJAX error!');
        }
    });


    function hidePayButton() {
        if (!payBtn) return;
        payBtn.hide();
    }

    function showPayButton() {
        if (!payBtn) {
            addPayButton();
        }
        if (payBtn) {
            payBtn.show();
        }
    }


    function addPayButton() {
        var tDiv2 = $('div.tDiv2');
        if (!tDiv2.length) {
            console.log('Info: cannot find tDiv2 class element to add pay button');
            return;
        }
        var inner = $('<i class="fa fa-eur" aria-hidden="true">&nbsp;Pay</i>');
        payBtn = $('<a />')
            .addClass('btn btn-info')
            .css({marginLeft: '20px', width: '120px'})
            .attr('href', '#')
            .attr('id', 'pay-btn');
        payBtn.on('click', confirmPayment)
        payBtn.append(inner);
        tDiv2.append(payBtn);
    }


    function confirmPayment(e) {
        e.preventDefault();
        alertify.confirm(
            'Payment confirmation',
            'Do you really want to proceed a payment ?',
            doPayment,
            cancelPayment
        ).set('labels', {ok:'Yes', cancel:'Cancel'});
    }

    function cancelPayment() {
        alertify.error('Process Cancelled');
    }

    function doPayment() {
        setTimeout(function() {
            alert('Payment!'), 5000
        })
    }


});