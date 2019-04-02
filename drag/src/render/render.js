/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.Render = nameSpace.Render || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    var handleSortableClass = "my-handle";
    function Render(componentMap,rootKey,container,isShowBgColor) {
        this._componentMap = componentMap;
        this._isShowBgColor = isShowBgColor;
        this._container = container;
        this._rootKey = rootKey || new Date().getTime().toString();
        this.selectComponentKey = "";
    }
    Render.prototype={
        constructor:Render,
        isShowBgColor:function (isShowBgColor) {
            this._isShowBgColor = isShowBgColor;
        },
        getIsShowBgColor:function () {
            return  this._isShowBgColor;
        },
        _setSelectComponent:function (component) {
            var current = component.getCurrentElement();
            // var beforeKey = this.selectComponentKey;
            if(this.selectComponentKey){
                if(this.selectComponentKey !== current.key){
                    var component = this._componentMap.getComponent(this.selectComponentKey);
                    if(component && component.unSelect){
                        component.unSelect();
                    }
                    component && (component.getCurrentDom().className = "");
                    this.selectComponentKey = current.key;
                }
            }else{
                this.selectComponentKey = current.key;
            }
            var selectComponent = this._componentMap.getComponent(this.selectComponentKey);
            if(selectComponent && selectComponent.getCurrentDom()){
                selectComponent.getCurrentDom().className = "yt-dataView-select";
            }
            if(selectComponent && selectComponent._addTools){
                selectComponent._addTools();
            }
            //this.repaint(this._rootKey,true)
            return this;
        },
        _clearSelectComponent:function () {
           this.selectComponentKey = "";
            // this.selectComponen=null;
            return this;
        },
        _getSelectComponentKey:function () {
          return this.selectComponentKey;
        },
        _setAuto:function (components) {
            //debugger
            var firstComponent = components[0];
            var parentComponent =this._componentMap.getComponent(firstComponent._currentElement.parentKey);
            if(parentComponent){
                var parentContainer = parentComponent.getContainer();
                var disWidth = 0;
                var disHeight = 0;
                var autoWidthCom = null;
                var autoHeightCom = null;
                var segWidth = 0;
                var segHeight = 0;
                var widthType=0;
                components.forEach(function (item) {
                    var _currentElement = item._currentElement;
                    if(_currentElement.width !== "auto"){
                        var dom = item.getCurrentDom();
                        if(
                            parentContainer.offsetHeight-dom.offsetHeight<2
                        ){
                            segWidth += dom.offsetWidth;
                            widthType=1;
                        }else if(widthType!=1){
                            widthType=2;
                        }
                        disWidth+=dom.offsetWidth;
                    }else{
                        autoWidthCom = item;
                    }
                    if(_currentElement.height !== "auto"){
                        var dom = item.getCurrentDom();
                        if(
                            parentContainer.offsetWidth-dom.offsetWidth<2
                        ){
                            segHeight += dom.offsetHeight;

                        }
                        disHeight+=dom.offsetHeight;
                    }else{
                        autoHeightCom = item;
                    }
                });
                if(autoWidthCom){
                    var nextWidth = parentContainer.offsetWidth;
                    if(widthType===1){
                        nextWidth = parentContainer.offsetWidth-segWidth;
                    }else{
                        nextWidth = parentContainer.offsetWidth-disWidth%(parentContainer.offsetWidth);
                    }
                    autoWidthCom.getCurrentDom().style.width = nextWidth+"px";
                }
                if(autoHeightCom){
                    var nextHeight = parentContainer.offsetHeight-segHeight;
                    autoHeightCom.getCurrentDom().style.height = nextHeight+"px";
                }
            }
        },
        _doRender:function (component,container,isPreview) {
            var self = this;
            var currentDom = null;
            var currentElement = component._currentElement;
            if(component.render instanceof Function){
                currentDom = component.render(this,isPreview);
                if(currentDom){
                    container.appendChild(currentDom);
                }
                if(component.afterRender instanceof Function){
                    component.afterRender();
                }
                if(currentElement.child &&  currentElement.child.length>0){
                    currentElement.child.forEach(function (item) {
                        self._doRender(item,component.getContainer(),isPreview);
                    });
                }
            }
        },
        _setAllAuto:function (component) {
            var self = this;
            var currentElement = component._currentElement;
            if(component.autoAfter instanceof Function){
                component.autoAfter();
            }
            if(currentElement.child &&  currentElement.child.length>0){
                if(COMPONENTS_TYPE.CUSTOM !== currentElement.$type){
                    this._setAuto(currentElement.child);
                    currentElement.child.forEach(function (item) {
                        self._setAllAuto(item);
                    });
                }

                // debugger
            }

        },
        render:function (isPreview) {
            this._clearSelectComponent();
            this._isPreview = isPreview;
            var rootComponent = this._componentMap.getComponent(this._rootKey);
            this._container.innerHTML = "";
            this._doRender(rootComponent,this._container,isPreview);
            this._setAllAuto(rootComponent);
        },
        repaint:function (key,flushAll) {
            var self = this;
            var repaintComponent = this._componentMap.getComponent(key);
            if(repaintComponent){
                var container = repaintComponent.getContainer();
                if(flushAll){
                    container = this._container;
                }
                container.innerHTML = "";
                self._doRender(repaintComponent,container,this._isPreview);
                this._setAllAuto(repaintComponent);
            }
        }
    }
    nameSpace.Render=Render;
})(window.YT.DataView)