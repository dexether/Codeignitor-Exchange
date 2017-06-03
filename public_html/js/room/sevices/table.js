var Table = function (element, object, userInfo) {
    var k = 10; //count of the records in the tables

    //Init the object
    var user = userInfo;                    //the user object from the room.js 
    var tableID = $(element).attr('id');    //hold the ID of the table of this object
    var table = $(element).find('tbody');   //the DOM element of the table
    var keys = object['keys'];              //The name of columns from thead in the order
    var tableValue = object['first'] || []; //The array of the records of this table
    //   var firstPageInTable = 1;               //The number of first page of the records that is saving
    var tableLength = object['count'];      //MAX count of the records in this table /on the server

    var countOfRows = (tableValue.length < k) ? tableValue.length : k;
    //MAX count of the records in the tables    
    var pageNumber = 1;                     //Page of the table that is showing on the site
    var pageCount = Math.round(object['count'] / 10);
    //Calc the count of the pages 

    //Update the count of the pages
    function setNewPageCount() {
        pageCount = Math.round(tableLength / countOfRows);
//        if (pageNumber > pageCount)
//            pageNumber = pageCount;
    }
    ;

    //Download the records of the table via AJAX
    //  'fromNumber' - from which number the records are requested,
    //  'button'     - which function is calling this request 
    function downloadNext(fromNumber, button) {
        //for 'first', 'last' or 'update' we're going to update the all table
        //for the rest only 200 records

        var countForLoaded;
        if (button === 'update') {
            countForLoaded = tableValue.length;
        } else {
            if (button === 'last') {
                countForLoaded = tableLength;
            } else
                countForLoaded = 200;
        }
        ;
        if (countForLoaded)
            $.ajax({
                url: "http://localhost:7777/get_next_records",
                data: {
                    'fromNumber': fromNumber, //from which number the records are requested
                    'count': countForLoaded, //how many records are requested
                    'room': user['room'], //this is the room where a user is logging,
                    'table': tableID, //the ID of the table whose records are requested,
                    'data-market': user.market,
                    'data-suid': user.suid
                },
                type: "post",
                dataType: "json"
            })
                    //if AJAX POST request  is successful
                    .done(function (json) {
                        if (button === 'next') {
                            tableValue.push.apply(tableValue, json['value']); // add new from the response
                            pageNumber++;
                            changePageView();

                        } else {
                            if ((button === 'last') || (button === 'update')) {
                                tableValue = json['value'];  //update the tableValue
                            }
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

    function getNumberInTableById(id) {
        for (var i = 0; i < tableValue.length; i++) {
            if (tableValue[i]['Id'] === mooidForRemove) {
                return i;
            }
        }
        return undefined;
    }
    ;

    function addAtTopOfTable(record) {
        var lengthOfTableAtTheMomment = tableValue.length;
        tableValue.unshift(record);
        if (lengthOfTableAtTheMomment < tableValue.length) {
            tableValue.splice(lengthOfTableAtTheMomment, 1);
        }

    }
    ;

    function deleteRecordFromTable(numberInTable, newValue) {
        tableValue.splice(numberInTable, 1); //remove the record
        if (newValue) {
            tableValue.push(newValue); //add the new one instead the removed record
        } else {
            tableLength -= 1;
            setNewPageCount();
        }
        updateTable();
    }
    ;

    function deleteRecord(user, mooidForRemove, length) {
        var numberForRemove = getNumberInTableById(mooidForRemove);

        if (numberForRemove)
            $.ajax({
                url: 'http://localhost:7777/order-history',
                data: {
                    'user': user.userId, //user's ID
                    'action': 'delete', //action
                    'mooid': mooidForRemove, //data-mooid of this record
                    'tableLenght': length, //how many records are in the table
                    'data-market': user.market,
                    'data-suid': user.suid
                },
                type: "post",
                dataType: "json"
            })
                    .done(function (json) {
                        if (json['status'] === 'success') {
                            deleteRecordFromTable(numberForRemove, json['value']);
                        }
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
                                <button class='paginnation__control first'>First</button>\n\
                                <button class='paginnation__control previous'>previous</button>\n\
                                <span class='paginnation__page-number page-number'>" + pageNumber + " / " + pageCount + "</span>\n\
                                <button class='paginnation__control next'>Next</button>\n\
                                <button class='paginnation__control last'>Last</button>\n\
                            </div>");
        setNewPageCount();
        changePageView();

        //Add the EventListeners for the control buttons
        $('#' + tableID).find('.first').on('click', function () {
            pageNumber = 1;
            changePageView();
        });

        $('#' + tableID).find('.next').on('click', function () {
            if (pageNumber < pageCount) {
                if ((pageNumber % 20 === 0) && (pageNumber * k < tableLength)) {
                    downloadNext(k * (pageNumber) + 1, 'next');//load the records
                } else {
                    pageNumber++;
                    changePageView();
                }
            }
        });

        $('#' + tableID).find('.previous').on('click', function () {
            if (pageNumber > 1) {
                pageNumber--;
                changePageView();
            }

        });

        $('#' + tableID).find('.last').on('click', function () {
            if (tableValue.length + 9 >= k * pageCount) {
                pageNumber = pageCount;
                changePageView();
            } else {
                pageNumber = pageCount;
                downloadNext(1, 'last'); //load the records
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
        setNewPageCount();
        $('#' + tableID).find('.page-number').text(pageNumber + " / " + pageCount);
        updateTable();
    }
    ;

//update the values in the table which are shown 
    function updateTable() {
        var orderHistory = (tableID === 'order-history');
        var row = ''; //the new row <tr> of the table
        for (var i = 0; i < countOfRows; i++) { //for all rows of the table
            //Get the current row
            var rowOfTable = $(table).find('tr:eq( ' + i + ')');
            row = '<tr>';
            //if necessary record exist in the table
            if (tableValue[i + k * (pageNumber - 1)]) {
                //the loop by keys
                for (var key in keys) {
                    //add column with data
                    var templ = parseFloat(tableValue[i + k * (pageNumber - 1)][keys[key]]);
                    if (templ) {
                        if ((keys[key] !== 'Date') && (keys[key] !== 'Id'))
                            row += '<td>' + templ.toFixed(8) + '</td>';
                        else
                        if (keys[key] === 'Date') {
                            row += '<td>' + tableValue[i + k * (pageNumber - 1)][keys[key]] + '</td>';
                        }
                    } else {
                        row += '<td>' + tableValue[i + k * (pageNumber - 1)][keys[key]] + '</td>';

                    }
                }

                if (orderHistory) {
                    row += '<td class="delete" data-mooid="' + tableValue[i]['Id'] + '"><img src="/images/cross.png" style="width: 20px;"></td>';
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
            var orderHistory = (tableID === 'order-history');
            setNewPageCount();
            var row = '';         // the row of the table
            var rowTemplate = ''; // the body of the table
            for (var i = 0; i < countOfRows; i++) {
                row = '<tr>';
                for (var key in keys) {
                    if (keys[key] !== 'Id') {
                        var templ = parseFloat(tableValue[i][keys[key]]);
                        if (templ) {
                            if ((keys[key] !== 'Date') && (keys[key] !== 'Id'))
                                row += '<td>' + templ.toFixed(8) + '</td>';
                            else
                            if (keys[key] === 'Date') {
                                row += '<td>' + tableValue[i][keys[key]] + '</td>';
                            }
                        } else {
                            row += '<td>' + tableValue[i][keys[key]] + '</td>';

                        }
                    } else {
                        row += '<td class="delete" data-mooid="' + tableValue[i]['Id'] + '"><img src="/images/cross.png"></td>';
                    }
                }
                row += '</tr>';
                rowTemplate += row;
            }
            //Add HTML template to page
            $(table)
                    .html('')
                    .append(rowTemplate);

            if (10 < tableLength) {
                createPagination();
            }
            ;

            $(document).on('click', '.delete', function (e) {
                e.stopPropagation();
                var button = e.target;
                var mooidForRemove = $(button).parents('td').attr('data-mooid');
                // console.log(mooid);
                deleteRecord(user, mooidForRemove, tableValue.length);


            });
        }
        ,

        //Update the values of tableValue and change the records which are shown
        updateValue: function (object) {
            if (pageCount <= 20) {
                var value = object['first'];
                tableLength = object['count'];
                setNewPageCount();

                tableValue = value;

                if (countOfRows < tableLength) {
                    if ($('#' + tableID).find('.paginnation').length === 0)
                        createPagination();
                    countOfRows = k;
                } else {
                    deletePagination();
                }
                ;
                changePageView();
            } else {
                downloadNext(1, 'update');
                setNewPageCount();
                changePageView();
            }
        },

        removeRecord: function (id, newValue) {
            var numberForRemove = getNumberInTableById(id);
            if (numberForRemove)
                deleteRecordFromTable(numberForRemove, newValue);
        },

        addRecordAtTheTop(record) {
            addAtTopOfTable(record);
        }
    }
    ;
}
;


module.exports = Table;