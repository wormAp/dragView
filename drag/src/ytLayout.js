(function(){
    // window.YT = window.YT || {};
    // window.YT.DataView = window.YT.DataView || {};
    var fileName = "ytLayout"
    var getScriptLocation = function(matchName) {
        var r = new RegExp("(^|(.*?\\/))("+matchName+"[^\\/]*?\\.js)(\\?|$)"),
            s = document.getElementsByTagName('script'),
            src, m, l = "";
        for(var i=0, len=s.length; i<len; i++) {
            src = s[i].getAttribute('src');
            if(src) {
                m = src.match(r);
                if(m) {
                    l = m[1];
                    break;
                }
            }
        }
        return l;
    };
    /*
     * ��̬����js�ļ�
     *
     * */
    var loadJs = function(jsFiles,Location){
        var _css = new RegExp(".css$");
        var scriptTags = new Array(jsFiles.length);
        var host = Location || "";
        for (var i=0, len=jsFiles.length; i<len; i++) {
            var fileName = jsFiles[i];
            var m = fileName.match(_css);
            if(m){
                scriptTags[i] ="<link rel='stylesheet' href='" + host + fileName +
                    "'/>";
            }else{
                scriptTags[i] = "<script src='" + host + fileName +
                    "'></script>";
            }
        }
        if (scriptTags.length > 0) {
            document.write(scriptTags.join(""));
        }
    };
    var webgl;
    try {
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl');
        webgl = gl && gl instanceof WebGLRenderingContext;
    } catch (err) {
        webgl = false;
    }
    canvas=null;
    var jsFiles = [];
    jsFiles=[
        "ytLayout.css",
        "Sortable.js",
        "sources/sources.js",
        "components/func.js",
        "components/util.js",
        "event/event.js",
        "components/injection.js",
        "components/element/RowCol.js",
        "components/element/Contents.js",
        "components/element/Suspension.js",
        "components/element/Content.js",
        "components/element/Custom.js",
        "components/element/Show.js",
        "components/element/Layout.js",
        "components/element/Pages.js",
        "components/components.js",
        "render/render.js",
        "generate/generate.js",
        "start.js"
        //
        // "common/util.js",
        // "common/Component.js",
        // "render/ComponentDom.js",
        //
    ];
    // if(webgl){
    //     //can webgl
    //     jsFiles=[
    //         "./src/common/util.js",
    //         "./src/common/Component.js",
    //     ];
    // }else{
    //     jsFiles=["./ytMapOL/ol/openlayer.min.js",'./ytMapOL/ytmap/map.min.js']
    // }
    loadJs(jsFiles,getScriptLocation(fileName));
})();