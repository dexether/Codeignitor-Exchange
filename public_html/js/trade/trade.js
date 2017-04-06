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
});