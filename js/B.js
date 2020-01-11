var B;
(function (B) {
    B.version = '2.1ts';
})(B || (B = {}));
function notcoded() {
    var h = "Sorry, this feature is not ready yet.";
    say(h).error();
}
(function (B) {
    var is;
    (function (is) {
        function oneOf() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return B.util.whichOneOf.apply(null, arguments) >= 0;
        }
        is.oneOf = oneOf;
        ;
        function notOneOf() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return B.util.whichOneOf.apply(null, arguments) < 0;
        }
        is.notOneOf = notOneOf;
        ;
    })(is = B.is || (B.is = {}));
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
        function phone(num, ext) {
            var rslt = "";
            if (ext == undefined)
                ext = "";
            num = num.toString();
            var test = B.util.keepOnlyChars(num, "0123456789");
            if (test.length == 7) {
                rslt = test.substr(0, 3) + "-" + test.substr(3);
            }
            else if (test.length == 10) {
                rslt = "(" + test.substr(0, 3) + ") " + test.substr(3, 3) + "-" + test.substr(6);
            }
            else {
                rslt = num;
            }
            if (ext != "") {
                rslt += " x" + ext;
            }
            return rslt;
        }
        format.phone = phone;
        function leftPad(init, length, char) {
            var rslt = init;
            if (char.length > 0) {
                while (rslt.length < length) {
                    rslt += char;
                }
            }
            return rslt;
        }
        format.leftPad = leftPad;
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "Decepmber"];
        function dayOfWeek(day) {
            if (day == undefined)
                day = new Date();
            if (typeof day == "string")
                day = new Date(day);
            if (typeof day == "object")
                day = day.getDay();
            return dayNames[day];
        }
        format.dayOfWeek = dayOfWeek;
        function datePart(date, part) {
            if (typeof date == "string")
                date = new Date(date);
            var rslt = "";
            var tmp = 0;
            switch (part) {
                case "M":
                    rslt = (date.getMonth() + 1).toString();
                    break;
                case "MM":
                    rslt = leftPad(datePart(date, "M"), 2, "0");
                    break;
                case "MMM":
                    rslt = monthNames[date.getMonth()].substr(0, 3);
                    break;
                case "MONTH":
                    rslt = monthNames[date.getMonth()];
                    break;
                case "D":
                    rslt = (date.getDate()).toString();
                    break;
                case "DD":
                    rslt = leftPad(datePart(date, "D"), 2, "0");
                    break;
                case "ORDINAL":
                case "ORD":
                    var tmp_1 = date.getDate();
                    switch (date.getDate()) {
                        case 1:
                        case 21:
                        case 31: rslt = tmp_1.toString() + "st";
                        case 2:
                        case 22: rslt = tmp_1.toString() + "nd";
                        case 3:
                        case 23: rslt = tmp_1.toString() + "rd";
                        default: rslt = tmp_1.toString() + "th";
                    }
                case "DOW":
                case "DAY": rslt = dayOfWeek(date);
                case "YYYY":
                    rslt = (date.getFullYear()).toString();
                    break;
                case "H":
                    rslt = (date.getHours()).toString();
                    break;
                case "H12":
                    tmp_1 = date.getHours();
                    if (tmp_1 > 12)
                        tmp_1 -= 12;
                    rslt = tmp_1.toString();
                    break;
                case "HH12":
                    rslt = leftPad(datePart(date, "H12"), 2, "0");
                    break;
                case "HH":
                    rslt = leftPad(datePart(date, "H"), 2, "0");
                    break;
                case "a":
                    tmp_1 = date.getHours();
                    rslt = tmp_1 < 13 ? "a" : "p";
                    break;
                case "A":
                    rslt = (datePart(date, "a") == "a") ? "A" : "P";
                    break;
                case "am":
                    rslt = (datePart(date, "a") == "a") ? "am" : "pm";
                    break;
                case "AM":
                    rslt = (datePart(date, "a") == "a") ? "AM" : "PM";
                    break;
                case "NN":
                case "MI":
                    rslt = leftPad(date.getMinutes().toString(), 2, "0");
                    break;
                case "SS":
                    rslt = leftPad(date.getSeconds().toString(), 2, "0");
                    break;
                case "SSS":
                    rslt = leftPad(date.getMinutes().toString(), 2, "0");
                    break;
            }
            return rslt;
        }
        format.datePart = datePart;
        function MMDDYYYY(date) { return datePart(date, "MM") + "/" + datePart(date, "DD") + "/" + datePart(date, "YYYY"); }
        format.MMDDYYYY = MMDDYYYY;
        function MDYYYY(date) { return datePart(date, "M") + "/" + datePart(date, "D") + "/" + datePart(date, "YYYY"); }
        format.MDYYYY = MDYYYY;
        function MMMYYYY(date) { return datePart(date, "MMM") + ", " + datePart(date, "YYYY"); }
        format.MMMYYYY = MMMYYYY;
        function MONTHYYYY(date) { return datePart(date, "MONTH") + ", " + datePart(date, "YYYY"); }
        format.MONTHYYYY = MONTHYYYY;
        function MYYYY(date) { return datePart(date, "M") + "/" + datePart(date, "YYYY"); }
        format.MYYYY = MYYYY;
        function HNN(date, ap) { return datePart(date, "H") + ":" + datePart(date, "MI") + ap == undefined ? "" : datePart(date, ap); }
        format.HNN = HNN;
        function HHNN(date, ap) { return datePart(date, "HH") + ":" + datePart(date, "MI") + ap == undefined ? "" : datePart(date, ap); }
        format.HHNN = HHNN;
        function HNNSS(date, ap) { return datePart(date, "H") + ":" + datePart(date, "MI") + ":" + datePart(date, "SS") + ap == undefined ? "" : datePart(date, ap); }
        format.HNNSS = HNNSS;
        function HHNNSS(date, ap) { return datePart(date, "HH") + ":" + datePart(date, "MI") + ":" + datePart(date, "SS") + ap == undefined ? "" : datePart(date, ap); }
        format.HHNNSS = HHNNSS;
        function TS(date) { return MMDDYYYY(date) + " " + HHNNSS(date) + ":" + datePart(date, "SSS"); }
        format.TS = TS;
        function FANCY(date) {
            return datePart(date, "DOW") + " the " + datePart(date, "ORDINAL") + " of " + datePart(date, "MONTH");
        }
        format.FANCY = FANCY;
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
        function whichOneOf(txt) {
            var a = txt.toString().toUpperCase();
            if (arguments.length > 2) {
                for (var i = 1; i < arguments.length; i++) {
                    var b = arguments[i].toUpperCase();
                    if (a == b)
                        return i - 1;
                }
            }
            else {
                var itm = arguments[1];
                if (typeof itm == "string") {
                    var lst = itm.split(",");
                    for (var i = 0; i < lst.length; i++) {
                        var b = lst[i].toUpperCase();
                        if (a == b)
                            return i;
                    }
                }
                else { // list passed in
                    for (var i = 0; i < itm.length; i++) {
                        var b = itm[i].toUpperCase();
                        if (a == b)
                            return i;
                    }
                }
            }
            return -1;
        }
        util.whichOneOf = whichOneOf;
        function stripChars(orig, chars) {
            var rslt = "";
            for (var i = 0; i < orig.length; i++) {
                var char = orig.substr(i, 1);
                if (chars.indexOf(char) >= 0)
                    continue;
                rslt += char;
            }
            return rslt;
        }
        util.stripChars = stripChars;
        function keepOnlyChars(orig, chars) {
            var rslt = "";
            for (var i = 0; i < orig.length; i++) {
                var char = orig.substr(i, 1);
                if (chars.indexOf(char) < 0)
                    continue;
                rslt += char;
            }
            return rslt;
        }
        util.keepOnlyChars = keepOnlyChars;
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
                "z-index:" + (parseInt(el.style.zIndex) + 1) + "; " +
                "background: repeating-linear-gradient(-45deg, " + clrA + ", " + clrA + " 10px, " + clrB + " 10px, " + clrB + " 20px); " +
                "opacity: 0.1; " +
                "cursor: default; " +
                "left:0; top:0; width:100%;height:100%; " +
                "overflow:auto; ";
            el.appendChild(div);
            return div;
        }
        util.freezeArea = freezeArea;
        function clearSelection() {
            if (window.getSelection) {
                var sel = window.getSelection();
                sel.removeAllRanges();
            }
        }
        util.clearSelection = clearSelection;
        function addOverlayText(el, text) {
            var container = document.createElement("div");
            container.style.cssText = "position: absolute; ";
            container.style.zIndex = (parseInt(el.style.zIndex) + 1).toString();
            container.style.height = el.style.height;
            container.style.width = el.style.width;
            container.style.top = el.style.top;
            container.style.left = el.style.left;
            el.insertAdjacentElement("afterend", container);
            var div = document.createElement("div");
            div.style.cssText = "" +
                "padding: .5em; color: black; background: white; border-radius: .2em; width: 75%;" +
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
        function findNodeWithAttribute(node, attr) {
            while (node != document.body && !node.hasAttribute(attr)) {
                node = node.parentElement;
            }
            return node;
        }
        util.findNodeWithAttribute = findNodeWithAttribute;
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
(function (B) {
    var Timer = /** @class */ (function () {
        function Timer(id, target, renderAs, startup) {
            if (renderAs === void 0) { renderAs = "LINES"; }
            if (startup === void 0) { startup = true; }
            this.id = "";
            this.secondsElement = null;
            this.minutesElement = null;
            this.hoursElement = null;
            this.renderAs = "";
            this.startTime = null;
            this.target = null;
            this.active = false;
            if (Timer.timers[id] != null)
                return Timer.timers[id];
            this.id = id;
            this.startTime = new Date();
            if (typeof target == "string")
                target = document.getElementById(target);
            this.target = target;
            this.target.style.zIndex = "99";
            this.target.style.position = "relative";
            this.renderAs = renderAs;
            if (Timer.timerList.length == 0) {
                //if (window.requestAnimationFrame) {
                //    window.requestAnimationFrame(Timer.renderTimers);
                //} else {
                window.setTimeout(Timer.renderTimers, 1000);
                //}
            }
            if (renderAs == "LINES") {
                this.secondsElement = document.createElement("div");
                this.secondsElement.style.borderTop = "4px solid green";
                this.secondsElement.style.width = "0";
                this.minutesElement = document.createElement("div");
                this.minutesElement.style.borderTop = "4px solid blue";
                this.minutesElement.style.width = "0";
                this.hoursElement = document.createElement("div");
                this.hoursElement.style.borderTop = "4px solid red";
                this.hoursElement.style.width = "0";
                this.target.appendChild(this.secondsElement);
                this.target.appendChild(this.minutesElement);
                this.target.appendChild(this.hoursElement);
            }
            if (renderAs == "SPIN") {
                this.target.style.width = "38px";
                this.target.style.height = "38px";
                this.secondsElement = document.createElement("div");
                this.secondsElement.style.cssText = "position:absolute; height:90%; width:90%; top:5%; left:5%;z-index:99";
                this.secondsElement.className = "loader";
                this.target.appendChild(this.secondsElement);
                this.minutesElement = document.createElement("div");
                ;
                this.minutesElement.style.cssText = "line-height: 38px; text-align:center; font-size:8pt; position:absolute; height:100%; width:100%; top:0; left:0";
                this.target.appendChild(this.minutesElement);
            }
            Timer.timers[id] = this;
            Timer.timerList.push(this);
            this.active = startup;
        }
        Timer.add = function (id, target, renderAs, startup) {
            if (renderAs === void 0) { renderAs = "LINES"; }
            if (startup === void 0) { startup = true; }
            return new B.Timer(id, target, renderAs, startup);
        };
        Timer.prototype.start = function () {
            this.active = true;
        };
        Timer.prototype.stop = function () {
            this.active = false;
        };
        Timer.prototype["delete"] = function () {
            delete B.Timer.timers[this.id];
            for (var i = 0; i < B.Timer.timerList.length; i++) {
                if (B.Timer.timerList[i].id == this.id) {
                    B.Timer.timerList.splice(i, 1);
                }
            }
        };
        Timer.prototype.show = function () {
        };
        Timer.prototype.hide = function () {
        };
        Timer.prototype.render = function () {
            var now = new Date();
            var millis = (now.getTime() - this.startTime.getTime());
            var secs = millis / 1000;
            millis = parseInt((millis % 60).toString(), 10);
            secs = parseInt(secs.toString(), 10);
            var days = parseInt((secs / (24 * 60 * 60)).toString(), 10);
            secs -= (days * 24 * 60 * 60);
            var hours = parseInt((secs / (60 * 60)).toString(), 10);
            secs -= (hours * 60 * 60);
            var mins = parseInt((secs / 60).toString(), 10);
            secs -= (mins * 60);
            if (this.renderAs == "LINES") {
                this.secondsElement.style.width = ((secs / 60) * 100) + "%";
                this.minutesElement.style.width = ((mins / 60) * 100) + "%";
                if (hours > 24)
                    hours = 24;
                this.hoursElement.style.width = ((hours / 24) * 100) + "%";
            }
            if (this.renderAs == "SPIN" || this.renderAs == "TEXT") {
                var text = "";
                if (days > 0)
                    text = days + "d";
                if (hours > 0)
                    text += hours + "h";
                if (text != "")
                    text += "<br>";
                //if (mins < 10) text += "0";
                if (mins > 0)
                    text += mins + ":";
                if (secs > 0) {
                    if (secs < 10)
                        text += "0";
                    text += secs;
                }
                if (this.renderAs == "SPIN") {
                    this.minutesElement.innerHTML = text;
                }
                else if (this.renderAs == "TEXT") {
                    this.target.innerHTML = text;
                }
            }
        };
        Timer.renderTimers = function () {
            for (var i = 0; i < Timer.timerList.length; i++) {
                var t = Timer.timerList[i];
                if (t.active) {
                    t.render();
                }
            }
            if (Timer.timerList.length > 0) {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(Timer.renderTimers);
                }
                else {
                    window.setTimeout(Timer.renderTimers, 20);
                }
            }
        };
        Timer.handler = null;
        Timer.timers = {};
        Timer.timerList = [];
        return Timer;
    }());
    B.Timer = Timer;
})(B || (B = {}));
document.addEventListener('invalid', (function () {
    return function (e) {
        //prevent the browser from showing default error bubble/ hint
        e.preventDefault();
        // optionally fire off some custom validation handler
        // myvalidationfunction();
    };
})(), true);
/// <reference path="B.ts" />
var B;
/// <reference path="B.ts" />
(function (B) {
    var Dialog = /** @class */ (function () {
        function Dialog(id, callback) {
            if (callback === void 0) { callback = function () { }; }
            this.id = "";
            this.domObj = null;
            this.content = null;
            this.scrollbox = null;
            this.title = null;
            this.closerButton = null;
            this.buttonbox = null;
            this.bottomMessageBox = null;
            this.buttonList = [];
            this.callback = null;
            this.isOpen = false;
            this.isFirstOpen = true;
            this.noclose = false; // Stop user from closing (Freeze)
            this.form = null;
            this.tallness = 0;
            this.wideness = 0;
            this.zIndex = 0;
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
            this.domObj.ondblclick = function () { B.Dialog.get().center(); B.util.clearSelection(); };
            contentObj.insertAdjacentElement("beforebegin", this.domObj);
            // Make the header box
            var titlebar = document.createElement("div");
            titlebar.className = "titlebar";
            this.title = document.createElement("span");
            var msg = contentObj.getAttribute("title");
            if (msg == null || msg == "")
                msg = "System Message";
            this.title.innerHTML = msg;
            titlebar.appendChild(this.title);
            titlebar.onmousedown = B.Dialog.startDrag;
            this.closerButton = document.createElement("div");
            this.closerButton.className = "hover_closer";
            this.closerButton.innerHTML = "&times;";
            this.closerButton.onclick = popDialog;
            titlebar.appendChild(this.closerButton);
            this.domObj.appendChild(titlebar);
            this.scrollbox = document.createElement("div");
            // Make room for a header and buttons
            this.scrollbox.style.cssText = "min-height:calc(100% - 5.1em); max-height:calc(100% - 5.1em); overflow-x:hidden; overflow-y:auto";
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
            var buttonboxContainer = document.createElement("div");
            buttonboxContainer.style.cssText = "position:relative;";
            this.buttonbox = document.createElement("div");
            this.buttonbox.style.cssText = "border-top: 1px dotted black; padding: .5rem; text-align: right; position:relative; bottom:0";
            buttonboxContainer.appendChild(this.buttonbox);
            var btns = this.content.getElementsByClassName("BDialogButton");
            while (btns.length > 0) {
                var btn = btns.item(0);
                this.buttonbox.appendChild(btn);
                this.buttonList.push(btn);
            }
            this.bottomMessageBox = document.createElement("div");
            this.bottomMessageBox.style.cssText = "line-height:40px;position:absolute; height:100%; left:.5em; top:.2em";
            buttonboxContainer.appendChild(this.bottomMessageBox);
            this.domObj.appendChild(buttonboxContainer);
            B.Dialog.dialogs[id] = this;
            B.Dialog.dialogCount++;
            if (B.Dialog.dialogCount == 1) {
                B.Dialog.overlay = document.createElement("div");
                B.Dialog.overlay.ondblclick = function () {
                    B.Dialog.get().center();
                };
                document.body.appendChild(B.Dialog.overlay);
                B.Dialog.overlay.style.cssText =
                    "position: absolute; " +
                        "display: none; " + /* Hidden by default */
                        "width: 100%; height:100%; " + /* Full width (cover the whole page) */
                        "top: 0; left: 0; right: 0; bottom: 0; " +
                        "margin:0; padding:0; border: 0; " +
                        "background: rgba(0,0,0,0.2); "; /* Black background with opacity */
                "z-index: 1; "; /* Specify a stack order in case you're using a different order for other elements */
            }
            this.form = new B.Form(id);
        }
        Dialog.prototype.getForm = function () { return this.form; };
        Dialog.prototype.setContent = function (html) {
            this.content.innerHTML = html;
            return this;
        };
        Dialog.prototype.setTitle = function (html) {
            this.title.innerHTML = html;
            return this;
        };
        Dialog.prototype.getTitle = function () {
            return this.title.innerHTML;
        };
        Dialog.prototype.reset = function () {
            if (this.form != null)
                this.form.reset();
            return this;
        };
        Dialog.prototype.setBottomMessage = function (html) {
            if (html === void 0) { html = ""; }
            this.bottomMessageBox.innerHTML = html;
        };
        Dialog.prototype.setCallback = function (callback) {
            this.callback = callback;
            return this;
        };
        Dialog.prototype.center = function () {
            var rect = this.domObj.getBoundingClientRect();
            this.domObj.style.left = "calc(50vw - " + (rect.width / 2).toString() + "px)";
            this.domObj.style.top = "calc(50vh - " + (rect.height / 2).toString() + "px)";
            return this;
        };
        Dialog.prototype.open = function (center) {
            if (this.isOpen)
                return;
            this.isOpen = true;
            this.domObj.style.display = "inline-block";
            var z = (B.Dialog.dialogStack.length * 2) + 10;
            B.Dialog.overlay.style.zIndex = z;
            this.zIndex = z;
            B.Dialog.overlay.style.display = "block";
            window.onkeydown = function (event) {
                var dlg = B.Dialog.get();
                if (dlg.noclose)
                    return;
                if (event.key == "Escape")
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
                this.center();
            }
            this.isFirstOpen = false;
            this.setNoClose(false);
            B.Dialog.dialogStack.push(this.id);
            return this;
        };
        Dialog.prototype.good = function () { this.domObj.style.backgroundColor = "aquamarine"; return this; };
        Dialog.prototype.warning = function () { this.domObj.style.backgroundColor = "lightyellow"; return this; };
        Dialog.prototype.error = function () { this.domObj.style.backgroundColor = "lightpink"; return this; };
        Dialog.prototype.bad = function () { this.domObj.style.backgroundColor = "lightpink"; return this; };
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
                this.addSayButton(btns[i]);
            }
            return this;
        };
        Dialog.prototype.setNoClose = function (value) {
            if (value === void 0) { value = true; }
            this.noclose = value;
            this.closerButton.style.display = value ? "none" : "";
        };
        Dialog.prototype.addButton = function (text, callback) {
            var btn = document.createElement("button");
            btn.setAttribute("data", this.id);
            btn.className = "BDialogButton";
            btn.tabIndex = 100 + this.buttonList.length;
            btn.onclick = function () {
                callback.call(this);
            };
            btn.innerHTML = text;
            this.buttonbox.appendChild(btn);
            this.buttonList.push(btn);
            return btn;
        };
        Dialog.prototype.addSayButton = function (text, returnValue) {
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
            var dlg = B.Dialog.get("B_SAY_DIALOG");
            dlg.domObj.style.backgroundColor = "";
            dlg.setBottomMessage("");
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
function freeze(msg, title) {
    if (title === void 0) { title = "System Message"; }
    var dlg = B.Dialog.getSay();
    msg = "<div style='text-align:center;width:100%;height:100%;'><br>" + msg + "</div>";
    dlg.setContent(msg);
    dlg.setTitle(title);
    dlg.setButtons();
    dlg.setSize(200, 400, true);
    dlg.open().center();
    dlg.setNoClose();
    dlg.setBottomMessage("<div id='B_FREEZE_TIMER'></div>");
    var timer = B.Timer.add("B_FREEZE_TIMER", "B_FREEZE_TIMER", "SPIN");
    return dlg;
}
function thaw() {
    B.Timer.timers["B_FREEZE_TIMER"]["delete"]();
    popDialog();
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
    dlg.setSize(200, 400, true);
    dlg.open().center();
    return dlg;
}
function sayGet(msg, prompt, defaultValue, title, callback, inputAsTextarea, allowTabs, bgcolor) {
    if (title === void 0) { title = "System Message"; }
    if (inputAsTextarea === void 0) { inputAsTextarea = false; }
    if (allowTabs === void 0) { allowTabs = false; }
    if (bgcolor === void 0) { bgcolor = ""; }
    var dlg = B.Dialog.getSay();
    var h = msg;
    var dlgWidth = 400;
    h += "<table class='form' style='margin:0 auto; margin-top:.5em;'>";
    h += "<tr><th>" + prompt + ":</th>";
    if (inputAsTextarea) {
        h += "<td><textarea" + (allowTabs ? " class='ALLOWTABS'" : "") + " tabIndex=1 name='result' style='height:3em; width: 20em;'></td></tr>";
        dlgWidth = 500;
    }
    else {
        h += "<td><input tabIndex=1 name='result' size='25'></td></tr>";
    }
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
    dlg.setButtons("Accept=SAVE", "Cancel=CANCEL");
    dlg.domObj.style.backgroundColor = bgcolor;
    dlg.setSize(200, dlgWidth, true);
    var frm = B.getForm("B_SAY_DIALOG");
    frm.set("result", defaultValue);
    var tbox = frm.getElement("result");
    tbox.domElements.focus();
    tbox.domElements.select();
    B.buildForm("B_SAY_DIALOG");
    dlg.open().center();
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
        dlg.addSayButton(list[i]);
    }
    dlg.domObj.style.backgroundColor = bgcolor;
    dlg.setSize(200, 400, true);
    dlg.open().center();
    return dlg;
}
function ask(msg, title, callback) {
    if (typeof title == "string") {
        // All is well... nothing to do here
    }
    else {
        callback = title;
        title = "System Message";
    }
    return choose(msg, title, "Yes=YES|No=NO", callback, "");
}
/// <reference path="B.ts" />
var B;
/// <reference path="B.ts" />
(function (B) {
    function buildForm(id, allowSubmit) {
        if (allowSubmit === void 0) { allowSubmit = false; }
        return new Form(id, allowSubmit, true);
    }
    B.buildForm = buildForm;
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
        function Form(id, allowSubmit, forceBuild) {
            if (allowSubmit === void 0) { allowSubmit = false; }
            if (forceBuild === void 0) { forceBuild = false; }
            this.id = "";
            this.pairedTableId = "";
            this.validationResult = null;
            if (!forceBuild) {
                if (Form.cache[id] != null) {
                    return Form.cache[id];
                }
            }
            this.id = id;
            var form = document.forms.namedItem(id);
            if (!allowSubmit) {
                form.onsubmit = function (event) {
                    event.preventDefault();
                    return false;
                };
            }
            for (var i = 0; i < form.elements.length; i++) {
                var el = form.elements.item(i);
                if (el.type == "textarea" && el.className.indexOf("ALLOWTABS") >= 0) {
                    el.onkeydown = function (e) {
                        if (e.keyCode == 9 || e.which == 9) {
                            e.preventDefault();
                            var el_1 = this;
                            var s = el_1.selectionStart;
                            el_1.value = el_1.value.substring(0, el_1.selectionStart) + "\t" + el_1.value.substring(el_1.selectionEnd);
                            el_1.selectionEnd = s + 1;
                        }
                    };
                }
            }
            Form.cache[id] = this;
        }
        Form.prototype.get = function () {
            var items = {};
            var form = document.getElementById(this.id);
            var els = new FormData(form);
            for (var elname in els) {
                var el = els[elname];
                if (B.is.oneOf(el.type, ",text,textarea,number,hidden")) {
                    items[el.name] = el.value.trim();
                }
                else if (el.type == "checkbox") {
                    items[el.name] = el.checked;
                }
                else if (el.type == "select-one") {
                    var sel = els[elname];
                    if (sel.selectedIndex >= 0) {
                        items[el.name] = sel.options[sel.selectedIndex].value.trim();
                    }
                    else {
                        items[el.name] = null;
                    }
                }
                else if (el.type == "select-multiple") {
                    var sel = els[elname];
                    var sels = [];
                    for (var optnum = 0; optnum = sel.options.length; optnum++) {
                        var opt = sel.options[optnum];
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
            var form = document.getElementById(this.id);
            var els = form.elements[field];
            var obj = {
                domElements: els[field],
                type: els[0].type
            };
            return obj;
        };
        Form.prototype.click = function (field) {
            var obj = this.getElement(field);
            obj.domElements.click();
        };
        Form.prototype.set = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // Pairs of values set(name,val, name,val);
            var form = document.getElementById(this.id);
            for (var argnum = 0; argnum < args.length; argnum += 2) {
                var field = args[argnum];
                if (field == null)
                    continue;
                var val = "";
                if (args.length <= argnum + 1) {
                    val = "";
                }
                else {
                    val = args[argnum + 1];
                }
                var el = form.elements[field];
                if (el != null) {
                    if (el.type == "checkbox") {
                        if (typeof val == "string")
                            val = (val.toUpperCase() == "Y");
                        el.checked = val;
                    }
                    else {
                        el.value = val;
                    }
                }
            }
        };
        Form.prototype.freeze = function () {
        };
        Form.prototype.thaw = function () {
        };
        Form.prototype.reset = function () {
            var form = document.getElementById(this.id);
            form.reset();
        };
        Form.prototype.getValidationIssues = function () {
            var rslt = "";
            for (var key in this.validationResult) {
                var itm = this.validationResult[key];
                if (itm.issue != "") {
                    rslt += "<li>" + itm.prompt + " " + itm.issue + "</li>";
                }
            }
            if (rslt != "")
                rslt = "<ul>" + rslt + "</ul>";
            return rslt;
        };
        Form.prototype.validate = function (action, validator) {
            if (validator === void 0) { validator = null; }
            var form = document.getElementById(this.id);
            var vdata = {};
            var chk = this.get();
            for (var key in chk) {
                if (chk.hasOwnProperty(key)) {
                    var el = form.elements[key];
                    var itm = {
                        field: key,
                        value: chk[key],
                        type: el.type,
                        prompt: el.dataset["prompt"],
                        required: el.hasAttribute("required"),
                        minNumber: el.hasAttribute("min") ? el.getAttribute("min") : 0,
                        maxNumber: el.hasAttribute("max") ? el.getAttribute("max") : 0,
                        minLength: el.hasAttribute("minLength") ? parseInt(el.getAttribute("minLength")) : 0,
                        maxLength: el.hasAttribute("maxLength") ? parseInt(el.getAttribute("maxLength")) : 0,
                        pattern: el.hasAttribute("pattern") ? el.getAttribute("pattern") : "",
                        issue: ""
                    };
                    if (itm.type == undefined)
                        itm.type = "text";
                    if (itm.prompt == undefined)
                        itm.prompt = el.getAttribute("prompt");
                    if (itm.prompt == undefined)
                        itm.prompt = "Field " + key;
                    vdata[key] = itm;
                    var minmaxIssue = false;
                    var minmaxText = "";
                    var patternIssue = false;
                    if (itm.type == "number") {
                        var val = parseInt(itm.value);
                        if (itm.minNumber > 0 && itm.maxNumber > 0) {
                            minmaxText = "must be between " + itm.minNumber + " and " + itm.maxNumber;
                            minmaxIssue = val < itm.minNumber || val > itm.maxNumber;
                        }
                        else if (itm.minNumber > 0) {
                            minmaxText = "must be >= " + itm.minNumber;
                            minmaxIssue = val < itm.minNumber;
                        }
                        else if (itm.maxNumber > 0) {
                            minmaxText = "must be <= " + itm.maxNumber;
                            minmaxIssue = val > itm.maxNumber;
                        }
                        if (isNaN(val))
                            minmaxIssue = true;
                    }
                    else {
                        if (itm.minLength > 0 && itm.maxLength > 0) {
                            if (itm.minLength == itm.maxLength) {
                                minmaxText = "must be " + itm.minLength + " chars";
                            }
                            else {
                                minmaxText = "must be between " + itm.minLength + " and " + itm.maxLength + " chars";
                            }
                            minmaxIssue = itm.value.length < itm.minLength || itm.value.length > itm.maxLength;
                        }
                        else if (itm.minLength > 0) {
                            minmaxText = "must be >= " + itm.minLength + " chars";
                            minmaxIssue = itm.value.length < itm.minLength;
                        }
                        else if (itm.maxLength > 0) {
                            minmaxText = "must be <= " + itm.maxLength + " chars";
                            minmaxIssue = itm.value.length > itm.maxLength;
                        }
                    }
                    if (itm.required && itm.value == "") {
                        var txt = "is required";
                        if (minmaxIssue)
                            txt += " and " + minmaxText;
                        itm.issue = txt;
                    }
                    else {
                        if (minmaxIssue)
                            itm.issue = minmaxText;
                        if (itm.issue == "" && itm.pattern != "") {
                            var patt = new RegExp(itm.pattern);
                            var isMatch = patt.test(itm.value);
                            if (!isMatch) {
                                itm.issue = "is invalid";
                            }
                        }
                    }
                }
            }
            if (validator != null)
                validator(this, vdata, action);
            this.validationResult = vdata;
            var anyIssues = false;
            for (var key in vdata) {
                var itm = vdata[key];
                if (itm.issue != "")
                    anyIssues = true;
            }
            return !anyIssues; // No issues = valid
        };
        Form.cache = {};
        return Form;
    }());
    B.Form = Form;
})(B || (B = {}));
/// <reference path="B.ts" />
var B;
/// <reference path="B.ts" />
(function (B) {
    var DropdownMenu = /** @class */ (function () {
        function DropdownMenu(containerId, id, icon, title, width) {
            if (width === void 0) { width = 0; }
            this.container = null;
            this.element = null;
            this.enabled = true;
            this.visible = true;
            this.popup = null;
            this.onDrop = null;
            this.container = document.getElementById(containerId);
            this.element = document.createElement("div");
            this.element.setAttribute("data-BDROPDOWN", id);
            DropdownMenu.menus[id] = this;
            this.element.style.cssText = "display:inline-block; padding: .5em; padding-top:0; position:relative;";
            this.element.className = "anchor";
            if (icon != null) {
                var spn_1 = document.createElement("span");
                spn_1.style.cssText = "font-size: 1.2em; display:inline-block; position:relative; top:.14em; width:1.2em;";
                spn_1.className = "material-icons";
                spn_1.innerHTML = icon;
                this.element.appendChild(spn_1);
                //spn = document.createElement("span");
                //spn.innerHTML = "&nbsp;";
                //this.element.appendChild(spn);
            }
            var spn = document.createElement("span");
            spn.style.cssText = "display:inline-block; position:relative;";
            spn.innerHTML = title;
            this.element.appendChild(spn);
            this.container.appendChild(this.element);
            this.element.onclick = function (event) {
                var target = B.util.findNodeWithAttribute(event.target, "data-BDROPDOWN");
                var mnu = DropdownMenu.menus[target.getAttribute("data-BDROPDOWN")];
                if (mnu.popup.visible) {
                    mnu.hide();
                }
                else {
                    event.stopPropagation();
                    if (mnu.enabled) {
                        var el = mnu.element;
                        var rect = el.getBoundingClientRect();
                        mnu.show(rect.left + 6, rect.bottom - 6);
                    }
                }
            };
            this.popup = new PopupMenu('DROPDOWN_' + id, width);
            document.body.addEventListener("click", function () {
                B.PopupMenu.hideAll();
            });
        }
        DropdownMenu.prototype.show = function (left, top) {
            for (var id in DropdownMenu.menus) {
                DropdownMenu.menus[id].popup.hide();
            }
            if (this.popup.visible)
                return;
            if (this.onDrop != null)
                this.onDrop(this);
            this.popup.show(left, top);
        };
        DropdownMenu.prototype.hide = function () {
            for (var id in DropdownMenu.menus) {
                DropdownMenu.menus[id].popup.hide();
            }
        };
        DropdownMenu.prototype.enable = function (torf) {
            if (torf === void 0) { torf = true; }
            if (!torf)
                return this.disable();
            this.element.className = "anchor";
            this.element.style.color = "";
            this.enabled = true;
            return this;
        };
        DropdownMenu.prototype.disable = function (torf) {
            if (torf === void 0) { torf = true; }
            if (!torf)
                return this.enable();
            this.element.className = "";
            this.element.style.color = "brown";
            this.enabled = false;
            return this;
        };
        DropdownMenu.menus = {};
        DropdownMenu.menuCount = 0;
        return DropdownMenu;
    }());
    B.DropdownMenu = DropdownMenu;
    var MenuItem = /** @class */ (function () {
        function MenuItem(parentId, id, callback, icon, text) {
            this.id = "";
            this.callback = null;
            this.icon = "";
            this.text = "";
            this.enabled = true;
            this.visible = true;
            this.element = null;
            this.iconDiv = null;
            this.textDiv = null;
            this.id = id;
            this.callback = callback;
            this.icon = icon;
            this.text = text;
            this.element = document.createElement("div");
            this.element.setAttribute("data-BMENUITEM", parentId + "." + id);
            this.element.onclick = function (event) {
                var target = B.util.findNodeWithAttribute(event.target, "data-BMENUITEM");
                var myids = target.getAttribute("data-BMENUITEM").split("."); // parent,child
                var pop = PopupMenu.menus[myids[0]];
                var itm = pop.items[myids[1]];
                if (itm.enabled) {
                    pop.hide();
                    itm.callback();
                }
                else {
                    event.stopPropagation(); // Dont close
                }
            };
            this.element.className = "BPopupMenuItem";
            this.iconDiv = document.createElement("div");
            this.iconDiv.className = "ICON material-icons";
            //this.iconDiv.style.cssText = "display:table-cell; width:1.2em; text-align:center; vertical-align:top;";
            this.element.appendChild(this.iconDiv);
            this.textDiv = document.createElement("div");
            this.textDiv.className = "TEXT";
            this.textDiv.style.cssText = "display:table-cell; vertical-align:top;";
            this.element.appendChild(this.textDiv);
            this.setIcon(icon);
            this.setText(text);
        }
        MenuItem.prototype.setIcon = function (icon) { this.iconDiv.innerHTML = icon; };
        MenuItem.prototype.setText = function (text) { this.textDiv.innerHTML = text; };
        MenuItem.prototype.enable = function (torf) {
            if (torf === void 0) { torf = true; }
            if (!torf)
                return this.disable();
            this.element.style.color = "";
            this.enabled = true;
            return this;
        };
        MenuItem.prototype.disable = function (torf) {
            if (torf === void 0) { torf = true; }
            if (!torf)
                return this.enable();
            this.element.style.color = "orange";
            this.enabled = false;
            return this;
        };
        return MenuItem;
    }());
    B.MenuItem = MenuItem;
    var PopupMenu = /** @class */ (function () {
        function PopupMenu(id, width) {
            this.container = null;
            this.id = "";
            this.items = [];
            this.x = 0;
            this.y = 0;
            this.visible = false;
            this.id = id;
            this.container = document.createElement("div");
            this.container.className = "BDropdownMenu";
            if (width > 0)
                this.container.style.width = width.toString() + "px";
            document.body.appendChild(this.container);
            PopupMenu.menus[id] = this;
        }
        PopupMenu.prototype.show = function (left, top) {
            this.container.style.top = top.toString() + "px";
            this.container.style.left = left.toString() + "px";
            this.container.style.display = "block";
            this.visible = true;
        };
        PopupMenu.prototype.hide = function () {
            this.container.style.display = "none";
            this.visible = false;
        };
        PopupMenu.hideAll = function () {
            for (var id in PopupMenu.menus) {
                PopupMenu.menus[id].hide();
            }
        };
        PopupMenu.prototype.addItem = function (id, callback, icon, text) {
            var itm = new MenuItem(this.id, id, callback, icon, text);
            this.container.appendChild(itm.element);
            this.items[id] = itm;
        };
        PopupMenu.prototype.addSpace = function () {
            var div = document.createElement("div");
            div.className = "BPopupMenuSpace";
            this.container.appendChild(div);
            //this.items[id] = itm;
        };
        PopupMenu.menus = {};
        return PopupMenu;
    }());
    B.PopupMenu = PopupMenu;
})(B || (B = {}));
/// <reference path="B.ts" />
var B;
/// <reference path="B.ts" />
(function (B) {
    var RemoteMethod = /** @class */ (function () {
        function RemoteMethod(className, methodName, onBefore, onAfter, url) {
            this.className = "";
            this.methodName = "";
            this.onBefore = null;
            this.onAfter = null;
            this.url = "";
            this.runCount = 0;
            this.error = "";
            this.running = false;
            this.aborted = false;
            this.timings = { start: null, end: null, remotemillis: 0, overheadmillis: 0, totalmillis: 0 };
            this.params = {};
            this.results = {};
            this.xhr = new XMLHttpRequest();
            this.listPosition = -1;
            this.className = className;
            this.methodName = methodName;
            this.onBefore = onBefore;
            this.onAfter = onAfter;
            if (url == undefined)
                url = RemoteMethod.defaultURL;
            this.url = url;
            this.xhr.onreadystatechange = function (event) {
                var _this = this;
                console.log("XHR state=" +
                    this.readyState +
                    ", Status " +
                    this.status + " '" +
                    this.statusText + "'");
                if (this.readyState == 4) {
                    var matchArray = B.RemoteMethod.remoteMethods.filter(function (itm) {
                        return (_this == itm.xhr);
                    });
                    var remoteMethod = matchArray[0].remoteMethod;
                    if (this.status == 200) {
                        // parts of result are seperated by formfeeds
                        var parts = this.responseText.split("\f");
                        // part 0 is the error message (if any)
                        // part 1+ are result names and values. 
                        // Name and values are seperated by backspace characters
                        remoteMethod.error = parts[0].split("\b")[1]; //ERROR\bText of error\f
                        for (var i = 1; i < parts.length; i++) {
                            var itm = parts[i].split("\b"); // ITEMNAME\bItem value\f
                            var key = itm[0];
                            var val = itm[1];
                            if (val.charCodeAt(val.length - 1)) { //Ends with null?
                                val = val.substr(0, val.length - 1);
                            }
                            remoteMethod.results[key] = val;
                        }
                        remoteMethod.onAfter(remoteMethod.error == "", remoteMethod);
                    }
                    else {
                        remoteMethod.error = "Error status code: " + this.status + " '" + this.statusText;
                        remoteMethod.onAfter(false, remoteMethod);
                    }
                }
            };
            B.RemoteMethod.remoteMethods.push({ "xhr": this.xhr, remoteMethod: this });
        }
        RemoteMethod.prototype.setParameter = function () {
            if (arguments.length == 1) { // Pass in a collection?
                var args = arguments[0];
                for (var itm in args) {
                    var key = itm.trim().toUpperCase();
                    this.params[key] = args[itm];
                }
            }
            for (var i = 0; i < arguments.length; i += 2) {
                var key = arguments[i].trim().toUpperCase();
                this.params[key] = arguments[i + 1];
            }
            return this;
        };
        RemoteMethod.prototype.getParameter = function (key) {
            return this.params[key];
        };
        RemoteMethod.prototype.setResult = function () {
            if (arguments.length == 1) { // Pass in a collection?
                var args = arguments[0];
                for (var itm in args) {
                    var key = itm.trim().toUpperCase();
                    this.results[key] = args[itm];
                }
            }
            for (var i = 0; i < arguments.length; i += 2) {
                var key = arguments[i].trim().toUpperCase();
                this.results[key] = arguments[i + 1];
            }
            return this;
        };
        RemoteMethod.prototype.getResult = function (key) {
            return this.results[key.toUpperCase()];
        };
        RemoteMethod.prototype.run = function () {
            this.setParameter.call(null, arguments);
            this.aborted = false;
            this.timings.start = new Date();
            this.timings.end = null;
            this.timings.remotemillis = 0;
            this.timings.overheadmillis = 0;
            this.timings.totalmillis = 0;
            var ok = this.onBefore(this);
            if (ok == undefined)
                ok = true;
            if (!ok)
                return;
            var d = "callClass=" + this.className;
            d += "&callMethod=" + this.methodName;
            d += "&RPCCallType=" + "CALLBUNDLE";
            d += "&RemoteMethodItem=" + this.listPosition;
            d += "&RPCCallNumber=" + this.runCount++;
            for (var key in this.params) {
                d += "&key=" + encodeURI(this.params[key]);
            }
            this.error = "";
            this.results = {};
            this.running = true;
            if (this.className == null) {
                if (this.methodName != null) {
                    // Check if you sent in a millisecond counter for test purposes
                    if (!isNaN(parseInt(this.methodName, 10))) {
                        // Simulate taking some time to do the remote method
                        window.setTimeout(function (remoteMethod) {
                            remoteMethod.onAfter.call(null, true, remoteMethod);
                        }, parseInt(this.methodName, 10), this);
                        return;
                    }
                    else {
                        this.onAfter(true, this);
                        return;
                    }
                }
                else {
                    this.onAfter(true, this);
                    return;
                }
            }
            //this.xhr.onreadystatechange = this.stateHandler;
            this.xhr.open("POST", this.url, true);
            this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            this.xhr.send(d);
        };
        RemoteMethod.remoteMethods = [];
        RemoteMethod.defaultURL = "/test/RemoteMethod";
        return RemoteMethod;
    }());
    B.RemoteMethod = RemoteMethod;
})(B || (B = {}));
/// <reference path="B.ts" />
var B;
/// <reference path="B.ts" />
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
            if (headJust === void 0) { headJust = ""; }
            this.id = "BEEF";
            this.width = "0";
            this.just = "L";
            this.head = "";
            this.headJust = "L";
            this.id = id;
            if (!isNaN(width))
                width += "px";
            this.width = width;
            this.just = just;
            this.head = head;
            if (headJust == "")
                headJust = just;
            this.headJust = headJust;
        }
        return TableColumn;
    }());
    B.TableColumn = TableColumn;
    var Table = /** @class */ (function () {
        function Table(tbl, id, datasetCodes, title1, title2) {
            if (title1 === void 0) { title1 = "row"; }
            if (title2 === void 0) { title2 = ""; }
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
            this.pickedCell = null;
            this.pickStyle = "ROW"; // ROW, CELL or ROWCELL
            this.thead = null;
            this.tbody = null;
            this.tfoot = null;
            this.pairedFormId = null;
            this.pairedFormBaseTitle = "";
            this.onFormFill = null;
            this.onFormSave = null;
            this.sourceRowCount = -1; // show xxx of yyyy rows?
            this.columns = {};
            this.columnList = [];
            this.anyHeaders = false;
            this.table = document.getElementById(tbl);
            this.container = document.createElement("div");
            this.container.style.cssText = "text-align:left; display:inline-block; margin:0; border:0; padding:0; position:relative;";
            this.table.parentNode.insertBefore(this.container, this.table);
            // Move the table as defined in the HTML into the container
            this.container.appendChild(this.table);
            // Add a container around it to be scrolled (if necessary)
            this.tableContainer = document.createElement("div");
            this.tableContainer.setAttribute("data-BTABLE", id);
            this.tableContainer.onclick = function (event) {
                var tmp = B.util.findNodeWithAttribute(event.target, "data-BTABLE");
                var tblId = tmp.getAttribute("data-BTABLE");
                var btbl = B.Table.cache[tblId];
                btbl.unpick();
            };
            this.tableContainer.className = "BTableScrollingContainer";
            this.tableContainer.style.cssText = "overflow-y:scroll; overflow-x:hidden; " +
                //"overflow-style:-ms-autohiding-scrollbar; " +
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
                var colgroup = document.createElement("colgroup");
                for (var colnum = 0; colnum < this.columnList.length; colnum++) {
                    var itm = this.columnList[colnum];
                    var col = document.createElement("col");
                    var w = itm.width;
                    col.style.width = itm.width;
                    colgroup.appendChild(col);
                }
                this.table.appendChild(colgroup);
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
                for (var colnum = 0; colnum < this.columnList.length; colnum++) {
                    var itm = this.columnList[colnum];
                    var el = document.createElement("th");
                    el.className = "th";
                    el.style.cssText = "position:sticky; top:0;";
                    el.innerHTML = itm.head;
                    var just = itm.headJust;
                    just = (just == "C" ? "center" : (just == "R" ? "right" : "left"));
                    if (just != "")
                        el.style.textAlign = just;
                    tr_1.appendChild(el);
                }
                tr_1.cells[tr_1.cells.length - 1].style.paddingRight = "20px";
                this.thead.appendChild(tr_1);
            }
            this.table.setAttribute("data-BTABLE", this.id);
            if ("IntersectionObserver" in window) {
                this.rowWatcher = new IntersectionObserver(function (entries, observer) {
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        if (entry.isIntersecting) {
                            var tr_2 = entry.target;
                            var table_1 = B.util.parentNode(tr_2, "table");
                            var id_1 = table_1.getAttribute("data-BTABLE");
                            var btbl = Table.cache[id_1];
                            btbl.renderRow(tr_2.rowIndex - 1);
                            btbl.rowWatcher.unobserve(tr_2);
                        }
                    }
                }, { root: this.table });
            }
            Table.cache[this.id] = this;
            this.table.onclick = function (event) {
                document.body.click();
                event.stopPropagation();
                var td = event.target;
                var tr = B.util.parentNode(td, "tr");
                var table = B.util.parentNode(tr, "table");
                var cacheNumber = table.getAttribute("data-BTABLE");
                var btbl = Table.cache[cacheNumber];
                if (event.shiftKey) {
                    btbl.unpick();
                }
                else {
                    btbl.pickRow(tr.rowIndex, td);
                }
            };
            this.table.ondblclick = function (event) {
                // In order to be double-clicked, it must have been clicked
                // The click event would handle the visual aspects, etc.
                var td = event.target;
                var tr = B.util.parentNode(td, "tr");
                var table = B.util.parentNode(tr, "table");
                table = B.util.findNodeWithAttribute(table, "data-BTABLE");
                var cacheNumber = table.getAttribute("data-BTABLE");
                var btbl = Table.cache[cacheNumber];
                var rn = tr.rowIndex;
                if (btbl.anyHeaders)
                    rn--;
                var rd = btbl.dataset.rows[rn];
                var currd = btbl.getDataRow();
                var curtr = btbl.getTableRow();
                btbl.pickedRow = rn;
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
            this.footerButtonContainer.style.cssText = "vertical-align:middle";
            this.footerMessageContainer = tr.insertCell(-1);
            this.footerMessageContainer.className = "BFooterMessageContainer";
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
                            if (this.enabled)
                                return;
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
                            if (!this.enabled)
                                return;
                            this.enabled = false;
                            this.div.style.cursor = "default";
                            //this.div.style.color = "firebrick";
                            //this.div.onmouseover = function() {}
                            //this.div.className = "BTableFooterButton";
                            this.div.setAttribute("disabled", "disabled");
                        }
                    };
                    var btn = document.createElement("button");
                    btn.className = "BTableFooterButton enabled inline";
                    btn.style.cssText = "top: 0";
                    btn.setAttribute("data-BTABLE", this.tableObject.table.getAttribute("data-BTABLE"));
                    btn.setAttribute("data-BUTTONID", id);
                    btn.innerHTML = title;
                    btn.id = this.tableObject.id + "_BTN_" + this.buttonList.length;
                    btn.onclick = function () {
                        var div = event.target;
                        div = B.util.findNodeWithAttribute(div, "data-BTABLE");
                        var cacheNumber = div.getAttribute("data-BTABLE");
                        var btbl = Table.cache[cacheNumber];
                        var btn = btbl.footer.buttons[div.getAttribute("data-BUTTONID")];
                        if (btn.enabled) {
                            var tblRow = btbl.getTableRow();
                            var cells = null;
                            if (tblRow != undefined) {
                                cells = btbl.makeCellsCollection(btbl.getTableRow());
                            }
                            btn.onclick.call(btbl, btn, btbl.dataset.rows[btbl.pickedRow], cells);
                        }
                    };
                    obj.div = btn;
                    this.tableObject.footerButtonContainer.appendChild(btn);
                    this.buttons[id] = obj;
                    if (this.buttonList.length > 0)
                        btn.style.marginLeft = ".25em";
                    this.buttonList.push(id);
                    if (track && this.tableObject.pickedRow == null) {
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
            this.rowCountTitle = title1;
            this.rowCountTitle2 = title2;
            this.setMessage();
        }
        Table.prototype.preRowRender = function (rn, row, cells, rd) { return true; };
        Table.prototype.onclick = function (td, tr, rd, changed) { return; };
        Table.prototype.ondblclick = function (td, tr, rd) { return; };
        Table.prototype.setTableHeight = function (height) {
            if (typeof height == "number")
                height = height.toString() + "px";
            this.tableContainer.style.height = height;
            this.tableContainer.style.overflowY = "scroll";
        };
        Table.prototype.pickRow = function (rownum, td) {
            var tr = this.table.rows[rownum];
            if (this.anyHeaders)
                rownum--;
            var rd = this.getDataRow(rownum);
            var curtr = this.getTableRow();
            var changed = false;
            if (curtr == null) {
                changed = true;
            }
            else if (curtr == tr) { // Picked same row... maybe different cell?
                if (this.pickedCell != null)
                    curtr.cells[this.pickedCell].className = "";
            }
            else { // Picked different row
                if (this.pickedCell != null)
                    curtr.cells[this.pickedCell].className = "";
                if (curtr.className == "pickedRow")
                    curtr.className = "";
            }
            if (this.pickStyle == "ROW" || this.pickStyle == "ROWCELL") {
                if (tr.className != "pickedRow")
                    tr.className = "pickedRow";
            }
            this.pickedRow = rownum;
            // Handle tracked footer buttons
            this.handleTrackedButtons();
            // Do user click action (if any)
            var cells = this.makeCellsCollection(tr);
            if (td == undefined)
                td = tr.cells[0];
            this.pickedCell = td.cellIndex;
            if (this.pickStyle == "CELL")
                td.className = "pickedRow";
            if (this.pickStyle == "ROWCELL")
                td.className = "pickedCell";
            if (this.onclick != null)
                this.onclick.call(this, td, tr, rd, cells, changed);
        };
        Table.prototype.handleTrackedButtons = function () {
            for (var key in this.footer.buttons) {
                var btn = this.footer.buttons[key];
                if (btn.track)
                    btn.enable(this.pickedRow != null);
            }
        };
        Table.prototype.unpick = function () {
            var curtr = this.getTableRow();
            if (curtr == null)
                return;
            curtr.className = "";
            this.pickedRow = null;
            // Handle tracked footer buttons
            this.handleTrackedButtons();
            if (this.onclick != null)
                this.onclick.call(this, null, null, null, null, true);
        };
        Table.prototype.pairWithForm = function (formId, supportedActions, onFormFill, onFormSave) {
            if (supportedActions === void 0) { supportedActions = "AECD"; }
            if (onFormFill === void 0) { onFormFill = null; }
            if (onFormSave === void 0) { onFormSave = null; }
            this.pairedFormId = formId;
            this.pairedFormBaseTitle = B.Dialog.get(formId).getTitle();
            this.onFormFill = onFormFill;
            this.onFormSave = onFormSave;
            if (supportedActions.indexOf("A") >= 0) {
                this.footer.addButton("formAdd", "Add", function () {
                    this.formAdd();
                });
            }
            if (supportedActions.indexOf("E") >= 0) {
                this.footer.addButton("formEdit", "Edit", function () {
                    this.formEdit();
                }, true).disable();
                this.ondblclick = function () {
                    this.formEdit();
                };
            }
            if (supportedActions.indexOf("C") >= 0) {
                this.footer.addButton("formCopy", "Copy", function () {
                    this.formCopy();
                }, true).disable();
            }
            if (supportedActions.indexOf("D") >= 0) {
                var btn = this.footer.addButton("formDelete", "Delete", function () {
                    this.formDelete();
                }, true);
                btn.disable();
                btn.className = "warning";
            }
            return this;
        };
        Table.prototype.getForm = function () { return B.getForm(this.pairedFormId); };
        Table.prototype.formAdd = function () {
            if (this.pairedFormId == null)
                return;
            var dlg = B.Dialog.get(this.pairedFormId);
            dlg.setTitle(this.pairedFormBaseTitle + " (Add)");
            var frm = this.getForm();
            if (frm == null)
                return;
            frm.pairedTableId = this.id;
            frm.reset();
            var okToOpen = true;
            if (this.onFormFill != null) {
                okToOpen = this.onFormFill(frm, "ADD");
                if (okToOpen == undefined)
                    okToOpen = true;
            }
            if (okToOpen) {
                dlg.setButtons();
                dlg.addButton("Save new " + this.rowCountTitle, function () {
                    var frm = B.Form.cache[this.getAttribute("data")];
                    var btbl = B.Table.cache[frm.pairedTableId];
                    btbl.saveNewRow(frm);
                });
                dlg.addButton("Cancel", popDialog);
                dlg.open();
            }
        };
        Table.prototype.saveNewRow = function (frm) {
            var chk = frm.get();
            var params = [];
            for (var i = 0; i < this.dataset.columns.length; i++) {
                var cname = this.dataset.columns[i];
                params.push(chk[cname]);
            }
            var rslt = frm.validate("NEW", this.onFormSave);
            if (rslt == undefined)
                rslt = true;
            if (!rslt) {
                say(this.getForm().getValidationIssues()).error();
                return;
            }
            this.addRow.apply(this, params);
            this.pickRow(this.table.rows.length - 1);
            popDialog();
            this.handleTrackedButtons();
        };
        Table.prototype.formEdit = function () {
            if (this.pairedFormId == null)
                return;
            var dlg = B.Dialog.get(this.pairedFormId);
            dlg.setTitle(this.pairedFormBaseTitle + " (Ediit)");
            var rd = this.getDataRow();
            if (rd == null)
                return;
            var frm = this.getForm();
            if (frm == null)
                return;
            frm.pairedTableId = this.id;
            frm.reset();
            for (var cname in rd) {
                frm.set(cname, rd[cname]);
            }
            //for (let cname in this.dataset.columnNames) {
            //    frm.set(cname, rd[cname]);
            //}
            var okToOpen = true;
            if (this.onFormFill != null) {
                okToOpen = this.onFormFill(frm, "EDIT");
                if (okToOpen == undefined)
                    okToOpen = true;
            }
            if (okToOpen) {
                dlg.setButtons();
                dlg.addButton("Save " + this.rowCountTitle + "  changes", function () {
                    var frm = B.Form.cache[this.getAttribute("data")];
                    var btbl = B.Table.cache[frm.pairedTableId];
                    btbl.saveRowChanges(frm);
                });
                dlg.addButton("Cancel", popDialog);
                dlg.open();
            }
        };
        Table.prototype.saveRowChanges = function (frm) {
            var rslt = frm.validate("EDIT", this.onFormSave);
            if (rslt == undefined)
                rslt = true;
            if (!rslt) {
                say(this.getForm().getValidationIssues()).error();
                return;
            }
            var rd = this.getDataRow();
            if (rd == null)
                return;
            var chk = frm.get();
            for (var cname in this.dataset.columnNames) {
                if (chk[cname] != null) {
                    rd[cname] = chk[cname];
                }
            }
            this.renderRow(this.pickedRow);
            popDialog();
            this.handleTrackedButtons();
        };
        Table.prototype.formCopy = function () {
            if (this.pairedFormId == null)
                return;
            var dlg = B.Dialog.get(this.pairedFormId);
            dlg.setTitle(this.pairedFormBaseTitle + " (Copy)");
            var rd = this.getDataRow();
            if (rd == null)
                return;
            var frm = this.getForm();
            if (frm == null)
                return;
            frm.pairedTableId = this.id;
            frm.reset();
            for (var cname in this.dataset.columnNames) {
                frm.set(cname, rd[cname]);
            }
            var okToOpen = true;
            if (this.onFormFill != null) {
                okToOpen = this.onFormFill(frm, "COPY");
                if (okToOpen == undefined)
                    okToOpen = true;
            }
            if (okToOpen) {
                dlg.setButtons();
                dlg.addButton("Save " + this.rowCountTitle + "  copy", function () {
                    var frm = B.Form.cache[this.getAttribute("data")];
                    var btbl = B.Table.cache[frm.pairedTableId];
                    btbl.saveNewRow(frm);
                });
                dlg.addButton("Cancel", popDialog);
                dlg.open();
            }
        };
        Table.prototype.formDelete = function () {
            var msg = "Are you sure you want to delete the selected " + this.rowCountTitle + "?";
            var btbl = this;
            var okToDelete = true;
            if (this.onFormSave != null) {
                var okToDelete_1 = this.onFormSave(null, null, "DEL");
                if (okToDelete_1 == undefined)
                    okToDelete_1 = true;
            }
            if (!okToDelete)
                return;
            choose(msg, "Delete " + this.rowCountTitle, "Yes - Delete=YES|No - Cancel=No", function (rslt) {
                if (rslt == "YES")
                    btbl.saveRowDelete();
            }).warning();
        };
        Table.prototype.saveRowDelete = function () {
            var rd = this.getDataRow();
            if (rd == null)
                return;
            var tr = this.getTableRow();
            this.unpick();
            this.dataset.rows.splice(tr.rowIndex - 1, 1);
            this.table.deleteRow(tr.rowIndex);
            popDialog();
            this.handleTrackedButtons();
        };
        Table.prototype.getDataRow = function (rownum) {
            if (rownum == undefined) {
                if (this.pickedRow != null)
                    rownum = this.pickedRow;
            }
            return (rownum == null ? null : this.dataset.rows[rownum]);
        };
        Table.prototype.getTableRow = function (rownum) {
            if (rownum == undefined) {
                if (this.pickedRow != null)
                    rownum = this.pickedRow;
            }
            return (rownum == null ? null : this.tbody.rows[rownum]);
        };
        Table.prototype.getTableRowCells = function (rownum) {
            if (rownum == undefined) {
                if (this.pickedRow != null)
                    rownum = this.pickedRow;
            }
            return (rownum == null ? null : this.tbody.rows[rownum]);
        };
        Table.prototype.clear = function () {
            this.unpick();
            this.dataset.rows = [];
            while (this.table.rows.length > 1)
                this.table.deleteRow(1);
            this.setMessage();
            this.handleTrackedButtons();
        };
        Table.prototype.addRowsJSON = function (list) {
            for (var i = 0; i < list.length; i++) {
                this.addRowJSON(list[i]);
            }
        };
        Table.prototype.addRows = function (data) {
            if (typeof data == "object") {
                this.addRowsJSON(data);
            }
            else {
                var rows = data.split("\n");
                for (var i = 0; i < rows.length; i++) {
                    this.addRow(rows[i].split("\t"));
                }
            }
        };
        Table.prototype.addRowJSON = function (json) {
            this.dataset.rows.push(json);
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
        Table.prototype.addRow = function (argumentList) {
            //if (arguments.length == 1 && typeof arguments[0] == "object") {
            //    return this.addRowJSON(arguments[0]);
            //}
            var rowData = {};
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
            if (this.rowCountTitle2 == "") {
                this.rowCountTitle2 = this.rowCountTitle + "s";
            }
            if (msg == "") {
                var count = this.dataset.rows.length;
                if (count == 0) {
                    this.footerMessageContainer.innerHTML = "No " + this.rowCountTitle2;
                }
                else if (count == 1) {
                    this.footerMessageContainer.innerHTML = "1 " + this.rowCountTitle;
                }
                else {
                    msg = B.format.numberWithCommas(count);
                    if (this.sourceRowCount > count) {
                        msg += " of <span class='highlight'>" + B.format.numberWithCommas(this.sourceRowCount) + "</span>";
                    }
                    this.footerMessageContainer.innerHTML = msg + " " + this.rowCountTitle2;
                }
            }
            else {
                this.footerMessageContainer.innerHTML = msg;
            }
        };
        Table.prototype.setSourceRowCount = function (count) {
            this.sourceRowCount = count;
            this.setMessage();
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
                    rownum = this.pickedRow;
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
            this.preRowRender(tr.rowIndex, tr, cells, this.dataset.rows[rownum]);
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
            this.container.style.opacity = .6;
        };
        Table.prototype.thaw = function () {
            if (this.freezeTimer != null) {
                this.freezeTimer.stop();
            }
            B.util.killElement(this.freezeTextElement, this.freezeCover);
            this.container.style.opacity = 1;
        };
        Table.cache = {};
        return Table;
    }());
    B.Table = Table;
})(B || (B = {}));
//# sourceMappingURL=B.js.map