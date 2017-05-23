var Table = function (element, object, userInfo) {
    var k = 10; //count of the recirds

    var user = userInfo;
    var tableID = $(element).attr('id');
    var table = $(element).find('tbody');
    var keys = object['keys'];
    var tableValue = object['first'] || [];
    var firstPageInTable = 1;
    var tableLength = object['count'];
    
    var countOfRows = (tableValue.length < k) ? tableValue.length : k;
    var pageNumber = 1;
    var pageCount;
    
        pageCount = Math.round(tableLength / countOfRows);

    function downloadNext(fromNumber, button) {
        var countForLoaded = ((button === 'first') || (button === 'last')) ? 50 : 2 * k;
        $.ajax({
            url: "http://localhost:7777/get_next_records",
            data: {
                'fromNumber': fromNumber,
                'count': countForLoaded,
                'room': user['room'],
                'table': tableID
            },
            type: "post",
            dataType: "json"
        })
                .done(function (json) {
                    if (button === 'next') {

                        tableValue.splice(0, 2 * k);
                        tableValue.push.apply(tableValue, json['value']);

                    } else {
                        if (button === 'prevent') {
                            tableValue.splice(30, (2 * k));

                            var arr2 = json['value'].slice();
                            arr2.push.apply(arr2, tableValue);

                            tableValue = arr2;

                            if (firstPageInTable > 2)
                                firstPageInTable = firstPageInTable - 2;

                        } else {
                            if (button === 'first') {
                                firstPageInTable = 1;
                                tableValue = json['value'];
                            } else {
                                if (button === 'last') {
                                    tableValue = json['value'];
                                }
                            }

                        }
                    }
                    ;
                    changePageView();
                })
                .fail(function (xhr, status, errorThrown) {
                    console.error("Error: " + errorThrown);
                })
                .always(function (xhr, status) {
                    //console.log("The request is complete!");
                });
    }
    ;
    function createPagination() {
        $(table).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='prevent'>Prevent</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
        $(table).find('.first').on('click', function () {
            if (pageNumber >= 3) {
                pageNumber = 1;
                downloadNext(1, 'first');
            } else {
                pageNumber = 1;
                changePageView();
            }
            
        });
        $(table).find('.next').on('click', function () {
            if (pageNumber < pageCount) {
                pageNumber++;
                if (pageNumber >3) {
                    if ((pageNumber - 2) % 2 === 0) {
                        firstPageInTable = firstPageInTable + 2;
                        
                        downloadNext(k * (pageNumber +1) + 1, 'next');
                    } else {
                        changePageView();
                    }
                } else
                    changePageView();
            }
            ;
        });
        $(table).find('.prevent').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                if ((pageNumber > 2) && (pageNumber + 1 < pageCount)) {
                    if ((pageNumber - 1) % 2 === 0) {
                        downloadNext(k * (pageNumber - 3) + 1, 'prevent');
                    } else
                        changePageView();
                } else {
                    changePageView();
                }
                ;
            }
            
        });
        $(table).find('.last').on('click', function () {
            if (pageNumber + 2 >= pageCount) {
                
                
                pageNumber = pageCount;
                changePageView();
            } else {
                pageNumber = pageCount;
                
                if ((pageNumber % 2) === 0)
                    firstPageInTable = pageCount - 3;
                else
                    firstPageInTable = pageNumber-2;
                downloadNext(k * (firstPageInTable-1) + 1, 'last');
            }
        });
    }
    ;
    function deletePagination() {
        $(table).find('.paginnation').remove();
    }
    ;
    //Recount the numbers of the pagination
    function changePageView() {

        //Replace the numbers
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);
        updateTable();
    }
    ;
    function updateTable() {
        var row = '';
        var messageTemplate = '';
        for (var i = 0; i < countOfRows; i++) {
            var rowOfTable = $(table).find('tr:eq( ' + i + ')');
            row = '<tr>';
            if (tableValue[i + k * (pageNumber - firstPageInTable)]) {
                for (var key in keys) {
                    row += '<td>' + tableValue[i + k * (pageNumber - firstPageInTable)][keys[key]] + '</td>';
                }
                ;
                row += '</tr>';
                if (rowOfTable.length === 0) {
                    if (countOfRows > $(table).find('tr').length)
                        $(table).append(row);
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
                    .html('')
                    .append(rowTemplate);
            if (countOfRows < tableLength) {
                createPagination();
            }
        },
        updateValue: function (object) {
            var value = object['first'];
            tableLength = object['count'];
            
            tableValue = value;
            if (countOfRows <= tableLength) {
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