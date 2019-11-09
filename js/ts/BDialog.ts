namespace B {

    export class Dialog {
        public id:string = "";
        public static overlay = null;
        public static dialogs = {};
        public static dialogCount:number = 0;
        public static dialogStack = [];
        private static dragInfo = {dlg:null, offset:{x:0, y:0}};
        public domObj:HTMLElement = null;
        private content = null;
        private scrollbox = null;
        private title = null;
        private buttonbox = null;
        private buttonList = [];
        private callback = null;
        private isOpen = false;
        private isFirstOpen = true;
        public form:Form = null;
        private tallness = 0;
        private wideness = 0;
        constructor(id:string, callback:CallableFunction = function() {}) {
            if (B.Dialog.dialogs[id] != undefined) {
                return B.Dialog.get(id);
            }
            this.id = id;
            this.callback = callback;
            let contentObj:HTMLElement = document.getElementById(id);
            // Create a container for the dialog
            this.domObj = document.createElement("form");
            this.domObj.id = id;
            this.domObj.className = "BDialog";
            this.domObj.style.cssText = "display:none; position:absolute;"
            this.domObj.style.height = contentObj.style.height;
            this.domObj.style.width = contentObj.style.width;
            this.domObj.ondblclick = function() { B.Dialog.get().center(); }
            contentObj.insertAdjacentElement("beforebegin", this.domObj);

            // Make the header box
            this.title = document.createElement("div");
            this.title.className = "titlebar";
            let msg = contentObj.getAttribute("title");
            if (msg == null || msg == "") msg = "System Message";
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
            this.buttonbox.style.cssText = "border-top: 1px dotted black; padding: .5rem; text-align: right; position:relative; bottom:0"
            this.domObj.appendChild(this.buttonbox);
            let btns = this.content.getElementsByClassName("BDialogButton");
            while (btns.length > 0) {
                let btn = btns.item(0);
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
                    "display: none; " +/* Hidden by default */
                    "width: 100%; height:100%; " +/* Full width (cover the whole page) */
                    "top: 0; left: 0; right: 0; bottom: 0; " +
                    "margin:0; padding:0; border: 0; " +
                    "background: rgba(0,0,0,0.2); "; /* Black background with opacity */
                    "z-index: 1; "; /* Specify a stack order in case you're using a different order for other elements */
            }
            this.form = new B.Form(id);
        }   
        setContent(html:string):B.Dialog {
            this.content.innerHTML = html;
            return this;
        }
        setTitle(html:string):B.Dialog {
            this.title.innerHTML = html;
            return this;
        }
        setCallback(callback:CallableFunction):B.Dialog {
            this.callback = callback;
            return this;
        }
        center() {
            let rect = this.domObj.getBoundingClientRect();
            this.domObj.style.left = "calc(50vw - " + (rect.width / 2).toString() + "px)";
            this.domObj.style.top = "calc(50vh - " + (rect.height / 2).toString() + "px - 3em)";
            return this;
        }
        open(center?:boolean):B.Dialog {
            if (this.isOpen) return;
            this.isOpen = true;
            this.domObj.style.display = "inline-block";
            let z = (B.Dialog.dialogStack.length * 2) + 10;
            B.Dialog.overlay.style.zIndex = z;
            B.Dialog.overlay.style.display = "block";
            window.onkeydown = function(event:KeyboardEvent) {
                if (event.key == "Escape") popDialog();
                if (event.ctrlKey && event.key == "w") popDialog();
            };
            this.domObj.style.zIndex = (z+1).toString();
            let rect = this.domObj.getBoundingClientRect();
            this.tallness = rect.height; // Used during drag
            this.wideness = rect.width; // Used during drag
            if (center == undefined) {
                if (this.isFirstOpen) center = true;
            }
            if (center) {
                // Calculate positioning
                this.domObj.style.left = "calc(50vw - " + (rect.width / 2).toString() + "px)";
                this.domObj.style.top = "calc(50vh - " + (rect.height / 2).toString() + "px - 3em)";
            }
            this.isFirstOpen = false;
            B.Dialog.dialogStack.push(this.id);
            return this;
        }
        close():B.Dialog {
            if (!this.isOpen) return;
            this.isOpen = false;
            this.domObj.style.display = "none";
            for (let i = 0; i < B.Dialog.dialogStack.length; i++) {
                if (B.Dialog.dialogStack[i] == this.id) {
                    B.Dialog.dialogStack.splice(i, 1);
                }
            }
            if (B.Dialog.dialogStack.length == 0) {
                B.Dialog.overlay.style.display = "none";
                window.onkeydown = null;
            } else {
                let z = ((B.Dialog.dialogStack.length-1) * 2) + 10;
                B.Dialog.overlay.style.zIndex = z;
            }
            return this;
        }
        setSize(height:string|number, width?:string|number, center:boolean=true) {
            if (height != null && height != "") {
                if (typeof height == "number") height = height + "px";
                this.domObj.style.height = height;
            }
            if (width != null && width != "") {
                if (typeof width == "number") width = width + "px";
                this.domObj.style.width = width;
            }
            if (center) this.center();
            return this;
        }
        setButtons(...btns:string[]):Dialog {
            this.buttonbox.innerHTML = "";
            this.buttonList = [];
            for (let i = 0; i < btns.length; i++) {
                this.addButton(btns[i]);
            }
            return this;
        }
        addButton(text:string, returnValue:string=""):B.Dialog {
            if (returnValue == "") {
                let parts = text.split("=");
                if (parts.length == 1) {
                    returnValue = (this.buttonList.length + 1).toString();
                } else {
                    text = parts[0];
                    returnValue = parts[1]
                }
            }
            let btn = null;
            btn = document.createElement("button");
            
            btn.setAttribute("data", returnValue);
            btn.className = "BDialogButton";
            btn.tabIndex = 100 + this.buttonList.length;
            btn.onclick = function(event:MouseEvent) {
                let dlg = B.Dialog.get();
                popDialog();
                let el = event.target as HTMLElement;
                dlg.callback(el.getAttribute("data"));
            }
            btn.innerHTML = text;
            this.buttonbox.appendChild(btn);
            this.buttonList.push(btn);
    
            return this;
        }
        static get(id:string=""):Dialog {
            if (id == "") {
                let pos = B.Dialog.dialogStack.length;
                if (pos < 1) return null;
                id = B.Dialog.dialogStack[pos-1];
            }
            let dlg = B.Dialog.dialogs[id];
            if (dlg == null) {
                dlg = new Dialog(id);
            }
            return dlg;
        }
        static getSay():Dialog {
            let test = B.Dialog.dialogs["B_SAY_DIALOG"];
            if (test == null) {
                let frm = document.createElement("form");
                frm.id = "B_SAY_DIALOG";
                frm.className = "BDialog";
                frm.style.cssText = "height: 200px; width: 400px;";
                document.body.appendChild(frm);
            }
            let dlg = openDialog("B_SAY_DIALOG");
            dlg.domObj.style.backgroundColor = "";
            return dlg;
        
        }
        static startDrag(event:MouseEvent) {
            let dlg = B.Dialog.get();
            B.Dialog.dragInfo.dlg = dlg;
            let rect = dlg.domObj.getBoundingClientRect();
            B.Dialog.dragInfo.dlg.domObj.style.opacity = .6;
            B.Dialog.dragInfo.offset.x = event.x - rect.left;
            B.Dialog.dragInfo.offset.y = event.y - rect.top;
            document.onmousemove = B.Dialog.dragHandler;
            document.onmouseup = B.Dialog.drop;
            //dlg.title.onmousemove = B.Dialog.dragHandler;
            //dlg.title.onmouseup = B.Dialog.drop;
            dlg.title.style.cursor = "grabbing";
        }
        static dragHandler(event:MouseEvent) {
            let inf = B.Dialog.dragInfo;
            let dlg = inf.dlg;
            let newLeft = (event.x - inf.offset.x);
            let newRight = newLeft + dlg.wideness;
            let newTop = (event.y - inf.offset.y);
            let newBottom = newTop + dlg.tallness;
            console.log(window.innerWidth);
            if (newLeft < 0) return;
            if (newTop < 0) return;
            if (newRight > window.innerWidth) return;
            if (newBottom > window.innerHeight) return;
            dlg.domObj.style.left = (newLeft) + "px";
            dlg.domObj.style.top = (newTop) + "px";
        }
        static drop() {
            let dlg = B.Dialog.dragInfo.dlg;
            dlg.domObj.style.opacity = 1;
            document.onmousemove = null;
            document.onmouseup = null;
            //dlg.title.onmousemove = null;
            //dlg.title.onmouseup = null;
            dlg.title.style.cursor = "grab";
            dlg = null;
        }
    }
}

function openDialog(id:string):B.Dialog {
    let dlg = B.Dialog.get(id);
    dlg.open();
    return dlg;
}
function closeDialog(id:string):B.Dialog {
    let dlg = B.Dialog.get(id);
    dlg.close();
    return dlg;
}
function popDialog():B.Dialog {
    if (B.Dialog.dialogStack.length > 0) {
        return closeDialog(B.Dialog.dialogStack[B.Dialog.dialogStack.length-1]);
    } else {
        return null;
    }
}

function say(msg:string, title:string="System Message", onclose:CallableFunction=function() {}, bgcolor:string="") {
    let dlg = B.Dialog.getSay();
    dlg.setContent(msg);
    dlg.setTitle(title);
    dlg.setCallback(onclose);
    dlg.setButtons("Close");
    dlg.domObj.style.backgroundColor = bgcolor;
    dlg.setSize(200, 400, false);
    return dlg;
}
function sayG(msg:string, title:string="System Message", onclose:CallableFunction=function() {}) {
    return say(msg, title, onclose, "aquamarine");
}
function sayW(msg:string, title:string="System Message", onclose:CallableFunction=function() {}) {
    return say(msg, title, onclose, "lightyellow");
}
function sayE(msg:string, title:string="System Message", onclose:CallableFunction=function() {}) {
    return say(msg, title, onclose, "lightpink");
}
function sayGet(msg:string, prompt:string, defaultValue:string, title:string="System Message", callback:CallableFunction, bgcolor:string="") {
    let dlg = B.Dialog.getSay();
    let h = msg;
    h += "<table class='form' style='margin:0 auto; margin-top:.5em;'>";
    h += "<tr><th>" + prompt + ":</th><td><input tabIndex=1 name='result' size='12'></td></tr>";
    h += "</table>";
    dlg.setContent(h);
    dlg.setTitle(title);
    let masterCallback = function(val:string) {
        if (val == "SAVE") {
            let chk = B.getForm("B_SAY_DIALOG").get();
            callback(chk["result"]);    
        }
    }
    dlg.setCallback(masterCallback);
    dlg.setButtons("Save=SAVE", "Cancel=CANCEL");
    dlg.domObj.style.backgroundColor = bgcolor;
    dlg.setSize(200, 400, false);
    let frm = B.getForm("B_SAY_DIALOG");
    frm.set("result", defaultValue);
    let tbox = frm.getElement("result");
    tbox.focus();
    tbox.select();
    return dlg;
}
function sayGetG(msg:string, prompt:string, defaultValue:string, title:string="System Message", callback:CallableFunction) {
    return sayGet(msg, prompt, defaultValue, title, callback, "aquamarine");
}
function sayGetW(msg:string, prompt:string, defaultValue:string, title:string="System Message", callback:CallableFunction) {
    return sayGet(msg, prompt, defaultValue, title, callback, "lightyellow");
}
function sayGetE(msg:string, prompt:string, defaultValue:string, title:string="System Message", callback:CallableFunction) {
    return sayGet(msg, prompt, defaultValue, title, callback, "lightpink");
}

function choose(msg:string, title:string="System Message", buttons:string, callback:CallableFunction, bgcolor:string="") {
    let dlg = B.Dialog.getSay();
    dlg.setContent(msg);
    dlg.setTitle(title);
    dlg.setButtons();
    dlg.setCallback(callback);
    let list = buttons.split("|");
    for (let i = 0; i < list.length; i++) {
        dlg.addButton(list[i]);
    }
    dlg.domObj.style.backgroundColor = bgcolor;
    dlg.setSize(200, 400, false);
    return dlg;
}
function chooseG(msg:string, title:string="System Message", buttons:string, callback:CallableFunction) {
    return choose(msg, title, buttons, callback, "aquamarine");
}
function chooseW(msg:string, title:string="System Message", buttons:string, callback:CallableFunction) {
    return choose(msg, title, buttons, callback, "lightyellow");
}
function chooseE(msg:string, title:string="System Message", buttons:string, callback:CallableFunction) {
    return choose(msg, title, buttons, callback, "lightpink");
}
function ask(msg:string, title:string="System Message", callback:CallableFunction) {
    return choose(msg, title, "Yes=YES|No=NO", callback, "");
}
function askG(msg:string, title:string="System Message", callback:CallableFunction) {
    return choose(msg, title, "Yes=YES|No=NO", callback, "aquamarine");
}
function askW(msg:string, title:string="System Message", callback:CallableFunction) {
    return choose(msg, title, "Yes=YES|No=NO", callback, "lightyellow");
}
function askE(msg:string, title:string="System Message", callback:CallableFunction) {
    return choose(msg, title, "Yes=YES|No=NO", callback, "lightpink");
}