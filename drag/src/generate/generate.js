/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.Generate = nameSpace.Generate || {};
    var sources = nameSpace.sources;
    var components = nameSpace.components;
    var Render = nameSpace.Render;
    var event = nameSpace.event;
    var TYPES = sources.COMPONENTS_TYPE;
    function Generate() {
        this.init({
            width:"auto",
            height:"100%"
        });
    }
    Generate.prototype={
        construct:Generate,
        init:function (paintingConfigs) {
            paintingConfigs = paintingConfigs || {};
            this._rootKey = "-1";
            this._isShowBgColor = true;
            this._LayoutRender = null;
            this._LayoutComponentsMap = null;
            this._componentRender = null;
            this._componentListMap = null;
            this._projectRender = null;
            this._projectMap = null;
            this._componentListConfigs = [];
            this._projectConfigs = [];
            this._layoutViewConfigs = [
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":1,
                    "configs":
                        {
                            "element": {
                                "key":-1,"bgColor":"#ddd117","parentKey":null,"width":"100%","height":"100%"}
                        }
                },
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":2,
                    "configs":
                        {
                            "element":
                                {
                                    "key":1,"bgColor":"#a1dd28","parentKey":-1,"width":"100%","height":"0px"
                                }
                        }
                },
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":3,
                    "configs":
                        {
                            "element":
                                {
                                    "key":2,"bgColor":"#ddc710","parentKey":-1,"width":"100%","height":"auto"
                                }
                        }
                },
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":4,
                    "configs":
                        {
                            "element":
                                {
                                    "key":3,"bgColor":"#dd574a","parentKey":2,"width":"260px","height":"100%"
                                }
                        }
                },
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":5,
                    "configs":
                        {
                            "element":
                                {
                                    "key":5,"bgColor":"#ccc","parentKey":2,"width":"auto","height":"100%",overflowX:"auto",overflowY:"auto"
                                }
                        }
                },
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":6,
                    "configs":
                        {
                            "element":
                                {
                                    "key":4,"bgColor":"#fff","parentKey":5,"width":paintingConfigs.width || "100%","height":paintingConfigs.height ||"auto",leaf:true
                                }
                        }
                },
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":7,
                    "configs":
                        {
                            "element":
                                {
                                    "key":6,"bgColor":"#2A2E36","parentKey":3,"width":"60px","height":"100%"
                                }
                        }
                },
                {
                    "type":sources.COMPONENTS_TYPE.CONTENT,
                    "sortNumber":8,
                    "configs":
                        {
                            "element":
                                {
                                    "key":7,"bgColor":"#dd574a","parentKey":3,"width":"200px","height":"100%"
                                }
                        }
                },
            ];
        },
        _dragComponentList:function (container) {
            var self = this;
            new Sortable(container, {
                group: {
                    name: 'content',
                    pull: 'clone',// To clone: set pull to 'clone'
                    put: false
                },
                onClone:function (e) {
                    var element = JSON.parse(e.item.getAttribute("data-element"));
                    var allConfigs = self._projectMap.componentMapToConfig();
                    allConfigs.forEach(function (item) {
                        item.configs.element.put = true;
                        if(element.type !== TYPES.SUSPENSION){
                            if(item.configs.element.leaf){
                                item.configs.element.put = true;
                            }
                        }else{
                            item.configs.element.put = true;
                        }
                    });
                    // console.log(allConfigs)
                    self._projectMap.changeConfig(allConfigs);
                    self._projectRender.render(true);
                },
                sort: false,
                animation: 150
            });
        },
        _doRenderWork:function (name,configs,rootKey,container,isPreview) {
            components.componentsMaps.createMaps([{name:name,config:configs}]);
            var componentsMap  = components.componentsMaps.getMap(name);
            var render = new Render(componentsMap,rootKey,container,this._isShowBgColor);
            render.render(!!isPreview);
            return ({componentsMap:componentsMap,render:render});
        },
        renderLayout:function (configs) {
            var self = this;
            configs = configs || {};
            var rootId = configs.rootId || "root";
            var rootKey = configs.rootKey || new Date().getTime().toString();
            this._layoutRootKey = rootKey;
            this._layoutViewConfigs.forEach(function (item) {
                if(item.configs.element.key==-1){
                    item.configs.element.key = rootKey;
                }
                if(item.configs.element.parentKey==-1){
                    item.configs.element.parentKey= rootKey;
                }
            })
            // debugger
            var obj = this._doRenderWork("previewLayout",this._layoutViewConfigs,this._layoutRootKey,document.getElementById(rootId));
            this._LayoutComponentsMap=obj.componentsMap;
            this._LayoutRender = obj.render;
        },
        renderComponentClazzList:function(data,configs){
            if(!this._LayoutComponentsMap){throw new Error("请先render layout!");}
            configs = configs || {};
            var self = this;
            var rootKey = new Date().getTime().toString();
            var clazzList = [ {
                "type":sources.COMPONENTS_TYPE.CONTENT,
                "sortNumber":0,
                "configs":
                    {
                        "element": {
                            "key":rootKey,"parentKey":null,"width":"100%","height":"100%",dropComponent:false,bgColor:"#1C1E24"}
                    }
            }];
            var showIndex = 1;
            data.forEach(function (item) {
                clazzList.push({
                    "type":sources.COMPONENTS_TYPE.SHOW,
                    "sortNumber":showIndex++,
                    "configs":{
                        "element":{
                            "key":new Date().getTime().toString()+showIndex,
                            "parentKey":rootKey,
                            "color":configs.color || "#BECAD5",
                            "bgColor":configs.bgColor || "rgb(75, 77, 81)",
                            configs:item.configs,
                            allHeight:30,
                            textShow:true,
                            // url:item.url,
                            text:item.text
                        }
                    }//配置
                });
            });
            var listContent = this._LayoutComponentsMap.getComponent(6);
            var obj  = this._doRenderWork("clazzList",clazzList,rootKey,listContent.getContainer());
          //  this._componentListMap=obj.componentsMap;
           // this._componentRender = obj.render;
            var rootComponent = obj.componentsMap.getComponent(rootKey);
            this._dragComponentList(rootComponent.getContainer());
            event.addHandle(TYPES.SHOW,"clickClazz",function (configs) {
                 self.renderComponentList(configs,{canDrag:true});
            })
            //clickClazz
        },
        _toShowConfig:function (data,configs,rootKey) {
            var _componentListConfigs = [ {
                "type":sources.COMPONENTS_TYPE.CONTENT,
                "sortNumber":0,
                "configs":
                    {
                        "element": {
                            "key":rootKey,"parentKey":null,"width":"100%","height":"100%",dropComponent:true,overflowY:"auto",bgColor:"#1C1E24"}
                    }
            }];
            var showIndex = 1;
            data.forEach(function (item) {
                _componentListConfigs.push({
                    "type":sources.COMPONENTS_TYPE.SHOW,
                    "sortNumber":showIndex++,
                    "configs":{
                        "element":{
                            "key":new Date().getTime().toString()+showIndex,
                            "parentKey":rootKey,
                            "color":configs.color || "#BECAD5",
                            "bgColor":configs.bgColor || "rgb(75, 77, 81)",
                            "width":"auto",
                            imgShow:true,
                            textShow:true,
                            url:item.url,
                            text:item.text,
                            data:item.data
                        }
                    }//配置
                });
            });
            return _componentListConfigs;
        },
        renderComponentList:function (data,configs) {
            if(!this._LayoutComponentsMap){throw new Error("请先render layout!");}
            configs = configs || {};
            var self = this;
            var rootKey = new Date().getTime().toString();
            this.componentListRootKey = rootKey;
            this._componentListConfigs =this._toShowConfig(data,configs,rootKey);

            var listContent = this._LayoutComponentsMap.getComponent(7);
            listContent.getContainer().innerHTML ="";
            var obj  = this._doRenderWork("componentList",this._componentListConfigs,rootKey,listContent.getContainer());
            this._componentListMap=obj.componentsMap;
            this._componentRender = obj.render;
            var rootComponent = this._componentListMap.getComponent(rootKey);
            if(configs.canDrag){
                this._dragComponentList(rootComponent.getContainer());
            }
        },
        getProjectConfigs:function () {
            return this._projectMap.componentMapToConfig();
        },
        render:function (configs,options,rootKey) {
            if(configs.length>0){
                this._projectConfigs=configs;
                var _rootKey = "";
                for(var i=0,len=configs.length;i<len;i++){
                    var element = configs[i].configs.element;
                    if(element.parentKey=== null || element.parentKey=="null"){
                        _rootKey = element.key;
                    }
                }
                this._rootKey = _rootKey;
            }else{
                this._rootKey = rootKey || new Date().getTime().toString();
                if(!this._LayoutComponentsMap){throw new Error("请先render layout!");}
                this._projectConfigs = [
                    {
                        "type":sources.COMPONENTS_TYPE.CONTENT,
                        "sortNumber":1,
                        "configs":
                            {
                                "element": {"key":this._rootKey,"bgColor":"#fff","parentKey":null,"width":"100%","height":"100%"}
                            }
                    }
                ];
            }

            var projectComponent = this._LayoutComponentsMap.getComponent(4);
            var obj  = this._doRenderWork("project",this._projectConfigs, this._rootKey,projectComponent.getContainer(),true);
            this._projectMap=obj.componentsMap;
            this._projectRender = obj.render;
        },
        changeBgColor:function (bgColor) {
            if(!this._LayoutComponentsMap){throw new Error("请先render layout!");}
            var component = this._projectMap.getComponent(this._rootKey);
            component._currentElement.bgColor = bgColor;
            this.flushPreview();
        },
        getPreviewJsonData:function (filters) {
            filters = filters || [];
          return this._projectMap.componentMapToConfig(null,filters);
        },
        flushPreview:function(){
            this._projectRender.repaint(this._rootKey,true);
        },
        isShowBgColor:function (isShowBg) {
            this._isShowBgColor = isShowBg;
            this._projectRender.isShowBgColor(this._isShowBgColor);
            this._projectRender.repaint(this._rootKey,true);
            // this._rootKey
        },
        show:function(configs,container){
            if(configs.length>0){
                var rootKey = "";
                for(var i=0,len=configs.length;i<len;i++){
                    var element = configs[i].configs.element;
                    if(element.parentKey=== null || element.parentKey=="null"){
                        rootKey = element.key;
                    }
                }
                this._isShowBgColor = false;
                this._doRenderWork("project",configs, rootKey,container,false);
            }


            //this._doRenderWork(name,configs,rootKey,container,isPreview);
        }
        // getContentDom:function () {
        //     return this._LayoutComponentsMap?this._LayoutComponentsMap.getComponent(4):null;
        // }
    }
    nameSpace.Generate = {
        generate:new Generate
    }

})(window.YT.DataView);