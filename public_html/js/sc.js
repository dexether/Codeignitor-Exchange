console.log('sc is working');
if (!window.WebSocket) {
    document.body.innerHTML = 'WebSocket в этом браузере не поддерживается.';
}

// создать подключение
var socket = io.connect('http://localhost:8080');
socket.on('connect', function () {
    socket.on('bids', function (msg) {
        $('#table-bids').find('tbody').html('');
        var thead = '<tr><th>Sum</th><th>Total</th> <th>Size (NLG)</th><th>Bid (BTC)</th></tr>';
         $('#table-bids').find('tbody').append(thead);
        msg.forEach(function (element) {
            var bid = '<tr><td>' + Math.round(element['sum']* 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(element['total']* 10000) / 10000 + '</td>\n\
                        <td>' + element['size(ngl)'] + '</td>\n\
                        <td>' + element['bid(btc)'] + '</td></tr>';
            $('#table-bids').find('tbody').append(bid);
        });
    });
    
    socket.on('ask', function (msg) {
        $('#table-ask').find('tbody').html('');
        var thead = '<tr><th>Sum</th><th>Total</th> <th>Size (NLG)</th><th>Bid (BTC)</th></tr>';
         $('#table-ask').find('tbody').append(thead);
        msg.forEach(function (element) {
            var bid = '<tr><td>' + Math.round(element['sum']* 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(element['total']* 10000) / 10000 + '</td>\n\
                        <td>' + element['size(ngl)'] + '</td>\n\
                        <td>' + element['bid(btc)'] + '</td></tr>';
            $('#table-ask').find('tbody').append(bid);
        });
    });
    
    
    document.querySelector('#buy_button').onclick = function () {
        socket.send('client');
        console.log('client', new Date());
        // document.querySelector('#input').value = '';
    };
});