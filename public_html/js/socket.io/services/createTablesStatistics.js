var Table = function () {
    var table;
    var keys = [];
    var tableValue = [];
    var countOfRows = 5;

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
        setKeys: function (newValue) {
            keys = newValue;
        },

        createTable: function (element) {
            table = element;
            var headOfTable = '<tr>';
            for (var key in keys) {
                headOfTable += '<th>' + keys[key] + '</th>';
            }
            ;
            headOfTable += '</tr>';

            var row = '+';
            var messageTemplate = '';
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    row += '<td></td>';
                }
                ;
                row += '</tr>';
                messageTemplate += row;
            }

            $(table)
                    .find('tbody')
                    .html('')
                    .append(headOfTable);
            $(table)
                    .find('tbody')
                    .html('')
                    .append(messageTemplate);
        },

        setCount: function (newValue) {
            countOfRows = newValue;
        },

        updateValue: function (value) {
            tableValue = value;

            updateTable();
        }
    };
};


module.exports = Table;