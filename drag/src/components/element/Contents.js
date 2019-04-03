/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    // var getClassNames = nameSpace.utils.getClassNames;
    // var canSortable = nameSpace.utils.canSortable;
    var getKey = nameSpace.utils.getKey;
    var createNativeElement = nameSpace.utils.createNativeElement;
    var createTool = nameSpace.utils.createTool;
    var getColor = nameSpace.utils.getColor;
    var event = nameSpace.event;

    function Contents(config) {
        config = config || {};
        this._currentElement = config.element;
        this._componentMap = config.componentMap;
        this._sortable = null;
        this._dom = null;
        this._renderClazz = null;
        this._contentDom = null;
        this._currentPage = null;
        this._pageContent = null;
        // this._tabsContent=null;
    }
    Contents.addChildComponent = function (configs,parentKey,componentMap) {
        var contentsNumber = configs.element.contentsNumber;
        var currentIndex = configs.element.currentIndex;
        // var _config = JSON.parse(JSON.stringify(configs));//复制拷贝
        // componentMap.addComponent(COMPONENTS_TYPE.CONTENT,_config);
        for(var i=1;i<=contentsNumber;i++){
            var _config = JSON.parse(JSON.stringify(configs));//复制拷贝
            var background = _config.element.background;
            var key = getKey();
            _config.sortNumber = 1;
            _config.componentMap = componentMap;
            _config.element.key = key;
            _config.element.background=background[i];
            _config.element.height="100%";
            _config.element.width="100%";
            _config.element.isShow = currentIndex == i;
            //_config.element.bgColor=getColor(isShowBgColor);
            _config.element.currentNumber=i;
            _config.element.parentKey = parentKey;
            _config.element.rootKey = parentKey;
            _config.element.leaf=true;
            _config.element.put = false;
            _config.element.handles = false;
            _config.element.text = i;
            componentMap.addComponent(COMPONENTS_TYPE.CONTENT,_config);
        }
    }
    Contents.addComponent=function(componentMap,configs,srcKey,targetKey,itemKey){
        //console.log(configs.element)
        var pkey = getKey();
        var _pConfig = JSON.parse(JSON.stringify(configs));//复制拷贝
        _pConfig.element.key=pkey;
        _pConfig.element.height="100%";
        _pConfig.element.width="100%";
        _pConfig.element.parentKey = targetKey;
        _pConfig.element.handles = true;
        _pConfig.element.rootKey = targetKey;
        componentMap.addComponent(COMPONENTS_TYPE.CONTENTS,_pConfig);
        Contents.addChildComponent(configs,pkey,componentMap);
        return pkey;
    }
    Contents.prototype={
        constructor:Contents,
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
        changeCurrentIndex:function (currentIndex) {
            if(this._pageContent){
                var node = this._pageContent.childNodes[currentIndex-1];
                if(node){
                    node.onclick();
                }
            }else{
                this._currentElement.child[ this._currentElement.currentIndex-1].showHide(false);
                this._currentElement.child[ currentIndex-1].showHide(true);
            }
            this._currentElement.currentIndex =  currentIndex;

        },
        select:function () {
            var self = this;
            this._renderClazz._setSelectComponent(this);
            var callBacks = event.getCallBacks(COMPONENTS_TYPE.CONTENTS,"select");
            callBacks.forEach(function (callBack) {
                callBack.call(self);
            });
        },
        unSelect:function () {
            this._toolsDom.innerHTML = "";
        },
        render:function (renderClazz,isPreview) {
            var self = this;
            this._renderClazz = renderClazz;
            var styles = {
                position:"relative",
                float:"left",
                width:this._currentElement.width,
                height:this._currentElement.height,
                overflowY:this._currentElement.overflowY,
                overflowX:this._currentElement.overflowX,
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
                    width:"100%",
                    height:"100%",
                },
                attrs:{
                    "data-key":this._currentElement.key,
                    "data-parentKey":this._currentElement.parentKey,
                    "data-dropComponent":this._currentElement.dropComponent,
                }
            });
            if(isPreview){
                if(this._currentElement.handles){
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
                    dom.appendChild(this._toolsDom);
                }

                var contentsNumber = this._currentElement.contentsNumber;
                this._pageContent = createNativeElement("div",{
                    styles:{
                        position:"absolute",
                        paddingLeft:"30px",
                        zIndex:2
                        //paddingLeft:"50%"
                    }
                });
                var clickState = {
                    background:"rgb(137, 129, 129)",
                    color:"#fff"
                };
                var unClickState = {
                    background:"#fff",
                    color:"#aaa"
                };
                // this._currentElement.child[0].showHide(this._currentElement.currentIndex==1);
                for(var i=1;i<=contentsNumber;i++){
                    //rgb(137, 129, 129)
                    //#fff
                    var pageDom = createNativeElement("div",{
                        styles:{
                            float:"left",
                            background:i==this._currentElement.currentIndex?clickState.background:unClickState.background,
                            margin:"5px",
                            padding:"0px 5px",
                            borderRadius: "2px",
                            color: i==this._currentElement.currentIndex?clickState.color:unClickState.color,
                            cursor:"pointer"
                        },
                        attrs:{
                            "data-page":i
                        },
                        handles:{
                            onclick:function (e) {
                                if(self._currentPage){
                                    self._currentPage.style.background = unClickState.background;
                                    self._currentPage.style.color = unClickState.color;
                                    self._currentElement.child[self._currentPage.getAttribute("data-page")-1].showHide(false);
                                }
                                this.style.background = clickState.background;
                                this.style.color = clickState.color;
                                self._currentPage = this;
                                self._currentElement.currentIndex = this.getAttribute("data-page");
                                self._currentElement.child[self._currentElement.currentIndex-1].showHide(true);
                                if(e){
                                    window.event? window.event.cancelBubble = true : e.stopPropagation();
                                }
                            }
                        }
                    });
                    pageDom.innerHTML = i;
                    if(i==this._currentElement.currentIndex){
                        this._currentPage = pageDom;
                    }
                    this._pageContent.appendChild(pageDom);
                    // componentMap.addComponent(COMPONENTS_TYPE.CONTENT,_pConfig);
                }

                _contentDom.appendChild(this._pageContent);
                if(this._renderClazz._getSelectComponentKey()===this._currentElement.key){
                   this._addTools();
                }
            }
            // dom.appendChild(this._tabsContent);
            dom.appendChild(_contentDom);
            this._contentDom = _contentDom;
            this._dom = dom;
            return dom;

        }
    }
    injection.register(COMPONENTS_TYPE.CONTENTS,Contents);
    nameSpace.components.Contents=Contents;
})(window.YT.DataView);