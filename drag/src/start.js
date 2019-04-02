/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.Face = nameSpace.Face || {};
    var sources = nameSpace.sources;
    var components = nameSpace.components;
    var Render =nameSpace.Render;
    var Generate = nameSpace.Generate;
    var event = nameSpace.event;
    var TYPES = sources.COMPONENTS_TYPE;
    var data = {
        clazz:[],
        componentConfigs:[],
    };
    function runPreview(componentConfigs,projectConfig) {
        componentConfigs = componentConfigs || [];
        projectConfig = projectConfig || [];
        var _componentConfigs =[
            {
                text:"布局组件",
                url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACqCAIAAABnBpeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUU2MkFCRjU0MkUwMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUU2MkFCRjQ0MkUwMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MTQwMzE1ZWMtNTUzMC00M2Y5LTk0ODYtODE0YTFiYzhlOTIxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PhJCJwAABWhJREFUeNrs299rm1UYwPFzurRN1/wwbW0t7WbXycZWJpYpCCpC9bLehYGIMAUvdu0fsAvBO71xd7sRioxB2ZV6Mx2IKF5MJpQxOly1ri2r1sY2/bm2O3tOzps3MX3b0mWLvm++H8ZIQpq85P3uOadJptsvX1XA49bASwDCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGhzsQWv75Sm2faHB3h5f7vz3f2XSYWWAoBwgJhgbAAwgJhgbAAwgJhgbAAwgJhgbAAwgJhgbBAWLwEICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFupDLHRH/M1rzXV1ht78fp2JBYR2YoX633H9zGYmFggLhAX2WHVh+Gn15V8Bt59qVccT6lhSd5TtZz4aN7lN73K2S7Uc0IMZezm/ob6bM8Pdes+nm1hSFyZN+S1DbepkUvcnvKvTq2o8bwIPibDC5NUOfTNvflurvH1s2f7JKtPRbHO59mflyR6dlb/MYEa72iRQ8eOcKdxurw512h+8tagu3jUuoNc7dPOB0iNkYur9w7qnxdb22R17DHLLOz1afvD5tLo0FXBULIXhIGOpqUGdTlf1IG6GxRtsQ66qQNfm7VRLxUpVnevzqpIZ5hqSh5LLcouMybOHdSZGWOH0QtoOFVnvHsuj3Vk2u99B2iotwZ3eIvvVbOVPuVuSjSrbrQkrlJ4r7GzkBMvoqt6Nxb3vs/7A/n0krtzmTHZU29c7uUWGljiRUi+nCCuE62DF6KqGLIL+vn4XH/9qp5G/+E7uMOTurXm3n0prwgrfOji2YOYKb9QPpGv61P7iO78RfIfxJe/C0QQTK2wkpm//VrfzdjbIFl5+a6uZVKN3YWWHIbe05V2QA4vYFj7iYUlGUyt28SrNhtbaLTpNxVd39n7wHco3Xk8RVohIRr+v2Fk1tqzcaiiLTqZe3rwjrCdDApKMfsh5V/3V8JVMjQ7g/gPvQlfT3nf+Z5OwQmIw5a2Dzs8L3oXjyRqthvLszsEdZuSReCnBXLTCivKq4D6b+3SgMqOeFjvM9nUi/dmzL/fWTH/CPntbY/Ad/EnmJ0hYIVgHpSr32Zzvg0P6ROGtyDfa//WxzFqxm3hD8FxZ33qUY5DfRl9ss4uvfd9hNuCtrN4W78L1nGGPFQ6Szvb3u8cWvPNX8fHOZHFgPBMPWCUHkmpq9VGOQYbi9Xn7jDu96e8OY2JJ/bSoCCscnm3V4/nKMSDnzy1qFWdafmecLqTTe7C07/En30sZ7Re5XzIXbxWieWvbB4JDbfYw8hvqi2kTvdc/mmFJNLKR8n8fLHezuIWv+HjnyoyRcyzL1tu92v/kTi6c67NVVTNRLt41N3K2oQ/7tV9ztksNd+u5dfX5HyZi2/Zo7rHcF/fcR2+yGsrc+mTCuMEjV0VncSANZtTqljdUVOG9yvO3jZxvWZ7OHNJnCvexi9S8Kf+2QvnG63TaPr67ejRhW5EVMzDBkRnzy4JN+b0+7/6SlP+lrkiKWljui3ujpZ2y8bc7xbNodl+5AnfZ20mIhQ2c2c+BmZEZVSf4zjsICyyFT1q9/Ud7JhYQzolVD/+5nokFEBYIC4QFEBYIC4QFEBYIC4QFEBYIC4QFEBYIC4QFEBYIC4QFEBYIC4QFEBYIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC4QFwgIIC/8fuv3yVV4FMLFAWCAsgLBAWCAsgLBAWCAsgLBAWCAsgLBAWCAsgLBAWCAsoEoPBRgA6oxqvTr3V5kAAAAASUVORK5CYII=",
                data: {
                    "type":sources.COMPONENTS_TYPE.LAYOUT,
                    // "sortNumber":4,
                    "configs":
                        {
                            "element":[
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
                                                    "key":1,"bgColor":"#4E7CB077","parentKey":-1,"width":"100%","height":"70px",
                                                    _configure:{
                                                        text:"上",
                                                        fields:[{key:"height",text:"高度"},{key:"background",text:"背景"}]
                                                    },leaf:true
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
                                                    "key":3,"bgColor":"#0C7D9077","parentKey":2,"width":"200px","height":"100%",overflowY:"auto",overflowY:"auto",
                                                    _configure:{
                                                        text:"中左",
                                                        fields:[{key:"width",text:"宽度"},{key:"background",text:"背景"}]
                                                    },leaf:true
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
                                                    "key":4,"bgColor":"#827D2977","parentKey":2,"width":"auto","height":"100%",overflowY:"auto",overflowY:"auto",leaf:true,
                                                    _configure:{
                                                        text:"中",
                                                        fields:[{key:"background",text:"背景"}]
                                                    }
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
                                                    "key":5,"bgColor":"#859C7A77","parentKey":2,"width":"200px","height":"100%",overflowY:"auto",overflowY:"auto",
                                                    _configure:{
                                                        text:"中右",
                                                        fields:[{key:"width",text:"高度"},{key:"background",text:"背景"}]
                                                    },leaf:true
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
                                                    "key":6,"bgColor":"#169F4477","parentKey":-1,"width":"100%","height":"70px",
                                                    _configure:{
                                                        text:"下",
                                                        fields:[{key:"height",text:"高度"},{key:"background",text:"背景"}]
                                                    },leaf:true
                                                }
                                        }
                                }
                            ]

                        }
                }
            },
            {
                text:"左右布局1",
                url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACqCAIAAABnBpeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUU2MkFCRjk0MkUwMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUU2MkFCRjg0MkUwMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMjVkMGNjYS04YWEwLTExN2MtOGVlYi04ODkzYTBjZjc5ZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5E7i/IAAAFSklEQVR42uzbzWtcVRiA8XPSfEya+XBiTAxJa5qKpYaKoQqCihBdxl0oiAs/wEXW/gEuBHe60V03QhA3wZXutCCiuKhUCKWk2GhsEhqNGZPJZ5P0+J577twZb24S0pGR0/v8kHJnmEyuuU/fczIz1S1vjKuG2J2cUEiNJn4EICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFvzX/ID9/3z9Yluqrt8r320zscDE4u8xs5mJBcICYQHsseo0+oj68s+E+y90qHNZ9UROd9XsZ96fNqXd8HisR7Wf0MNFe1zeUd8umdFefeS3m1lTn8ya2ntGOtWTOT2YDW/Ob6rpskk8JcLyyQtd+nrZ/LoVv39q3f43pkxXm83lyh/xiz25KH+Y4aJ2tUmg4oclE9xvb4502y+8saou3zYuoJe6dNuJ6jMUm9Xbp3Vfu63t41v2HOSe1/u0fOFTBfX5XMJZsRT6QcZSa5O6WKjrSdwMyzTZhlxVia4s26mWb65WNT4QViUzzDUkTyXHco+MyTdP62IzYfnp6YIdKrLe/SfPdmvdHP4Aaau6BHeHi+xXi/GvcvfkWtRYryYsLz0e7GzkAsvoqt+11aMfs33P/nkmo9zmTHZU+9c7uUeGljifV8/lCcvDdTA2uuohi2C0rz/EB7/YaRQtvrMHDLk7W+H9FwqasPxbB6dWzFLwQv1QoaHfOlp8l3eSHzC9Fh6czTKxfCMxffOXulm2s0G28PJbW8PkW8KDjQOG3NpeeCAn5t0WPtVhSUZzG3bxqs6GjsYtOq2Vn/3i3eQH1G68HiIsj0hGv23YWTW1rtxqKItOkZf2CKseEpBk9H0pvBmths8XG3QCd++FBz2tRz/4713C8sRwPlwHnZ9WwoNzuQathvLdnZMHzMgzmWqCJd/CSu/cd+/NfTQUz6iv3Q6zY13IaPYcy50tM5i1372zJfkB0SSLEiQsD9ZBqcq9Nxd555Q+H7wU+fLD/3pbZqvSTaYpea5s793POchvo8902sXXvu6wmPBSVn97eHC1ZNhj+UHS2f9699RKeP1ib+/MVgbGo5mEVXIop+Y27+ccZCheXbbf8aAX/d1pzKypH1cVYfnhsQ49XY6PAbl+blGLXWn5nXE+SKf/ZHXfE02+Z4s6KvK4ZC7eCKJ5dd8bgiOd9jTKO+qzeePjTziNYUk0spGKfh+sdb2yhY+9vfPFgpFrLMvWa/06eudODsYHbFX1TJTLt821km3o3UEd1TzWo0Z79dK2+vR34922PY17LPfBPffWm6yGMrc+nDFu8MhN0V0ZSMNFtbkXDhUVvFb53k0j11uWp0un9KXgMXaRWja1n1ao3XhdLNjndzfPZm0rsmImJjixYH5esSm/NRA+XpKKPtTlqXSF5T64N1ndKZtou1O5iubwlStxl72fhBhs4MxxTsxMLDw4P2o+NgPCAkvh/ytt/9CeiQUmlp/S8I/rmVggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFjwzD8CDAA+92WQMr4wfgAAAABJRU5ErkJggg==",
                data: {
                    "type":sources.COMPONENTS_TYPE.LAYOUT,
                    // "sortNumber":4,
                    "configs":
                        {
                            "element":[
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
                                    "sortNumber":4,
                                    "configs":
                                        {
                                            "element":
                                                {
                                                    "key":3,"bgColor":"#0C7D9077","parentKey":-1,"width":"200px","height":"100%",overflowY:"auto",overflowY:"auto",
                                                    _configure:{
                                                        text:"左",
                                                        fields:[{key:"width",text:"宽度"},{key:"background",text:"背景"}]
                                                    },leaf:true
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
                                                    "key":4,"bgColor":"#827D2977","parentKey":-1,"width":"auto","height":"100%",overflowY:"auto",overflowY:"auto",
                                                    _configure:{
                                                        text:"右",
                                                        fields:[{key:"background",text:"背景"}]
                                                    },leaf:true
                                                }
                                        }
                                }
                            ]

                        }
                }
            },
            {
                text:"上中下布局",
                url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACqCAIAAABnBpeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUU2MkFCRkQ0MkUwMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUU2MkFCRkM0MkUwMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMjVkMGNjYS04YWEwLTExN2MtOGVlYi04ODkzYTBjZjc5ZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4zl315AAAFP0lEQVR42uzdz2scZRjA8fdNN8mm+6u7jYkhaU3T0lJDxVAFQUWIHuMtFMSLCj303D/Ag+CtvdhboRSkFEH0oie1IKJ4qFQIpaTYaGxSGo1Zk83Ppunr8+47O7tOJo3pxoXZ+X4oZTJsdic73z7vZDehif2ffKWA3dbCUwDCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmEhZrROpXkWwMQCYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYYGwAMICYaHpJJrjy/j61fZYnbY3vltjYoGJxb9jZjMTC4QFwgK4xqrHyFPqiz9D9p9IqWNpdTSjO2suZj4YN8WH3vZot+rYo4fydru0rr6dNSM9etuHm1hUFyZN7Z7hgno2owcq/3Py9IoaL5nQQyKsKHmlU98smV9Xg/vHluyfUWU6220u1/4InuxPZ+QvM5TXrjYJVPwwa8r77YfDXfYTby2oi3eNC+i1Tt2+p3oP+YR676Du7bC1fXTHHoPsebtXyyc+l1NXp0KOiqUwGmQstbWok7m67sTNsGSLbchVFeranJ1q2US1qjP9XlUyw1xDcleyLXtkTL5zUOcThBVNz+fsUJH1blfu7c6SefwNpK3qEtzlLbJfzgQ/y+3JtKrRHk1YkXSkfGUjJ1hGV/1uLGx/m7VH9u9DSeUuzuSKavN6J3tkaInjWfVSlrAiuA4GRlc9ZBH0r+sf48Nf7DTyF9/JLYbc/VVv/4mcJqzorYNj82a2/Cr9YK6hD+0vvnPr4TcYX/Q2DqeZWFEjMX3zl7pdsrNBLuHlu7aGybZ6G8tbDLnFDW9DDizSl/CxC0symlq2i1d1NqQat+i0VZ7vmQfhN6i98NpHWBEiGf22bGfV2JJyq6EsOvn4vpxHWLtBApKMvi96H/qr4cv5Bh3Ag0feRnfb9jf++yFhRcRQ1lsHnZ/mvY1jmQathvLozt4tZuShZDXBYpTDitca4N6bOz8YzKi3ww6zHZ1If/bsyP1VM5C2j15oDb+BP8n8BAkrAuugVOXem/OdPqCPl1+KfH3/v96WWa10k2wJnytrG09yDPLd6AsFu/ja1x1mQl7K6uvwNq4XDddY0SDpbH69e2zeO3+Bt3cmKwPj6WTIKjmYUVMrT3IMMhSvz9lH3OpFf3cYE4vqxwVFWNHwTEqPl4JjQM6fW9QCZ1q+Z5wup9O3t3rd40++F/PaL3KnZC7eKkfz5qY3BIcL9jBK6+rKtIn6sx2XsCQauZDyvx+sdbNyCR94e+eze0bOsSxbb/Vp/5072TjTb6uqZ6JcvGtuFG1DZwe0X/Notxrp0bNr6vLvJtKX7XG5xnI/uOfeepPVUObWuQnjBo98KLoqA2kor1Y2vKGiyq9Vvn/byPmW5enUAX2qfBu7SM2Z2p9WqL3wOpmz9+8+PJy2rciKGZrgx/fMz/M25Xf7vdtLUv4PdTUBrVPpJvgy3O+uxOe3dPi9QsQUYYFrrP+2TICJhabVJBfvYGKBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCAmGBsADCwv8kUbj0Oc8CmFggLBAWQFggLBAWQFggLBAWQFggLBAWQFggLBAWQFggLBAWUKd/BBgAoC5PsN1/CJ4AAAAASUVORK5CYII=",
                data: {
                    "type":sources.COMPONENTS_TYPE.LAYOUT,
                    // "sortNumber":4,
                    "configs":
                        {
                            "element":[
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
                                                    "key":1,"bgColor":"#4E7CB077","parentKey":-1,"width":"100%","height":"70px",
                                                    _configure:{
                                                        text:"上",
                                                        fields:[{key:"height",text:"高度"},{key:"background",text:"背景"}]
                                                    },leaf:true
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
                                                    "key":2,"bgColor":"#827D2977","parentKey":-1,"width":"100%","height":"auto",overflowY:"auto",overflowY:"auto",
                                                    _configure:{
                                                        text:"中",
                                                        fields:[{key:"background",text:"背景"}]
                                                    },leaf:true
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
                                                    "key":6,"bgColor":"#859C7A77","parentKey":-1,"width":"100%","height":"70px",
                                                    _configure:{
                                                        text:"下",
                                                        fields:[{key:"height",text:"高度"},{key:"background",text:"背景"}]
                                                    },leaf:true
                                                }
                                        }
                                }
                            ]

                        }
                }
            },
            {
                text:"左右布局2",
                url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACqCAIAAABnBpeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkFDRkEzM0M0MkUyMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkFDRkEzM0I0MkUyMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMjVkMGNjYS04YWEwLTExN2MtOGVlYi04ODkzYTBjZjc5ZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz60ZU3cAAAFQUlEQVR42uzb32tTZxjA8fetaZuaX0vXtSutrlZRXHGsOEHYxqDbZb0LggxBB7vw2j/AC2F37mbeeTMY4s3Y1Xa3CWNs7MLhoIhUZrfOVuxWG9v0p7W+Pm/ek5Ps9NRSq5kn5/tB5CSkybH5+rxvklbrVFoh9hKFk8/3Dpv4nuJFICwQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFggLhAUQFuor8ZKf3/fvt8bq+fjopxUmFhDZidVg/4/jM5uZWCAsEBbYYzWa4dfUt/+GXH8opQ6k1f6M7qjZzJwfNcVH3nGhS7Xt0IN5e1xaVT9Om+FuvenDjc2ri+Om9pqhdvVmRvenvYuTS2q0ZEJPibCi5L0OfaNk/lwOXj+yYP8UlOlotblc/Sf4ZH89JX+Zwbx2tUmg4pdpU77eXhzqtF94c05dumNcQB906NYd1XvIJ9Qnu3VPm63ti9v2HOSaj3u0fOFbOXVlIuSsWAqjQcZSS5M6nNvWnbgZlmyyDbmqQl2dsVMtm6hWdabPq0pmmGtI7kqO5RoZk6d263yCsKLp7ZwdKrLePZd7u71gnn4Daau6BHd6i+x3U8GvctdkmlWhWxNWJO0r72zkCZbRtX3X5za/zcpj+/eepHKbM9lRrV/v5BoZWuJgVh3NElYE18HA6NoOWQT9ff1TfPaHnUb+4ju+wZC7t+xdfyinCSt66+DIrJkuv0s/kKvrQ/uL78xq+A1G572DvWkmVtRITD/cV7dKdjbIFl5etdVNttk7WNxgyM2veQdyYnHYwjdOWJLRxKJdvKqzIVW/Rael8o2cehh+g9qN1yuEFSGS0V+LdlaNLCi3GsqiE5+X94T1QkhAktHPRe+ivxq+m6/TCTx87B10tWx+4wePCCsiBrPeOuj8NusdHMjUaTWUR3d2bjAj9ySrCRZjEFaDLBXus7nPB4IZ9bTZYbalJ9KfPVtyb9n0p+2jtzeH38CfZH6ChBWBdVCqcp/N+T7dpQ+W34r88NX/fCyzXOkm2RQ+V1bWnuUc5NXoO+128bXvO0yFvJXV2+YdXCsa9ljRIOmsf797ZNZ7/gIf74xXBsbryZBVciCjJpae5RxkKF6bsY+40Zv+7jTG5tWvc4qwouGNlB4tBceAPH9uUQs80/KacbKcTu/O6r7Hn3xH8tovcqtkLt4sR3Ns3QeCQ+32NEqr6vJkLMZVI4Ql0chGyn89WOtGZQsf+Hjnm7tGnmNZtk70av+TOzk402er2s5EuXTHXC/ahs72a7/mQpca7tbTK+rLv00ctu2R32O5H9xzH73Jaihz68KYcYNHLorOykAazKulNW+oqPJ7leduGXm+ZXk6vksfL9/GLlIzpvanFWo3Xodz9v7dxb1p24qsmKEJfnXX/D5rUz7d591ekvJ/qCs+tE691J9dud9dic9v6fxf/9JE4SRLIdhjIa6isceK2y/aM7GAaE6sOGzbmVgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFgAYYGwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFggLICwQFhocE8EGADAaVArNbX86QAAAABJRU5ErkJggg==",
                data: {
                    "type":sources.COMPONENTS_TYPE.LAYOUT,
                    // "sortNumber":4,
                    "configs":
                        {
                            "element":[
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
                                    "sortNumber":5,
                                    "configs":
                                        {
                                            "element":
                                                {
                                                    "key":4,"bgColor":"#827D2977","parentKey":-1,"width":"auto","height":"100%",overflowY:"auto",overflowY:"auto",leaf:true,
                                                    _configure:{
                                                        text:"左",
                                                        fields:[{key:"background",text:"背景"}]
                                                    }
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
                                                    "key":5,"bgColor":"#0C7D9077","parentKey":-1,"width":"200px","height":"100%",overflowY:"auto",overflowY:"auto",
                                                    _configure:{
                                                        text:"右",
                                                        fields:[{key:"width",text:"宽度"},{key:"background",text:"背景"}]
                                                    },leaf:true
                                                }
                                        }
                                }
                            ]

                        }
                }
            },

            {
                text:"拖动组件",
                url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACqCAIAAABnBpeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTcyMTNDRjU0MkUzMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTcyMTNDRjQ0MkUzMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMjVkMGNjYS04YWEwLTExN2MtOGVlYi04ODkzYTBjZjc5ZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qdEg1AAABRklEQVR42uzSQQ0AMAgAsTFjKMIsijDBh6SVcLnoygfbvgQYC2NhLDAWxsJYYCyMhbHAWBgLY4GxMBbGAmNhLIwFxsJYGAuMhbEwFhgLY2EsMBbGwlhgLIyFscBYGAtjgbEwFsYCY2EsjAXGwlgYC4yFsTAWGAtjYSwwFsbCWGAsjIWxwFgYC2OBsTAWxgJjYSyMBcbCWBgLjIWxMBYYC2NhLDAWxsJYYCyMhbHAWBgLY4GxMBbGwlhgLIyFscBYGAtjgbEwFsYCY2EsjAXGwlgYC4yFsTAWGAtjYSwwFsbCWGAsjIWxwFgYC2OBsTAWxgJjYSyMBcbCWBgLjIWxMBYYC2NhLDAWxsJYYCyMhbHAWBgLY4GxMBbGAmNhLIwFxsJYGAuMhbEwFhgLY2EsMBbGwlhgLIyFscBYGAtjgbEwFreMAAMAT0MC0sL+QGkAAAAASUVORK5CYII=",
                data: {
                    "type":sources.COMPONENTS_TYPE.SUSPENSION,
                    // "sortNumber":4,
                    "configs":
                        {
                            "element":{
                                "key":6,"bgColor":"#9F1A2477","parentKey":-1,width:"200px",height:"100px",top:"10px",left:"10px",
                                _configure:{
                                    text:"拖动组件",
                                    fields:[
                                        {key:"width",text:"宽度"},
                                        {key:"height",text:"高度"},
                                        {key:"background",text:"背景"},
                                        {key:"top",text:"top"},
                                        {key:"bottom",text:"bottom"},
                                        {key:"left",text:"left"},
                                        {key:"right",text:"right"}
                                        ]
                                },leaf:true
                            }
                        }
                }
            },
            {
                text:"Row组件",
                url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACqCAIAAABnBpeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkFDRkEzNDQ0MkUyMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkFDRkEzNDM0MkUyMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMjVkMGNjYS04YWEwLTExN2MtOGVlYi04ODkzYTBjZjc5ZTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7trNboAAABaElEQVR42uzVwQmAMBBFQSPpIP0XkBoCetIqBBG7CDnYxIIQZkr4PHZTqW2BaKsJEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWCAshIWwQFgIC2GBsBAWwgJhISyEBcLif7mfuxWID2u8jxXwChEWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBbCYkap1GYFXCyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsJhR7sdmBeLDGvdlBbxChIWwQFgIC2GBsBAWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbCY0SfAAHuxDrwV/S+rAAAAAElFTkSuQmCC",
                data: {
                    "type":sources.COMPONENTS_TYPE.ROW,
                    // "sortNumber":4,
                    "configs":
                        {
                            "element": {
                                "key":6,"parentKey":-1,splitNumber:[1,5,1],background:[],
                                _configure:{
                                    text:"Row组件",
                                    fields:[{key:"splitNumber",text:"分割比例数组"},{key:"background",text:"Row的背景"}]
                                }
                            }
                        }
                }
            },
            {
                text:"Col组件",
                url:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACqCAIAAABnBpeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxNDAzMTVlYy01NTMwLTQzZjktOTQ4Ni04MTRhMWJjOGU5MjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTFGMjlCNjE0M0QzMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTFGMjlCNjA0M0QzMTFFOTlCMDc5MzIwRjVCOUNCNTkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQUNGQTM0MzQyRTIxMUU5OUIwNzkzMjBGNUI5Q0I1OSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQUNGQTM0NDQyRTIxMUU5OUIwNzkzMjBGNUI5Q0I1OSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pnt7mugAAAF8SURBVHja7NJBCsIwEEDRmppFNwG9gxtBkEKP4dJbuvNwVkmIoadI4b3FMMth+Ifp8Ry6knM4neN9OV6u9fft5apxrOtnfb/abHsvV5USUoq3ua9fbcIAwkJYCAuEhbAQFggLYSEsEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWCAshIWwQFgIC2GBsBAWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBbCQlgIywsQFsJCWCAshIWwQFgIC2GBsBAWwgJhISyEBcJCWAgLhIWwEBYIC2EhLBAWwkJYICyEhbBAWAgLYYGwEBbCAmEhLIQFwkJYCAuEhbAQFggLYSEsEBbCQlggLISFsEBYCAthgbAQFsICYSEshAXCQlgIC4SFsBAWCAthISwQFsJCWCAshIWwQFgIC2GBsBAWu/IXYACrTxXLp9p4eQAAAABJRU5ErkJggg==",
                data: {
                    "type":sources.COMPONENTS_TYPE.COL,
                    // "sortNumber":4,
                    "configs":
                        {
                            "element": {
                                "key":6,"parentKey":-1,splitNumber:[1,1,2,1],background:[],
                                _configure:{
                                    text:"Col组件",
                                    fields:[{key:"splitNumber",text:"分割比例数组"},{key:"background",text:"Col的背景"}]
                                }
                            }
                        }
                }
            },
        ];
        var clazz = [
            {
                text:"布局",
                //url:"./test01.png",
                configs:_componentConfigs
            }
        ]
        componentConfigs.forEach(function (item) {
            clazz.push(item);
        })
        data.clazz = clazz;
        data.componentConfigs = _componentConfigs;
        Generate.generate.renderLayout();
        Generate.generate.renderComponentClazzList(clazz);
        Generate.generate.renderComponentList(_componentConfigs,{canDrag:true});
        Generate.generate.render(projectConfig);
    }
    function doRender(configs,container) {
        Generate.generate.show(configs,container);
    }
    function isShowBgColor(isShowBgColor) {
        Generate.generate.isShowBgColor(isShowBgColor);
    }
    function flushPreview() {
        Generate.generate.flushPreview();
    }
    function getPreviewJsonData() {
        return Generate.generate.getPreviewJsonData();
    }
    function changeBgColor(color) {
        Generate.generate.changeBgColor(color);
    }
    function changePainting(width,height) {
        var projectConfigs = Generate.generate.getProjectConfigs();
        Generate.generate.init({
            width:width,height:height
        });
        Generate.generate.renderLayout();
        Generate.generate.renderComponentClazzList(data.clazz);
        Generate.generate.renderComponentList(data.componentConfigs,{canDrag:true});
        Generate.generate.render(projectConfigs);
    }
    nameSpace.Face = {
        getPreviewJsonData:getPreviewJsonData,
        isShowBgColor:isShowBgColor,
        runPreview:runPreview,
        flushPreview:flushPreview,
        changeBgColor:changeBgColor,
        doRender:doRender,
        changePainting:changePainting,
        event:event,
        TYPES:TYPES
    };
})(window.YT.DataView);
