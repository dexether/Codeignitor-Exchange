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
        payBtn.append(inner);
        tDiv2.append(payBtn);
    }

});