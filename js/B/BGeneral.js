// Initialize B container if needed
if (window.B == undefined) window.B = { version: "2.1" }
if (B.system == undefined) B.system = {}
B.system.stopWatches = {showSweep: true, timer: null, watches:[]};
B.system.stopWatches.animate = function() {
    for (var swnum = 0; swnum < B.system.stopWatches.watches.length; swnum++) {
        var sw = B.system.stopWatches.watches[swnum];
        if (sw.running) sw.drawWatch();
    }
    if (B.system.stopWatches.watches.length > 0) {
        if (window.requestAnimationFrame) {
        	window.requestAnimationFrame(B.system.stopWatches.animate);
        } else {
        	window.setTimeout(B.system.stopWatches.animate, 20);
        }
    }
}

$(document).ready(function() {
	if (typeof init === 'function') init();
});

B.system.formsCache = {}
B.util = {}
B.util.endsWith = function(search, this_len) {
	if (!String.prototype.endsWith) {
		if (this_len === undefined || this_len > search.length) {
			this_len = search.length;
		}
		return search.substring(this_len - search.length, this_len) === search;
	} else {
		return search.endsWith(search, this_len);
	}
}
B.util.spinnerHtml = function(size, style) {
    if (size == undefined) size = "1em";
    var h = "<div class='spinner' style='height:" + size + "; width:" + size +";" + style + "'></div>";
    return h;
}
B.util.spinnerElement = function(size) {
    return B.util.makeElement(B.util.spinnerHtml(size));
}
B.util.freezeArea = function(el) {
    var div = document.createElement("div");
    //var clrA = "rgb(20,20,20,.2)";
    //var clrB = "rgb(90,90,90,.2)";
    var clrA = "white";
    var clrB = "cadetblue";
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
B.util.addOverlayText = function(el, text, timer) {
    if (timer == undefined) timer = null;
    var container = document.createElement("div");
    container.style.cssText = "position: absolute; ";
    container.style.height = el.style.height;
    container.style.width = el.style.width;
    container.style.top = el.style.top;
    container.style.left = el.style.left;
    el.insertAdjacentElement("afterend", container);
    var div = document.createElement("div");
    div.style.cssText = "z-index: 2; " +
        "padding: .5em; background: rgba(240,248,255,.9); border-radius: .2em; width: 75%;"+
        "position: absolute; top: 50%; left: 50%; text-align: center; box-shadow: 1px 1px 2px black;"+
        "-ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); ";
    
    if (timer != null) {
    	var spinDiv = document.createElement("div");
    	spinDiv.style.cssText = "position: absolute; top:2px; left:2px;";
    	spinDiv.appendChild(timer.canvas);
    	timer.canvas.style.padding = "2px";
    	div.appendChild(spinDiv);
    	div.style.minHeight = (timer.canvas.height + 15) + "px";
    	div.style.paddingLeft = (timer.canvas.width + 10) + "px";
    }
    var spn = document.createElement("span");
    spn.innerHTML = text;
    div.appendChild(spn);
    container.appendChild(div);
    return container;
}
B.util.compare = function(obj1, obj2) {
    //Loop through properties in object 1
    for (var p in obj1) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
    
        switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
                if (!Object.compare(obj1[p], obj2[p])) return false;
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
    
    //Check object 2 for any extra properties
    for (var p in obj2) {
        if (typeof (obj1[p]) == 'undefined') return false;
    }
    return true;
}
B.util.parentNode = function(obj, parentType) {
    var pn = obj.parentNode;
    if (parentType != undefined) {
        while (pn != null && pn.tagName.toUpperCase() != parentType.toUpperCase()) {
            pn = pn.parentNode;
        }
    }
    return pn;
}
B.util.killElement = function(els) {
	for (i = 0; i < arguments.length; i++) {
		var el = arguments[i];
		if (el != null) {
			if (el.parentNode != null) {
				el.parentNode.removeChild(el);
				el = null;
			}
		}
	}
}
B.util.makeElement = function(html) {
    var div = document.createElement('div');
    div.innerHTML = html.trim();
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}
B.whichOneOf = function(txt) {
	var a = txt.toString().toUpperCase();
	if (arguments.length > 2) {
		for (var i = 1; i < arguments.length; i++) {
			var b = B.trim(arguments[i]).toUpperCase();
			if (a == b) return i-1;
		}
	} else {
		var itm = arguments[1];
		if (typeof itm == "string") {
			var lst = itm.split(",");
			for (var i = 0; i < lst.length; i++) {
				var b = B.trim(lst[i]).toUpperCase();
				if (a == b) return i;
			}
		} else { // list passed in
			for (var i = 0; i < itm.length; i++) {
				var b = B.trim(itm[i]).toUpperCase();
				if (a == b) return i;
			}
		}
	}
	return -1;
};

B.is = {}
B.is.aFunction = function(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

B.is.oneOf = function() {
	return B.whichOneOf.apply(null, arguments) >= 0;
};
B.is.notOneOf = function() {
	return B.whichOneOf.apply(null, arguments) < 0;
};

B.format = {}
B.format.numberWithCommas = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
B.format.money = function(num) {
    return new Number(num).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

B.getForm = function(id) {
    var frm = B.system.formsCache[id];
    if (frm == undefined) {
        frm = new this.Form(id);
        B.system.formsCache[id] = frm;
    }
    return frm;
}
B.Form = function(id, googleFonts) {
    if (googleFonts == undefined) googleFonts = false;
    this.id = id;
    this.form = document.forms.namedItem(id);
    this.form.style.position = "relative";
    this.cleanData = this.get();
    this.frozen = false;
    this.freezeCover = null;
    this.freezeTextElement = null;
    this.googleFonts = googleFonts;
    B.system.formsCache[id] = this;
    if (googleFonts) {
        var els = this.form.elements;
        for (var elnum = 0; elnum < els.length; elnum++) {
            var el = els.item(elnum);
            if (el.type == "" || el.type == "text") {

            } else if (el.type == "checkbox") {
                var el2 = document.createElement("i"); // Arbitrary element type... as long as it is in-line
                el2.className = "material-icons";
                el2.style.cssText = "font-size: 1em;";
                if (el.checked) {
                    el2.innerHTML = "check_box";
                } else {
                    el2.innerHTML = "check_box_outline_blank";
                }
                el2.innerHTML = "check_box";
                el.insertAdjacentElement('afterend', el2);
                el.addEventListener("change", function() {
                    var sib = this.nextSibling;
                    if (this.checked) {
                        sib.innerHTML = "check_box";
                    } else {
                        sib.innerHTML = "check_box_outline_blank";
                    }
                });
                el.style.display = "none";
            } else if (el.type == "select-one") {

            } else if (el.type == "select-multiple") {

            } else if (el.type == "radio") {
                var el2 = document.createElement("i"); // Arbitrary element type... as long as it is in-line
                el2.className = "material-icons";
                el2.style.cssText = "font-size: 1em;";
                if (el.checked) {
                    el2.innerHTML = "radio_button_checked";
                } else {
                    el2.innerHTML = "radio_button_unchecked";
                }
                el.insertAdjacentElement('afterend', el2);
                el.addEventListener("change", function() {
                    var radios = this.form.elements[this.name];
                    for (var rdonum = 0; rdonum < radios.length; rdonum++) {
                        var rdo = radios[rdonum];
                        var sib = rdo.nextSibling;
                        if (rdo.checked) {
                            sib.innerHTML = "radio_button_checked";
                        } else {
                            sib.innerHTML = "radio_button_unchecked";
                        }
                        }
                });
                el.style.display = "none";
            }
        }
    }

}
B.Form.prototype.isClean = function() {
    var currentState = this.get();
    return B.util.compare(currentState, this.cleanData);
}
B.Form.prototype.isDirty = function() {
    return !this.isClean();
}
B.Form.prototype.setClean = function(cleanData) {
    if (cleanData == undefined) {
        this.cleanData = this.get();
    } else {
        this.cleanData = cleanData;
    }
}
B.Form.prototype.get = function() {
    var items = {};
    var els = this.form.elements;
    for (var elnum = 0; elnum < els.length; elnum++) {
        var el = els.item(elnum);
        if (el.type == "" || el.type == "text") {
            items[el.name] = el.value.trim();
        } else if (el.type == "checkbox") {
            items[el.name] = el.checked;
        } else if (el.type == "select-one") {
            items[el.name] = el.options[el.selectedIndex].value.trim();
        } else if (el.type == "select-multiple") {
            var sels = [];
            for (var optnum = 0; optnum = el.options.length; optnum++) {
                var opt = el.options[optnum];
                if (opt.selected) sels.push(opt.value.trim());
            }
            items[el.name] = sels;
        } else if (el.type == "radio") {
            if (el.checked) items[el.name] = el.value.trim();
        }
    }
    return items;
}
B.Form.prototype.set = function(field, val) {
    // Pairs of values set(name,val, name,val);
    for (var argnum = 0; argnum < arguments.length; argnum+=2) {
        field = arguments[argnum];
        if (arguments.length <= argnum+1) return;
        val = arguments[argnum+1];
        var el = this.form.elements[field];
        if (el.type == "checkbox") {
            el.checked = val;
        } else {
            el.value = val;
        }
    }
}
B.Form.prototype.setFromTableRow = function(btable, rownum) {
	var rd = btable.getDataRow(rownum);
	var fields = this.get();
	for (var key in fields) {
		if (rd[key] != null) this.set(key, rd[key]);
	}
}
B.Form.prototype.freeze = function(text) {
    var div = B.util.freezeArea(this.form);
    this.freezeCover = div;
    var spin = B.util.spinnerHtml("1.2em", "position:absolute; top:5px; left:5px;");
    if (text == undefined) text = "";
    this.freezeTextElement = B.util.addOverlayText(div, spin + text);
}
B.Form.prototype.thaw = function() {
    B.util.killElement(this.freezeCover, this.freezeTextElement);
}
B.Form.prototype.getLabel = function(name) {
    var el;
    if (typeof name == "string") {
        el = this.form.elements[name];
    } else {
        el = name;
    }
    if (el == undefined) return; // caller gets undefined
    var lbl = el.parentElement;
    if (lbl.tagName == "LABEL") {
        return lbl;
    } else {
        return;
    }
}

B.Stopwatch = function(width, autoStart) {
    if (width == undefined) width = 30;
    width = parseInt(width, 10);
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("width", width);
    this.canvas.setAttribute("height", width);
    this.canvas.onclick = function(event) {
    	for (var swnum = 0; swnum < B.system.stopWatches.watches.length; swnum++) {
            var sw = B.system.stopWatches.watches[swnum];
            if (sw.canvas == this) {
            	if (sw.running) {
            		sw.pause();
            	} else {
            		sw.resume();
            	}
            	break;
            }
    	}
    	
    }
    this.cx = (width/2);
    this.cy = this.cx;
    this.radii = {s: {lw:0, secs:0}, ms: {lw:0, secs:0, mins:0}}
    linewidth = width/7;
    this.radii.ms.lw = linewidth;
    this.radii.ms.secs = (width/2) - (linewidth/2);
    this.radii.ms.mins = this.radii.ms.secs - linewidth - 1;

    linewidth = width/5;
    this.radii.s.lw = linewidth;
    this.radii.s.secs = (width/2) - (linewidth/2);
 
    this.ctx = this.canvas.getContext("2d");
    this.ctx.lineCap = "round";
    this.startTime = null;
    this.running = false;
    var isFirstWatch = (B.system.stopWatches.watches.length == 0);
    B.system.stopWatches.watches.push(this);
    if (autoStart == undefined) autoStart = true;
    if (autoStart) this.start();
    if (isFirstWatch) B.system.stopWatches.animate();
    return this;
}
B.Stopwatch.prototype.start = function(fromTime) {
    if (fromTime == undefined) {
        this.startTime = new Date();
    } else {
        this.startTime = fromTime;
    }
    this.running = true;
}
B.Stopwatch.prototype.pause = function() {
    this.running = false;
}
B.Stopwatch.prototype.resume = function(fromTime) {
	if (fromTime != undefined || this.startTime == null) {
		this.start(fromTime);
	} else {
	    this.running = true;
	}
}
B.Stopwatch.prototype.stop = function() {
	for (var swnum = 0; swnum < B.system.stopWatches.watches.length; swnum++) {
        var sw = B.system.stopWatches.watches[swnum];
        if (sw == this) {
        	B.system.stopWatches.watches.splice(swnum, 1);
        	break;
        }
	}
}
B.Stopwatch.prototype.calcAngle = function(thisValue, maxValue) {
    var threeSixty = Math.PI*2;
    var angle = thisValue / maxValue * threeSixty;
    // rotate to top of "clock" since 0 is at 3 o'clock on canvas
    angle -= Math.PI/2;
    return angle;
}
B.Stopwatch.prototype.drawArc = function(radius, angle, color) {
	this.drawPartialArc(radius, -Math.PI/2, angle, color);
}
B.Stopwatch.prototype.drawPartialArc = function(radius, startAngle, endAngle, color) {
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.arc(this.cx, this.cy, radius, startAngle, endAngle);
    this.ctx.stroke();
    this.ctx.closePath();
}
B.Stopwatch.prototype.drawTextAt = function(x, y, just, color, text) {
	this.ctx.textAlign = just;
    this.ctx.fillStyle = "white";
    this.ctx.fillText(text, x+1,y+1);
    this.ctx.fillText(text, x+1,y-1);
    this.ctx.fillText(text, x-1,y+1);
    this.ctx.fillText(text, x-1,y-1);
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
}

B.Stopwatch.prototype.drawWatch = function() {
    var now = new Date().getTime();
    var orig = this.startTime.getTime();
    if (now < orig) {
        var temp = orig;
        orig = now;
        now = temp;
    }
    var secs = ((now - orig) / 1000) % 60;
    var mins = Math.floor(((now - orig) / 60000) % 60);
    var hrs = Math.floor(((now - orig) / (60000 * 60)));
    // Background only for now...
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = this.radii.ms.lw;
    this.drawArc(this.radii.ms.secs, Math.PI*2, "linen");
    this.drawArc(this.radii.ms.mins, Math.PI*2, "linen");
    if (hrs > 0 || mins > 0 || secs > 1) {
        var rads = this.calcAngle(secs, 60);
        //this.drawPartialArc(this.radii.ms.secs, rads-Math.PI/4, rads, "dodgerblue");
        this.drawPartialArc(this.radii.ms.secs, rads, rads, "dodgerblue");
    }
    if (hrs > 0) {
        if (mins > 0) {
            rads = this.calcAngle(mins, 60);
            this.drawArc(this.radii.ms.mins, rads, "skyblue");
        }
    } else if (mins > 0) {
        if (mins > 0) {
            rads = this.calcAngle(mins, 60);
            this.drawArc(this.radii.ms.mins, rads, "skyblue");
        }
    }
    //if (hrs > 0 || mins > 0 || secs > 1) {
	    if (B.system.stopWatches.showSweep) {
	        var rads = this.calcAngle((now - orig) % 1000, 1000);
	        this.ctx.lineWidth = 1;
	        var radius = (this.canvas.width/2) - 2;
	        this.drawPartialArc(radius+2, rads - Math.PI/3, rads, "yellow");
	        this.ctx.lineWidth = 2;
	        this.drawPartialArc(radius+1, rads - Math.PI/6, rads, "orange");
	        this.ctx.lineWidth = 3;
	        this.drawPartialArc(radius, rads, rads, "firebrick");
	    }
    //}
    var txt = Math.floor(secs);
    this.ctx.font = "bold 9pt arial";
    this.drawTextAt(this.cx, this.cy + 4, "center", "navy", Math.floor(secs));
    this.ctx.font = "bold 8pt arial";
    var days = 0;
    if (hrs > 24) {
    	days = Math.floor(hrs / 24);
    	this.drawTextAt(0, 9, "left", "black", days + "d");
    	hrs = hrs % 24; // Leftover hours after days
    }
    if (hrs > 0) {
    	this.drawTextAt(0, this.canvas.width, "left", "black", hrs + "h");
    }
    if (days > 0 || hrs > 0 || mins > 0) {
        this.drawTextAt(this.canvas.width, this.canvas.width, "right", "black", mins + "m");
    }
}


