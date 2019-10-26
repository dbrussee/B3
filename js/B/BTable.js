// Initialze B container if needed
if (window.B == undefined) window.B = { }
if (B.system == undefined) B.system = { }
if (B.system.tableCache == undefined) B.system.tableCache = []
B.system.tablePaddingForScrollbar = "20px";

B.Dataset = function(colsList) {
	this.columnNames = {};
    this.columns = [];
    var list = colsList.split("\t");
    if (list.length == 1 && list[0].indexOf(",") > -1)list=colsList.split(",");
    for (var itmnum = 0; itmnum < list.length; itmnum++) {
    	this.columnNames[list[itmnum]] = this.columns.length;
        this.columns.push(list[itmnum]);
    }
    this.rows = [];
}

B.TableColumn = function(id, width, just, head, headJust) {
    this.id = id; // Must have an id!!!
    if (width == undefined || width == "") width = "0";
    if (just == undefined || just == "") just = "L"
    if (head == undefined) head = "";
    if (headJust == undefined || headJust == "") headJust = just;
    this.width = width;
    this.just = just;
    this.head = head;
    this.headJust = headJust;
}

B.Table = function(tbl, id, datasetCodes, title) {
    if (typeof tbl == "string") tbl = document.getElementById(tbl);
    // Create the overall container. It contains:
    // 1. A container for the table itself
    // 1.1 The table
    // 2. A footer that contains 'buttons' and row totals
    this.container = document.createElement("div");
    this.container.style.cssText = "display:inline-block; margin:0; border:0; padding:0; position:relative; ";
    tbl.parentNode.insertBefore(this.container, tbl);
    // Make room for a table title
    this.titleBox = document.createElement("div");
    this.titleBox.style.cssText = "font-size:1.25em;"
    if (title == undefined) title = "";
    this.titleBox.innerHTML = title;
    this.container.appendChild(this.titleBox);
    // Now the actual table gets repositioned inside the container
    this.container.appendChild(tbl);
    this.freezeCover = null;
    this.freezeTextElement = null;
    this.freezeTimer = null;

    if (tbl.tagName.toUpperCase() == "TABLE") {
        // The referenced item is actually a table. 
        // We need to add a container around it to be scrolled (if necessary)
        this.tableContainer = document.createElement("div");
        this.tableContainer.style.cssText = "overflow-y:overlay; overflow-x:hidden; " +
            "overflow-style:-ms-autohiding-scrollbar; " +
            "display:inline-block; " +
            "margin:0; border:0; padding:0;";
        this.tableContainer.style.width = tbl.style.width;
        tbl.parentNode.insertBefore(this.tableContainer, tbl);
        this.tableContainer.appendChild(tbl);
        this.table = tbl;
    } else {
        this.container = tbl;
        this.table = document.createElement("table");
        this.container.appendChild(tbl);
    }
    this.id = id;

    this.rowCountTitle = "row";
    this.rowCountTitle2 = "";

    this.columns = {};
    this.columnList = [];
    this.anyHeaders = false;
    this.preRowRender = function(rn,row,cells,rd) { return true; }
    this.onclick = null; //function(td, tr, rd, changed) { return; }
    this.ondblclick = null; //function(td, tr, rd) { return; }
    if (this.table.rows.length > 0 && this.table.rows[0].cells[0].tagName.toUpperCase() == "TH") {
        var cells = this.table.rows[0].cells;
        for (var cellnum = 0; cellnum < cells.length; cellnum++) {
            var cell = cells[cellnum];
            var data = cell.getAttribute("data").split(",");
            while (data.length < 3) data.push("");

            var col = new B.TableColumn(data[0], data[1], data[2], cell.innerHTML, data[3]);
            if (col.head != "") this.anyHeaders = true;
            this.columnList.push(col);
            this.columns[col.id] = col;
        }
        cells[cells.length-1].style.paddingRight = B.system.tablePaddingForScrollbar; // Make room for scrollbar??
    }
    // Initialize the table
    this.table.innerHTML = ""; // Clear it first
    this.table.style.borderSpacing = "0";
    this.table.style.borderCollapse = "separate";
    this.table.style.tableLayout = "fixed";
    this.table.style.border = "0";
    if (this.columnList.length > 1) {
        let colgroup = document.createElement("colgroup");
        this.columnList.forEach(function(itm) {
            let col = document.createElement("col");
            if (itm.width > 0) col.style.width = itm.width + "px";
            colgroup.appendChild(col);
        })
        this.table.appendChild(colgroup);
    }
    this.thead = document.createElement("thead");
    this.table.appendChild(this.thead);
    this.tfoot = document.createElement("tfoot");
    this.table.appendChild(this.tfoot);
    this.tbody = document.createElement("tbody");
    this.table.appendChild(this.tbody);
    if (this.anyHeaders) {
        let tr = document.createElement("tr");
        tr.style.border = "10px";
        this.columnList.forEach(function(itm) {
            let el = document.createElement("th");
            el.className = "th";
            el.style.cssText = "position:sticky; top:0;";
            el.innerHTML = itm.head;
            let just = itm.headJust;
            just = (just=="C"?"center":(just=="R"?"right":"left"));
            if (just != "") el.style.textAlign = just;
            tr.appendChild(el);
        })
        this.thead.appendChild(tr);
    }
    this.table.setAttribute("data-BTABLE", B.system.tableCache.length);
    if ("IntersectionObserver" in window) {
        this.rowWatcher = new IntersectionObserver(function(entries, observer) {
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                if (entry.isIntersecting) {
                    var tr = entry.target;
                    var table = B.util.parentNode(tr, "table");
                    var cacheNumber = table.getAttribute("data-BTABLE");
                    var btbl = B.system.tableCache[cacheNumber];
                    btbl.renderRow(tr.rowIndex-1);
                    btbl.rowWatcher.unobserve(tr);
                }
            }
        }, {root:this.tableContainer})
    }
    B.system.tableCache.push(this);

    this.pickedRow = null;
    this.table.onclick = function(event) {
        var td = event.target;
        var tr = B.util.parentNode(td, "tr");
        var table = B.util.parentNode(tr, "table");
        var cacheNumber = table.getAttribute("data-BTABLE");
        var btbl = B.system.tableCache[cacheNumber];
        var rn = tr.rowIndex;
        if (btbl.anyHeaders) rn--;
        var rd = btbl.dataset.rows[rn]; 
        var curtr = btbl.getTableRow();
        var changed = false;
        if (curtr == null) {
            changed = true;
        } else if (curtr != tr) {
            changed = true;
            if (curtr.className == "pickedRow") {
                curtr.className = "";
            }
        }
        if (tr.className != "pickedRow") tr.className = "pickedRow";
        btbl.pickedRow = rd;
        // Handle tracked footer buttons
        for (var key in btbl.footer.buttons) {
            var btn = btbl.footer.buttons[key];
            if (btn.track && !btn.enabled) btn.enable();
        }
        // Do user click action (if any)
        var cells = btbl.makeCellsCollection(tr);
        if (btbl.onclick != null) btbl.onclick.call(btbl, td, tr, rd, cells, changed);
    }
    this.table.ondblclick = function(event) {
        // In order to be double-clicked, it must have been clicked
        // The click event would handle the visual aspects, etc.
        var td = event.target;
        var tr = B.util.parentNode(td, "tr");
        var table = B.util.parentNode(tr, "table");
        var cacheNumber = table.getAttribute("data-BTABLE");
        var btbl = B.system.tableCache[cacheNumber];
        var rn = tr.rowIndex;
        if (btbl.anyHeaders) rn--;
        var rd = btbl.dataset.rows[rn]; 
        var currd = btbl.getDataRow();
        var curtr = btbl.getTableRow();
        btbl.pickedRow = rd;
        var cells = btbl.makeCellsCollection(tr);
        if (btbl.ondblclick != null) btbl.ondblclick.call(btbl, td, tr, rd, cells);
    }
    // Add the table footer where commands display
    this.footerBox = document.createElement("div");
    this.footerBox.style.cssText = "font-size:.9em; display:block; height:1.8em; background-color: gainsboro; padding-left:0; padding-right:.3em;";
    this.container.appendChild(this.footerBox);

    var table = document.createElement("table");
    table.style.cssText = "width: 100%; height:100%";
    var tr = table.insertRow(-1);
    this.footerButtonContainer = tr.insertCell(-1);
    this.footerButtonContainer.style.cssText = "";
    this.footerMessageContainer = tr.insertCell(-1);
    this.footerMessageContainer.style.cssText = "text-align:right; width:30%; font-size:.8em;";
    this.footerBox.appendChild(table);

    this.footerMessageContainer.innerHTML = "&nbsp;";
    this.footer = {
        tableObject: this,
        buttons: {},
        buttonList: [],
        addButton: function(id,title,onclick,track) {
            if (track == undefined) track = false;
            var obj = {
                id:id, 
                title:title, 
                position:this.buttonList.length, 
                div:null, 
                enabled:true, 
                onclick:onclick, 
                track: track,
                table:this,
                enable: function(yorn) {
                    if (yorn != undefined && yorn == false) {
                        this.disable();
                        return;
                    }
                    this.enabled = true;
                    this.div.style.cursor = "pointer";
                    this.div.style.color = "";
                    this.div.className = "BTableFooterButton enabled";
                },
                disable: function(yorn) {
                    if (yorn != undefined && yorn == false) {
                        this.enable();
                        return;
                    }
                    this.enabled = false;
                    this.div.style.cursor = "default";
                    this.div.style.color = "firebrick";
                    this.div.onmouseover = function() {}
                    this.div.className = "BTableFooterButton";
                }
            };
            var div = document.createElement("div");
            div.className = "BTableFooterButton enabled";
            div.setAttribute("data-BTABLE", this.tableObject.table.getAttribute("data-BTABLE"));
            div.setAttribute("data-BUTTONID", id);
             
            div.innerHTML = title;
            div.id = this.tableObject.id + "_BTN_" + this.buttonList.length;
            div.onclick = function() {
                var div = event.target;
                var cacheNumber = div.getAttribute("data-BTABLE");
                var btbl = B.system.tableCache[cacheNumber];
                var btn = btbl.footer.buttons[div.getAttribute("data-BUTTONID")];
                if (btn.enabled) {
                    var tblRow = btbl.getTableRow();
                    var cells = null;
                    if (tblRow != undefined) {
                        cells = btbl.makeCellsCollection(btbl.getTableRow());
                    }
                    btn.onclick.call(btn, btbl.pickedRow, cells);
                }
            }
            obj.div = div;
            this.tableObject.footerButtonContainer.appendChild(div);
            this.buttons[id] = obj;
            this.buttonList.push(id);
            if (track && this.tableObject.dataset.pickedRow == null) {
                obj.disable();
            } else {
                obj.enable();
            }
            return obj;
        }
    }
    if (this.table.style.height != "") {
    	this.setTableHeight(this.table.style.height);
    	this.table.style.height = "";
    }
    this.table.style.visibility = "visible";
    this.dataset = new B.Dataset(datasetCodes);
    
    this.linkedForm = null;
}
B.Table.prototype.getDataRow = function(rownum) {
    if (rownum == undefined) {
        if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
    }
    return (rownum == null ? null : this.dataset.rows[rownum]);
}
B.Table.prototype.getTableRow = function(rownum) {
    if (rownum == undefined) {
        if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
    }
    return (rownum == null ? null : this.tbody.rows[rownum]);
}
B.Table.prototype.getTableRowCells = function(rownum) {
    if (rownum == undefined) {
        if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
    }
    return (rownum == null ? null : this.tbody.rows[rownum]);
}


B.Table.prototype.setTableHeight = function(height) {
    this.tableContainer.style.height = height;
    this.tableContainer.style.overflowY = "scroll";
}
B.Table.prototype.addRows = function(data) {
    var rows = data.split("\n");
    for (var i = 0; i < rows.length; i++) {
    	this.addRow(rows[i].split("\t"));
    }
}
B.Table.prototype.addRow = function() {
    let rowData = {};

    let args = arguments;
    if (arguments.length == 1 && arguments[0].constructor === Array) args = arguments[0];
    for (let argnum = 0; argnum < args.length; argnum++) {
        // Data is provided in the order defined in the dataset
        if (this.dataset.columns.length > argnum) {
            var colname = this.dataset.columns[argnum];
            rowData[colname] = args[argnum];
        } else {
            var colname = "COL_" + argnum;
            rowData[colname] = args[argnum];
        }
    }
    rowData.ROWNUM = this.dataset.rows.length;
    this.dataset.rows.push(rowData);

    var tr = this.preloadRowToTable(this.dataset.rows.length-1);
    if ("IntersectionObserver" in window) { 
        this.rowWatcher.observe(tr); 
    } else {
        this.renderRow(tr.rowIndex-1);
    }
    this.setMessage();
    return tr;
}
B.Table.prototype.linkForm = function(formId) {
	if (formId == undefined || formId == null) {
		this.linkedForm = null;
	} else {
		this.linkedForm = formId;
	}
}
B.Table.prototype.edit = function(rownum) {
	if (this.linkedForm == null) return;
	var frm = B.getForm(this.linkedForm);
	frm.setFromTableRow(this, rownum);
	openDialog(this.linkedForm);
}

B.Table.prototype.setMessage = function(msg) {
    if (msg == undefined || msg == null || msg == "") {
        var count = this.dataset.rows.length;
        if (count == 1) {
            this.footerMessageContainer.innerHTML = count + " " + this.rowCountTitle;
        } else {
            if (this.rowCountTitle2 == "") {
                this.rowCountTitle2 = this.rowCountTitle + "s";
            }
            this.footerMessageContainer.innerHTML = B.format.numberWithCommas(count) + " " + this.rowCountTitle2;
        }
    }
}
B.Table.prototype.freeze = function(text, withTimer) {
	this.thaw();
    var div = B.util.freezeArea(this.container);
    this.freezeCover = div;
    if (text == undefined) text = "";
    this.freezeTimer = new B.Stopwatch(50, true);
    this.freezeTextElement = B.util.addOverlayText(div, text, this.freezeTimer);
}
B.Table.prototype.thaw = function() {
	if (this.freezeTimer != null) {
		this.freezeTimer.stop();
	}
	B.util.killElement(this.freezeTextElement, this.freezeCover);
}
B.Table.prototype.preloadRowToTable = function(rownum) {
    let tr = document.createElement("tr");
    tr.style.cssText = "cursor:pointer";
    let td = document.createElement("td");
    td.innerHTML = "&nbsp;";
    td.colSpan = this.columnList.length;
    tr.appendChild(td);
    this.tbody.appendChild(tr);
    return tr;
}
B.Table.prototype.makeCellsCollection = function(tr) {
    var rownum = tr.rowIndex;
    if (this.anyHeaders) rownum--; // Skipt the header row
    var cells = {}; // Named map of td elements
    for (var colnum = 0; colnum < this.columnList.length; colnum++) {
        var column = this.columnList[colnum];
        var html = this.dataset.rows[rownum][column.id];
        if (html == undefined) html = "";
        html = html.toString(); // just in case the data was a number, etc.
        var el = tr.cells[colnum];
        cells[column.id] = el;
    }
    return cells;
}
B.Table.prototype.renderRow = function(rownum) {
    if (rownum == undefined) {
        if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
    }
    var tr = this.tbody.rows[rownum];
    tr.innerHTML = ""; // Empty it of cells;
    var cells = {}; // Named map of td elements
    for (var colnum = 0; colnum < this.columnList.length; colnum++) {
        var column = this.columnList[colnum];
        var html = this.dataset.rows[rownum][column.id];
        if (html == undefined) html = "";
        html = html.toString(); // just in case the data was a number, etc.
        var el = document.createElement("td");
       
        // Type can be string, int, float, money, bool, date, datetime
        var dsObj = this.dataset.columns[column.id];
        if (dsObj != null) {
            if (dsObj.autoTrim) html = html.trim();
            if (dsObj.type == "money") {
                html = B.format.money(html);
            } else if (dsObj.type == "bool") {
                var isYes = false;
                if (html != "") {
                    html = html.toUpperCase().trim();
                    if (html == "TRUE") {
                        isYes = true;
                    } else {
                        if (html.substr(0,1) == "Y") {
                            isYes = true;
                        }
                    }
                    html = (isYes) ? "&#x2714;" : "&nbsp;";
                }
            }
        }
       
        el.innerHTML = html;

        var just = column.just;
        just = (just=="C"?"center":(just=="R"?"right":"left"));
        if (just != "") el.style.textAlign = just;
        tr.appendChild(el);
        cells[column.id] = el;
    }
    tr.cells[tr.cells.length-1].style.paddingRight = B.system.tablePaddingForScrollbar; // Make room for scrollbar??
    this.preRowRender(this.table.rows.length,tr,cells,this.dataset.rows[rownum]);
    return tr;
}
