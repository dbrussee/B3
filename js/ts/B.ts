namespace B {
    export const version = '2.1ts';
}
namespace B.is {

}
namespace B.format {
    export function numberWithCommas(num:any) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    export function money(num:any) {
        return new Number(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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
            this.startTime = new Date();
            if (typeof target == "string") target = document.getElementById(target);
            this.target = target;
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
            Timer.timers[id] = this;
            Timer.timerList.push(this);

            this.active = startup;
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
            } else if (this.renderAs == "TEXT") {
                let text = "";
                if (days > 0) text = days + "d";
                if (hours > 0) text += hours + ":";
                if (mins < 10) text += "0";
                text += mins + ":";
                if (secs < 10) text += "0";
                text += secs;
                this.target.innerHTML = text;
            }
        }

        static renderTimers() {
            for (let i = 0; i < Timer.timerList.length; i++) {
                let t = Timer.timerList[i];
                if (t.active) {
                    t.render();
                }
            }
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(Timer.renderTimers);
            } else {
                window.setTimeout(Timer.renderTimers, 20);
            }

        }

    }
}


console.log(B.version);