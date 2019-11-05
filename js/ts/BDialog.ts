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
        private title = null;
        private buttonbox = null;
        private buttonList = [];
        private callback = null;
        public form:Form = null;
        private h = 0;
        private w = 0;
        constructor(id:string, callback:CallableFunction = function() {}) {
            if (B.Dialog.dialogs[id] != undefined) {
                return B.Dialog.get(id);
            }
            this.id = id;
            this.callback = callback;
            this.content = document.getElementById(id);
            // Create a container for the dialog
            this.domObj = document.createElement("div");
            this.domObj.className = "BDialog";
            this.domObj.style.cssText = "display:none; position:absolute;"
            this.domObj.style.height = this.content.style.height;
            this.domObj.style.width = this.content.style.width;
            this.content.insertAdjacentElement("beforebegin", this.domObj);
            this.content.className = "";
            // Make the header box
            this.title = document.createElement("div");
            this.title.className = "titlebar";
            let msg = this.content.getAttribute("title");
            if (msg == null || msg == "") msg = "System Message";
            this.title.innerHTML = msg;
            this.title.onmousedown = B.Dialog.startDrag;
            this.content.removeAttribute("title");
            this.domObj.appendChild(this.title);

            let scrollbox = document.createElement("div");
            // Make room for a header and buttons
            scrollbox.style.height = "calc(" + this.content.style.height + " - 5.1em)";
            scrollbox.style.overflowY = "auto";
            this.content.style.height = "";
            this.content.style.padding = ".5em";
            // Move the content into the scrollbox
            scrollbox.appendChild(this.content);
            // Move the scrollbox into the container
            this.domObj.appendChild(scrollbox);

            // Add a button box for the bottom of the container
            this.buttonbox = document.createElement("div");
            this.buttonbox.style.cssText = "border-top: 1px dotted black; padding: .5rem; text-align: right;"
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
                B.Dialog.overlay.onclick = popDialog;
                document.body.appendChild(B.Dialog.overlay);
                B.Dialog.overlay.style.cssText = 
                    "position: absolute; " +
                    "cursor: pointer; " +
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
        isOpen() { return (this.domObj.style.display == "inline-block") }
        open(center:boolean=true):B.Dialog {
            if (this.isOpen()) return;
            this.domObj.style.display = "inline-block";
            let z = (B.Dialog.dialogStack.length * 2) + 10;
            B.Dialog.overlay.style.zIndex = z;
            B.Dialog.overlay.style.display = "block";
            this.domObj.style.zIndex = (z+1).toString();
            let rect = this.domObj.getBoundingClientRect();
            this.h = rect.height;
            this.w = rect.width;
            if (center == undefined) center = true;
            if (center) {
                // Calculate positioning
                this.domObj.style.left = "calc(50vw - " + (rect.width / 2).toString() + "px)";
                this.domObj.style.top = "calc(50vh - " + (rect.height / 2).toString() + "px - 3em)";
            }
            B.Dialog.dialogStack.push(this.id);
            return this;
        }
        close():B.Dialog {
            if (!this.isOpen()) return;
            this.domObj.style.display = "none";
            for (let i = 0; i < B.Dialog.dialogStack.length; i++) {
                if (B.Dialog.dialogStack[i] == this.id) {
                    B.Dialog.dialogStack.splice(i, 1);
                }
            }
            if (B.Dialog.dialogStack.length == 0) {
                B.Dialog.overlay.style.display = "none";
            } else {
                let z = ((B.Dialog.dialogStack.length-1) * 2) + 10;
                B.Dialog.overlay.style.zIndex = z;
            }
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
            let btn = document.createElement("button");
            btn.setAttribute("data", returnValue);
            btn.className = "BDialogButton";
            btn.onclick = function(event:MouseEvent) {
                let dlg = B.Dialog.get();
                popDialog();
                let el = event.target as HTMLElement;
                dlg.callback(el.getAttribute("data"));
            }
            btn.innerHTML = text;
            this.buttonbox.appendChild(btn);
    
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
            let newRight = newLeft + dlg.w;
            let newTop = (event.y - inf.offset.y);
            let newBottom = newTop + dlg.h;
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
    return dlg;
}
function sayG(msg:string, title:string="System Message", onclose:CallableFunction=function() {}) {
    let dlg = say(msg, title, onclose, "aquamarine");
}
function sayW(msg:string, title:string="System Message", onclose:CallableFunction=function() {}) {
    let dlg = say(msg, title, onclose, "lightyellow");
}
function sayE(msg:string, title:string="System Message", onclose:CallableFunction=function() {}) {
    let dlg = say(msg, title, onclose, "lightpink");
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
    return dlg;
}
function chooseG(msg:string, title:string="System Message", buttons:string, callback:CallableFunction) {
    let dlg = choose(msg, title, buttons, callback, "aquamarine");
}
function chooseW(msg:string, title:string="System Message", buttons:string, callback:CallableFunction) {
    let dlg = choose(msg, title, buttons, callback, "lightyellow");
}
function chooseE(msg:string, title:string="System Message", buttons:string, callback:CallableFunction) {
    let dlg = choose(msg, title, buttons, callback, "lightpink");
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