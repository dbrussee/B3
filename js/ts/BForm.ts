/// <reference path="B.ts" />
namespace B {
    export function buildForm(id:string, allowSubmit:boolean=false) {
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
        public validationResult = null;
        constructor(id:string, allowSubmit:boolean = false, forceBuild:boolean=false) {
            if (!forceBuild) {
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
                if (B.is.oneOf(el.type, ",text,textarea,number")) {
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
            let els = this.form.elements[field];
            let obj = { 
                domElements:els[field],
                type:els[0].type
            }
            return obj;
        }
        click(field:string) {
            let obj = this.getElement(field);
            obj.domElements.click();
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
        getValidationIssues() {
            let rslt:string = "";
            for (const key in this.validationResult) {
                let itm = this.validationResult[key];
                if (itm.issue != "") {
                    rslt += "<li>" + itm.prompt + " " + itm.issue + "</li>";
                }
            }
            if (rslt != "") rslt =  "<ul>" + rslt + "</ul>";
            return rslt;
        }
        validate(action:string, validator:Function = null) {
            let vdata = {};
            let chk = this.get();
            for (const key in chk) {
                if (chk.hasOwnProperty(key)) {
                    let el = this.form.elements[key] as HTMLFormElement;
                    let itm = {
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
                    }
                    if (itm.type == undefined) itm.type = "text";
                    if (itm.prompt == undefined) itm.prompt = el.getAttribute("prompt");
                    if (itm.prompt == undefined) itm.prompt = "Field " + key;
                    vdata[key] = itm;
                    let minmaxIssue = false;
                    let minmaxText = "";
                    let patternIssue = false;
                    if (itm.type == "number") {
                        let val = parseInt(itm.value);
                        if (itm.minNumber > 0 && itm.maxNumber > 0) {
                            minmaxText = "must be between " + itm.minNumber + " and " + itm.maxNumber;
                            minmaxIssue = val < itm.minNumber || val > itm.maxNumber;
                        } else if (itm.minNumber > 0) {
                            minmaxText = "must be >= " + itm.minNumber;
                            minmaxIssue = val < itm.minNumber;
                        } else if (itm.maxNumber > 0) {
                            minmaxText = "must be <= " + itm.maxNumber;
                            minmaxIssue = val > itm.maxNumber
                        }
                        if (isNaN(val)) minmaxIssue = true;
                    } else {
                        if (itm.minLength > 0 && itm.maxLength > 0) {
                            if (itm.minLength == itm.maxLength) {
                                minmaxText = "must be " + itm.minLength + " chars";
                            } else {
                                minmaxText = "must be between " + itm.minLength + " and " + itm.maxLength + " chars";
                            }
                            minmaxIssue = itm.value.length < itm.minLength || itm.value.length > itm.maxLength;
                        } else if (itm.minLength > 0) {
                            minmaxText = "must be >= " + itm.minLength + " chars";
                            minmaxIssue = itm.value.length < itm.minLength;
                        } else if (itm.maxLength > 0) {
                            minmaxText = "must be <= " + itm.maxLength + " chars";
                            minmaxIssue = itm.value.length > itm.maxLength;
                        }
                    }
                    if (itm.required && itm.value == "") {
                        let txt = "is required";
                        if (minmaxIssue) txt += " and " + minmaxText ;
                        itm.issue = txt;
                    } else {
                        if (minmaxIssue) itm.issue = minmaxText;
                        if (itm.issue == "" && itm.pattern != "") {
                            let patt = new RegExp(itm.pattern);
                            let isMatch = patt.test(itm.value);
                            if (!isMatch) {
                                itm.issue = "is invalid";
                            }
                        }
                    }
                }
            }
            if (validator != null) validator(this, vdata, action);
            this.validationResult = vdata;
            let anyIssues = false;
            for (const key in vdata){
                let itm = vdata[key];
                if (itm.issue != "") anyIssues = true;
            }
            return !anyIssues; // No issues = valid
        }
    }
}