/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var injection = nameSpace.components.injection;
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var elementMap = nameSpace.sources.elementMap;
    /**
     *存放数据源的map
     * @constructor sourceMap
     */
    function ComponentsMap(config) {
        this._map ={};
        this._sortByNumber(config);
        this._config = config || [];
        this._rootKey = "-1";
        if(this._config.length>0){
            this._rootKey = this._config[0].configs.element.key
        }
        this._configToComponentMap();
        // console.log(this._map,this._rootKey)
    }
    ComponentsMap.prototype={
        constructor:ComponentsMap,
        _sortByNumber:function (config) {
            config.sort(function (t1,t2) {
                return (t1.sortNumber-t2.sortNumber);
            });
        },
        _configToComponentMap:function () {
            var self = this;
            this._config.forEach(function (item) {
                item.configs.componentMap = self;
                self.addComponent(item.type,item.configs);
            })
        },
        _componentMapToConfig:function (configs,component,filters) {
            var config = {};
            var child = [];
            var self = this;
            for(var key in component._currentElement){
                if(key !== "child"){
                    if(filters.length>0){
                        if(filters.indexOf(key)<0){
                            config[key] =  component._currentElement[key];
                        }
                    }else{
                        config[key] =  component._currentElement[key];
                    }

                }else{
                    child =  component._currentElement.child
                }
            }
            // if(child.length<=0){
            //     config.leaf = true;
            // }
            configs.push({
                type:config.$type,
                sortNumber:this._sortNumber++,
                configs:{
                    element:config
                }
            });
            if(child){
                child.forEach(function (item) {
                    self. _componentMapToConfig(configs,item,filters);
                });
            }
        },
        componentMapToConfig:function (component,filters) {
            filters = filters || [];
            var component = component || this.getComponent(this._rootKey);
            var configs = [];
            this._sortNumber = 1;
            this._componentMapToConfig(configs,component,filters);
            return configs;
        },
        changeConfig:function (config) {
            this._sortByNumber(config);
            this._config = config;
            this._configToComponentMap();
        },
        getConfig:function () {
            return this._config;
        },
        addComponent:function (type,config) {
            var _type= type.toLowerCase();
            var types = Object.values(COMPONENTS_TYPE);
            if(types.indexOf(_type)<0){
                throw new Error(key+" type is not fount,please check!");
            }
            config.type = injection.getClazz(_type);
            var element = elementMap.getElement(_type,config.element);
            var component = injection.createClazz(_type,{element:element,componentMap:config.componentMap});
            if(element.parentKey != null){
                var parent = this._map[element.parentKey];
                parent._currentElement.child.push(component);
            }
            this._map[element.key] = component;
            return this;
        },
        moveComponent:function (srcKey,targetKey,itemKey) {
            // debugger
            var srcComponent = this.getComponent(srcKey);
            var targetComponent = this.getComponent(targetKey);
            var itemComponent =  this.getComponent(itemKey);
            if(srcComponent && targetComponent && itemComponent){
                // this.removeComponent(itemKey);
                var sChild = [];
                srcComponent._currentElement.child.forEach(function (item) {
                    if(item._currentElement.key !== itemKey){
                        sChild.push(item);
                    }
                });
                srcComponent._currentElement.child = sChild;
                itemComponent._currentElement.parentKey = targetKey;
                var parent = this._map[targetKey];
                parent._currentElement.child.push(itemComponent);
                this._map[itemKey] = itemComponent;
            }
            return this;
        },
        removeComponent:function (key){
            key=key+"";
            var self = this;
            var component = this._map[key];
            var element = component._currentElement;
            if(component){
                var parent = this._map[element.parentKey];
                var child=[];
                parent._currentElement.child.forEach(function (itemComponent) {
                    var element = itemComponent._currentElement;
                    var elementKey = element.key+"";
                    if(key !== elementKey){
                        child.push(itemComponent);
                    }
                });
                parent._currentElement.child = child;
                element.child.forEach(function (item) {
                    self.removeComponent(item._currentElement.key);
                })
                delete this._map[key];
            }
            return this;
        },
        getComponent:function(key){
            key=key+"";
            return this._map[key] || null;
        }

    }
    //用于存放多个ComponentsMap
    function ComponentsMaps() {
        this._sourceMaps = {};
    }
    ComponentsMaps.prototype={
        constructor:ComponentsMaps,
        createMaps:function (datas) {
            var self = this;
            datas.forEach(function (item) {
                self._sourceMaps[item.name] = new ComponentsMap(item.config);
            });
            return this;
        },
        getMap:function(key){
            var sourceMap = this._sourceMaps[key];
            if(!sourceMap){
                throw new Error('please create:'+key+' source Map');
            }
            return sourceMap;
        },
        removeMap:function (key) {
            if(this._sourceMaps[key]){
                delete this._sourceMaps[key];
            }
            return this;
        },
        clearAll:function () {
            this._sourceMaps = {};
            return;
        }
    }

    nameSpace.components.componentsMaps=new ComponentsMaps;
})(window.YT.DataView);