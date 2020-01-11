/// <reference path="B.ts" />
namespace B {
    export class RemoteMethod {
        private static remoteMethods = [];
        private static defaultURL = "/test/RemoteMethod";
        public className:string = "";
        public methodName:string = "";
        public onBefore:Function = null;
        public onAfter:Function = null;
        public url:string = "";
        private runCount = 0;
        public error:string = "";
        public running:boolean = false;
        public aborted:boolean = false;
        public timings = { start: null, end: null, remotemillis: 0, overheadmillis: 0, totalmillis: 0 };
        public params = { };
        public results:any = { };
        private xhr:XMLHttpRequest = new XMLHttpRequest();
        private listPosition = -1;
        
        constructor(className:string, methodName:string, onBefore:Function, onAfter:Function, url?:string) {
            this.className = className;
            this.methodName = methodName;
            this.onBefore = onBefore;
            this.onAfter = onAfter;
            if (url == undefined) url = RemoteMethod.defaultURL;
            this.url = url;
            this.xhr.onreadystatechange = function(event) {
                console.log("XHR state=" + 
                    this.readyState + 
                    ", Status " + 
                    this.status + " '" + 
                    this.statusText + "'");
                if(this.readyState == 4) {
                    let matchArray = B.RemoteMethod.remoteMethods.filter((itm) => {
                        return (this == itm.xhr);
                    });
                    let remoteMethod:B.RemoteMethod = matchArray[0].remoteMethod;
                    if (this.status == 200) {
                        // parts of result are seperated by formfeeds
                        let parts = this.responseText.split("\f");
                        // part 0 is the error message (if any)
                        // part 1+ are result names and values. 
                        // Name and values are seperated by backspace characters
                        remoteMethod.error = parts[0].split("\b")[1]; //ERROR\bText of error\f
                        for (var i = 1; i < parts.length; i++) {
                            var itm = parts[i].split("\b"); // ITEMNAME\bItem value\f
                            var key = itm[0];
                            var val = itm[1];
                            if (val.charCodeAt(val.length-1)) { //Ends with null?
                                val = val.substr(0,val.length-1);
                            }
                            remoteMethod.results[key] = val;
                        }
                        remoteMethod.onAfter(remoteMethod.error == "", remoteMethod);
                    } else {
                        remoteMethod.error = "Error status code: " + this.status + " '" + this.statusText;
                        remoteMethod.onAfter(false, remoteMethod);
                    }
                }

            }
            B.RemoteMethod.remoteMethods.push({"xhr":this.xhr, remoteMethod:this});
        }
        setParameter() {
            if (arguments.length == 1) { // Pass in a collection?
                let args = arguments[0];
                for (let itm in args) {
                    let key = itm.trim().toUpperCase();
                    this.params[key] = args[itm]; 
                }
            }
            for (let i = 0; i < arguments.length; i+=2) {
                let key = arguments[i].trim().toUpperCase();
                this.params[key] = arguments[i+1];
            }
            return this;
        }
        getParameter(key:string) {
            return this.params[key];
        }
        setResult() {
            if (arguments.length == 1) { // Pass in a collection?
                let args = arguments[0];
                for (let itm in args) {
                    let key = itm.trim().toUpperCase();
                    this.results[key] = args[itm]; 
                }
            }
            for (let i = 0; i < arguments.length; i+=2) {
                let key = arguments[i].trim().toUpperCase();
                this.results[key] = arguments[i+1];
            }
            return this;
        }
        getResult(key:string) {
            return this.results[key.toUpperCase()];
        }
        run() {
            this.setParameter.call(null, arguments);

            this.aborted = false;
            this.timings.start = new Date();
            this.timings.end = null;
            this.timings.remotemillis = 0;
            this.timings.overheadmillis = 0;
            this.timings.totalmillis = 0;
        
            let ok = this.onBefore(this);
            if (ok == undefined) ok = true;
            if (!ok) return;
            let d = "callClass=" + this.className;
            d += "&callMethod=" + this.methodName;
            d += "&RPCCallType=" + "CALLBUNDLE";
            d += "&RemoteMethodItem=" + this.listPosition;
            d += "&RPCCallNumber=" + this.runCount++;
            for (let key in this.params) {
                d += "&key=" + encodeURI(this.params[key]);
            }
            this.error = "";
            this.results = { };
            this.running =  true;
            if (this.className == null) {
                if (this.methodName != null) {
                    // Check if you sent in a millisecond counter for test purposes
                    if (!isNaN(parseInt(this.methodName,10))) {
                        // Simulate taking some time to do the remote method
                        window.setTimeout( function(remoteMethod:B.RemoteMethod) {
                            remoteMethod.onAfter.call(null, true, remoteMethod);
                        }, parseInt(this.methodName, 10), this);
                        return;
                    } else {
                        this.onAfter(true, this);
                        return;
                    }
                } else {
                    this.onAfter(true, this);
                    return;
                }
            }
            //this.xhr.onreadystatechange = this.stateHandler;
            this.xhr.open("POST", this.url, true); 
            this.xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            this.xhr.send(d); 
        }
    }
}