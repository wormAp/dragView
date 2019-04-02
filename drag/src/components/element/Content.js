/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    var getClassNames = nameSpace.utils.getClassNames;
    var canSortable = nameSpace.utils.canSortable;
    var getKey = nameSpace.utils.getKey;
    var createNativeElement = nameSpace.utils.createNativeElement;
    var createTool = nameSpace.utils.createTool;
    var getColor = nameSpace.utils.getColor;

    /**
     * content
     */
    function Content(config) {
        config = config || {};
        this._currentElement = config.element;
        this._componentMap = config.componentMap;
        this._sortable = null;
        this._dom = null;
        this._renderClazz = null;
        this._contentDom = null;
    }
    Content.addComponent=function(componentMap,configs,srcKey,targetKey,itemKey){
        var key = getKey();
        configs.sortNumber = 1;
        configs.componentMap = componentMap;
        configs.element.key = key;
        configs.element.parentKey = targetKey;
        configs.element.rootKey = targetKey;
        configs.element.put = false;
        componentMap.addComponent(COMPONENTS_TYPE.CONTENT,configs);
        return key;
    }
    Content.prototype={
        constructor:Content,
        getCurrentElement:function () {
          return this._currentElement;
        },
        getContainer:function () {
            return  this._contentDom;
        },
        getCurrentDom:function () {
            return this._dom;
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
                overflowY:this._currentElement.overflowY,
                overflowX:this._currentElement.overflowX,
                width:this._currentElement.width,
                height:this._currentElement.height,
            }
            var bgColor = getColor(this._renderClazz.getIsShowBgColor(),this._currentElement.bgColor);
            if(this._currentElement.background){
                styles.background = this._currentElement.background;
            }
            if(bgColor){
                if(styles.background){
                    styles.background += " "+bgColor;
                }else{
                    styles.background =bgColor;
                }
            }
            var _dom = createNativeElement("div",{
                styles:styles,
                attrs:{
                    "data-key":this._currentElement.key,
                    "data-parentKey":this._currentElement.parentKey,
                    "data-dropComponent":this._currentElement.dropComponent,
                }
            });
            var _contentDom =  createNativeElement("div",{
                styles:{
                    position:"relative",
                    width:"100%",
                    height:"100%",
                },
                classNames:getClassNames(COMPONENTS_TYPE.CONTENT),
                attrs:{
                    "data-key":this._currentElement.key,
                    "data-parentKey":this._currentElement.parentKey,
                    "data-dropComponent":this._currentElement.dropComponent,
                    class:this._renderClazz._getSelectComponentKey()===this._currentElement.key?"yt-dataView-select":""
                }
            })
            if(isPreview){
                this._sortable = canSortable.call(this,_contentDom,injection);
                if(this._currentElement.handles){

                    this._toolsDom =  createNativeElement("div",{
                        styles:{
                            position:"relative",
                            // overflow:"hidden"
                        }
                    });
                    _dom.appendChild(this._toolsDom);
                    if(this._renderClazz._getSelectComponentKey()===this._currentElement.key){
                        this._addTools();
                    }
                }
            }
            _dom.appendChild(_contentDom);
            this._contentDom = _contentDom;
            this._dom = _dom;
            return _dom;
        }
    }
    injection.register(COMPONENTS_TYPE.CONTENT,Content);
    nameSpace.components.Content=Content;
})(window.YT.DataView);