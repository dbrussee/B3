namespace B {

    export class Dialog {
        public id:string = "";
        public static overlay = null;
        public static dialogs = {};
        public static dialogCount:number = 0;
        public static dialogStack = [];
        private domObj:HTMLElement = null;
        private container = null;
        public form:Form = null;
        constructor(id:string) {
            if (B.Dialog.dialogs[id] != undefined) {
                return B.Dialog.get(id);
            }
            this.id = id;
            var el = document.getElementById(id);
            // Create a container for the dialog
            this.domObj = document.createElement("div");
            this.domObj.className = "BDialog";
            this.domObj.style.cssText = "display:none; position:absolute;"
            this.domObj.style.height = el.style.height + 25; // Room for a button box
            this.domObj.style.width = el.style.width;
            el.insertAdjacentElement("beforebegin", this.domObj);
            el.className = "";
            // Move the form into the container
            this.domObj.appendChild(el);

            // Add a button box for the bottom of the container
            let bbox = document.createElement("div");
            bbox.style.cssText = "border-top: 1px solid silver; padding-top: .4rem; text-align: right;"
            this.domObj.appendChild(bbox);
            let btns = el.getElementsByClassName("BDialogButton");
            if (btns.length == 0) {
                let btn = document.createElement("button");
                btn.innerHTML = "Close";
                btn.onclick = popDialog;
                bbox.appendChild(btn);    
            } else {
                while (btns.length > 0) {
                    let btn = btns.item(0);
                    bbox.appendChild(btn);
                }    
            }

            // TODO make the div pretty, etc
            B.Dialog.dialogs[id] = this;
            B.Dialog.dialogCount++;
            if (B.Dialog.dialogCount == 1) {
                B.Dialog.overlay = document.createElement("div");
                document.body.appendChild(B.Dialog.overlay);
                B.Dialog.overlay.style.cssText = 
                    "position: absolute; " +
                    "display: none; " +/* Hidden by default */
                    "width: 100%; height:100%; " +/* Full width (cover the whole page) */
                    "top: 0; left: 0; right: 0; bottom: 0; " +
                    "margin:0; padding:0; border: 0; " +
                    "background: rgba(0,0,0,0.3); "; /* Black background with opacity */
                    "z-index: 1; "; /* Specify a stack order in case you're using a different order for other elements */
            }
            this.form = new B.Form(id);
        }   
        isOpen() { return (this.domObj.style.display == "inline-block") }
        open(center:boolean=true) {
            if (this.isOpen()) return;
            this.domObj.style.display = "inline-block";
            let z = (B.Dialog.dialogStack.length * 2) + 10;
            B.Dialog.overlay.style.zIndex = z;
            B.Dialog.overlay.style.display = "block";
            this.domObj.style.zIndex = (z+1).toString();
            if (center == undefined) center = true;
            if (center) {
                // Calculate positioning
                let rect = this.domObj.getBoundingClientRect();
                this.domObj.style.left = "calc(50vw - " + (rect.width / 2).toString() + "px)";
                this.domObj.style.top = "calc(50vh - " + (rect.height / 2).toString() + "px - 3em)";
            }
            B.Dialog.dialogStack.push(this.id);
        }
        close() {
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
        }
        static get(id:string):Dialog {
            let dlg = B.Dialog.dialogs[id];
            if (dlg == null) {
                dlg = new Dialog(id);
            }
            return dlg;
        }
    }
}

function openDialog(id:string) {
    let dlg = B.Dialog.get(id);
    dlg.open();
    return dlg.form;
}
function closeDialog(id:string) {
    B.Dialog.get(id).close();
}
function popDialog() {
    if (B.Dialog.dialogStack.length > 0) {
        closeDialog(B.Dialog.dialogStack[B.Dialog.dialogStack.length-1]);
    }
}
