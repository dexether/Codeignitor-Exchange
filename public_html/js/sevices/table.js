var Table = function (element, object, userInfo) {
    var k = 10; //count of the records in the tables

    //Init the object
    var user = userInfo;                    //the user object from the room.js 
    var tableID = $(element).attr('id');    //hold the ID of the table of this object
    var table = $(element).find('tbody');   //the DOM element of the table
    var keys = object['keys'];              //The name of columns from thead in the order
    var tableValue = object['first'] || []; //The array of the records of this table
    var firstPageInTable = 1;               //The number of first page of the records that is saving
    var tableLength = object['count'];      //MAX count of the records in this table /on the server

    var countOfRows = (tableValue.length < k) ? tableValue.length : k;
    //MAX count of the records in the tables    
    var pageNumber = 1;                     //Page of the table that is showing on the site
    var pageCount = Math.round(tableLength / countOfRows);
    //Calc the count of the pages 

    //Update the count of the pages
    function setNewPageCount() {
        pageCount = Math.round(tableLength / countOfRows);
    }
    ;

    //Download the records of the table via AJAX
    //  'fromNumber' - from which number the records are requested,
    //  'button'     - which function is calling this request 
    function downloadNext(fromNumber, button) {
        //for 'first', 'last' or 'update' we're going to update the all table
        //for the rest only 20 records
        var countForLoaded = ((button === 'first') || (button === 'last') || (button === 'update')) ? 50 : 2 * k;
        $.ajax({
            url: "http://localhost:7777/get_next_records",
            data: {
                'fromNumber': fromNumber, //from which number the records are requested
                'count': countForLoaded, //how many records are requested
                'room': user['room'], //this is the room where a user is logging,
                'table': tableID            //the ID of the table whose records are requested,
            },
            type: "post",
            dataType: "json"
        })
                //if AJAX POST request  is successful
                .done(function (json) {
                    if (button === 'next') {
                        tableValue.splice(0, 2 * k); //remove the unnecessary records
                        tableValue.push.apply(tableValue, json['value']); // add new from the response

                    } else {
                        if (button === 'previous') {
                            tableValue.splice(20, (3 * k));//remove the unnecessary records
                            var arr2 = json['value'].slice(); // add new from the response
                            arr2.push.apply(arr2, tableValue);
                            tableValue = arr2;

                            if (firstPageInTable > 2) //update the firstPageInTable
                                firstPageInTable = firstPageInTable - 2;

                        } else {
                            if (button === 'first') {
                                firstPageInTable = 1; //update the firstPageInTable
                                tableValue = json['value']; //update the tableValue
                            } else {
                                if ((button === 'last') || (button === 'update')) {
                                    tableValue = json['value'];  //update the tableValue
                                }
                            }
                        }
                        ;
                    }
                    ;
                    changePageView();  //update the view the table, show new records
                })
                .fail(function (xhr, status, errorThrown) {
                    console.error("Error: " + errorThrown);
                })
                .always(function (xhr, status) {
                    //console.log("The request is complete!");
                });
    }
    ;

    //Create the pagination for this table
    function createPagination() {
        //Add the HTML structure
        $('#' + tableID).append("<div class='paginnation'>\n\
                                <button class='first'>First</button>\n\
                                <button class='previous'>previous</button>\n\
                                <span class='page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='next'>Next</button>\n\
                                <button class='last'>Last</button>\n\
                            </div>");
        //Add the EventListeners for the control buttons
        $('#' + tableID).find('.first').on('click', function () {
            if ((pageNumber >= 3) && (tableLength > 50)) { //if we need to update the tableValue
                pageNumber = 1;
                downloadNext(1, 'first'); //load the records
            } else {
                pageNumber = 1;
                changePageView();
            }

        });


        $('#' + tableID).find('.next').on('click', function () {
            if (pageNumber < pageCount - 1) {
                pageNumber++;
                if ((pageNumber > 3) && (tableLength > 50)) { //if we need to update the tableValue
                    if ((pageNumber - 2) % 2 === 0) {
                        firstPageInTable = firstPageInTable + 2;
                        downloadNext(k * (pageNumber + 1) + 1, 'next');//load the records
                    } else {
                        changePageView();
                    }
                } else
                    changePageView();
            } else {
                if (pageNumber === pageCount - 1) {
                    pageNumber++;
                    changePageView();
                }
            }
            ;
        });

        $('#' + tableID).find('.previous').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                if ((pageNumber > 2) && (pageNumber + 1 < pageCount) && (tableLength > 50)) {
                    if ((pageNumber - 1) % 2 === 0) {
                        downloadNext(k * (pageNumber - 3) + 1, 'previous'); //load the records
                    } else
                        changePageView();
                } else {
                    changePageView();
                }
                ;
            }

        });

        $('#' + tableID).find('.last').on('click', function () {
            if ((pageNumber + 2 >= pageCount) && (tableLength > 50)) {
                pageNumber = pageCount;
                changePageView();
            } else {
                pageNumber = pageCount;
                //Update the firstPageInTable
                if ((pageNumber % 2) === 0)
                    firstPageInTable = pageCount - 3;
                else
                    firstPageInTable = pageNumber - 2;

                downloadNext(k * (firstPageInTable - 1) + 1, 'last'); //load the records
            }
        });
    }
    ;

    //Delete the pagination
    function deletePagination() {
        $('#' + tableID).find('.paginnation').remove();
    }
    ;

    //Recount the numbers of the pagination
    function changePageView() {
        //Replace the numbers
        $(table).find('.page-number').text(pageNumber + " / " + pageCount);
        updateTable();
    }
    ;

    //update the values in the table which are shown 
    function updateTable() {
        var row = ''; //the new row <tr> of the table
        for (var i = 0; i < countOfRows; i++) { //for all rows of the table
            //Get the current row
            var rowOfTable = $(table).find('tr:eq( ' + i + ')');
            row = '<tr>';
            //if necessary record exist in the table
            if (tableValue[i + k * (pageNumber - firstPageInTable)]) {
                //the loop by keys
                for (var key in keys) {
                    //add column with data
                    var templ = parseFloat(tableValue[i + k * (pageNumber - firstPageInTable)][keys[key]]);
                    if (templ&&(keys[key] !== 'Date'))
                        row += '<td>' + templ.toFixed(8) + '</td>';
                    else {
                        row += '<td>' + tableValue[i + k * (pageNumber - firstPageInTable)][keys[key]] + '</td>';
                    }
                }
                row += '</tr>';
                //if the current row in the table is not existing
                if (rowOfTable.length === 0) {
                    //but we need more then rows are
                    if (countOfRows > $(table).find('tr').length)
                        //add row
                        $(table).append(row);
                } else {
                    //if just update
                    if (countOfRows >= $(table).find('tr').length) {
                        $(rowOfTable).replaceWith(row);
                    } else {
                        //if table is too small
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
        //create a new table, add the records
        createTable: function () {
            var row = '';         // the row of the table
            var rowTemplate = ''; // the body of the table
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    // console.log(tableValue[i][keys[key]]);
                    var templ = parseFloat(tableValue[i][keys[key]]);
                    if (templ&&(keys[key] !== 'Date'))
                        row += '<td>' + templ.toFixed(8) + '</td>';
                    else {
                        row += '<td>' + tableValue[i][keys[key]] + '</td>';
                    }
                }
                row += '</tr>';
                rowTemplate += row;
            }
            //Add HTML template to page
            $(table)
                    .html('')
                    .append(rowTemplate);

            if (countOfRows < tableLength) {
                createPagination();
            }
        },

        //Update the values of tableValue and change the records which are shown
        updateValue: function (object) {
            //if updated data have came when we save the first 5 pages
            if (firstPageInTable === 1) {
                var value = object['first'];
                tableLength = object['count'];
                setNewPageCount();

                tableValue = value;

                if (countOfRows <= tableLength) {
                    if ($('#' + tableID).find('.paginnation').length === 0)
                        createPagination();
                    countOfRows = k;
                } else {
                    deletePagination();
                }
                ;
                changePageView();
            } else {
                downloadNext(k * (firstPageInTable - 1) + 1, 'update');
                setNewPageCount();
                changePageView();
            }
        }
    };
};


module.exports = Table;