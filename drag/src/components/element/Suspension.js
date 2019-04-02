/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    var canSortable = nameSpace.utils.canSortable;
    var getColor = nameSpace.utils.getColor;
    var getKey = nameSpace.utils.getKey;
    var createNativeElement = nameSpace.utils.createNativeElement;
    var changeStyle = nameSpace.utils.changeStyle;
    var createTool = nameSpace.utils.createTool;
    var changeSortableOpt =  nameSpace.utils.changeSortableOpt;
    var getClassNames = nameSpace.utils.getClassNames;
    var canConfig = nameSpace.func.canConfig;
    var Minx = nameSpace.utils.Minx;
    var event = nameSpace.event;

    function Suspension(config) {
        config = config || {};
        this._currentElement = config.element;
        this._componentMap = config.componentMap;
        this._renderClazz = null;
        this._dom = null;
    }
    Suspension.addComponent=function(componentMap,configs,srcKey,targetKey,itemKey){
        var key = getKey();
        configs.sortNumber = 1;
        configs.componentMap = componentMap;
        configs.element.key = key;
        configs.element.parentKey = targetKey;
        configs.element.rootKey = targetKey;
        // configs.element.bgColor = getColor(isShowBgColor);//随机color
        configs.element.put = false;
        componentMap.addComponent(COMPONENTS_TYPE.SUSPENSION,configs);
        return key;
    }
    Suspension.prototype={
        constructor:Suspension,
        getCurrentElement:function () {
          return this._currentElement;
        },
        getContainer:function () {
            return  this._contentDom;
        },
        getCurrentDom:function () {
            return  this._dom;
        },
        autoAfter:function(){
            var parentContainer = this._componentMap.getComponent(this._currentElement.parentKey).getContainer();
            var top = parseFloat(this._currentElement.top);
            var left = parseFloat(this._currentElement.left);
            var right = parseFloat(this._currentElement.right);
            var bottom = parseFloat(this._currentElement.bottom);
            var height = parseFloat(this._currentElement.height);
            var width = parseFloat(this._currentElement.width);
            if(parentContainer){
                if(isNaN(top)){
                    top = parentContainer.offsetHeight-(height+bottom);
                }else if(isNaN(bottom)){
                    bottom = parentContainer.offsetHeight-(height+top);
                }
                if(isNaN(left)){
                    left =  parentContainer.offsetWidth-(width+right);
                }else if(isNaN(right)){
                    right = parentContainer.offsetWidth-(width+left);
                }
            }
            console.log(top,bottom,left,right)
            changeStyle(this._dom,{
                top:top+"px",
                left:left+"px",
                right:right+"px",
                bottom:bottom+"px"
            });
        },
        //选中
        select:function () {
            var self = this;
            this._renderClazz._setSelectComponent(this);
            var callBacks = event.getCallBacks(COMPONENTS_TYPE.SUSPENSION,"select");
            callBacks.forEach(function (callBack) {
                callBack.call(self,COMPONENTS_TYPE.SUSPENSION);
            });
        },
        unSelect:function () {
            this._toolsDom.innerHTML = "";
            //console.log("unSelect")
        },
        _addTools:function () {
            var self = this;
            var crossDom = createTool.call(this,'crossMove');
            var leftResize = createTool.call(this,"leftResize");
            var rightResize = createTool.call(this,"rightResize");
            var deleteDom = createTool.call(this,"delete");
            var moveDom = createTool.call(this,"move");
            this._toolsDom.innerHTML = "";
            this._toolsDom.appendChild(crossDom);
            this._toolsDom.appendChild(moveDom);
            this._toolsDom.appendChild(deleteDom);
            this._toolsDom.appendChild(leftResize);
            this._toolsDom.appendChild(rightResize);
        },
        render:function (renderClazz,isPreview) {
            var self = this;
            this._renderClazz = renderClazz;
            var styles = {
                position:"absolute",
                zIndex:this._currentElement.zIndex,
            };
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
            var dom = createNativeElement("div",{
                styles:styles,
                attrs:{
                    "data-key":this._currentElement.key,
                    "data-parentKey":this._currentElement.parentKey,
                    "data-dropComponent":this._currentElement.dropComponent,
                    class:this._renderClazz._getSelectComponentKey()===this._currentElement.key?"yt-dataView-select":""
                }
            });
            var _contentDom =  createNativeElement("div",{
                styles:{
                    position:"relative",
                    width:"100%",
                    height:"100%",
                    overflow:"hidden"
                },
                classNames:getClassNames(COMPONENTS_TYPE.SUSPENSION),
                attrs:{
                    "data-key":this._currentElement.key,
                    "data-parentKey":this._currentElement.parentKey,
                    "data-dropComponent":this._currentElement.dropComponent,
                }
            });
            if(isPreview){
                dom.onclick=function () {
                    self.select();
                    // self.select(self._currentElement.key,self._currentElement.appCom,self._currentElement.component)
                    window.event? window.event.cancelBubble = true : e.stopPropagation();
                }
                this._sortable = canSortable.call(this,_contentDom,injection);
                this._toolsDom =  createNativeElement("div");
                dom.appendChild(this._toolsDom);
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
    Minx(Suspension.prototype,canConfig());
    injection.register(COMPONENTS_TYPE.SUSPENSION,Suspension);
    nameSpace.components.Suspension = Suspension;
})(window.YT.DataView);