/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.utils =  nameSpace.utils || {};
    var handleSortableClass = "my-handle";
    // var key = 1;
    function getKey() {
        return "v"+Math.random().toString().replace(".","");
    }
    function canSortable(contentDom,injection) {
        var self = this;
        var _sortable = new Sortable(contentDom, {
            group:{
                name: 'content',
                put: self._currentElement.put
            },
            handle: "."+handleSortableClass,
            animation: 150,
            onAdd: function (/**Event*/evt) {
                var srcKey = evt.from.getAttribute("data-key");
                var targetKey= evt.to.getAttribute("data-key");
                var itemKey =  evt.item.getAttribute("data-key");
                var dropComponent = evt.from.getAttribute("data-dropcomponent");
                if(evt.item){evt.item.parentNode.removeChild(evt.item)}
                if(dropComponent === "true"){
                    var element = evt.item.getAttribute("data-element");
                    if(!element){return;}
                    var config = JSON.parse(element);
                    var configs = config.configs;
                    injection.getClazz(config.type).addComponent(self._componentMap,configs,srcKey,targetKey,itemKey);
                    //config.sortNumber = evt.newIndex;
                    // configs.componentMap = self._componentMap;
                    // configs.element.key = getKey();
                    // configs.element.parentKey = targetKey;
                    // configs.element.bgColor = getColor();//随机color
                    //configs.element.put = false;
                    //var _rules  = rules(self._componentMap.getComponent(targetKey),configs.element);
                    // if(_rules){
                    // }

                    //self._componentMap.addComponent(config.type,configs);
                }else {
                    // debugger
                    self._componentMap.moveComponent(srcKey, targetKey, itemKey);
                }
                var allConfigs = self._componentMap.componentMapToConfig();
                allConfigs.forEach(function (item) {
                    item.configs.element.put = false;
                });
                self._componentMap.changeConfig(allConfigs);
                self._renderClazz.repaint(self._renderClazz._rootKey,true);
                // console.log(JSON.stringify(self._componentMap.componentMapToConfig()),self._renderClazz._rootKey);
                // if(_rules){
                //
                // }
            }
        });
        return _sortable;
    }
    /**
     *
     * @param type
     * @param options{styles:{key:value},handles:{key:value},classNames:[],attrs:{}}
     */
    function createNativeElement(type,options) {
        options = options || {};
        var native = document.createElement(type);
        var styles = options.styles || {};
        var handles = options.handles || {};
        var attrs = options.attrs || {};
        var classNames = options.classNames || [];
        native.className = classNames.join(" ");
        for(var styleKey in styles){
            native.style[styleKey] = styles[styleKey];
        }
        for(var handleKey in handles){
            native[handleKey] = handles[handleKey];
        }
        for(var attrKey in attrs){
            native.setAttribute(attrKey,attrs[attrKey]);
        }
        return native;
    }
    function changeStyle(native,styles) {
        styles = styles || {};
        for(var styleKey in styles){
            native.style[styleKey] = styles[styleKey];
        }
    }
    function changeSortableOpt(components,opts,canMoveAll) {
        components.forEach(function (item) {
            if(canMoveAll){
                //所有级别课拖放
                item._sortable.option(opts.key,opts.value);
            }else if(!(item._currentElement.child && item._currentElement.child.length>0)){
                //只有最后一级可拖放
                item._sortable.option(opts.key,opts.value);
            }
            if(item._currentElement.child && item._currentElement.child.length>0){
                changeSortableOpt(item._currentElement.child,opts);
            }
        })
    }
    function resizeHandles(ev,dom,type) {
        var self = this;
        var oevent = ev || event;
        oevent.stopPropagation();
        var startX = oevent.clientX;
        var startY = oevent.clientY;
        var parentContainer = self._componentMap.getComponent(self._currentElement.parentKey).getContainer();
        var startTop = parseFloat(dom.style.top);
        var startLeft = parseFloat(dom.style.left);
        var startBottom = parseFloat(dom.style.bottom);
        var startRight = parseFloat(dom.style.right);

        document.onmousemove = function(ev){
            var oevent = ev || event;
            var disWidth = oevent.clientX-startX;
            var disHeight = oevent.clientY-startY;
            var leftRight = 0;
            var bottom = startBottom-disHeight;
            if(type==="right"){
                leftRight = startRight-disWidth;
                dom.style.right = leftRight+"px";
            }else{
                leftRight = startLeft+disWidth;
                dom.style.left = leftRight+"px";
            }
            self._currentElement.width = dom.offsetWidth+"px";
            dom.style.bottom = bottom+"px";
            self._currentElement.height = parentContainer.offsetHeight-bottom-startTop+"px";
        }
        document.onmouseup = function(){
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
    function Minx(_prototype,props) {
        for(var key in props){
            if(props.hasOwnProperty(key)){
                _prototype[key] = props[key];
            }
        }
    }
    function createTool(type,handle) {
        // var selectKey = this._renderClazz._getSelectComponentKey();
        // console.log(selectKey)
        // if(selectKey!==this.getCurrentElement().key){
        //     var toolDom = createNativeElement("span");
        //     return toolDom;
        // }
        var handles = {};
        handle= handle || null;
        var self = this;
        var styles = {
            position:"absolute",
            zIndex:20,
        };
        var classNames = [];
        var attrs = {};
        switch(type){
            case "move":
                styles.background="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAB0ElEQVQ4T63UO6iPcRzH8deHMoiQYnEpQik5C5NiM0iS60JnMEhJnNxyiSwuIQkZCIMMDChlwEku5ZIMBjIoE1JGKX766f/Xief8Tye+9dQzPM/7e/l8vt/4z5HKK6WMxhbMw5B+cnzF9SRnOtXQBh7FKpzHj35+GIGNWJHkRn/QNvAuHibZ0yl7KeUQnia5OhCwF71J9v3rSNsV/gaWUmbiJt5jV5KHg0nSBNyJtVWAllA9SU62oaWUOstx2IDpOJakFvQrmoBzcQ9TUd+vYRGm4FsFYBQ+4w6WYUGSB43Alo0qZFiSxaWUA9iNtxiLxziCkUlullJuY3ySrk7AiXiNNa3Wn6M+22tXST72GcE0vMGcJM/+arnPh1vRgxmoQs1PcrBJoFLKE9yqLukEHIpXeJBk3QD+vFgXLkl3kyjDsb+2gNp6FaNWd78/aMvwXUkWNgFX4yyW16ytlXyR5HQH4AlMSrK0CTgBL1HXa2+SDwMZu5RyBV+SrG+cYSllMg5jScuHp5I86lDhJnxKcrnjcSilzMIO1DFUgWprF5J8H+g4HMdKnGudr3rCLiV51zJ6FWYbujE7SfVoY7QrHIPNfxzYk0nqxgwqfgH/Z/wEAifmFURXuRIAAAAASUVORK5CYII=)";
                styles.width = "20px";
                styles.height = "20px";
                styles.left="20px";
                styles.cursor = "move";
                attrs.title = "同级移动";
                handles={
                    onmousedown:function (ev) {
                        var dom = self._dom;
                        var oevent = ev || event;
                        oevent.stopPropagation();
                        var distanceX = oevent.clientX - dom.offsetLeft;
                        var distanceY = oevent.clientY - dom.offsetTop;
                        var parentContainer = self._componentMap.getComponent(self._currentElement.parentKey).getContainer();
                        document.onmousemove = function(ev){
                            var oevent = ev || event;
                            var disLeft = oevent.clientX - distanceX;
                            var disTop = oevent.clientY - distanceY;
                            var left = disLeft;
                            var top = disTop;
                            var bottom = 0;
                            var right = 0;
                            if(parentContainer){
                                right = (parentContainer.offsetWidth-disLeft-parseFloat(self._currentElement.width))+"px";
                                bottom=(parentContainer.offsetHeight-disTop-parseFloat(self._currentElement.height))+"px";
                            }
                            dom.style.left =  left+"px";
                            dom.style.right = right;
                            dom.style.bottom= bottom;
                            dom.style.top = top+"px";
                            self._currentElement.left = left;
                            self._currentElement.top = top;
                        };
                        document.onmouseup = function(){
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    }
                };
                break;
            case "crossMove":
                styles.background="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAw0lEQVQ4T+2UsQ3CMBBF/9+GkpoqOyB6esQCVFTUSCyQBZAYIRUzsM1Hts6SFWLnjEA0uDlHunsX+9838eHFwJO0B7AusK8kL96+CThYQYqpvgsbkjF6Vg4cSB7zIknhu/sDq1f5NVFOAFbWemHxYfFO8uBROE7EOFFSb6Oy9ULyvN8CPY5q+kNJs456B1h1VAm4BHCbECUI1dcsOgXcANgVFA6Nzk3A2qjYHbYd2QEMKcVn7uXIM8DcUePU6KgmoMc5T0VohhXgLkr/AAAAAElFTkSuQmCC)";
                styles.width = "18px";
                styles.height = "18px";
                styles.cursor = "move";
                attrs.title = "夸级移动";
                classNames.push(handleSortableClass);
                handles={
                    onmousedown:function () {
                        var opts = {
                            key:"group",
                            value:{name: 'content',put:true}
                        }
                        var component = self._componentMap.getComponent(self._renderClazz._rootKey);
                        changeSortableOpt(component._currentElement.child,opts);
                        //changeSortableOpt(component._currentElement.child,opts,true);
                        if(handle && handle instanceof Function){
                            handle.call(this);
                        }
                    }
                }
                break;
            case "delete":
                styles.background="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACFElEQVQ4T62US4jOYRTGf08uxY7MUJaSy0rElNtgaUzSZFLMToZiIwuXtUuyQ0iywEJEctnINZdci4SysaHMiLJg4fLofM7/03zfN/9vkrN83+d93vOc55wj/nNoMD7bI4FFwGJgWuJeAreA65K+N3pbR2h7GLAJ2Aa0Aj+B1/l4KhD3fcBuYL+kuK/GAELbQXAemAucAfYCz4psbI8AZgBbgG7gHrBCUnxQiSqh7VHAHWAS0CPpYll5bW8ADgJPgIWSvtUS7kqZ3ZIiu6Zhex1wJORL2l4ltD0GeA/ckLQ0LmyPTzMeSvqaZ6OBOcBzSZ/y7EoaNzHOKpJtrwZOAvMl3c2z+OQp8AJYnulGGaYDMyV9TlzUO96skXSqIDwEdEkKU6phezLwGDgORI1XAm2S3tTgwpRzktYXhJeAFklttYWz3Q5cA34B7ZLuN8A8APolLSsIQ0prCeHVJCkj7JPUWRAeTsktJZID25P1e1uD60/JvbWmLJAUvRhGFabEuHUmwQUgpmWWpC+Jm5f9O8CUscC7nNGOBE7Ix43a5pWkD4m7DCwB/rZNXsRsbgXWSjrWtKv/qOgCzgJ7JMXs143e7ZAD9Eo62mT0ogwngGih+tHLLMOUkDAbOA3sG2Q5bAZWAY+ADklhSiUara/hwEZgBzAO+JFZGJiS6+sjsBM4ICnuq/EvC/ZmzvzQFuxQzCjD/AY0F+oVuAzVRgAAAABJRU5ErkJggg==)";
                styles.width = "20px";
                styles.height = "20px";
                styles.top = "2px";
                styles.right = "2px";
                styles.cursor = "pointer";
                handles={
                    onclick:function (e) {
                        var key = this.parentNode.parentNode.getAttribute("data-key");
                        self._componentMap.removeComponent(key);
                        self._renderClazz.repaint(self._renderClazz._rootKey,true);
                        if(handle && handle instanceof Function){
                            handle.call(this);
                        }
                    }
                };
                break;
            case "rightResize":
                styles.width = "19px";
                styles.height = "19px";
                styles.cursor="se-resize";
                styles.bottom="0px";
                styles.right="0px";
                styles.background="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABSUlEQVQ4T7WUL0gdcBSFvw+cRbAIogaxGAWrL6wKgiKoOA0mg0EMA8MWRItYLEtiECwW/wQtCxs2sQqap8UtbKDBIAhH3lB5PhTe0/du/t3vd+85hys1LmvM4wmY5CPQq35L0gTMA5vqrySfgDt1J0k3MAmsqLdJPgPH6lFxuFLgF2BObU/SAvwFhtSDJLtAozqYpB/4DnSov5NcABvq0jNgrVavq4aLwIzaVs20Sf4Aa2qx/5mGXQ+6/Be30kpSAC7V8/pqmGQKGFCLEam4kuwAe+pW+coTwKg6UjENeFXDaiClb+thyqsuVx2bJB+AG2BWXX+3y0lGge2HG3DyZmCSVmAYWAYO1bFHXUuPwwIwrXYmaQaugRF1L8k+MPiCcT+BcfXfS8A+oKCuJmkAvgK76lmSYpR6SoBXwKn6o/yT+h2Ht+awvO8eEZWSFYZF6I4AAAAASUVORK5CYII=)";
                handles={
                    onmousedown:function (ev) {
                        resizeHandles.call(self,ev,self._dom,"right");
                    }
                };
                break;
            case "leftResize":
                styles.width = "19px";
                styles.height = "19px";
                styles.cursor="sw-resize";
                styles.bottom="0px";
                styles.left="0px";
                styles.background="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABTUlEQVQ4T7WUMUiUcRiHn2dpachwsSYXtwhnBxeFIDCoQUShUVx0EBwcBAMpZ0loMbilQ7QaXFpbxNU2p3S5QhpdAuEnnxxyd9zJ3fHdu37f/+F9n//v/0rJZck87oBJJoFxdSfJQ2ANqKi/k8wB1+phkjFgHthW/ydZBU7U46K5RuA6sKI+STIM/ANeqUdJvgIP1JkkL4AfwFP1T5IL4LP6rglY1ugDdbgJLKkjvXSb5C/wSS3ONzkcrXu5ldttJZkAaur5YB0meQu8VIuIdF1JDoFv6pfWkft1WC1ipFZKAbaO0hjsfjtsfylJFoFd4LF61a3E+2LzHDgFNtStboEdRy4+JDkAXhdQYE+97BXc9PTqS2EfmGoD+q6+STILFDf7qFCTpAZ8VN93DHaSaeAZMNQAPlOr9fW1AHyor69l4Jf6c7AvpVdXnf6/AZXwkxVFIrDyAAAAAElFTkSuQmCC)";
                handles={
                    onmousedown:function (ev) {
                        resizeHandles.call(self,ev,self._dom,"left");
                    }
                };
                break;
        }
        var toolDom = createNativeElement("span",
            {
                styles:styles,
                handles:handles,
                classNames:classNames,
            });
        return toolDom;
    }
    var colorIndex=-1;
    function getColor(isShowBgColor,bgColor) {
        var colors = [
            "#4E7CB077",
            "#0C7D9077",
            "#827D2977",
            "#859C7A77",
            "#169F4477",
            "#23669F77",
            "#9F1A2477",
            "#1A874277",
            "#729F2D77",
            "#9F056A77"
        ];
       if(isShowBgColor){
           if(bgColor){
               return bgColor;
           }
           if(colorIndex === colors.length){
               colorIndex=0;
           }else{
               colorIndex++;
           }
           return colors[colorIndex];
       }else{
           return null;
       }
    }
    function getClassNames(type) {
       return ["yt-dataView-content"];
    }
    nameSpace.utils = {
        Minx:Minx,
        getClassNames:getClassNames,
        changeSortableOpt:changeSortableOpt,
        createNativeElement:createNativeElement,
        changeStyle:changeStyle,
        createTool:createTool,
        getKey:getKey,
        getColor:getColor,
        canSortable:canSortable
    }
})(window.YT.DataView);