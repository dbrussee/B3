namespace B {
    export const version = '2.1ts';
}
function notcoded() {
    let h = "Sorry, this feature is not ready yet.";
    say(h).error();
}
namespace B.is {
    export function oneOf(...args:any[]) {
        return B.util.whichOneOf.apply(null, arguments) >= 0;
    };
    export function notOneOf(...args:any[]) {
        return B.util.whichOneOf.apply(null, arguments) < 0;
    };
}
namespace B.format {
    export function numberWithCommas(num:any) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    export function money(num:any) {
        return new Number(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
    export function phone(num:string|number, ext?:string|number) {
        let rslt = "";
        if (ext == undefined) ext = "";
        num = num.toString();
        let test = util.keepOnlyChars(num, "0123456789");
        if (test.length == 7) {
            rslt = test.substr(0,3) + "-" + test.substr(3);
        } else if (test.length == 10) {
            rslt = "(" + test.substr(0,3) + ") " + test.substr(3,3) + "-" + test.substr(6);
        } else {
            rslt = num;
        }
        if (ext != "") {
            rslt += " x" + ext;
        }
        return rslt;
    }
    export function leftPad(init:string, length:number, char:string):string {
        let rslt = init;
        if (char.length > 0) {
            while(rslt.length < length) { rslt += char; }
        }
        return rslt;
    }
    let dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let monthNames = ["January","February","March","April","May","June","July","August","September","October","November","Decepmber"];
    export function dayOfWeek(day?:number|string|Date) {
        if (day == undefined) day = new Date();
        if (typeof day == "string") day = new Date(day);
        if (typeof day == "object") day = day.getDay();
        return dayNames[day];
    }
    export function datePart(date:Date|string, part:string):string {
        if (typeof date == "string") date = new Date(date);
        let rslt = "";
        let tmp = 0;
        switch(part) {
            case "M": rslt = (date.getMonth() + 1).toString(); break;
            case "MM": rslt = leftPad(datePart(date, "M"), 2, "0"); break;
            case "MMM": rslt = monthNames[date.getMonth()].substr(0,3); break;
            case "MONTH": rslt = monthNames[date.getMonth()]; break;
            case "D": rslt = (date.getDate()).toString(); break;
            case "DD": rslt = leftPad(datePart(date, "D"), 2, "0"); break;  
            case "ORDINAL":
            case "ORD": 
                let tmp = date.getDate();
                switch(date.getDate()) {
                    case 1: 
                    case 21: 
                    case 31: rslt = tmp.toString() + "st";
                    case 2: 
                    case 22:rslt = tmp.toString() + "nd";
                    case 3: 
                    case 23: rslt = tmp.toString() + "rd";
                    default: rslt = tmp.toString() + "th";
                }
            case "DOW":
            case "DAY": rslt = dayOfWeek(date);         
            case "YYYY": rslt = (date.getFullYear()).toString(); break;
            case "H": rslt = (date.getHours()).toString(); break;
            case "H12": 
                tmp = date.getHours(); 
                if (tmp > 12) tmp -= 12;
                rslt = tmp.toString(); break;
            case "HH12": rslt = leftPad(datePart(date, "H12"), 2, "0"); break;
            case "HH": rslt = leftPad(datePart(date, "H"), 2, "0"); break;
            case "a": 
                tmp = date.getHours();
                rslt = tmp < 13 ? "a":"p"; break;
            case "A": rslt = (datePart(date, "a") == "a") ? "A":"P"; break;
            case "am": rslt = (datePart(date, "a") == "a") ? "am":"pm"; break;
            case "AM": rslt = (datePart(date, "a") == "a") ? "AM":"PM"; break;
            case "NN":
            case "MI": rslt = leftPad(date.getMinutes().toString(), 2, "0"); break;
            case "SS": rslt = leftPad(date.getSeconds().toString(), 2, "0"); break;
            case "SSS": rslt = leftPad(date.getMinutes().toString(), 2, "0"); break;
        }
        return rslt;
    }
    export function MMDDYYYY(date:Date|string) { return datePart(date,"MM") + "/" + datePart(date,"DD") + "/" + datePart(date, "YYYY"); }
    export function MDYYYY(date:Date|string) { return datePart(date,"M") + "/" + datePart(date,"D") + "/" +datePart(date,"YYYY"); }
    export function MMMYYYY(date:Date|string) { return datePart(date,"MMM") + ", " + datePart(date,"YYYY"); }
    export function MONTHYYYY(date:Date|string) { return datePart(date,"MONTH") + ", " + datePart(date,"YYYY"); }
    export function MYYYY(date:Date|string) { return datePart(date,"M") + "/" + datePart(date,"YYYY"); }
    export function HNN(date:Date|string, ap?:string) { return datePart(date, "H") + ":" + datePart(date,"MI") + ap == undefined ? "":datePart(date,ap); }
    export function HHNN(date:Date|string, ap?:string) { return datePart(date, "HH") + ":" + datePart(date,"MI") + ap == undefined ? "":datePart(date,ap); }
    export function HNNSS(date:Date|string, ap?:string) { return datePart(date, "H") + ":" + datePart(date,"MI") + ":" + datePart(date, "SS") + ap == undefined ? "":datePart(date,ap); }
    export function HHNNSS(date:Date|string, ap?:string) { return datePart(date, "HH") + ":" + datePart(date,"MI") + ":" + datePart(date, "SS") + ap == undefined ? "":datePart(date,ap); }
    export function TS(date:Date|string) { return MMDDYYYY(date) + " " + HHNNSS(date) + ":" + datePart(date, "SSS"); }
    export function FANCY(date:Date|string) {
        return datePart(date, "DOW") + " the " + datePart(date,"ORDINAL") + " of " + datePart(date, "MONTH");
    }
}

namespace B.util {
    export function killElement(...args) {
        for (let i = 0; i < arguments.length; i++) {
            let el = arguments[i];
            if (el != null) {
                if (el.parentNode != null) {
                    el.parentNode.removeChild(el);
                    el = null;
                }
            }
        }
    }
    export function whichOneOf(txt) {
        let a = txt.toString().toUpperCase();
        if (arguments.length > 2) {
            for (let i = 1; i < arguments.length; i++) {
                let b = arguments[i].toUpperCase();
                if (a == b) return i-1;
            }
        } else {
            let itm = arguments[1];
            if (typeof itm == "string") {
                let lst = itm.split(",");
                for (let i = 0; i < lst.length; i++) {
                    let b = lst[i].toUpperCase();
                    if (a == b) return i;
                }
            } else { // list passed in
                for (let i = 0; i < itm.length; i++) {
                    let b = itm[i].toUpperCase();
                    if (a == b) return i;
                }
            }
        }
        return -1;
    }
    export function stripChars(orig:string, chars:string) {
        let rslt = "";
        for (let i = 0; i < orig.length; i++) {
            let char = orig.substr(i,1);
            if (chars.indexOf(char) >= 0) continue;
            rslt += char;
        }
        return rslt;
    }
    export function keepOnlyChars(orig:string, chars:string) {
        let rslt = "";
        for (let i = 0; i < orig.length; i++) {
            let char = orig.substr(i,1);
            if (chars.indexOf(char) < 0) continue;
            rslt += char;
        }
        return rslt;
    }
    export function makeElement(html:string) {
        let div = document.createElement('div');
        div.innerHTML = html.trim();
        // Change this to div.childNodes to support multiple top-level nodes
        return div.firstChild;
    }

    export function freezeArea(el:any) {
        let div = document.createElement("div");
        let clrA = "white";
        let clrB = "cadetblue";
        div.style.cssText = "position:absolute; " +
            "z-index:" + (parseInt(el.style.zIndex) + 1) + "; " +
            "background: repeating-linear-gradient(-45deg, "+clrA+", "+clrA+" 10px, "+clrB+" 10px, "+clrB+" 20px); " +
            "opacity: 0.1; " +
            "cursor: default; " +
            "left:0; top:0; width:100%;height:100%; " +
            "overflow:auto; ";
        el.appendChild(div);
        return div;
    }
    export function clearSelection() {
        if (window.getSelection) {
            var sel = window.getSelection();
            sel.removeAllRanges();
        }
    }
    export function addOverlayText(el:any, text:string) {//}, timer:Stopwatch=null) {
        let container = document.createElement("div");
        container.style.cssText = "position: absolute; ";
        container.style.zIndex = (parseInt(el.style.zIndex) + 1).toString();
        container.style.height = el.style.height;
        container.style.width = el.style.width;
        container.style.top = el.style.top;
        container.style.left = el.style.left;
        el.insertAdjacentElement("afterend", container);
        let div = document.createElement("div");
        div.style.cssText = "" +
            "padding: .5em; color: black; background: white; border-radius: .2em; width: 75%;"+
            "position: absolute; top: 50%; left: 50%; text-align: center; box-shadow: 1px 1px 2px black;"+
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

    export function findNodeWithAttribute(node:HTMLElement, attr:string) {
        while (node != document.body && !node.hasAttribute(attr)) {
            node = node.parentElement;
        }
        return node;
    }
    
    export function parentNode(obj:any, parentType:string) {
        let pn = obj.parentNode;
        if (parentType != undefined) {
            while (pn != null && pn.tagName.toUpperCase() != parentType.toUpperCase()) {
                pn = pn.parentNode;
            }
        }
        return pn;
    }
    export function compare(obj1:any, obj2:any) {
        //Loop through properties in object 1
        for (let p in obj1) {
            //Check property exists on both objects
            if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
        
            switch (typeof (obj1[p])) {
                //Deep compare objects
                case 'object':
                    if (!compare(obj1[p], obj2[p])) return false;
                    break;
                //Compare function code
                case 'function':
                    if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
                    break;
                //Compare values
                default:
                    if (obj1[p] != obj2[p]) return false;
            }
        }
        return true;
    }   
} 
namespace B {
    export class Timer {
        public id:string = "";
        public static handler = null;
        public static timers = {}
        private static timerList = [];
        private secondsElement:HTMLElement = null;
        private minutesElement:HTMLElement = null;
        private hoursElement:HTMLElement = null;
        private renderAs:string = "";
        public startTime:Date = null;
        public target:HTMLElement = null;
        public active:boolean = false;
        constructor(id:string, target:HTMLElement|string, renderAs:string="LINES", startup:boolean=true) {
            if (Timer.timers[id] != null) return Timer.timers[id];
            this.id = id;
            this.startTime = new Date();
            if (typeof target == "string") target = document.getElementById(target);
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
            } if (renderAs == "SPIN") {
                this.target.style.width = "38px";
                this.target.style.height = "38px";
                this.secondsElement = document.createElement("div");
                this.secondsElement.style.cssText = "position:absolute; height:90%; width:90%; top:5%; left:5%;z-index:99";
                this.secondsElement.className = "loader";
                this.target.appendChild(this.secondsElement);
                this.minutesElement = document.createElement("div");;
                this.minutesElement.style.cssText = "line-height: 38px; text-align:center; font-size:8pt; position:absolute; height:100%; width:100%; top:0; left:0";
                this.target.appendChild(this.minutesElement);
            }
            Timer.timers[id] = this;
            Timer.timerList.push(this);

            this.active = startup;
        }
        static add(id:string, target:HTMLElement|string, renderAs:string="LINES", startup:boolean=true) {
            return new B.Timer(id, target, renderAs, startup);
        }
        start() {
            this.active = true;
        }
        stop() {
            this.active = false;
        }
        delete() {
            delete B.Timer.timers[this.id];
            for (let i = 0; i < B.Timer.timerList.length; i++) {
                if (B.Timer.timerList[i].id == this.id) {
                    B.Timer.timerList.splice(i,1);
                }
            }
        }
        show() {

        }
        hide() {

        }
        render() {
            let now:Date = new Date();
            let millis = (now.getTime() - this.startTime.getTime());
            let secs = millis / 1000;
            millis = parseInt((millis % 60).toString(),10);
            secs = parseInt(secs.toString(),10);
            let days = parseInt((secs / (24 * 60 * 60)).toString(),10);
            secs -= (days * 24 * 60 * 60);
            let hours = parseInt((secs / (60 * 60)).toString(),10);
            secs -= (hours * 60 * 60);
            let mins = parseInt((secs / 60).toString(),10);
            secs -= (mins * 60);

            if (this.renderAs == "LINES") {
                this.secondsElement.style.width = ((secs / 60) * 100) + "%";
                this.minutesElement.style.width = ((mins / 60) * 100) + "%";
                if (hours > 24) hours = 24;
                this.hoursElement.style.width = ((hours / 24) * 100) + "%";
            }
            if (this.renderAs == "SPIN" || this.renderAs == "TEXT") {
                let text = "";
                if (days > 0) text = days + "d";
                if (hours > 0) text += hours + "h";
                if (text != "") text += "<br>";
                //if (mins < 10) text += "0";
                if (mins > 0) text += mins + ":";
                if(secs > 0) {
                    if (secs < 10) text += "0";
                    text += secs;
                }
                if (this.renderAs == "SPIN") {
                    this.minutesElement.innerHTML = text;
                } else if (this.renderAs == "TEXT") {
                    this.target.innerHTML = text;
                }
            }
        }

        static renderTimers() {
            for (let i = 0; i < Timer.timerList.length; i++) {
                let t = Timer.timerList[i];
                if (t.active) {
                    t.render();
                }
            }
            if (Timer.timerList.length > 0) {
                if (window.requestAnimationFrame) {
                    window.requestAnimationFrame(Timer.renderTimers);
                } else {
                    window.setTimeout(Timer.renderTimers, 20);
                }
            }
        }
    }
}

document.addEventListener('invalid', (function(){
    return function(e){
        //prevent the browser from showing default error bubble/ hint
        e.preventDefault();
        // optionally fire off some custom validation handler
        // myvalidationfunction();
    };
})(), true);