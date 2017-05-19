var Table = function () {
    var table;
    var tableValue = [];
    var pageNumber = 1;
    var pageCount = 1;
    var countRow = 6;

    function changePageView() {
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);
    }
    ;

    function updateTable() {
        changePageView();

        var count = (pageCount !== pageNumber) ? countRow : Math.round(10 * tableValue.length / countRow) - Math.round(tableValue.length / countRow);
        var data = tableValue.splice((pageNumber - 1) * countRow, count);
        for (var i = 0; i < countRow; i++) {
            if (data[i]) {
                var bid = '<tr><td>' + Math.round(data[i]['sum'] * 10000) / 10000 + '</td>\n\
                        <td>' + Math.round(data[i]['total'] * 10000) / 10000 + '</td>\n\
                        <td>' + data[i]['size(ngl)'] + '</td>\n\
                        <td>' + data[i]['bid(btc)'] + '</td></tr>';
            } else {
                var bid = '<tr><td></td>\n\
                        <td></td>\n\
                        <td></td>\n\
                        <td></td></tr>';
            }
            ;
            $(table).find('tr:eq( ' + (i + 1) + ')').replaceWith(bid);

        }
        ;
    }
    ;


    return {
        setCount: function (newValue) {
            countRow = newValue;
        },

        updateValue: function (value) {
            tableValue = value;

            if ((value.length % countRow === 0))
                pageCount = Math.round(value.length / countRow);
            else
                pageCount = Math.round(value.length / countRow) + 1;

            if (pageCount < pageNumber)
                pageNumber = pageCount - 1;

            updateTable();
        },

        createTable: function (element) {
            table = element;
            var messageTemplate = '<tr><th>Sum</th><th>Total</th><th>Size (NLG)</th><th>Bid (BTC)</th></tr>';
            var row = '+';
            console.log(countRow);
            for(var i = 0; i < countRow; i++){
                row = '<tr class="row-' + i + '"><td></td><td> </td><td> </td><td> </td></tr>';
                messageTemplate += row;
            }

            $(table)
                    .find('tbody')
                    .html('')
                    .append(messageTemplate);
            $(table).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='prevent'>Prevent</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
            $(table).find('.first').on('click', function () {
                pageNumber = 1;
                updateTable();
            });
            $(table).find('.next').on('click', function () {
                if (pageNumber < pageCount) {
                    pageNumber++;
                    changePageView();
                    updateTable();
                }
            });
            $(table).find('.prevent').on('click', function () {
                if (pageNumber > 1) {
                    pageNumber--;
                    changePageView();
                    updateTable();
                }
            });
            $(table).find('.last').on('click', function () {
                pageNumber = pageCount;
                updateTable();
            });
        }

    };
};


module.exports = Table;