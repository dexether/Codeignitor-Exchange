var Table = function (element, key, data) {
    var table = $(element);
    var keys = key;
    var tableValue = data || [];
    var countOfRows = (tableValue.length < 5) ? tableValue.length : 5;

    function updateTable() {

        var row = '+';
        var messageTemplate = '';
        for (var i = 0; i < countOfRows; i++) {
            var rowOfTable = $(table).find('tr:eq( ' + (i + 1) + ')');
            row = '<tr>';
            if (tableValue[i]) {
                for (var key in keys) {
                    row += '<td>' + tableValue[i][keys[key]] + '</td>';
                }
                ;
                row += '</tr>';

                if (rowOfTable.length) {
                    $(rowOfTable).replaceWith(row);
                } else {
                    $(table).find('tbody').append(row);
                }
            } else {
                $(table).find('tr:eq( ' + (tableValue.length + 1) + ')').remove();
            }
            ;

        }
    }
    ;


    return {
        createTable: function () {
            var row = '+';
            var rowTemplate = '';
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    row += '<td>'+tableValue[i][keys[key]]+'</td>';
                }
                ;
                row += '</tr>';
                rowTemplate += row;
            };
            
            $(table)
                    .find('tbody')
                    .html('')
                    .append(rowTemplate);
        },

        updateValue: function (value) {
            tableValue = value;

            updateTable();
        }
    };
};


module.exports = Table;