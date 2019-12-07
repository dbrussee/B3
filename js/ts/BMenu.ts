/// <reference path="B.ts" />
namespace B {
    export class DropdownMenu {
        public static menus = {};
        public static menuCount = 0;
        public container:HTMLElement = null;
        public element:HTMLElement = null;
        public enabled:boolean = true;
        public visible:boolean = true;
        public popup:PopupMenu = null;
        constructor(containerId:string, id:string, icon:string, title:string, width:number=0) {
            this.container = document.getElementById(containerId);
            this.element = document.createElement("div");
            this.element.setAttribute("data-BDROPDOWN", id);
            DropdownMenu.menus[id] = this;
            this.element.style.cssText = "display:inline-block; padding: .5em; padding-top:0; position:relative;";
            this.element.className = "anchor";
            if (icon != null) {
                let spn = document.createElement("span");
                spn.style.cssText = "font-size: 1.2em; display:inline-block; position:relative; top:.14em; width:1.2em;";
                spn.className = "material-icons";
                spn.innerHTML = icon;
                this.element.appendChild(spn);
                //spn = document.createElement("span");
                //spn.innerHTML = "&nbsp;";
                //this.element.appendChild(spn);
            }
            let spn = document.createElement("span");
            spn.style.cssText = "display:inline-block; position:relative;";
            spn.innerHTML = title;
            this.element.appendChild(spn);
            this.container.appendChild(this.element);
            this.element.onclick = function(event) {
                let target = B.util.findNodeWithAttribute(event.target as HTMLElement, "data-BDROPDOWN");
                let mnu:DropdownMenu = DropdownMenu.menus[target.getAttribute("data-BDROPDOWN")];
                if (mnu.popup.visible) {
                    mnu.hide();
                } else {
                    event.stopPropagation();
                    if (mnu.enabled) {
                        let el:HTMLElement = mnu.element;
                        let rect = el.getBoundingClientRect();
                        mnu.show(rect.left +  6, rect.bottom - 6);
                    }
                }
            }
            this.popup = new PopupMenu('DROPDOWN_' + id, width);
            document.body.addEventListener("click", function() {
                B.PopupMenu.hideAll();
            });
        }
        show(left:number, top:number) {
            for (let id in DropdownMenu.menus) {
                DropdownMenu.menus[id].popup.hide();
            }

            if (this.popup.visible) return;
            this.popup.show(left, top);
        }
        hide() {
            for (let id in DropdownMenu.menus) {
                DropdownMenu.menus[id].popup.hide();
            }
        }
        enable(torf:boolean=true) {
            if (!torf) return this.disable();
            this.element.className = "anchor";
            this.element.style.color = "";
            this.enabled = true;
            return this;
        }
        disable(torf:boolean=true) {
            if (!torf) return this.enable();
            this.element.className = "";
            this.element.style.color = "brown";
            this.enabled = false;
            return this;
        }

    }

    export class MenuItem {
        public id:string = "";
        public callback:CallableFunction = null;
        public icon:string = "";
        public text:string = "";
        public enabled:boolean = true;
        public visible:boolean = true;
        public element:HTMLElement = null;
        public iconDiv:HTMLElement = null;
        public textDiv:HTMLElement = null;
        constructor(parentId:string, id:string, callback:CallableFunction, icon:string, text:string) {
            this.id = id;
            this.callback = callback;
            this.icon = icon;
            this.text = text;
            this.element = document.createElement("div");
            this.element.setAttribute("data-BMENUITEM", parentId + "." + id);
            this.element.onclick = function(event) {
                let target = B.util.findNodeWithAttribute(event.target as HTMLElement, "data-BMENUITEM");
                let myids = target.getAttribute("data-BMENUITEM").split("."); // parent,child
                let pop = PopupMenu.menus[myids[0]];
                let itm = pop.items[myids[1]];
                if (itm.enabled) {
                    pop.hide();
                    itm.callback();
                } else {
                    event.stopPropagation(); // Dont close
                }
            }
            this.element.className = "BPopupMenuItem";
            this.iconDiv = document.createElement("div");
            this.iconDiv.className = "ICON material-icons";
            //this.iconDiv.style.cssText = "display:table-cell; width:1.2em; text-align:center; vertical-align:top;";
            this.element.appendChild(this.iconDiv);
            this.textDiv = document.createElement("div");
            this.textDiv.className = "TEXT";
            this.textDiv.style.cssText = "display:table-cell; vertical-align:top;";
            this.element.appendChild(this.textDiv);
            this.setIcon(icon);
            this.setText(text);
        }
        setIcon(icon:string) { this.iconDiv.innerHTML = icon; }
        setText(text:string) { this.textDiv.innerHTML = text; }
        enable(torf:boolean=true) {
            if (!torf) return this.disable();
            this.element.style.color = "";
            this.enabled = true;
            return this;
        }
        disable(torf:boolean=true) {
            if (!torf) return this.enable();
            this.element.style.color = "orange";
            this.enabled = false;
            return this;
        }
    }

    export class PopupMenu {
        public static menus = {};
        public container:HTMLElement = null;
        public id:string = "";
        public items:MenuItem[] = [];
        public x:number = 0;
        public y:number = 0;
        public visible:boolean = false;
        constructor(id:string, width:number) {
            this.id = id;
            this.container = document.createElement("div");
            this.container.className = "BDropdownMenu"
            if (width > 0) this.container.style.width = width.toString() + "px";
            document.body.appendChild(this.container);
            PopupMenu.menus[id] = this;
        }
        show(left:number, top:number) {
            this.container.style.top = top.toString() + "px";
            this.container.style.left = left.toString() + "px";
            this.container.style.display = "block";
            this.visible = true;
        }
        hide() {
            this.container.style.display = "none";
            this.visible = false;
        }
        static hideAll() {
            for (let id in PopupMenu.menus) {
                PopupMenu.menus[id].hide();
            }
        }

        addItem(id:string, callback:CallableFunction, icon:string, text:string) {
            let itm:MenuItem = new MenuItem(this.id, id, callback, icon, text);
            this.container.appendChild(itm.element);
            this.items[id] = itm;
        }
        addSpace() {
            let div = document.createElement("div");
            div.className = "BPopupMenuSpace";
            this.container.appendChild(div);
            //this.items[id] = itm;
        }
    }
}