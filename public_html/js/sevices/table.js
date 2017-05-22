var Table = function (element, key, data) {
    var k = 10; //count of the recirds

    var table = $(element);
    var keys = key;
    var tableValue = data || [];
    var countOfRows = (tableValue.length < k) ? tableValue.length : k;
    var pageNumber = 1;
    var pageCount;
    if (tableValue.length % countOfRows === 0) {
        pageCount = Math.round(tableValue.length / countOfRows);
    } else {
        pageCount = Math.round(tableValue.length / countOfRows) + 1;
    }

    function createPagination() {
        
                console.log('+');
        $(table).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='prevent'>Prevent</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
        $(table).find('.first').on('click', function () {
            pageNumber = 1;
            changePageView();
        });
        $(table).find('.next').on('click', function () {
            if (pageNumber < pageCount) {
                pageNumber++;
                changePageView();
            }
        });
        $(table).find('.prevent').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                changePageView();
            }
        });
        $(table).find('.last').on('click', function () {
            pageNumber = pageCount;
            changePageView();
        });
    }
    ;

    function deletePagination() {
        $(table).find('.paginnation').remove();
    }
    ;

    //Recount the numbers of the pagination
    function changePageView() {
        var length = tableValue.length;

        if ((length % countOfRows === 0) && (length > countOfRows)) {
            pageCount = Math.round(length / countOfRows);
        } else
            pageCount = Math.round(length / countOfRows) + 1;
        if (pageCount < pageNumber) {
            pageNumber = pageCount;
        }

        //Replace the numbers
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);

        updateTable();
    }
    ;

    function updateTable() {
        var row = '';
        var messageTemplate = '';
        for (var i = 0; i < countOfRows; i++) {
            var rowOfTable = $(table).find('tr:eq( ' + (i + 1) + ')');

            row = '<tr>';
            if (tableValue[i + k * (pageNumber - 1)]) {
                for (var key in keys) {
                    row += '<td>' + tableValue[i + k * (pageNumber - 1)][keys[key]] + '</td>';
                }
                ;
                row += '</tr>';
                if (rowOfTable.length === 0) {
                    if (countOfRows > $(table).find('tr').length)
                        $(table).find('tbody').append(row);
                } else {
                    if (countOfRows >= $(table).find('tr').length) {
                        $(rowOfTable).replaceWith(row);
                    } else {
                        $(rowOfTable).remove();
                    }
                }
            } else {
                if (rowOfTable.length > 0) {
                    row = '<tr>';
                    for (var key in keys) {
                        row += '<td></td>';
                    }
                    ;
                    row += '</tr>';
                    $(rowOfTable).replaceWith(row);
                }
            }
            ;

        }
        ;
    }
    ;


    return {
        createTable: function () {
            var row = '+';
            var rowTemplate = '';
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    row += '<td>' + tableValue[i][keys[key]] + '</td>';
                }
                ;
                row += '</tr>';
                rowTemplate += row;
            }
            ;

            $(table)
                    .find('tbody')
                    .html('')
                    .append(rowTemplate);
            
            
            console.log(tableValue.length, table);
            if (countOfRows < tableValue.length) {
                    createPagination();
            }
        },

        updateValue: function (value) {
            tableValue = value;
            if (countOfRows < value.length) {
                if ($(table).find('.paginnation').length === 0)
                    createPagination();
                countOfRows = k;
            } else {
                deletePagination();
            }
            ;

            changePageView();
        }
    };
};


module.exports = Table;