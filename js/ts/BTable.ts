namespace B {
    export class Dataset {
        public columnNames = {};
        public columns = [];
        public rows = [];
        constructor(colsList:string = "") {
            let list = colsList.split("\t");
            if (list.length == 1 && list[0].indexOf(",") > -1)list=colsList.split(",");
            for (let itmnum = 0; itmnum < list.length; itmnum++) {
                this.columnNames[list[itmnum]] = this.columns.length;
                this.columns.push(list[itmnum]);
            }
        }
    }

    export class TableColumn {
        public id = "BEEF";
        public width = "0";
        public just = "L";
        public head = "";
        public headJust = "L";
        constructor(id:string, width:string, just:string = "L", head:string="", headJust:string="L") {
            this.id = id;
            this.width = width;
            this.just = just;
            this.head = head;
            this.headJust = headJust;
        }
    }

    export class Table {
        public id:string = "";
        static cache = null;
        private container = null;
        private table = null;
        private tableContainer = null;
        public footer = null;
        private footerBox = null;
        private footerButtonContainer = null;
        private footerMessageContainer = null;
        private freezeCover = null;
        private freezeTextElement = null;
        private freezeTimer = null;
        public rowCountTitle = "row";
        public rowCountTitle2 = "";
        private rowWatcher = null;
        public dataset = null;
        public pickedRow = null;
        private thead = null;
        private tbody = null;
        private tfoot = null;
    
        public columns = {};
        public columnList = [];
        public anyHeaders = false;
        preRowRender(rn:number,row:object,cells:object,rd:object) { return true; }
        onclick(td:object, tr:object, rd:object, changed:boolean) { return; }
        ondblclick(td:object, tr:object, rd:object) { return; }

        setTableHeight(height:string) {
            this.tableContainer.style.height = height;
            this.tableContainer.style.overflowY = "scroll";
        }
        constructor(tbl:string, id:string, datasetCodes:string, title:string="") {
            if (Table.cache == null) Table.cache = [];
            this.table = document.getElementById(tbl);
            this.container = document.createElement("div");
            this.container.style.cssText = "display:inline-block; margin:0; border:0; padding:0; position:relative;";
            this.table.parentNode.insertBefore(this.container, this.table);
            // Move the table as defined in the HTML into the container
            this.container.appendChild(this.table);
            // Add a container around it to be scrolled (if necessary)
            this.tableContainer = document.createElement("div");
            this.tableContainer.style.cssText = "overflow-y:overlay; overflow-x:hidden; " +
                "overflow-style:-ms-autohiding-scrollbar; " +
                "display:inline-block; " +
                "margin:0; border:0; padding:0;";
            this.tableContainer.style.width = this.table.style.width;
            this.table.parentNode.insertBefore(this.tableContainer, this.table);
            this.tableContainer.appendChild(this.table);

            this.id = id;

            if (this.table.rows.length > 0 && this.table.rows[0].cells[0].tagName.toUpperCase() == "TH") {
                let cells = this.table.rows[0].cells;
                for (let cellnum = 0; cellnum < cells.length; cellnum++) {
                    let cell = cells[cellnum];
                    let data = cell.getAttribute("data").split(",");
                    while (data.length < 3) data.push("");
        
                    let col = new TableColumn(data[0], data[1], data[2], cell.innerHTML, data[3]);
                    if (col.head != "") this.anyHeaders = true;
                    this.columnList.push(col);
                    this.columns[col.id] = col;
                }
                cells[cells.length-1].style.paddingRight = "20px"; // Make room for scrollbar??
            }
            // Initialize the table
            this.table.innerHTML = ""; // Clear it first
            this.table.className = "BTable";
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
            this.table.setAttribute("data-BTABLE", Table.cache.length);
            if ("IntersectionObserver" in window) {
                    this.rowWatcher = new IntersectionObserver(function(entries, observer) {
                    for (let i = 0; i < entries.length; i++) {
                        let entry = entries[i];
                        if (entry.isIntersecting) {
                            let tr = entry.target as HTMLTableRowElement;
                            let table = util.parentNode(tr, "table");
                            let cacheNumber = table.getAttribute("data-BTABLE");
                            let btbl = Table.cache[cacheNumber];
                            btbl.renderRow(tr.rowIndex-1);
                            btbl.rowWatcher.unobserve(tr);
                        }
                    }
                }, {root:this.table});
            }
            Table.cache.push(this);

            this.table.onclick = function(event) {
                let td = event.target;
                let tr = util.parentNode(td, "tr");
                let table = util.parentNode(tr, "table");
                let cacheNumber = table.getAttribute("data-BTABLE");
                let btbl = Table.cache[cacheNumber];
                let rn = tr.rowIndex;
                if (btbl.anyHeaders) rn--;
                let rd = btbl.dataset.rows[rn]; 
                let curtr = btbl.getTableRow();
                let changed = false;
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
                for (let key in btbl.footer.buttons) {
                    let btn = btbl.footer.buttons[key];
                    if (btn.track && !btn.enabled) btn.enable();
                }
                // Do user click action (if any)
                let cells = btbl.makeCellsCollection(tr);
                if (btbl.onclick != null) btbl.onclick.call(btbl, td, tr, rd, cells, changed);
            }
            this.table.ondblclick = function(event) {
                // In order to be double-clicked, it must have been clicked
                // The click event would handle the visual aspects, etc.
                let td = event.target;
                let tr = util.parentNode(td, "tr");
                let table = util.parentNode(tr, "table");
                let cacheNumber = table.getAttribute("data-BTABLE");
                let btbl = Table.cache[cacheNumber];
                let rn = tr.rowIndex;
                if (btbl.anyHeaders) rn--;
                let rd = btbl.dataset.rows[rn]; 
                let currd = btbl.getDataRow();
                let curtr = btbl.getTableRow();
                btbl.pickedRow = rd;
                let cells = btbl.makeCellsCollection(tr);
                if (btbl.ondblclick != null) btbl.ondblclick.call(btbl, td, tr, rd, cells);
            }
            // Add the table footer where commands display
            this.footerBox = document.createElement("div");
            this.footerBox.style.cssText = "display:block; height:1.8em; background-color: gainsboro; padding-left:0; padding-right:.3em;";
            this.container.appendChild(this.footerBox);

            let table = document.createElement("table");
            table.style.cssText = "width: 100%; height:100%";
            let tr = table.insertRow(-1);
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
                addButton: function(id:string,title:string,onclick:object,track:boolean=false) {
                    let obj = {
                        id:id, 
                        title:title, 
                        position:this.buttonList.length, 
                        div:null, 
                        enabled:true, 
                        onclick:onclick, 
                        track: track,
                        table:this,
                        enable: function(yorn:boolean=true) {
                            if (yorn != undefined && yorn == false) {
                                this.disable();
                                return;
                            }
                            this.enabled = true;
                            this.div.style.cursor = "pointer";
                            //this.div.style.color = "";
                            //this.div.className = "BTableFooterButton enabled";
                            this.div.removeAttribute("disabled");
                        },
                        disable: function(yorn:boolean=true) {
                            if (yorn != undefined && yorn == false) {
                                this.enable();
                                return;
                            }
                            this.enabled = false;
                            this.div.style.cursor = "default";
                            //this.div.style.color = "firebrick";
                            //this.div.onmouseover = function() {}
                            //this.div.className = "BTableFooterButton";
                            this.div.setAttribute("disabled", "disabled");
                        }
                    };
                    let btn = document.createElement("button");
                    btn.className = "BTableFooterButton enabled";
                    btn.setAttribute("data-BTABLE", this.tableObject.table.getAttribute("data-BTABLE"));
                    btn.setAttribute("data-BUTTONID", id);
                    
                    btn.innerHTML = title;
                    btn.id = this.tableObject.id + "_BTN_" + this.buttonList.length;
                    btn.onclick = function() {
                        let div:any = event.target;
                        let cacheNumber = div.getAttribute("data-BTABLE");
                        let btbl = Table.cache[cacheNumber];
                        let btn = btbl.footer.buttons[div.getAttribute("data-BUTTONID")];
                        if (btn.enabled) {
                            let tblRow = btbl.getTableRow();
                            let cells = null;
                            if (tblRow != undefined) {
                                cells = btbl.makeCellsCollection(btbl.getTableRow());
                            }
                            btn.onclick.call(btn, btbl.pickedRow, cells);
                        }
                    }
                    obj.div = btn;
                    this.tableObject.footerButtonContainer.appendChild(btn);
                    this.buttons[id] = obj;
                    if (this.buttonList.length > 0) btn.style.marginLeft = ".25em";
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
            this.dataset = new Dataset(datasetCodes);                
        }

        getDataRow(rownum:number) {
            if (rownum == undefined) {
                if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
            }
            return (rownum == null ? null : this.dataset.rows[rownum]);        
        }
        getTableRow(rownum:number) {
            if (rownum == undefined) {
                if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
            }
            return (rownum == null ? null : this.tbody.rows[rownum]);
        }
        getTableRowCells(rownum:number) {
            if (rownum == undefined) {
                if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
            }
            return (rownum == null ? null : this.tbody.rows[rownum]);
        }
        addRows(data:string) {
            let rows = data.split("\n");
            for (let i = 0; i < rows.length; i++) {
                this.addRow(rows[i].split("\t"));
            }
        }
        addRow(argumentList:any) {
            let rowData = {ROWNUM:-1};
            let args = arguments;
            if (arguments.length == 1 && arguments[0].constructor === Array) args = arguments[0];
            for (let argnum = 0; argnum < args.length; argnum++) {
                // Data is provided in the order defined in the dataset
                if (this.dataset.columns.length > argnum) {
                    let colname = this.dataset.columns[argnum];
                    rowData[colname] = args[argnum];
                } else {
                    let colname = "COL_" + argnum;
                    rowData[colname] = args[argnum];
                }
            }
            rowData.ROWNUM = this.dataset.rows.length;
            this.dataset.rows.push(rowData);
        
            let tr = this.preloadRowToTable(this.dataset.rows.length-1);
            if ("IntersectionObserver" in window) { 
                this.rowWatcher.observe(tr); 
            } else {
                this.renderRow(tr.rowIndex-1);
            }
            this.setMessage();
            return tr;
        }
        setMessage(msg:string="") {
            if (msg == "") {
                let count = this.dataset.rows.length;
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
        preloadRowToTable(rownum:number) {
            let tr = document.createElement("tr");
            tr.style.cssText = "cursor:pointer";
            let td = document.createElement("td");
            td.innerHTML = "&nbsp;";
            td.colSpan = this.columnList.length;
            tr.appendChild(td);
            this.tbody.appendChild(tr);
            return tr;
        }
        makeCellsCollection(tr:any) {
            let rownum = tr.rowIndex;
            if (this.anyHeaders) rownum--; // Skipt the header row
            let cells = {}; // Named map of td elements
            if (rownum >= 0) {
                for (let colnum = 0; colnum < this.columnList.length; colnum++) {
                    let column = this.columnList[colnum];
                    let html = this.dataset.rows[rownum][column.id];
                    if (html == undefined) html = "";
                    html = html.toString(); // just in case the data was a number, etc.
                    let el = tr.cells[colnum];
                    cells[column.id] = el;
                }
            }
            return cells;
        }
        renderRow(rownum:number) {
            if (rownum == undefined) {
                if (this.pickedRow != null) rownum = this.pickedRow.ROWNUM;
            }
            let tr = this.table.rows[rownum+1];
            tr.innerHTML = ""; // Empty it of cells;
            let cells = {}; // Named map of td elements
            for (let colnum = 0; colnum < this.columnList.length; colnum++) {
                let column = this.columnList[colnum];
                let html = this.dataset.rows[rownum][column.id];
                if (html == undefined) html = "";
                html = html.toString(); // just in case the data was a number, etc.
                let el = document.createElement("td");
               
                // Type can be string, int, float, money, bool, date, datetime
                let dsObj = this.dataset.columns[column.id];
                if (dsObj != null) {
                    if (dsObj.autoTrim) html = html.trim();
                    if (dsObj.type == "money") {
                        html = B.format.money(html);
                    } else if (dsObj.type == "bool") {
                        let isYes = false;
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
        
                let just = column.just;
                just = (just=="C"?"center":(just=="R"?"right":"left"));
                if (just != "") el.style.textAlign = just;
                tr.appendChild(el);
                cells[column.id] = el;
            }
            tr.cells[tr.cells.length-1].style.paddingRight = "20px"; // Make room for scrollbar??
            this.preRowRender(this.table.rows.length,tr,cells,this.dataset.rows[rownum]);
            return tr;
        }

        freeze(text:string, withTimer:boolean=true) {
            this.thaw();
            let div = util.freezeArea(this.container);
            this.freezeCover = div;
            if (text == undefined) text = "";
            //this.freezeTimer = new B.Stopwatch(50, true);
            this.freezeTextElement = B.util.addOverlayText(div, text);//, this.freezeTimer);
        }
        thaw() {
            if (this.freezeTimer != null) {
                this.freezeTimer.stop();
            }
            B.util.killElement(this.freezeTextElement, this.freezeCover);
        }
        
    }
}



