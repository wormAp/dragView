/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    // nameSpace.event = nameSpace.event || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var types = [];
    function Event() {
        var self = this;
        this._listerns={};
        Object.values(COMPONENTS_TYPE).forEach(function (type) {
            self._listerns[type] ={};
            types.push(type);
        });
    }
    Event.prototype={
        constructor:Event,
        addHandle:function (compType,type,callback) {
            //debugger
            if(Object.values(COMPONENTS_TYPE).indexOf(compType)<0){
                throw new Error(compType+"类型不存在,必须是"+types.join(",")+"中的一种!");
            }
            if(this._listerns[compType][type]){
                this._listerns[compType][type].push(callback);
            }else{
                this._listerns[compType][type] = [callback];
            }
        },
        removeAll:function (compType,type) {
            if(Object.values(COMPONENTS_TYPE).indexOf(compType)<0){
                throw new Error("类型必须是"+types.join(",")+"中的一种!");
            }
            if(this._listerns[compType][type]){
                delete this._listerns[compType][type];
            }
        },
        removeHandle:function (compType,type,callback) {
            if(Object.values(COMPONENTS_TYPE).indexOf(compType)<0){
                throw new Error("类型必须是"+types.join(",")+"中的一种!");
            }
            if(this._listerns[compType][type]){
                var callBacks = [];
                this._listerns[compType][type].forEach(function (_callback) {
                    if(callback !== _callback){
                        callBacks.push(_callback);
                    }
                })
                this._listerns[compType][type] = _callback;
            }
        },
        getCallBacks:function (compType,type) {
            if(Object.values(COMPONENTS_TYPE).indexOf(compType)<0){
                throw new Error("类型必须是"+types.join(",")+"中的一种!");
            }
            if(!this._listerns[compType][type]){
                return [];
            }
            return this._listerns[compType][type];
        }
    }
    nameSpace.event = new Event;
})(window.YT.DataView);