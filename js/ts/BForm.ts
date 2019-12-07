/// <reference path="B.ts" />
namespace B {
    export function makeForm(id:string, allowSubmit:boolean=false) {
        return new Form(id, allowSubmit, true);
    }
    export function getForm(id:string, allowSubmit:boolean = false):Form {
        let frm = Form.cache[id];
        if (frm == undefined) {
            frm = new Form(id, allowSubmit);
        }
        return frm;
    }
    export class Form {
        private id:string = "";
        private form:HTMLFormElement = null;
        public static cache = {};
        public pairedTableId = "";
        constructor(id:string, allowSubmit:boolean = false, forceMake:boolean=false) {
            if (!forceMake) {
                if (Form.cache[id] != null) {
                    return Form.cache[id];
                }
            }
            this.id = id;
            this.form = document.forms.namedItem(id);
            if (!allowSubmit) {
                this.form.onsubmit = function(event:any) {
                    event.preventDefault();
                    return false;
                }
            }

            for (let i = 0; i < this.form.elements.length; i++) {
                var el = this.form.elements.item(i) as HTMLFormElement;
                if (el.type == "textarea" && el.className.indexOf("ALLOWTABS") >= 0) {
                    el.onkeydown = function(e){
                        if(e.keyCode==9 || e.which==9){
                            e.preventDefault();
                            let el = this as HTMLTextAreaElement;
                            var s = el.selectionStart;
                            el.value = el.value.substring(0,el.selectionStart) + "\t" + el.value.substring(el.selectionEnd);
                            el.selectionEnd = s+1; 
                        }
                    }
                }
            }
            Form.cache[id] = this;
        }
        get() {
            let items = {};
            let els = this.form.elements;
            for (let elnum = 0; elnum < els.length; elnum++) {
                let el = els.item(elnum) as HTMLInputElement;
                if (el.type == "" || el.type == "text" || el.type == "textarea") {
                    items[el.name] = el.value.trim();
                } else if (el.type == "checkbox") {
                    items[el.name] = el.checked;
                } else if (el.type == "select-one") {
                    let sel = els.item(elnum) as HTMLSelectElement
                    items[el.name] = sel.options[sel.selectedIndex].value.trim();
                } else if (el.type == "select-multiple") {
                    let sel = els.item(elnum) as HTMLSelectElement
                    let sels = [];
                    for (let optnum = 0; optnum = sel.options.length; optnum++) {
                        let opt = sel.options[optnum];
                        if (opt.selected) sels.push(opt.value.trim());
                    }
                    items[el.name] = sels;
                } else if (el.type == "radio") {
                    if (el.checked) items[el.name] = el.value.trim();
                }
            }
            return items;
        }
        getElement(field:string) {
            return this.form.elements[field];
        }
        click(field:string) {
            let el = this.getElement(field);
            el.click();
        }
        set(...args) {
            // Pairs of values set(name,val, name,val);
            for (let argnum = 0; argnum < args.length; argnum+=2) {
                let field = args[argnum];
                if (args.length <= argnum+1) return;
                let val = args[argnum+1];
                let el = this.form.elements[field] as HTMLInputElement;
                if (el != null) {
                    if (el.type == "checkbox") {
                        el.checked = val;
                    } else {
                        el.value = val;
                    }
                }
            }
        }
        freeze() {

        }
        thaw() {

        }
        reset() {
            this.form.reset();
        }
    }
}