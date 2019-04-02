/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    var createNativeElement = nameSpace.utils.createNativeElement;
    var className = nameSpace.utils.className;
    var getKey = nameSpace.utils.getKey;
    var getColor = nameSpace.utils.getColor;
    var createTool = nameSpace.utils.createTool;
    var canConfig = nameSpace.func.canConfig;
    var Minx = nameSpace.utils.Minx;
    var event = nameSpace.event;
    function setRolCol(type) {
        function RowCol(config) {
            config = config || {};
            this._currentElement = config.element;
            this._componentMap = config.componentMap;
            this._renderClazz = null;
            this._dom = null;
            this._sortables = [];
            this._toolsDom = null;
            this._contentDom = null;
        }
        RowCol.addChildComponent = function (configs,parentKey,componentMap) {
            var splitNumber = configs.element.splitNumber;
            var sum = 0;
            for(var i=0;i<splitNumber.length;i++){
                sum+=Number(splitNumber[i]);
            }
            for(var i=0;i<splitNumber.length;i++){
                var _config = JSON.parse(JSON.stringify(configs));//复制拷贝
                var background = _config.element.background;
                console.log(background)
                var key = getKey();
                _config.sortNumber = 1;
                _config.componentMap = componentMap;
                _config.element.key = key;
                _config.element.background=background[i];
                _config.element.height=type==COMPONENTS_TYPE.COL?"100%":splitNumber[i]/sum*100+"%";
                _config.element.width=type==COMPONENTS_TYPE.ROW?"100%":splitNumber[i]/sum*100+"%";
                //_config.element.bgColor=getColor(isShowBgColor);
                _config.element.currentNumber=splitNumber[i];
                _config.element.parentKey = parentKey;
                _config.element.rootKey = parentKey;
                _config.element.leaf=true;
                _config.element.put = false;
                _config.element.handles = false;
                componentMap.addComponent(COMPONENTS_TYPE.CONTENT,_config);
            }
        }
        RowCol.addComponent = function (componentMap,configs,srcKey,targetKey,itemKey) {
            var pkey = getKey();
            var _pConfig = JSON.parse(JSON.stringify(configs));//复制拷贝
            _pConfig.element.key=pkey;
            _pConfig.element.height="100%";
            _pConfig.element.width="100%";
            _pConfig.element.parentKey = targetKey;
            _pConfig.element.handles = true;
            _pConfig.element.rootKey = targetKey;
            componentMap.addComponent(type,_pConfig);
            RowCol.addChildComponent(configs,pkey,componentMap);
            return pkey;
        };
        RowCol.prototype={
            constructor:RowCol,
            getCurrentElement:function () {
                return this._currentElement;
            },
            getContainer:function () {
                return  this._contentDom;
            },
            getCurrentDom:function () {
                return this._dom;
            },
            //选中
            select:function () {
                var self = this;
                this._renderClazz._setSelectComponent(this);
                var callBacks = event.getCallBacks(type,"select");
                callBacks.forEach(function (callBack) {
                    callBack.call(self);
                });
            },
            getConfigs:function () {
                var self = this;
                var configs = this._componentMap.componentMapToConfig(this).filter(function (item) {
                    return (item.type === COMPONENTS_TYPE.ROW || item.type === COMPONENTS_TYPE.COL)&&
                        item.configs.element.rootKey===self._currentElement.parentKey;
                });
                return configs
            },
            setConfig:function (nextConfigs) {
                var self = this;
                this._currentElement.child.forEach(function (item) {
                        self._componentMap.removeComponent(item.getCurrentElement().key);
                });
                var childConfigs = {};
                nextConfigs.forEach(function (item) {
                    var data = item.value.split(",");
                    childConfigs[item.field] = data;
                    self._currentElement[item.field] = data;
                })
               RowCol.addChildComponent({element:childConfigs},this._currentElement.key,this._componentMap);
            },
            unSelect:function () {
                this._toolsDom.innerHTML = "";
                //console.log("unSelect")
            },
            _addTools:function () {
                var self = this;
                var deleteDom = createTool.call(self,'delete');
                var crossDom = createTool.call(self,'crossMove');
                this._toolsDom.innerHTML = "";
                this._toolsDom.appendChild(crossDom);
                this._toolsDom.appendChild(deleteDom);
            },
            render:function (renderClazz,isPreview) {
                var self = this;
                this._renderClazz = renderClazz;
                var styles = {
                    position:"relative",
                    float:"left",
                    width:"100%",
                    height:"100%",
                }
                var bgColor = getColor(this._renderClazz.getIsShowBgColor(),this._currentElement.bgColor);
                if(bgColor){
                    styles.background = bgColor;
                }
                var dom = createNativeElement("div",{
                    styles:styles,
                    attrs:{
                        "data-key":this._currentElement.key,
                        "data-parentKey":this._currentElement.parentKey,
                        "data-dropComponent":this._currentElement.dropComponent,
                        class:this._renderClazz._getSelectComponentKey()===this._currentElement.key?"yt-dataView-select":""
                    }
                });
                var _contentDom = createNativeElement("div",{
                    styles:{
                        position:"relative",
                        height:"100%",
                        width:"100%"
                    },
                    attrs:{
                        "data-key":this._currentElement.key,
                        "data-parentKey":this._currentElement.parentKey,
                        "data-dropComponent":this._currentElement.dropComponent,
                    }
                });
                if(isPreview){
                    dom.onclick=function (e) {
                        self.select();
                        window.event? window.event.cancelBubble = true : e.stopPropagation();
                    }
                    this._toolsDom =  createNativeElement("div",{
                        styles:{
                            position:"relative",
                            // overflow:"hidden"
                        }
                    });
                    _contentDom.appendChild(this._toolsDom);
                    if(this._renderClazz._getSelectComponentKey()===this._currentElement.key){
                        this._addTools();
                    }
                }
                dom.appendChild(_contentDom);
                this._contentDom = _contentDom;
                this._dom = dom;
                return dom;
            }
        }
        return RowCol;
    }
    var Row = setRolCol(COMPONENTS_TYPE.ROW);
    var Col = setRolCol(COMPONENTS_TYPE.COL);
    injection.register(COMPONENTS_TYPE.ROW,Row);
    injection.register(COMPONENTS_TYPE.COL,Col);
    nameSpace.components.Row = Row;
    nameSpace.components.Col = Col;
})(window.YT.DataView);