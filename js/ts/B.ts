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
            "z-index:1; " +
            "background: repeating-linear-gradient(-45deg, "+clrA+", "+clrA+" 10px, "+clrB+" 10px, "+clrB+" 20px); " +
            "-ms-filter:'progid:DXImageTransform.Microsoft.Alpha(Opacity=10)'; " + // IE8
            "filter: alpha(opacity=10); " + // IE 5-7
            "opacity: 0.10; " +
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
        container.style.height = el.style.height;
        container.style.width = el.style.width;
        container.style.top = el.style.top;
        container.style.left = el.style.left;
        el.insertAdjacentElement("afterend", container);
        let div = document.createElement("div");
        div.style.cssText = "z-index: 2; " +
            "padding: .5em; background: rgba(240,248,255,.9); border-radius: .2em; width: 75%;"+
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

console.log(B.version);