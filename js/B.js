var B;
(function (B) {
    B.version = '2.1ts';
})(B || (B = {}));
(function (B) {
    var format;
    (function (format) {
        function numberWithCommas(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        format.numberWithCommas = numberWithCommas;
        function money(num) {
            return new Number(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        }
        format.money = money;
    })(format = B.format || (B.format = {}));
})(B || (B = {}));
(function (B) {
    var util;
    (function (util) {
        function killElement() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var i = 0; i < arguments.length; i++) {
                var el = arguments[i];
                if (el != null) {
                    if (el.parentNode != null) {
                        el.parentNode.removeChild(el);
                        el = null;
                    }
                }
            }
        }
        util.killElement = killElement;
        function makeElement(html) {
            var div = document.createElement('div');
            div.innerHTML = html.trim();
            // Change this to div.childNodes to support multiple top-level nodes
            return div.firstChild;
        }
        util.makeElement = makeElement;
        function freezeArea(el) {
            var div = document.createElement("div");
            var clrA = "white";
            var clrB = "cadetblue";
            div.style.cssText = "position:absolute; " +
                "z-index:1; " +
                "background: repeating-linear-gradient(-45deg, " + clrA + ", " + clrA + " 10px, " + clrB + " 10px, " + clrB + " 20px); " +
                "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=10)'; " + // IE8
                "filter: alpha(opacity=10); " + // IE 5-7
                "opacity: 0.10; " +
                "cursor: default; " +
                "left:0; top:0; width:100%;height:100%; " +
                "overflow:auto; ";
            el.appendChild(div);
            return div;
        }
        util.freezeArea = freezeArea;
        function addOverlayText(el, text) {
            var container = document.createElement("div");
            container.style.cssText = "position: absolute; ";
            container.style.height = el.style.height;
            container.style.width = el.style.width;
            container.style.top = el.style.top;
            container.style.left = el.style.left;
            el.insertAdjacentElement("afterend", container);
            var div = document.createElement("div");
            div.style.cssText = "z-index: 2; " +
                "padding: .5em; background: rgba(240,248,255,.9); border-radius: .2em; width: 75%;" +
                "position: absolute; top: 50%; left: 50%; text-align: center; box-shadow: 1px 1px 2px black;" +
                "-ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); ";
            /*if (timer != null) {
                var spinDiv = document.createElement("div");
                spinDiv.style.cssText = "position: absolute; top:2px; left:2px;";
                spinDiv.appendChild(timer.canvas);
                timer.canvas.style.padding = "2px";
                div.appendChild(spinDiv);
                div.style.minHeight = (timer.canvas.height + 15) + "px";
                div.style.paddingLeft = (timer.canvas.width + 10) + "px";
            }
            */
            var spn = document.createElement("span");
            spn.innerHTML = text;
            div.appendChild(spn);
            container.appendChild(div);
            return container;
        }
        util.addOverlayText = addOverlayText;
        function parentNode(obj, parentType) {
            var pn = obj.parentNode;
            if (parentType != undefined) {
                while (pn != null && pn.tagName.toUpperCase() != parentType.toUpperCase()) {
                    pn = pn.parentNode;
                }
            }
            return pn;
        }
        util.parentNode = parentNode;
        function compare(obj1, obj2) {
            //Loop through properties in object 1
            for (var p in obj1) {
                //Check property exists on both objects
                if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p))
                    return false;
                switch (typeof (obj1[p])) {
                    //Deep compare objects
                    case 'object':
                        if (!compare(obj1[p], obj2[p]))
                            return false;
                        break;
                    //Compare function code
                    case 'function':
                        if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString()))
                            return false;
                        break;
                    //Compare values
                    default:
                        if (obj1[p] != obj2[p])
                            return false;
                }
            }
            return true;
        }
        util.compare = compare;
    })(util = B.util || (B.util = {}));
})(B || (B = {}));
console.log(B.version);
var B;
(function (B) {
    var Dialog = /** @class */ (function () {
        function Dialog(id, callback) {
            if (callback === void 0) { callback = function () { }; }
            this.id = "";
            this.domObj = null;
            this.content = null;
            this.scrollbox = null;
            this.title = null;
            this.buttonbox = null;
            this.buttonList = [];
            this.callback = null;
            this.isOpen = false;
            this.isFirstOpen = true;
            this.form = null;
            this.tallness = 0;
            this.wideness = 0;
            if (B.Dialog.dialogs[id] != undefined) {
                return B.Dialog.get(id);
            }
            this.id = id;
            this.callback = callback;
            var contentObj = document.getElementById(id);
            // Create a container for the dialog
            this.domObj = document.createElement("form");
            this.domObj.id = id;
            this.domObj.className = "BDialog";
            this.domObj.style.cssText = "display:none; position:absolute;";
            this.domObj.style.height = contentObj.style.height;
            this.domObj.style.width = contentObj.style.width;
            contentObj.insertAdjacentElement("beforebegin", this.domObj);
            // Make the header box
            this.title = document.createElement("div");
            this.title.className = "titlebar";
            var msg = contentObj.getAttribute("title");
            if (msg == null || msg == "")
                msg = "System Message";
            this.title.innerHTML = msg;
            this.title.onmousedown = B.Dialog.startDrag;
            this.domObj.appendChild(this.title);
            this.scrollbox = document.createElement("div");
            // Make room for a header and buttons
            this.scrollbox.style.cssText = "min-height:calc(100% - 5.1em); overflow-x:hidden; overflow-y:auto";
            this.content = document.createElement("div");
            this.scrollbox.appendChild(this.content);
            this.content.style.height = "";
            this.content.style.padding = ".5em";
            this.content.style.paddingTop = "0";
            // Move the content into the content container and remove the original content
            this.content.innerHTML = contentObj.innerHTML;
            contentObj.parentElement.removeChild(contentObj);
            // Move the scrollbox into the container
            this.domObj.appendChild(this.scrollbox);
            // Add a button box for the bottom of the container
            this.buttonbox = document.createElement("div");
            this.buttonbox.style.cssText = "border-top: 1px dotted black; padding: .5rem; text-align: right; position:relative; bottom:0";
            this.domObj.appendChild(this.buttonbox);
            var btns = this.content.getElementsByClassName("BDialogButton");
            while (btns.length > 0) {
                var btn = btns.item(0);
                this.buttonbox.appendChild(btn);
                this.buttonList.push(btn);
            }
            B.Dialog.dialogs[id] = this;
            B.Dialog.dialogCount++;
            if (B.Dialog.dialogCount == 1) {
                B.Dialog.overlay = document.createElement("div");
                document.body.appendChild(B.Dialog.overlay);
                B.Dialog.overlay.style.cssText =
                    "position: absolute; " +
                        //"cursor: pointer; " +
                        "display: none; " + /* Hidden by default */
                        "width: 100%; height:100%; " + /* Full width (cover the whole page) */
                        "top: 0; left: 0; right: 0; bottom: 0; " +
                        "margin:0; padding:0; border: 0; " +
                        "background: rgba(0,0,0,0.2); "; /* Black background with opacity */
                "z-index: 1; "; /* Specify a stack order in case you're using a different order for other elements */
            }
            this.form = new B.Form(id);
        }
        Dialog.prototype.setContent = function (html) {
            this.content.innerHTML = html;
            return this;
        };
        Dialog.prototype.setTitle = function (html) {
            this.title.innerHTML = html;
            return this;
        };
        Dialog.prototype.setCallback = function (callback) {
            this.callback = callback;
            return this;
        };
        Dialog.prototype.center = function () {
            var rect = this.domObj.getBoundingClientRect();
            this.domObj.style.left = "calc(50vw - " + (rect.width / 2).toString() + "px)";
            this.domObj.style.top = "calc(50vh - " + (rect.height / 2).toString() + "px - 3em)";
            return this;
        };
        Dialog.prototype.open = function (center) {
            if (this.isOpen)
                return;
            this.isOpen = true;
            this.domObj.style.display = "inline-block";
            var z = (B.Dialog.dialogStack.length * 2) + 10;
            B.Dialog.overlay.style.zIndex = z;
            B.Dialog.overlay.style.display = "block";
            window.onkeydown = function (event) {
                if (event.key == "Escape")
                    popDialog();
                if (event.ctrlKey && event.key == "w")
                    popDialog();
            };
            this.domObj.style.zIndex = (z + 1).toString();
            var rect = this.domObj.getBoundingClientRect();
            this.tallness = rect.height; // Used during drag
            this.wideness = rect.width; // Used during drag
            if (center == undefined) {
                if (this.isFirstOpen)
                    center = true;
            }
            if (center) {
                // Calculate positioning
                this.domObj.style.left = "calc(50vw - " + (rect.width / 2).toString() + "px)";
                this.domObj.style.top = "calc(50vh - " + (rect.height / 2).toString() + "px - 3em)";
            }
            this.isFirstOpen = false;
            B.Dialog.dialogStack.push(this.id);
            return this;
        };
        Dialog.prototype.close = function () {
            if (!this.isOpen)
                return;
            this.isOpen = false;
            this.domObj.style.display = "none";
            for (var i = 0; i < B.Dialog.dialogStack.length; i++) {
                if (B.Dialog.dialogStack[i] == this.id) {
                    B.Dialog.dialogStack.splice(i, 1);
                }
            }
            if (B.Dialog.dialogStack.length == 0) {
                B.Dialog.overlay.style.display = "none";
                window.onkeydown = null;
            }
            else {
                var z = ((B.Dialog.dialogStack.length - 1) * 2) + 10;
                B.Dialog.overlay.style.zIndex = z;
            }
            return this;
        };
        Dialog.prototype.setSize = function (height, width, center) {
            if (center === void 0) { center = true; }
            if (height != null && height != "") {
                if (typeof height == "number")
                    height = height + "px";
                this.domObj.style.height = height;
            }
            if (width != null && width != "") {
                if (typeof width == "number")
                    width = width + "px";
                this.domObj.style.width = width;
            }
            if (center)
                this.center();
            return this;
        };
        Dialog.prototype.setButtons = function () {
            var btns = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                btns[_i] = arguments[_i];
            }
            this.buttonbox.innerHTML = "";
            this.buttonList = [];
            for (var i = 0; i < btns.length; i++) {
                this.addButton(btns[i]);
            }
            return this;
        };
        Dialog.prototype.addButton = function (text, returnValue) {
            if (returnValue === void 0) { returnValue = ""; }
            if (returnValue == "") {
                var parts = text.split("=");
                if (parts.length == 1) {
                    returnValue = (this.buttonList.length + 1).toString();
                }
                else {
                    text = parts[0];
                    returnValue = parts[1];
                }
            }
            var btn = null;
            btn = document.createElement("button");
            btn.setAttribute("data", returnValue);
            btn.className = "BDialogButton";
            btn.tabIndex = 100 + this.buttonList.length;
            btn.onclick = function (event) {
                var dlg = B.Dialog.get();
                popDialog();
                var el = event.target;
                dlg.callback(el.getAttribute("data"));
            };
            btn.innerHTML = text;
            this.buttonbox.appendChild(btn);
            this.buttonList.push(btn);
            return this;
        };
        Dialog.get = function (id) {
            if (id === void 0) { id = ""; }
            if (id == "") {
                var pos = B.Dialog.dialogStack.length;
                if (pos < 1)
                    return null;
                id = B.Dialog.dialogStack[pos - 1];
            }
            var dlg = B.Dialog.dialogs[id];
            if (dlg == null) {
                dlg = new Dialog(id);
            }
            return dlg;
        };
        Dialog.getSay = function () {
            var test = B.Dialog.dialogs["B_SAY_DIALOG"];
            if (test == null) {
                var frm = document.createElement("form");
                frm.id = "B_SAY_DIALOG";
                frm.className = "BDialog";
                frm.style.cssText = "height: 200px; width: 400px;";
                document.body.appendChild(frm);
            }
            var dlg = openDialog("B_SAY_DIALOG");
            dlg.domObj.style.backgroundColor = "";
            return dlg;
        };
        Dialog.startDrag = function (event) {
            var dlg = B.Dialog.get();
            B.Dialog.dragInfo.dlg = dlg;
            var rect = dlg.domObj.getBoundingClientRect();
            B.Dialog.dragInfo.dlg.domObj.style.opacity = .6;
            B.Dialog.dragInfo.offset.x = event.x - rect.left;
            B.Dialog.dragInfo.offset.y = event.y - rect.top;
            document.onmousemove = B.Dialog.dragHandler;
            document.onmouseup = B.Dialog.drop;
            //dlg.title.onmousemove = B.Dialog.dragHandler;
            //dlg.title.onmouseup = B.Dialog.drop;
            dlg.title.style.cursor = "grabbing";
        };
        Dialog.dragHandler = function (event) {
            var inf = B.Dialog.dragInfo;
            var dlg = inf.dlg;
            var newLeft = (event.x - inf.offset.x);
            var newRight = newLeft + dlg.wideness;
            var newTop = (event.y - inf.offset.y);
            var newBottom = newTop + dlg.tallness;
            console.log(window.innerWidth);
            if (newLeft < 0)
                return;
            if (newTop < 0)
                return;
            if (newRight > window.innerWidth)
                return;
            if (newBottom > window.innerHeight)
                return;
            dlg.domObj.style.left = (newLeft) + "px";
            dlg.domObj.style.top = (newTop) + "px";
        };
        Dialog.drop = function () {
            var dlg = B.Dialog.dragInfo.dlg;
            dlg.domObj.style.opacity = 1;
            document.onmousemove = null;
            document.onmouseup = null;
            //dlg.title.onmousemove = null;
            //dlg.title.onmouseup = null;
            dlg.title.style.cursor = "grab";
            dlg = null;
        };
        Dialog.overlay = null;
        Dialog.dialogs = {};
        Dialog.dialogCount = 0;
        Dialog.dialogStack = [];
        Dialog.dragInfo = { dlg: null, offset: { x: 0, y: 0 } };
        return Dialog;
    }());
    B.Dialog = Dialog;
})(B || (B = {}));
function openDialog(id) {
    var dlg = B.Dialog.get(id);
    dlg.open();
    return dlg;
}
function closeDialog(id) {
    var dlg = B.Dialog.get(id);
    dlg.close();
    return dlg;
}
function popDialog() {
    if (B.Dialog.dialogStack.length > 0) {
        return closeDialog(B.Dialog.dialogStack[B.Dialog.dialogStack.length - 1]);
    }
    else {
        return null;
    }
}
function say(msg, title, onclose, bgcolor) {
    if (title === void 0) { title = "System Message"; }
    if (onclose === void 0) { onclose = function () { }; }
    if (bgcolor === void 0) { bgcolor = ""; }
    var dlg = B.Dialog.getSay();
    dlg.setContent(msg);
    dlg.setTitle(title);
    dlg.setCallback(onclose);
    dlg.setButtons("Close");
    dlg.domObj.style.backgroundColor = bgcolor;
    return dlg;
}
function sayG(msg, title, onclose) {
    if (title === void 0) { title = "System Message"; }
    if (onclose === void 0) { onclose = function () { }; }
    return say(msg, title, onclose, "aquamarine");
}
function sayW(msg, title, onclose) {
    if (title === void 0) { title = "System Message"; }
    if (onclose === void 0) { onclose = function () { }; }
    return say(msg, title, onclose, "lightyellow");
}
function sayE(msg, title, onclose) {
    if (title === void 0) { title = "System Message"; }
    if (onclose === void 0) { onclose = function () { }; }
    return say(msg, title, onclose, "lightpink");
}
function sayGet(msg, prompt, defaultValue, title, callback, bgcolor) {
    if (title === void 0) { title = "System Message"; }
    if (bgcolor === void 0) { bgcolor = ""; }
    var dlg = B.Dialog.getSay();
    var h = msg;
    h += "<table class='form' style='margin:0 auto; margin-top:.5em;'>";
    h += "<tr><th>" + prompt + ":</th><td><input tabIndex=1 name='result' size='12'></td></tr>";
    h += "</table>";
    dlg.setContent(h);
    dlg.setTitle(title);
    var masterCallback = function (val) {
        if (val == "SAVE") {
            var chk = B.getForm("B_SAY_DIALOG").get();
            callback(chk["result"]);
        }
    };
    dlg.setCallback(masterCallback);
    dlg.setButtons("Save=SAVE", "Cancel=CANCEL");
    dlg.domObj.style.backgroundColor = bgcolor;
    var frm = B.getForm("B_SAY_DIALOG");
    frm.set("result", defaultValue);
    var tbox = frm.getElement("result");
    tbox.focus();
    tbox.select();
    return dlg;
}
function choose(msg, title, buttons, callback, bgcolor) {
    if (title === void 0) { title = "System Message"; }
    if (bgcolor === void 0) { bgcolor = ""; }
    var dlg = B.Dialog.getSay();
    dlg.setContent(msg);
    dlg.setTitle(title);
    dlg.setButtons();
    dlg.setCallback(callback);
    var list = buttons.split("|");
    for (var i = 0; i < list.length; i++) {
        dlg.addButton(list[i]);
    }
    dlg.domObj.style.backgroundColor = bgcolor;
    return dlg;
}
function chooseG(msg, title, buttons, callback) {
    if (title === void 0) { title = "System Message"; }
    return choose(msg, title, buttons, callback, "aquamarine");
}
function chooseW(msg, title, buttons, callback) {
    if (title === void 0) { title = "System Message"; }
    return choose(msg, title, buttons, callback, "lightyellow");
}
function chooseE(msg, title, buttons, callback) {
    if (title === void 0) { title = "System Message"; }
    return choose(msg, title, buttons, callback, "lightpink");
}
function ask(msg, title, callback) {
    if (title === void 0) { title = "System Message"; }
    return choose(msg, title, "Yes=YES|No=NO", callback, "");
}
function askG(msg, title, callback) {
    if (title === void 0) { title = "System Message"; }
    return choose(msg, title, "Yes=YES|No=NO", callback, "aquamarine");
}
function askW(msg, title, callback) {
    if (title === void 0) { title = "System Message"; }
    return choose(msg, title, "Yes=YES|No=NO", callback, "lightyellow");
}
function askE(msg, title, callback) {
    if (title === void 0) { title = "System Message"; }
    return choose(msg, title, "Yes=YES|No=NO", callback, "lightpink");
}
var B;
(function (B) {
    function getForm(id, allowSubmit) {
        if (allowSubmit === void 0) { allowSubmit = false; }
        var frm = Form.cache[id];
        if (frm == undefined) {
            frm = new Form(id, allowSubmit);
        }
        return frm;
    }
    B.getForm = getForm;
    var Form = /** @class */ (function () {
        function Form(id, allowSubmit) {
            if (allowSubmit === void 0) { allowSubmit = false; }
            this.id = "";
            this.form = null;
            if (Form.cache[id] != null) {
                return Form.cache[id];
            }
            this.id = id;
            this.form = document.forms.namedItem(id);
            if (!allowSubmit) {
                this.form.onsubmit = function (event) {
                    event.preventDefault();
                    return false;
                };
            }
            Form.cache[id] = this;
        }
        Form.prototype.get = function () {
            var items = {};
            var els = this.form.elements;
            for (var elnum = 0; elnum < els.length; elnum++) {
                var el = els.item(elnum);
                if (el.type == "" || el.type == "text") {
                    items[el.name] = el.value.trim();
                }
                else if (el.type == "checkbox") {
                    items[el.name] = el.checked;
                }
                else if (el.type == "select-one") {
                    items[el.name] = el.options[el.selectedIndex].value.trim();
                }
                else if (el.type == "select-multiple") {
                    var sels = [];
                    for (var optnum = 0; optnum = el.options.length; optnum++) {
                        var opt = el.options[optnum];
                        if (opt.selected)
                            sels.push(opt.value.trim());
                    }
                    items[el.name] = sels;
                }
                else if (el.type == "radio") {
                    if (el.checked)
                        items[el.name] = el.value.trim();
                }
            }
            return items;
        };
        Form.prototype.getElement = function (field) {
            return this.form.elements[field];
        };
        Form.prototype.set = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Pairs of values set(name,val, name,val);
            for (var argnum = 0; argnum < args.length; argnum += 2) {
                var field = args[argnum];
                if (args.length <= argnum + 1)
                    return;
                var val = args[argnum + 1];
                var el = this.form.elements[field];
                if (el.type == "checkbox") {
                    el.checked = val;
                }
                else {
                    el.value = val;
                }
            }
        };
        Form.cache = {};
        return Form;
    }());
    B.Form = Form;
})(B || (B = {}));
console.log("Form " + B.version);
var B;
(function (B) {
    var Dataset = /** @class */ (function () {
        function Dataset(colsList) {
            if (colsList === void 0) { colsList = ""; }
            this.columnNames = {};
            this.columns = [];
            this.rows = [];
            var list = colsList.split("\t");
            if (list.length == 1 && list[0].indexOf(",") > -1)
                list = colsList.split(",");
            for (var itmnum = 0; itmnum < list.length; itmnum++) {
                this.columnNames[list[itmnum]] = this.columns.length;
                this.columns.push(list[itmnum]);
            }
        }
        return Dataset;
    }());
    B.Dataset = Dataset;
    var TableColumn = /** @class */ (function () {
        function TableColumn(id, width, just, head, headJust) {
            if (just === void 0) { just = "L"; }
            if (head === void 0) { head = ""; }
            if (headJust === void 0) { headJust = "L"; }
            this.id = "BEEF";
            this.width = "0";
            this.just = "L";
            this.head = "";
            this.headJust = "L";
            this.id = id;
            this.width = width;
            this.just = just;
            this.head = head;
            this.headJust = headJust;
        }
        return TableColumn;
    }());
    B.TableColumn = TableColumn;
    var Table = /** @class */ (function () {
        function Table(tbl, id, datasetCodes, title) {
            if (title === void 0) { title = ""; }
            this.id = "";
            this.container = null;
            this.table = null;
            this.tableContainer = null;
            this.footer = null;
            this.footerBox = null;
            this.footerButtonContainer = null;
            this.footerMessageContainer = null;
            this.freezeCover = null;
            this.freezeTextElement = null;
            this.freezeTimer = null;
            this.rowCountTitle = "row";
            this.rowCountTitle2 = "";
            this.rowWatcher = null;
            this.dataset = null;
            this.pickedRow = null;
            this.thead = null;
            this.tbody = null;
            this.tfoot = null;
            this.columns = {};
            this.columnList = [];
            this.anyHeaders = false;
            if (Table.cache == null)
                Table.cache = [];
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
                var cells = this.table.rows[0].cells;
                for (var cellnum = 0; cellnum < cells.length; cellnum++) {
                    var cell = cells[cellnum];
                    var data = cell.getAttribute("data").split(",");
                    while (data.length < 3)
                        data.push("");
                    var col = new TableColumn(data[0], data[1], data[2], cell.innerHTML, data[3]);
                    if (col.head != "")
                        this.anyHeaders = true;
                    this.columnList.push(col);
                    this.columns[col.id] = col;
                }
                cells[cells.length - 1].style.paddingRight = "20px"; // Make room for scrollbar??
            }
            // Initialize the table
            this.table.innerHTML = ""; // Clear it first
            this.table.className = "BTable";
            this.table.style.borderSpacing = "0";
            this.table.style.borderCollapse = "separate";
            this.table.style.tableLayout = "fixed";
            this.table.style.border = "0";
            if (this.columnList.length > 1) {
                var colgroup_1 = document.createElement("colgroup");
                this.columnList.forEach(function (itm) {
                    var col = document.createElement("col");
                    if (itm.width > 0)
                        col.style.width = itm.width + "px";
                    colgroup_1.appendChild(col);
                });
                this.table.appendChild(colgroup_1);
            }
            this.thead = document.createElement("thead");
            this.table.appendChild(this.thead);
            this.tfoot = document.createElement("tfoot");
            this.table.appendChild(this.tfoot);
            this.tbody = document.createElement("tbody");
            this.table.appendChild(this.tbody);
            if (this.anyHeaders) {
                var tr_1 = document.createElement("tr");
                tr_1.style.border = "10px";
                this.columnList.forEach(function (itm) {
                    var el = document.createElement("th");
                    el.className = "th";
                    el.style.cssText = "position:sticky; top:0;";
                    el.innerHTML = itm.head;
                    var just = itm.headJust;
                    just = (just == "C" ? "center" : (just == "R" ? "right" : "left"));
                    if (just != "")
                        el.style.textAlign = just;
                    tr_1.appendChild(el);
                });
                this.thead.appendChild(tr_1);
            }
            this.table.setAttribute("data-BTABLE", Table.cache.length);
            if ("IntersectionObserver" in window) {
                this.rowWatcher = new IntersectionObserver(function (entries, observer) {
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        if (entry.isIntersecting) {
                            var tr_2 = entry.target;
                            var table_1 = B.util.parentNode(tr_2, "table");
                            var cacheNumber = table_1.getAttribute("data-BTABLE");
                            var btbl = Table.cache[cacheNumber];
                            btbl.renderRow(tr_2.rowIndex - 1);
                            btbl.rowWatcher.unobserve(tr_2);
                        }
                    }
                }, { root: this.table });
            }
            Table.cache.push(this);
            this.table.onclick = function (event) {
                var td = event.target;
                var tr = B.util.parentNode(td, "tr");
                var table = B.util.parentNode(tr, "table");
                var cacheNumber = table.getAttribute("data-BTABLE");
                var btbl = Table.cache[cacheNumber];
                var rn = tr.rowIndex;
                if (btbl.anyHeaders)
                    rn--;
                var rd = btbl.dataset.rows[rn];
                var curtr = btbl.getTableRow();
                var changed = false;
                if (curtr == null) {
                    changed = true;
                }
                else if (curtr != tr) {
                    changed = true;
                    if (curtr.className == "pickedRow") {
                        curtr.className = "";
                    }
                }
                if (tr.className != "pickedRow")
                    tr.className = "pickedRow";
                btbl.pickedRow = rd;
                // Handle tracked footer buttons
                for (var key in btbl.footer.buttons) {
                    var btn = btbl.footer.buttons[key];
                    if (btn.track && !btn.enabled)
                        btn.enable();
                }
                // Do user click action (if any)
                var cells = btbl.makeCellsCollection(tr);
                if (btbl.onclick != null)
                    btbl.onclick.call(btbl, td, tr, rd, cells, changed);
            };
            this.table.ondblclick = function (event) {
                // In order to be double-clicked, it must have been clicked
                // The click event would handle the visual aspects, etc.
                var td = event.target;
                var tr = B.util.parentNode(td, "tr");
                var table = B.util.parentNode(tr, "table");
                var cacheNumber = table.getAttribute("data-BTABLE");
                var btbl = Table.cache[cacheNumber];
                var rn = tr.rowIndex;
                if (btbl.anyHeaders)
                    rn--;
                var rd = btbl.dataset.rows[rn];
                var currd = btbl.getDataRow();
                var curtr = btbl.getTableRow();
                btbl.pickedRow = rd;
                var cells = btbl.makeCellsCollection(tr);
                if (btbl.ondblclick != null)
                    btbl.ondblclick.call(btbl, td, tr, rd, cells);
            };
            // Add the table footer where commands display
            this.footerBox = document.createElement("div");
            this.footerBox.style.cssText = "display:block; height:1.8em; background-color: gainsboro; padding-left:0; padding-right:.3em;";
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
                addButton: function (id, title, onclick, track) {
                    if (track === void 0) { track = false; }
                    var obj = {
                        id: id,
                        title: title,
                        position: this.buttonList.length,
                        div: null,
                        enabled: true,
                        onclick: onclick,
                        track: track,
                        table: this,
                        enable: function (yorn) {
                            if (yorn === void 0) { yorn = true; }
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
                        disable: function (yorn) {
                            if (yorn === void 0) { yorn = true; }
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
                    var btn = document.createElement("button");
                    btn.className = "BTableFooterButton enabled";
                    btn.setAttribute("data-BTABLE", this.tableObject.table.getAttribute("data-BTABLE"));
                    btn.setAttribute("data-BUTTONID", id);
                    btn.innerHTML = title;
                    btn.id = this.tableObject.id + "_BTN_" + this.buttonList.length;
                    btn.onclick = function () {
                        var div = event.target;
                        var cacheNumber = div.getAttribute("data-BTABLE");
                        var btbl = Table.cache[cacheNumber];
                        var btn = btbl.footer.buttons[div.getAttribute("data-BUTTONID")];
                        if (btn.enabled) {
                            var tblRow = btbl.getTableRow();
                            var cells = null;
                            if (tblRow != undefined) {
                                cells = btbl.makeCellsCollection(btbl.getTableRow());
                            }
                            btn.onclick.call(btn, btbl.pickedRow, cells);
                        }
                    };
                    obj.div = btn;
                    this.tableObject.footerButtonContainer.appendChild(btn);
                    this.buttons[id] = obj;
                    if (this.buttonList.length > 0)
                        btn.style.marginLeft = ".25em";
                    this.buttonList.push(id);
                    if (track && this.tableObject.dataset.pickedRow == null) {
                        obj.disable();
                    }
                    else {
                        obj.enable();
                    }
                    return obj;
                }
            };
            if (this.table.style.height != "") {
                this.setTableHeight(this.table.style.height);
                this.table.style.height = "";
            }
            this.table.style.visibility = "visible";
            this.dataset = new Dataset(datasetCodes);
        }
        Table.prototype.preRowRender = function (rn, row, cells, rd) { return true; };
        Table.prototype.onclick = function (td, tr, rd, changed) { return; };
        Table.prototype.ondblclick = function (td, tr, rd) { return; };
        Table.prototype.setTableHeight = function (height) {
            this.tableContainer.style.height = height;
            this.tableContainer.style.overflowY = "scroll";
        };
        Table.prototype.getDataRow = function (rownum) {
            if (rownum == undefined) {
                if (this.pickedRow != null)
                    rownum = this.pickedRow.ROWNUM;
            }
            return (rownum == null ? null : this.dataset.rows[rownum]);
        };
        Table.prototype.getTableRow = function (rownum) {
            if (rownum == undefined) {
                if (this.pickedRow != null)
                    rownum = this.pickedRow.ROWNUM;
            }
            return (rownum == null ? null : this.tbody.rows[rownum]);
        };
        Table.prototype.getTableRowCells = function (rownum) {
            if (rownum == undefined) {
                if (this.pickedRow != null)
                    rownum = this.pickedRow.ROWNUM;
            }
            return (rownum == null ? null : this.tbody.rows[rownum]);
        };
        Table.prototype.addRows = function (data) {
            var rows = data.split("\n");
            for (var i = 0; i < rows.length; i++) {
                this.addRow(rows[i].split("\t"));
            }
        };
        Table.prototype.addRow = function (argumentList) {
            var rowData = { ROWNUM: -1 };
            var args = arguments;
            if (arguments.length == 1 && arguments[0].constructor === Array)
                args = arguments[0];
            for (var argnum = 0; argnum < args.length; argnum++) {
                // Data is provided in the order defined in the dataset
                if (this.dataset.columns.length > argnum) {
                    var colname = this.dataset.columns[argnum];
                    rowData[colname] = args[argnum];
                }
                else {
                    var colname = "COL_" + argnum;
                    rowData[colname] = args[argnum];
                }
            }
            rowData.ROWNUM = this.dataset.rows.length;
            this.dataset.rows.push(rowData);
            var tr = this.preloadRowToTable(this.dataset.rows.length - 1);
            if ("IntersectionObserver" in window) {
                this.rowWatcher.observe(tr);
            }
            else {
                this.renderRow(tr.rowIndex - 1);
            }
            this.setMessage();
            return tr;
        };
        Table.prototype.setMessage = function (msg) {
            if (msg === void 0) { msg = ""; }
            if (msg == "") {
                var count = this.dataset.rows.length;
                if (count == 1) {
                    this.footerMessageContainer.innerHTML = count + " " + this.rowCountTitle;
                }
                else {
                    if (this.rowCountTitle2 == "") {
                        this.rowCountTitle2 = this.rowCountTitle + "s";
                    }
                    this.footerMessageContainer.innerHTML = B.format.numberWithCommas(count) + " " + this.rowCountTitle2;
                }
            }
        };
        Table.prototype.preloadRowToTable = function (rownum) {
            var tr = document.createElement("tr");
            tr.style.cssText = "cursor:pointer";
            var td = document.createElement("td");
            td.innerHTML = "&nbsp;";
            td.colSpan = this.columnList.length;
            tr.appendChild(td);
            this.tbody.appendChild(tr);
            return tr;
        };
        Table.prototype.makeCellsCollection = function (tr) {
            var rownum = tr.rowIndex;
            if (this.anyHeaders)
                rownum--; // Skipt the header row
            var cells = {}; // Named map of td elements
            if (rownum >= 0) {
                for (var colnum = 0; colnum < this.columnList.length; colnum++) {
                    var column = this.columnList[colnum];
                    var html = this.dataset.rows[rownum][column.id];
                    if (html == undefined)
                        html = "";
                    html = html.toString(); // just in case the data was a number, etc.
                    var el = tr.cells[colnum];
                    cells[column.id] = el;
                }
            }
            return cells;
        };
        Table.prototype.renderRow = function (rownum) {
            if (rownum == undefined) {
                if (this.pickedRow != null)
                    rownum = this.pickedRow.ROWNUM;
            }
            var tr = this.table.rows[rownum + 1];
            tr.innerHTML = ""; // Empty it of cells;
            var cells = {}; // Named map of td elements
            for (var colnum = 0; colnum < this.columnList.length; colnum++) {
                var column = this.columnList[colnum];
                var html = this.dataset.rows[rownum][column.id];
                if (html == undefined)
                    html = "";
                html = html.toString(); // just in case the data was a number, etc.
                var el = document.createElement("td");
                // Type can be string, int, float, money, bool, date, datetime
                var dsObj = this.dataset.columns[column.id];
                if (dsObj != null) {
                    if (dsObj.autoTrim)
                        html = html.trim();
                    if (dsObj.type == "money") {
                        html = B.format.money(html);
                    }
                    else if (dsObj.type == "bool") {
                        var isYes = false;
                        if (html != "") {
                            html = html.toUpperCase().trim();
                            if (html == "TRUE") {
                                isYes = true;
                            }
                            else {
                                if (html.substr(0, 1) == "Y") {
                                    isYes = true;
                                }
                            }
                            html = (isYes) ? "&#x2714;" : "&nbsp;";
                        }
                    }
                }
                el.innerHTML = html;
                var just = column.just;
                just = (just == "C" ? "center" : (just == "R" ? "right" : "left"));
                if (just != "")
                    el.style.textAlign = just;
                tr.appendChild(el);
                cells[column.id] = el;
            }
            tr.cells[tr.cells.length - 1].style.paddingRight = "20px"; // Make room for scrollbar??
            this.preRowRender(this.table.rows.length, tr, cells, this.dataset.rows[rownum]);
            return tr;
        };
        Table.prototype.freeze = function (text, withTimer) {
            if (withTimer === void 0) { withTimer = true; }
            this.thaw();
            var div = B.util.freezeArea(this.container);
            this.freezeCover = div;
            if (text == undefined)
                text = "";
            //this.freezeTimer = new B.Stopwatch(50, true);
            this.freezeTextElement = B.util.addOverlayText(div, text); //, this.freezeTimer);
        };
        Table.prototype.thaw = function () {
            if (this.freezeTimer != null) {
                this.freezeTimer.stop();
            }
            B.util.killElement(this.freezeTextElement, this.freezeCover);
        };
        Table.cache = null;
        return Table;
    }());
    B.Table = Table;
})(B || (B = {}));
//# sourceMappingURL=B.js.map