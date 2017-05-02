$(function(){
    
    $("#buyorder").change(function(){
        if($(this).val() == "limit"){
            $("#buystop_order").hide();
            $("#buylimit_order").show();
        }
        else
        {
            $("#buylimit_order").hide();
            $("#buystop_order").show();
        }
    });
    
    $("#sellorder").change(function(){
        if($(this).val() == "limit"){
            $("#sellstop_order").hide();
            $("#selllimit_order").show();
        }
        else
        {
            $("#selllimit_order").hide();
            $("#sellstop_order").show();
        }
    });
    
    //calc total buy limit order
    $("#buylimit_order input[name=amount], #buylimit_order input[name=price]").on("keypress keyup blur",function () {
        if($('#buylimit_order input[name=price]').val() > 0 && $("#buylimit_order input[name=amount]").val() > 0)
        {
            $('#b_all').html(round(parseFloat($('#buylimit_order input[name=amount]').val()) * parseFloat($('#buylimit_order input[name=price]').val()),8) );
        }
    });
    
    //calc total buy limit order
    $("#selllimit_order input[name=amount], #selllimit_order input[name=price]").on("keypress keyup blur",function () {
        if($('#selllimit_order input[name=price]').val() > 0 && $("#selllimit_order input[name=amount]").val() > 0)
        {
            $('#s_all').html(round(parseFloat($('#selllimit_order input[name=amount]').val()) * parseFloat($('#selllimit_order input[name=price]').val()),8) );
        }
    });

    //submit buy order
    $("#buy_button").click(function(){
        if($('#buylimit_order input[name=price]').val() > 0 && $("#buylimit_order input[name=amount]").val() > 0)
        {
            $.post( "/trades/buylimit_order?XDEBUG_SESSION_START=netbeans-xdebug", { amount: $('#buylimit_order input[name=amount]').val(), 
                                            price: $('#buylimit_order input[name=price]').val(),
                                            trade_pair: $('input[name=market]').val(),
                                            csrf_gt: $('input[name=csrf_gt]').val(),
                                        }, function(data){
                                            var sObj = JSON.parse(data);
                                            $('input[name=csrf_gt]').val(sObj['csrf']);
                                            switch(sObj['status']) {
                                                case 'succes':
                                                    $('#buylimit_order input[name=amount]').val(0);
                                                    $('#buylimit_order input[name=price]').val(0);
                                                    $('#b_all').html(round(0,8));
                                                    alert('Your order is submitted.');
                                                    break;
                                                case 'balance':
                                                    alert('Insufficient balance!');
                                                    break;
                                                default:
                                                    alert('something went wrong!' + sObj['status']);
                                            }; 
                                       } );
        }
    });

    //submit buy order
    $("#sell_button").click(function(){
        if($('#selllimit_order input[name=price]').val() > 0 && $("#selllimit_order input[name=amount]").val() > 0)
        {
            $.post( "/trades/selllimit_order?XDEBUG_SESSION_START=netbeans-xdebug", { amount: $('#selllimit_order input[name=amount]').val(), 
                                            price: $('#selllimit_order input[name=price]').val(),
                                            trade_pair: $('input[name=market]').val(),
                                            csrf_gt: $('input[name=csrf_gt]').val(),
                                        }, function(data){
                                            var sObj = JSON.parse(data);
                                            $('input[name=csrf_gt]').val(sObj['csrf']);
                                            switch(sObj['status']) {
                                                case 'succes':
                                                    $('#selllimit_order input[name=amount]').val(0);
                                                    $('#selllimit_order input[name=price]').val(0);
                                                    $('#s_all').html(round(0,8));
                                                    alert('Your order is submitted.');
                                                    break;
                                                case 'balance':
                                                    alert('Insufficient balance!');
                                                    break;
                                                default:
                                                    alert('something went wrong!' + sObj['status']);
                                            }; 
                                       } );
        }
    });
});