"use strict";
var dt = (function () {
    var data_table,
        dt_cols = [{
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
            data_table.destroy();
            var index = $('th').index($('th[data-colGroup="details"]'));
            var position = parseInt($('th[data-colGroup="details"]').attr('colspan'));
            var target_insertion = index + position;
            $($('#example thead tr:first-child').find($('th[data-colGroup="details"]')).get(0)).attr('colspan', position + 1);
            $('#example thead tr:last-child th[data-colGroup="details"]:last-of-type').after($('<th></th>').html('IP').attr('data-colGroup', 'details'));
            dt_cols.splice(target_insertion, 0, {
                "mDataProp": "ip_address",
                sTitle: "IP"
            });
            loadTable();
        });
    }

    function loadTable() {
        $.get("db/db.json", function (data) {
            data_table = $('#example').DataTable({
                data: data.slice(0, 5),
                columns: dt_cols,
                bDeferRender: true,
                bDestroy: true,
                scrollY: "300px",
                scrollX: true,
                scrollCollapse: true,
                pagingType: 'numbers',
                pageLength: 50,
                fixedHeader: true,
                fixedColumns: {
                    leftColumns: 2
                }
            });
            window.data_table = data_table;
            addRowColumnButtonHandlers();
        });
    }

    function loadJqGrid() {
        $.get("db/db.json", function (data) {
            var jqcols = [{
                    label: 'FName',
                    name: 'first_name',
                    key: true,
                    width: 75
                },
                {
                    label: 'LName',
                    name: 'last_name',
                    width: 150
                },
                {
                    label: 'Email',
                    name: 'email',
                    width: 150
                },
                {
                    label: 'Gender',
                    name: 'gender',
                    width: 150
                }
            ];
            jqtable = $("#jqtable").jqGrid({
                datatype: "local",
                data: data.slice(0, 5),
                colModel: jqcols,
                idPrefix: "g1_",
                guiStyle: "bootstrap",
                viewrecords: true,
                rowNum: 20,
                pager: "#jqtablePager"
            });
        });
    }
    return {
        loadTable: loadTable,
        loadJqGrid: loadJqGrid
    }
})();