/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components = nameSpace.components || {};
    /**
     * 匹配注入
     * @constructor
     */
    function ComponentsClazzMap() {
        this._componentsMap = {};
    }
    ComponentsClazzMap.prototype={
        constructor:ComponentsClazzMap,
        register:function (key,clazz) {
            if(!this._componentsMap[key]){
                this._componentsMap[key] = clazz;
            }
            return this;
        },
        createClazz:function (key,params) {
            var clazz = null;
            if(this._componentsMap[key]){
                clazz = new this._componentsMap[key](params);
            }
            return clazz;
        },
        getClazz:function (key) {
            var clazz = null;
            if(this._componentsMap[key]){
                clazz = this._componentsMap[key];
            }
            return clazz;
        }
    }
    nameSpace.components.injection = new ComponentsClazzMap()
})(window.YT.DataView)