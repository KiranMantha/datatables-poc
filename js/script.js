"use strict";
var dt = (function () {
    var data_table;

    function ajaxCall(options) {
        var defer = $.Deferred();
        $.ajax(options)
            .done(function (result) {
                defer.resolve(result)
            })
            .fail(function (result) {
                defer.reject(result);
            });

        return defer.promise();
    }

    function attachTableClickEventHandlers() {
        //row/column indexing is zero based
        $("#example thead tr th").click(function () {    
            col_num = parseInt($(this).index());
            console.log("column_num =" + col_num);  
        });
        $("#example tbody tr td").click(function () {    
            col_cell = parseInt($(this).index());
            row_cell = parseInt($(this).parent().index());   
            console.log("Row_num =" + row_cell + "  ,  column_num =" + col_cell);
        });
    }

    function addRowColumnButtonHandlers() {

        $("#btnAddRow").click(function () {
            //adding/removing row from datatable datasource
            //create test new record
            var aoCols = data_table.fnSettings().aoColumns;
            var newRow = new Object();
            for (var iRec = 0; iRec < aoCols.length; iRec++) {

                if (aoCols[iRec]._sManualType === "date") {
                    newRow[aoCols[iRec].mDataProp] = "2011/03/25";
                } else if (aoCols[iRec]._sManualType === "numeric") {
                    newRow[aoCols[iRec].mDataProp] = 10;
                } else if (aoCols[iRec]._sManualType === "string") {
                    newRow[aoCols[iRec].mDataProp] = 'testStr';
                }
            }
            results.splice(row_cell + 1, 0, newRow);
            data_table.fnDestroy();
            loadTable();
        });

        $('#btnAddCol').click(function () {

            //new column information
            //row's new field(for new column)
            //cols must be updated
            cols.splice(col_num + 1, 0, {
                "mDataProp": "newField" + iter,
                sTitle: "Col-" + iter,
                sType: "string"
            });
            //update the result, actual data to be displayed
            for (var iRes = 0; iRes < results.length; iRes++) {
                results[iRes]["newField" + iter] = "data-" + iter;
            }
            //destroy the table
            data_table.fnDestroy();
            $("#example thead tr th").eq(col_num).after('<th>Col-' + iter + '</th>');
            //init again
            loadTable();
            iter++;
        });
    }

    function loadTable() {
        $.get("db/db.json", function (data) {
            var cols = [{
                    "mDataProp": "first_name",
                    sTitle: "FName"
                },
                {
                    "mDataProp": "last_name",
                    sTitle: "LName"
                },
                {
                    "mDataProp": "email",
                    "sTitle": "Email"
                },
                {
                    "mDataProp": "gender",
                    sTitle: "Gender"
                }
            ];
            data_table = $('#example').DataTable({
                data: data.slice(0, 5),
                columns: cols,
                bDeferRender: true,
                bDestroy: true,
                scrollY: "300px",
                scrollX: true,
                scrollCollapse: true,
                pagingType: 'numbers',
                pageLength: 50,
                fixedColumns: {
                    leftColumns: 2
                }
            });
            attachTableClickEventHandlers();
        });
    }
    return {
        loadTable: loadTable
    }
})();