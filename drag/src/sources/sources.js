/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
window.YT = window.YT || {};
window.YT.DataView = window.YT.DataView || {};
(function (nameSpace) {
    nameSpace.sources =  nameSpace.sources || {};
    var COMPONENTS_TYPE = Object.freeze({
        CONTENT:"content",
        CUSTOM:"custom",
        SHOW:"show",
        LAYOUT:"layout",
        ROW:"row",
        COL:"col",
        SUSPENSION:"suspension",
        CONTENTS:"contents",
        PAGES:"pages",
    });
    /**
     * 匹配注入
     * @constructor
     */
    function ElementMap() {
        this._componentsMap = {};
    }
    ElementMap.prototype={
        constructor:ElementMap,
        register:function (key,func) {
            if(!this._componentsMap[key]){
                this._componentsMap[key] = func;
            }
            return this;
        },
        getElement:function (key,params) {
            var clazz = null;
            if(this._componentsMap[key]){
                clazz = this._componentsMap[key](params);
            }
            return clazz;
        }
    }
    var _elementMap = new ElementMap();

    /**
     *
     * @param config
     * @returns {{$type: string, put: boolean, key: null, bgColor: null, parentKey: null, width, height, overflowX: string, overflowY: string, dropComponent: boolean, child: Array, handles: boolean, _configure: {}, rootKey: string, leaf: boolean, background: string}}
     * @constructor
     */
    function Content(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.CONTENT,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            bgColor:config.bgColor || null,
            parentKey:config.parentKey || null,
            width:config.width,
            height:config.height,
            overflowX:config.overflowX || "hidden",
            overflowY:config.overflowY || "hidden",
            dropComponent:config.dropComponent || false,
            child:config.child || [],
            handles:config.handles || false,
            _configure:config._configure || {},
            rootKey:config.rootKey || "",
            leaf:config.leaf || false,
            background:config.background || "",
            // text:config.text || "",
            isShow:typeof config.isShow ==="boolean"?config.isShow:true,
            _type:config._type||"",
            contentsKey:config.contentsKey||"",
        };
        // if(config.shows){
        //     config.shows.type = config.shows.type || "div";
        //     element.shows = config.shows;
        // }
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.CONTENT,Content);

    function Contents(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.CONTENTS,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            bgColor:config.bgColor || null,
            parentKey:config.parentKey || null,
            height:config.height || "100%",
            width:config.width || "100%",
            overflowX:config.overflowX || "hidden",
            overflowY:config.overflowY || "hidden",
            dropComponent:config.dropComponent || false,
            child:config.child || [],
            handles:config.handles || false,
            _configure:config._configure || {},
            rootKey:config.rootKey || "",
            leaf:config.leaf || false,
            background:config.background || "",
            contentsNumber:config.contentsNumber || 2,
            currentIndex:config.currentIndex || 1,
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.CONTENTS,Contents);
    /**
     *
     * @param config
     * @returns {{$type: string, put: boolean, key: null, parentKey: null, width, margin: string, imgShow: boolean, textShow: boolean, textHeight: *, allHeight: (*|number), bgColor: null, color: null, text: string, url: string, data: {}, configs: Array, rootKey: string}}
     * @constructor
     */
    function Show(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.SHOW,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            parentKey:config.parentKey || null,
            width:config.width,
            margin:config.margin || "5px",
            imgShow:config.imgShow || false,
            textShow:config.textShow || false,
            textHeight:config.textHeight,
            allHeight:config.allHeight,
            bgColor:config.bgColor || null,
            color:config.color || null,
            text:config.text || "",
            url:config.url || "",
            data:config.data || {},
            configs:config.configs || [],
            rootKey:config.rootKey || ""
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.SHOW,Show);

    /**
     *
     * @param config
     * @returns {{$type: string, put: boolean, key: null, parentKey: null, width, height, child: Array, rootKey: string, appCom: {}, component: {}, propsGlobal: {width: string, height: string, margin: string, padding: string, background: string}, leaf: boolean}}
     * @constructor
     */
    function Custom(config) {
        config = config || {};
        config.propsGlobal = config.propsGlobal || {};
        var element = {
            $type:COMPONENTS_TYPE.CUSTOM,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            parentKey:config.parentKey || null,
            width:config.width,
            height:config.height,
            child:config.child || [],
            rootKey:config.rootKey || "",
            appCom:config.appCom || {},//组件数据
            component:config.component || {},//组件数据结构
            contentsKey:config.contentsKey || "",
            propsGlobal:{
                width:config.propsGlobal.width || "100%",
                height:config.propsGlobal.height || "100%",
                margin:config.propsGlobal.margin || "0",
                padding:config.propsGlobal.padding || "0",
                background:config.propsGlobal.background || "",
            },//样式属性
            leaf:config.leaf || false,
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.CUSTOM,Custom);

    /**
     *
     * @param config
     * @returns {{$type: string, put: boolean, key: null, parentKey: null, rootKey: string, child: Array, leaf: boolean}}
     * @constructor
     */
    function Layout(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.LAYOUT,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            parentKey:config.parentKey || null,
            rootKey:config.rootKey || "",
            // data:config.data || {},//组件数据结构
            child:[],
            leaf:config.leaf || false,
            // background:config.background || ""
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.LAYOUT,Layout);

    function Pages(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.PAGES,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            parentKey:config.parentKey || null,
            rootKey:config.rootKey || "",
            // data:config.data || {},//组件数据结构
            child:[],
            leaf:config.leaf || false,
            // background:config.background || ""
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.PAGES,Pages);
    /**
     *
     * @param config
     * @returns {{$type: string, put: boolean, key: null, parentKey: null, height: string, width, currentNumber: number, splitNumber: [number,number,number], bgColor: null, overflowX: string, overflowY: string, dropComponent: boolean, child: Array, handles: boolean, _configure: {}, rootKey: string, leaf: boolean, background: Array}}
     * @constructor
     */
    function Row(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.ROW,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            parentKey:config.parentKey || null,
            height:"100%",
            width:config.width,
            currentNumber:config.currentNumber||0,
            splitNumber:config.splitNumber || [1,1,1],
            bgColor:config.bgColor || null,
            overflowX:config.overflowX || "hidden",
            overflowY:config.overflowY || "hidden",
            dropComponent:config.dropComponent || false,
            child:config.child || [],
            handles:config.handles || false,
            _configure:config._configure || {},
            rootKey:config.rootKey || "",
            leaf:config.leaf || false,
            background:config.background || []
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.ROW,Row);

    /**
     *
     * @param config
     * @returns {{$type: string, put: boolean, key: null, parentKey: null, width: string, height, currentNumber: number, splitNumber: [number,number,number], bgColor: null, overflowX: string, overflowY: string, dropComponent: boolean, child: Array, _configure: {}, rootKey: string, leaf: boolean, background: Array}}
     * @constructor
     */
    function Col(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.COL,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            parentKey:config.parentKey || null,
            width:"100%",
            height:config.height,
            currentNumber:config.currentNumber||0,
            splitNumber:config.splitNumber || [1,1,1],
            bgColor:config.bgColor || null,
            overflowX:config.overflowX || "hidden",
            overflowY:config.overflowY || "hidden",
            dropComponent:config.dropComponent || false,
            child:config.child || [],
            _configure:config._configure || {},
            rootKey:config.rootKey || "",
            leaf:config.leaf || false,
            background:config.background || []
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.COL,Col);

    /**
     *
     * @param config
     * @returns {{$type: string, put: boolean, key: null, parentKey: null, zIndex: number, data: {}, width, height, top: string, left: string, bottom: string, right: string, bgColor: null, overflowX: string, overflowY: string, dropComponent: boolean, child: Array, _configure: {}, rootKey: string, leaf: boolean, background: string}}
     * @constructor
     */
    function Suspension(config) {
        config = config || {};
        var element = {
            $type:COMPONENTS_TYPE.SUSPENSION,
            put:typeof config.put === "boolean"?config.put:true,
            key:config.key||null,
            parentKey:config.parentKey || null,
            zIndex: config.zIndex ||99,
            data:config.data || {},//组件数据结构
            width:config.width,
            height:config.height,
            top:config.top || "",
            left:config.left ||"",
            bottom:config.bottom || "",
            right:config.right ||"",
            bgColor:config.bgColor || null,
            overflowX:config.overflowX || "hidden",
            overflowY:config.overflowY || "hidden",
            dropComponent:config.dropComponent || false,
            child:config.child || [],
            _configure:config._configure || {},
            rootKey:config.rootKey || "",
            leaf:config.leaf || false,
            background:config.background || ""
        };
        return element;
    }
    _elementMap.register(COMPONENTS_TYPE.SUSPENSION,Suspension);
    nameSpace.sources={
        COMPONENTS_TYPE:COMPONENTS_TYPE,
        Content:Content,
        Custom:Custom,
        Row:Row,
        Col:Col,
        Suspension:Suspension,
        elementMap:_elementMap,
    }
})(window.YT.DataView);