var asf = {
    init: function() {
        console.log('Apache sever-status finer started');
        
        var self = this;
        this.applyCss();

        var tables = document.getElementsByTagName('table');
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            
            if (
                !table.rows || !table.rows[0] || !table.rows[0].cells 
                || table.rows[0].cells.length < 5
                || table.rows[0].cells[0].innerHTML !== 'Srv'
                || table.rows[0].cells[1].innerHTML !== 'PID'
                || table.rows[0].cells[2].innerHTML !== 'Acc'
            ) {
                continue;
            }
            table.classList.add('asf-table');
            for (var c = 0; c < table.rows[0].cells.length; c++) {
                table.rows[0].cells[c].innerHTML = '<a href="javascript:;">' + table.rows[0].cells[c].innerHTML + '</a>';
            }
            this.sortTableByColumn(table, 5);
            table.rows[0].addEventListener("click", function(e){ if (e.target.tagName == 'A') { self.onColumnClick(e.target); } });
        }
    },
    
    applyCss: function () {
        var css = '.asf-table { border: 1px solid #000; border-collapse: collapse; }' +
            '.asf-table td, .asf-table th { border: 1px solid #000; }' + 
            '.asf-table th { background: #ccccff; white-space: nowrap; }' +
            '.asf-table tr:nth-child(odd) { background: #ddffdd; }' +
            '.asf-table th.sort-down a, .asf-table th.sort-up a { display: block; position: relative; padding: 0 20px 0 0; }' + 
            '.asf-table th.sort-down a::after { display: block; position: absolute; top: 0; right: 0; width: 15px; height: 20px; content: "\u25be"; }' + 
            '.asf-table th.sort-up a::after { display: block; position: absolute; top: 0; right: 0; width: 15px; height: 20px; content: "\u25b4"; }'
        ;
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    },
    
    onColumnClick: function (where) {
        while (where && where.tagName !== 'TH') {
            where = where.parentNode;
        }
        var columnIndex = 0;
        var prev = where.previousSibling;
        while (prev) {
            prev = prev.previousSibling;
            columnIndex++;
        }
        table = where.parentNode;
        while (table && table.tagName !== 'TABLE') {
            table = table.parentNode;
        }
        if (table) {
            this.sortTableByColumn(table, columnIndex);
        }
    },
    
    sortTableByColumn: function (table, column) {
        var rows = table.rows;
        var head = rows[0];
        var dir = head.cells[column].classList.contains('sort-down') ? -1 : 1;
        for (var col = 0; col < head.cells.length; col++) {
            head.cells[col].classList.remove('sort-down', 'sort-up');
        }
        head.cells[column].classList.add(dir > 0 ? 'sort-down' : 'sort-up');
        for (var row1 = 1; row1 < rows.length - 1; row1++) {
            var found = row1;
            for (var row2 = row1 + 1; row2 < rows.length; row2++) {
                var v1 = rows[found].cells[column].innerHTML;
                var v2 = rows[row2].cells[column].innerHTML;
                var fv1 = parseFloat(v1) || 0;
                var fv2 = parseFloat(v2) || 0;
                if ((isNaN(fv1) && isNaN(fv2)) || fv1 === fv2) {
                    if (v1.localeCompare(v2) !== dir) {
                        found = row2;
                    }
                } else if (fv1 * dir < fv2 * dir) {
                    found = row2;
                }
            }
            if (found !== row1) {
                rows[row1].parentNode.insertBefore(rows[found], rows[row1]);
            }
        }
    }
    
};

setTimeout(function () { asf.init(); }, 1);
    