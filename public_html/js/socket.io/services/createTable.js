function updateTable(element, objectValue) {
    for (var i = 0; i < objectValue.length; i++) {
        var elem = objectValue[i];
        var bid = '<tr><td>' + Math.round(elem['sum'] * 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(elem['total'] * 10000) / 10000 + '</td>\n\
                        <td>' + elem['size(ngl)'] + '</td>\n\
                        <td>' + elem['bid(btc)'] + '</td></tr>';
        $(element).find('tr:eq( ' + (i + 2) + ')').replaceWith(bid);
    }
    ;
}

function createTable(element) {
    var messageTemplate = require('./template-table.pug');
    $(element)
            .find('tbody')
            .html('')
            .append(messageTemplate);
}

module.exports = {
    createTable: createTable,
    updateTable: updateTable
};