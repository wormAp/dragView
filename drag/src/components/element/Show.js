/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    var createNativeElement = nameSpace.utils.createNativeElement;
    var event = nameSpace.event;

    function Show(config) {
        config = config || {};
        this._currentElement = config.element;
        this._componentMap = config.componentMap;
        this._renderClazz = null;
        this._dom = null;
    }
    Show.prototype={
        constructor:Show,
        getCurrentDom:function () {
            return  this._dom;
        },
        render:function (renderClazz,isPreview) {
            var self = this;
            this._renderClazz = renderClazz;
            var textHeight = this._currentElement.textHeight || 30;
            var allHeight=this._currentElement.allHeight || 200;
            var dom = createNativeElement("div",{
                styles:{
                    // height:height,
                    cursor: "pointer",
                    width:"100%",
                    height:allHeight+"px",
                    // margin:this._currentElement.margin,
                    marginBottom:this._currentElement.margin,
                    color:this._currentElement.color,
                    background:this._currentElement.bgColor
                },
                attrs:{
                    "data-element":JSON.stringify(this._currentElement.data)
                },
                handles:{
                    onclick:function () {
                        if(self._currentElement.configs.length>0){
                            var callBacks = event.getCallBacks(COMPONENTS_TYPE.SHOW,"clickClazz");
                            callBacks.forEach(function (callBack) {
                                callBack.call(self,self._currentElement.configs)
                            })
                        }
                    }
                }
            });

            if(this._currentElement.imgShow){
                var ImgContent = createNativeElement("div",{
                    styles:{
                        height:this._currentElement.textShow?allHeight-textHeight+"px":allHeight+"px",
                    },
                });
                var Img = createNativeElement("img",{
                    styles:{
                        height:"100%",
                        width:"100%",
                    },
                    attrs:{
                        src:this._currentElement.url
                    }
                });

                ImgContent.appendChild(Img);
                dom.appendChild(ImgContent);
            }

            if(this._currentElement.textShow){
                var text = createNativeElement("div",{
                    styles:{
                        height:textHeight+"px",
                        lineHeight:textHeight+"px",
                        textAlign:"center"
                    }
                });
                text.innerHTML= this._currentElement.text;
                dom.appendChild(text);
            }

            this._dom = dom;
            return dom;
        }
    }
    injection.register(COMPONENTS_TYPE.SHOW,Show);
    nameSpace.components.Show = Show;
})(window.YT.DataView);