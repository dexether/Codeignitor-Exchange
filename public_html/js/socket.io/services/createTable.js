var Table = function () {
    var table;
    var tableValue = [];
    var pageNumber = 1;
    var pageCount = 1;

    function changePageView() {
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);
    }
    ;

    function updateTable() {
        changePageView();

        var count = (pageCount !== pageNumber) ? 6 : Math.round(10 * tableValue.length / 6) - Math.round(tableValue.length / 6);
        var data = tableValue.splice((pageNumber - 1) * 6, count);
        for (var i = 0; i < 6; i++) {
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
            $(table).find('tr:eq( ' + (i + 2) + ')').replaceWith(bid);

        }
        ;
    }
    ;


    return {
        updateValue: function (value) {
            tableValue = value;

            if ((value.length % 6 === 0))
                pageCount = Math.round(value.length / 6);
            else
                pageCount = Math.round(value.length / 6) + 1;

            if (pageCount < pageNumber)
                pageNumber = pageCount - 1;

            updateTable();
        },

        createTable: function (element) {
            table = element;
            var messageTemplate = require('./template-table.pug');
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