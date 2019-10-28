namespace B {

    export class Dialog {
        public id:string = "";
        public static overlay = null;
        public static dialogs = {};
        public static dialogCount:number = 0;
        public static dialogStack = [];
        private domObj:HTMLElement = null;
        public form:Form = null;
        constructor(id:string) {
            if (B.Dialog.dialogs[id] != undefined) {
                return B.Dialog.get(id);
            }
            this.id = id;
            this.domObj = document.getElementById(id);
            // TODO make the div pretty, etc
            B.Dialog.dialogs[id] = this;
            B.Dialog.dialogCount++;
            if (B.Dialog.dialogCount == 1) {
                B.Dialog.overlay = document.createElement("div");
                document.body.appendChild(B.Dialog.overlay);
                B.Dialog.overlay.style.cssText = 
                    "postion: fixed; " +
                    "display: none; " +/* Hidden by default */
                    "width: 100vw; " +/* Full width (cover the whole page) */
                    "height: 100vh; " + /* Full height (cover the whole page) */
                    "top: 0; " +
                    "left: 0; " +
                    //"right: 0; " +
                    //"bottom: 0; " +
                    "background-color: rgba(0,0,0,0.3); "; /* Black background with opacity */
                    //"z-index: 2; "; /* Specify a stack order in case you're using a different order for other elements */

            }
            this.form = new B.Form(id);
        }   
        isOpen() { return (this.domObj.style.display == "inline-block") }
        open(center?:boolean) {
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
                    B.Dialog.dialogStack = B.Dialog.dialogStack.splice(i, 1);
                }
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
