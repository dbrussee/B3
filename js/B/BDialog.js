// Initialze B container if needed
if (window.B == undefined) window.B = { }
if (B.system == undefined) B.system = { }
B.system.dialogStack = [];
B.system.dialogCollection = {};
B.system.dialogOverlay = null;
B.system.defaultSay = { id:"__BSayDialog", width:"380px", height:"200px", title:"System B Message" }
B.system.freezeDialog = { id:"__BFreezeDialog", width:"380px", height:"200px" }

B.getDialog = function(dialogId) {
    var dlg = B.system.dialogCollection[dialogId];
    if (dlg == undefined) {
        new B.Dialog(dialogId);
        dlg = B.system.dialogCollection[dialogId]
    }
    return dlg;
}
B.Dialog = function(dialogId) {
    this.id = dialogId; // required
    var initElement = document.getElementById(this.id);
    if (initElement.tagName == "FORM") {
    	initElement.onsubmit = function(event) {event.preventDefault(); return false;}
    }
    var initHeight = initElement.style.height;
    var initWidth = initElement.style.width;
    if (B.system.dialogOverlay == null) {
        var div = document.createElement("div");
        div.style.cssText = "display:none; " +
            "position:fixed; " +
            "padding-top: 100px; " +
            "background-color: rgba(0,0,0,0.1); " +
            "left:0; top:0; width:100%;height:100%; " +
            "overflow:auto; ";
        document.body.appendChild(div);
        B.system.dialogOverlay = div;
    }
    this.callback = function() { return true; }
    var iconValue = initElement.getAttribute("icon");
    // Make the dialog components
    this.container = B.util.makeElement("<div style='margin:auto; padding:.2em; border:1px solid black; border-radius:6px;' class='BDialog'></div>");
    this.container.style.height = initElement.style.height;
    this.container.style.width = initElement.style.width;
    initElement.removeAttribute("id");
    initElement.removeAttribute("style");
    initElement.className = "BDialogMessageText"; // This will now be inside the main dialog
    this.container.id = this.id;
    // Add it to the DOM just before the existing item
    initElement.insertAdjacentElement('beforebegin', this.container);

    this.header = B.util.makeElement("<div class='BDialogHeader' style='border-radius: 4px 4px 0 0;'></div>");
    var titleText = initElement.getAttribute("title");
    if (titleText == null) titleText = "&nbsp;";
    this.header.innerHTML = titleText; // Use the dialog's title
    initElement.removeAttribute("title");
    // Add the header to the container
    this.container.insertAdjacentElement('beforeend', this.header);

    // The messageArea allows its contents to scroll
    var messageContainer = B.util.makeElement("<div class='BDialogMessageArea'></div>");
    // Add to the end of the container
    this.container.insertAdjacentElement('beforeend', messageContainer);

    this.messageBox = initElement;
    // Add an icon (even if it is empty)
    this.iconContainer = null;
    if (iconValue != null) {
    	this.iconContainer = B.util.makeElement("<div class='BDialogMessageIcon material-icons'></div>");
        this.messageBox.insertAdjacentElement('afterbegin', this.iconContainer);
    	this.iconContainer.innerHTML = iconValue;
    }
    // Add an area that can be written to after loading
    this.messageArea = B.util.makeElement("<span></span>");
    this.messageBox.insertAdjacentElement('beforeend', this.messageArea);
    // Put the message inside the message container
    messageContainer.appendChild(this.messageBox);

    this.buttonContainer = B.util.makeElement("<div class='BDialogButtonContainer'></div>");
    this.container.insertAdjacentElement('beforeend', this.buttonContainer);

    this.showCount = 0;
    this.resultCodes = [];

    // Move all BDialogButton buttons inside the container
    this.buttons = [];
    for (var i = 0; i < this.messageBox.childNodes.length; i++) {
        var nod = this.messageBox.childNodes[i];
        if (nod.className == "BDialog") {
            this.addButton(nod.innerHTML, nod.onclick);
            B.util.killElement(nod);
        }
    }
    B.system.dialogCollection[dialogId] = this;
    return this;
}
B.Dialog.prototype.clearButtons = function() {
    for (var i = 0; i < this.buttons.length; i++) {
        var el = this.buttons[i].element;
        B.util.killElement(el);
    }
    this.buttons = [];
    this.resultCodes = [];
}
B.Dialog.prototype.addButton = function(html, handler, code) {
    var nod = B.util.makeElement("<button class='BDialog'>" + html + "</button>");
    var num = this.buttons.length;
    if (code == undefined) code = num;
    this.resultCodes.push(code);
    nod.setAttribute("BDialogButtonNumber", num);
    nod.setAttribute("BDialogId", this.id);
    if (handler == undefined) handler = true;
    if (handler == null) handler = true;
    if (typeof handler == 'boolean') {
        handler = function() { return handler; }
    }
    this.buttons.push({ onclick:handler, element:nod });
    nod.onclick = function(event) {
        var el = event.target;
        var dlg = B.getDialog(el.getAttribute("BDialogId"));
        var num = parseInt(el.getAttribute("BDialogButtonNumber"));
        var code = dlg.resultCodes[num];
        var btn = dlg.buttons[num];
        var rslt = null;
        if (dlg.genericCallback != null) {
            rslt = dlg.genericCallback(code);
        } else {
            rslt = btn.onclick(code);
        }
        if (rslt == undefined) rslt = true;
        if (rslt) closeDialog(dlg.id);
    }
    this.buttonContainer.insertAdjacentElement('beforeEnd', nod);
}
B.Dialog.prototype.setIcon = function(text) {
    this.iconContainer.innerHTML = text;
}
B.Dialog.prototype.show = function() {
    B.system.dialogOverlay.style.display = "block";
    this.container.style.display = "block";
    this.container.style.position = "absolute";
    this.container.style.backgroundColor = "white";
    var myDims = this.container.getBoundingClientRect();
    this.container.style.left = ((window.innerWidth / 2) - (myDims.width / 2)) + "px";
    this.container.style.top = ((window.innerHeight / 2) - (myDims.height / 2)) + "px";
    // 8/17/2019 - dan - Add dragging
    $(this.container).draggable({handle:$(this.header), containment:"document", opacity:.3, cursor:"grabbing"});
    $(this.container).resizable({handles:"n, e, s, w, ne, se, sw, nw", minHeight:myDims.height, minWidth:myDims.width});
    B.system.dialogStack.push(B.system.dialogCollection[this.id]);
    var level = B.system.dialogStack.length;
    this.container.style.zIndex = level * 10 + 1;
    B.system.dialogOverlay.style.zIndex = level * 10;
    this.showCount++;
}
B.Dialog.prototype.close = function() {
    this.showCount -= 1;
    if (this.showCount < 0) this.showCount = 0;
    if (this.showCount > 0) return;

    this.container.style.display = "none";
    for (var i = B.system.dialogStack.length - 1; i >= 0; i--) {
        var itm = B.system.dialogStack[i];
        if (itm.id == this.id) {
            B.system.dialogStack.splice(i, 1);
        }
    }
    var level = B.system.dialogStack.length;
    if (level == 0) {
        B.system.dialogOverlay.style.display = "none";
    } else {
        B.system.dialogOverlay.style.zIndex = level * 10;
    }
}
B.Dialog.prototype.setGenericCallback = function(callback) {
    this.genericCallback = callback;
}
function openDialog(dialogId) {
    var dlg = B.getDialog(dialogId);
    dlg.show();
}
function closeDialog(dialogId) {
    var dlg = B.getDialog(dialogId);
    dlg.close();
}
function popDialog() {
    var dlg = B.system.dialogStack[B.system.dialogStack.length-1];
    dlg.close();
}

B.prepareSay = function(msg, title, height, width, callback) {
    if (title == undefined) title = B.system.defaultSay.title;
    if (height == undefined) height = B.system.defaultSay.height;
    if (B.is.aFunction(height)) {
        callback = height;
        height = B.system.defaultSay.height;
        width = B.system.defaultSay.width;
    }
    if (width == undefined) width = B.system.defaultSay.width;
    var el = document.getElementById(B.system.defaultSay.id);
    if (el == null) {
        var h = "<div id='" + B.system.defaultSay.id + "' " +
            "class='BDialog' " +
            "icon='info' " +
            "style='height:" + height + " width: " + width + ";' " +
            "title='No Title'>" +
            "</div>";
        document.body.appendChild(B.util.makeElement(h));
    }
    var dlg = B.getDialog(B.system.defaultSay.id);
    dlg.messageArea.innerHTML = msg;
    dlg.header.innerHTML = title;
    dlg.iconContainer.innerHTML = "I";
    dlg.container.style.height = height;
    dlg.container.style.width = width;
    dlg.setGenericCallback(callback);
    dlg.clearButtons();
    return dlg;
}

function say(msg, title, height, width, callback) {
    dlg = B.prepareSay(msg, title, height, width, callback);
    dlg.setIcon("chat_bubble_outline");
    dlg.addButton("&nbsp; Ok &nbsp;", null, "OK");
    dlg.show();
}
function sayWarn(msg, title, height, width, callback) {
    dlg = B.prepareSay(msg, title, height, width, callback);
    dlg.setIcon("announcement");
    dlg.addButton("&nbsp; Ok &nbsp;", null, "OK");
    dlg.show();
}
function ask(msg, title, height, width, callback) {
    dlg = B.prepareSay(msg, title, height, width), callback;
    dlg.setIcon("help_outline");
    dlg.addButton("&nbsp; Yes &nbsp;", null, "YES");
    dlg.addButton("&nbsp; No &nbsp;", null, "NO");
    dlg.show();
}
function askC(msg, title, height, width, callback) {
    dlg = B.prepareSay(msg, title, height, width, callback);
    dlg.setIcon("help_outline");
    dlg.addButton("&nbsp; Yes &nbsp;", null, "YES");
    dlg.addButton("&nbsp; No &nbsp;", null, "NO");
    dlg.addButton("&nbsp; Cancel &nbsp;", null, "CANCEL");
    dlg.show();
}
function choose(msg, choices, title, height, width, callback) {
    dlg = B.prepareSay(msg, title, height, width, callback);
    dlg.setIcon("help_outline");
    var lst = choices.split(",");
    for (var i = 0; i < lst.length; i++) {
        dlg.addButton("&nbsp; " + lst[i] + " &nbsp;");
    }
    dlg.show();
}