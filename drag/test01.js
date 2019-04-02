// /**
//  * @author chaohui jiang
//  * @version:v1.1.0
//  */
// console.log(window)
//
// //
// // new Sortable(example2Right, {
// //     group: 'shared',
// //     animation: 150
// // });
// var common = window.ytLayout.common;
// var Com = window.ytLayout.Com;
// var componentMap = window.ytLayout.Com.componentMap;
// var Com = window.ytLayout.Com;
// // var CustomComponent
// var PositionComponent = window.ytLayout.Com.PositionComponent;
// var render = window.ytLayout.Render.render;
// function previewLayout(componentListData) {
//      componentListData.forEach(function (item) {
//         item.width="100%";
//         item.height="40px";
//         item.parentKey = 1;
//         setTimeout(function () {
//             item.dom.innerHTML=item.show.name;
//         },0);
//         componentMap().addComponent(item);
//     })
//     var componentList = componentMap().getComponent(1);
//     var sysComponent = componentMap().getComponent(2);
//     new Sortable(componentList.dom, {
//         group: {
//             name: 'shared',
//             pull: 'clone' // To clone: set pull to 'clone'
//         },
//         sort: false,
//         animation: 150,
//     });
//     var colors = [
//         "#19dd28",
//         "#a5dd20",
//         "#ddca35",
//         "#dd854f",
//         "#dd4c4b",
//         "#dd5faf",
//         "#a743dd",
//         "#5641dd",
//         "#64a7dd",
//         "#dd99c7",
//         "#9caadd"
//     ];
//     dropDom(sysComponent.dom);
//     function dropDom(dom) {
//         new Sortable(dom, {
//             group: 'shared', // set both lists to same group
//             filter: ".ignore-elements",
//             animation: 150,
//             onAdd:function (e) {
//                 var target = e.item;
//                 console.log(target.getAttribute("data-key"))
//                 if(target){
//                     target.parentNode.removeChild(target)
//                 }
//                 render(componentMap().getComponent(-1),sysComponent.dom);
//             }
//         });
//     }
// }
// // previewLayout([Com.Component({key:"list1",show:{name:"容器组件"}})]);
// // componentMap.addComponent(Component({key:common.getKey(),parentKey:common.rootKey,width:'100%',height:'80px'}));//3
// // //
// //  componentMap.addComponent(Component({key:common.getKey(),parentKey:2,width:'200px',height:'100%'}));
// //  componentMap.addComponent(Component({key:common.getKey(),parentKey:2,width:'auto',height:'100%'}));
// // componentMap.addComponent(Component({key:common.getKey(),parentKey:2,width:'10%',height:'100%'}));
// // //
// // componentMap.addComponent(Component({key:common.getKey(),parentKey:5,width:'30px',height:'100%'}));
// // componentMap.addComponent(Component({key:common.getKey(),parentKey:5,width:'60px',height:'100%'}));
// // componentMap.addComponent(Component({key:common.getKey(),parentKey:5,width:'auto',height:'100%'}));
// // // componentMap.addComponent(PositionComponent({key:common.getKey(),parentKey:5,width:'60px',height:'100px',top:"20px",left:"100px"}));
// //
// // console.log(componentMap.getComponent(-1));
//
//
// // component1.dom.innerHTML="<div>Item 1</div><div>Item 2</div><div>Item 3</div>";
//
// // componentMap().addComponent(Com.Component({key:1,parentKey:common.rootKey,width:'200px',height:'100%'}));//1
// // componentMap().addComponent(Com.Component({key:2,parentKey:common.rootKey,width:'auto',height:'100%'}));//2
// // componentMap().addComponent(Com.Component({key:3,parentKey:2,width:'100px',height:'50px'}));//2
// // componentMap().addComponent(Com.Component({key:4,parentKey:2,width:'300px',height:'100px'}));//2
// // componentMap().addComponent(Com.Component({key:5,parentKey:2,width:'500px',height:'100px'}));//2
// //
// // render(componentMap().getComponent(-1),document.getElementById("root"));
// // var d = componentMap().getComponent(2).dom;
// // new Sortable(d, {
// //     group: 'shared',
// //     animation: 150
// // });
//
var sources = window.ytDataView.sources;
var components = window.ytDataView.components;
var Render = window.ytDataView.Render;
var configs = [
    {
        "type":"content",
        "sortNumber":1,
        "configs":
            {
                "element": {
                    "$type":"content","key":-1,"bgColor":"#ddd117","parentKey":null,"width":"100%","height":"100%"}
            }
    },
    {
        "type":"content",
        "sortNumber":2,
        "configs":
            {
                "element":
                    {
                        "$type": "content", "key":1,"bgColor":"#dd574a","parentKey":-1,"width":"200px","height":"100%"
                    }
            }
    },
    {
        "type":"content",
        "sortNumber":3,
        "configs":
            {
                "element":{
                    "$type":"content","key":3,"bgColor":"#dd854f","parentKey":1,"width":"50px","height":"50px"
                }
            }
    },
    {
        "type":"content",
        "sortNumber":3,
        "configs":
            {
                "element":
                    {
                        "$type":"content","key":2,"bgColor":"#cc3fdd","parentKey":-1,"width":"auto","height":"100%"
                    }
            }
    },
    {
        "type":"content",
        "sortNumber":4,
        "configs":
            {
                "element":
                    {
                        "$type":"content","key":4,"bgColor":"#547fdd","parentKey":"2","width":"20%","height":"100%"
                    }
            }
    }]
 configs = [{"type":"content","sortNumber":1,"configs":{"element":{"$type":"content","key":-1,"bgColor":"#fff","parentKey":null,"width":"100%","height":"100%","overflowX":"hidden","overflowY":"hidden","dropComponent":false}}},{"type":"content","sortNumber":2,"configs":{"element":{"$type":"content","key":1,"bgColor":"#104bb5","parentKey":"-1","width":"auto","height":"auto","overflowX":"hidden","overflowY":"hidden","dropComponent":false}}},{"type":"content","sortNumber":3,"configs":{"element":{"$type":"content","key":2,"bgColor":"#a8a2f","parentKey":"1","width":"auto","height":"auto","overflowX":"hidden","overflowY":"hidden","dropComponent":false}}}];
components.componentsMaps.createMaps([{name:"layout",config:configs}]);
var LayoutComponentsMap = components.componentsMaps.getMap("layout");
var layout = new Render(LayoutComponentsMap,"-1",document.getElementById("root"));
layout.render(true);
function setConfig() {
    LayoutComponentsMap.changeConfig(JSON.parse(document.getElementById("showConfigs").value));
    layout.repaint("-1",true);
}
function getConfig() {
    document.getElementById("showConfigs").value=JSON.stringify(LayoutComponentsMap.componentMapToConfig());
}
function see() {
    layout.render(false);
}
// var c = LayoutComponentsMap.componentMapToConfig();
// console.log(c)
// LayoutComponentsMap.addComponent(sources.COMPONENTS_TYPE.CONTENT,{element:{
//     key:-1,parentKey:null,width:'100%',height:'100%',bgColor:"#ddd117"
// },componentMap:LayoutComponentsMap});
// LayoutComponentsMap.addComponent(sources.COMPONENTS_TYPE.CONTENT,{element:{
//     key:1,parentKey:-1,width:'200px',height:'100%',bgColor:"#dd574a"
// },componentMap:LayoutComponentsMap});
// LayoutComponentsMap.addComponent(sources.COMPONENTS_TYPE.CONTENT,{element:{
//     key:3,parentKey:1,width:'50px',height:'50px',bgColor:"#dd854f"
// },componentMap:LayoutComponentsMap});
// LayoutComponentsMap.addComponent(sources.COMPONENTS_TYPE.CONTENT,{element:{
//     key:2,parentKey:-1,width:'auto',height:'100%',bgColor:"#cc3fdd"
// },componentMap:LayoutComponentsMap});
//
// LayoutComponentsMap.addComponent(sources.COMPONENTS_TYPE.CONTENT,{element:{
//     key:4,parentKey:2,width:'20%',height:'100%',bgColor:"#547fdd"
// },componentMap:LayoutComponentsMap});
// console.log(LayoutComponentsMap._map)
