/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    var canSortable = nameSpace.utils.canSortable;
    var changeSortableOpt =  nameSpace.utils.changeSortableOpt;
    var getKey = nameSpace.utils.getKey;
    var getColor = nameSpace.utils.getColor;
    var createTool = nameSpace.utils.createTool;
    var createNativeElement = nameSpace.utils.createNativeElement;
    var event = nameSpace.event;
    /**
     *
     * @param element
     * @constructor
     */
    function Custom(config) {
        config = config || {};
        this._dom = null;
        this._contentDom = null;
        this._currentElement = config.element;
        this._componentMap = config.componentMap;
        this._renderClazz = null;
    }
    Custom.addComponent=function(componentMap,configs,srcKey,targetKey,itemKey){
        var key = getKey();
        configs.sortNumber = 1;
        configs.componentMap = componentMap;
        configs.element.key = key;
        configs.element.parentKey = targetKey;
        configs.element.put = false;
        configs.element.rootKey = targetKey;
        this._toolsDom = null;
        componentMap.addComponent(COMPONENTS_TYPE.CUSTOM,configs);
        return key;
    }
    Custom.prototype={
        constructor:Custom,
        getCurrentElement:function () {
            return this._currentElement;
        },
        getCurrentDom:function(){
          return this._contentDom;
        },
        autoAfter:function () {
            var self = this;
            var appCom = this._currentElement.appCom;
            var component = this._currentElement.component;
            var id = this._currentElement.key;
            var callBacks = event.getCallBacks(COMPONENTS_TYPE.CUSTOM,"autoAfter");
            callBacks.forEach(function (callBack) {
                callBack.call(self,id,component,appCom)
            })
        },
        afterRender:function(){
            var self = this;
            var appCom = this._currentElement.appCom;
            var component = this._currentElement.component;
            var id = this._currentElement.key;
            var callBacks = event.getCallBacks(COMPONENTS_TYPE.CUSTOM,"afterRender");
            callBacks.forEach(function (callBack) {
                callBack.call(self,id,component,appCom)
            })
        },
        //点击选中
        select:function(id,appCom,component,propsGlobal){
            var self = this;
            this._renderClazz._setSelectComponent(this);
            //this._contentDom.className = "yt-dataView-select";
            var callBacks = event.getCallBacks(COMPONENTS_TYPE.CUSTOM,"select");
            callBacks.forEach(function (callBack) {
                callBack.call(self,id,component,appCom,propsGlobal)
            })

        },
        unSelect:function () {
            this._toolsDom.innerHTML = "";
        },
        setCustomData:function (appCom,component) {
            this._currentElement.appCom = appCom;
            this._currentElement.component = component;
            return this;
        },
        setConfigs:function(props){
            var self = this;
            props.forEach(function (item) {
                self._currentElement.propsGlobal[item.key] = item.value;
            })
        },
        _addTools:function () {
            var self = this;
            var crossDom = createTool.call(self,'crossMove');
            var deleteDom = createTool.call(this,"delete",function () {
                var key = this.parentNode.parentNode.getAttribute("data-key");
                var callBacks = event.getCallBacks(COMPONENTS_TYPE.CUSTOM,"remove");
                callBacks.forEach(function (callBack) {
                    callBack.call(self,key)
                })
            });
            this._toolsDom.innerHTML = "";
            this._toolsDom.appendChild(crossDom);
            this._toolsDom.appendChild(deleteDom);
        },
        render:function (renderClazz,isPreview) {
            var self = this;
            this._renderClazz = renderClazz;
            var id = this._currentElement.key;
            var _dom = createNativeElement("div",{
                styles:{
                    position:"relative",
                    width:self._currentElement.propsGlobal.width,
                    height:self._currentElement.propsGlobal.height,
                    margin:self._currentElement.propsGlobal.margin,
                    padding:self._currentElement.propsGlobal.padding,
                    background:self._currentElement.propsGlobal.background,
                },
                attrs:{
                    "data-key":id
                }
            });
            var contentOptions = {
                styles:{
                    position:"relative",
                    width:"100%",
                    height:"100%"
                },
                attrs:{
                    id:id,
                    class:this._renderClazz._getSelectComponentKey()===this._currentElement.key?"yt-dataView-select":""
                }
            };
            var _contentDom=null;
            if(!isPreview){
                _contentDom = createNativeElement("div",contentOptions);
            }
            if(isPreview){
                contentOptions.handles={
                    onclick:function (e) {
                        self.select(self._currentElement.key,self._currentElement.appCom,self._currentElement.component,self._currentElement.propsGlobal)
                        window.event? window.event.cancelBubble = true : e.stopPropagation();
                    }
                };
                _contentDom= createNativeElement("div",contentOptions);
                this._sortable = canSortable.call(this,_contentDom,injection);
                this._toolsDom =  createNativeElement("div");
                _dom.appendChild(this._toolsDom);
                if(this._renderClazz._getSelectComponentKey()===this._currentElement.key){
                    this._addTools();
                }
            }
            this._contentDom = _contentDom;
            this._dom = _dom;
            this._dom.appendChild(this._contentDom);
            return this._dom;
        }
    }
    injection.register(COMPONENTS_TYPE.CUSTOM,Custom);
    nameSpace.components.Custom = Custom;
})(window.YT.DataView);