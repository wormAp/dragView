"use strict";
/*
 * 核心类
 * zhaona
 */
var ytvs = {
	/*
	 * 组件列表
	 */
	components:{},
	
	_comjs:{},
	_comcss:{},
	
	theme:"default",
	themeName :"YTVSTheme",
	
	getComponents:function(){
		var result = [] ;
		for(var key in components){
			result.push(components[key]);
		}
		return result;
	},
	get:function(id){
		if(!id){
			return null;
		}
		if(typeof id == "string"){
			return ytvs.components[id];
		}else{
			return null;
		}
	},
	reg : function(component) {
		this.components[component.containerid] = component;
	},
	unreg : function(component) {
		delete ytvs.components[component.containerid];
	},
	copyTo : function(c, b) {
		if (c && b) {
			for ( var a in b) {
				c[a] = b[a];
			}
		}
		return c;
	},
	extend : function(e, b, f) {
		if (typeof b != "function") {
			return this;
		}
		var g = e, d = g.prototype, a = b.prototype;
		if (g.superclass == a) {
			return;
		}
		g.superclass = a;
		g.superclass.constructor = b;
		for ( var c in a) {
			d[c] = a[c];
		}
		if (f) {
			for ( var c in f) {
				d[c] = f[c];
			}
		}
		return g;
	},
	isNode:function(node){
		var check = 0;
		for(var key in node){
			if(key=='name'||key=='default'||key=='type'){
				check++;
			}
		}
		if(check==3){
			return true;
		}else{
			false;
		}
	},
	create : function(options){
		var templete = options.templete;
		var value = options.value;
		var containerid = options.containerid;
		var factory = ytvs.getFactory(templete.type);
		if(factory==null){
			return null;
		}
		var component = factory.create(
				{
					templete:templete,
					value:value,
					containerid:containerid
				});
		return component;
	},
	update : function(options){
		ytvs.create(options);
	},
	destory : function(id){
		if(!id){
			return null;
		}
		if(typeof id == "string"){
			this.unreg(ytvs.components[id]);
		}else{
			return null;
		}
	},
	getFactory : function(type){
		switch(type){
		case "miniui":
			return ytvs._miniuiFactory;
		case "echarts4":
			return ytvs._echartsFactory;
		default:
			return ytvs._defaultFactory;
		}
	},
	addCss : function(cssHtml,id){
		var styleObj;
		if(this._comcss[id]!=null){
			styleObj = document.getElementById(id);
			styleObj.innerHTML=cssHtml;
		}else{
			styleObj = document.createElement('style');
			styleObj.id=id;
			styleObj.innerHTML = cssHtml;
			document.head.appendChild(styleObj);
		}
		this._comcss[id] = id;
	},
	addJs : function(js,id){
		try{
			eval("(" + js + ")");
			if(js.indexOf("YTVS")>=0){
				ytvs._comjs[id]=YTVS._comjs[id];
			}
		}catch(e){
			console.log(e);
			return;
		}
	}
};
/*
 * 关键渲染函数
 */
ytvs.parse = function(callback){
	//client代理获取组件列表 回调渲染
	ytvs.client.getComData(function(data){
		for(var i=0;i<data.length;i++){
			var component = ytvs.create(data[i]);
			component.superInit();
			component.superRender();
		}
		callback();
	});
};
/*
 * 组建类
 */
ytvs.Component=function(params){
	ytvs.copyTo(this,params);
	try{
		ytvs.addJs(this.templete.js,this.templete.code);
		ytvs.addCss(this.templete.style,this.templete.code);
	}catch(e){
		console.log(e);
		return;
	}
	this.datasource = new ytvs.DataSourceCenter(this);
	this.comjs = new ytvs._comjs[this.templete.code]();
	for(var key in this.comjs){
		this[key] = this.comjs[key];
	}
	
	
	//适配旧版本
	this.mergeConfig=this.value.style;
	this.eventConfig=this.value.event;
	this.apiConfig=this.datasource.mergeDataSourceConfig;
	this.comData = {
			attrdatasource:JSON.stringify(this.value.datasource),
			attrevent:JSON.stringify(this.value.event)};
	
	ytvs.reg(this);
};
ytvs.Component.prototype={
	templete:null,
	value:null,
	containerid:null,
	datasource:null,
	init:function(){},
	preload:function(){},
	render:function(){},
	superInit:function(){
		this.init();
	},
	superRender:function(){
		if(this.preload!=null){
			this.preload();
		}
		this.datasource.getData(this,"render");
	}
}
/**----------------数据部分------------------------**/
ytvs.dataSourceTypes=[ {
	name : "静态数据",
	value : "static",
	obj:"DataSourceStatic"
}, {
	name : "自定义方法",
	value : "customFunction",
	obj:"DataSourceCustomFunction"
},{
	name :"非跨域ajax请求",
	value :"ajax",
	obj:"DataSourceAjax"
},{
	name :"跨域ajax请求",
	value :"crossAjax",
	obj:"DataSourceCrossAjax"
},{
	name :"数据服务",
	value :"dataengine",
	obj:"DataSourceDataEngine"
}
];
/*
 * 数据源调度 中心
 */
ytvs.DataSourceCenter=function(component){
	if(component==null){
		return;
	}
	this.component = component;
	//组件数据模板
	if(component.templete==null){
		return;
	}
	var api = component.templete.config.api;
	//用户配置结果
	if(component.value==null){
		return;
	}
	var dataConfig=component.value.datasource;
	
	
	//刷新周期
	this.refreshInterval = dataConfig["api_refresh"];
	//全局配置函数
	this.globalFormatFunStr = dataConfig["api_alldata_format"];
	this.globalFormatFun = null;
	if(this.globalFormatFunStr!=null&&this.globalFormatFunStr!=""){
		try{
			this.globalFormatFun=eval("("+this.globalFormatFunStr+")");
		}catch(e){
		}
	}		
	//数据源对象
	this.dataSources=[];
	for(var i=1;i<100;i++){
		var key = "source"+i;
		var type = dataConfig["api_source_type_"+key];
		if(type==null){
			break;
		}
		var datasource = this.getDataSourceBaseObj(type,key);
		datasource.init(dataConfig);
		this.dataSources.push(datasource);
	}
	//合并用户配置结果和组件配置模板
	this.mergeDataSourceConfig = this.mergeApiConfig(dataConfig,api);
	//根据不同的数据源获取数据 递归函数
	this.getData=function(that,callback){
		var _this = this;
		function recursionGetData(i,data){
			if(i>_this.dataSources.length){
				if(_this.globalFormatFun!=null){
					data = _this.globalFormatFun(data);
				}
				try{
					that[callback](data);
				}catch(e){
					console.log(e);
				}
				
				if(_this.refreshInterval!=null&&_this.refreshInterval>0){
					YTVSInterval.add(_this.component.containerid,_this.refreshInterval,_this.refreshInterval,function(containerid,that){
						ytvs.get(containerid).superRender();
					});
				}
				return;
			}
			if(_this.dataSources[i-1].openState=="false"
				||_this.dataSources[i-1].openState==false){
				recursionGetData(i+1,data);
				return;
			}
			_this.dataSources[i-1].getData(function(result){
				data[_this.dataSources[i-1].key]=result;
				recursionGetData(i+1,data);
			});
		}
		var data = {};
		recursionGetData(1,data);
	}
};
ytvs.DataSourceCenter.prototype={
	component:null,
	dataSources:[],
	refreshInterval:0,
	globalFormatFunStr:"",
	globalFormatFun:null,
	mergeDataSourceConfig:{},
	/*
	 * 用于渲染控件
	 */
	formJson:[
		{label:"api_refresh",name:"自刷新",type:"text",default:0},
		{label:"api_alldata_format",name:"全局数据format函数",type:"text",default:""}
	],
	/*
	 * 获取数据源类型对象
	 */
	getDataSourceBaseObj : function(type,key){
		var datasource = new ytvs.DataSourceBase(key,this);
		for(var j=0;j<ytvs.dataSourceTypes.length;j++){
			if(type==ytvs.dataSourceTypes[j].value){
				datasource = new ytvs[ytvs.dataSourceTypes[j].obj](key,this);
			}
		}
		return datasource;
	},
	/*
	 * 合并用户配置结果和组件配置模板
	 */
	mergeApiConfig:function(attrdatasource,api){
		for(var key in api){
			var fields = api[key].fields;
			if(fields==null){
				continue;
			}
			for(var fieldKey in fields){
				var fieldName = attrdatasource["api_"+key+"_"+fieldKey];
				if(fieldName==null){
					fieldName=fieldKey;
				}
				fields[fieldKey].value = fieldName;
			}
		}
		return api;
	},
	getData:function(){that,callback}
}

/*
 * 数据源基类
 */
ytvs.DataSourceBase=function(key,datasource){
	this.key = key;
	//使用对象
	this.datasource=datasource;
	//参数控件
	this.baseFormJson=[
			{label:"api_data_format_"+this.key,type:"text",name:"数据format函数",default:""},
			{label:"api_open_"+this.key,type:"boolean",name:"是否开启",default:true},
			{label:"api_source_type_"+this.key,type:"select",name:"数据接口类型",default:"static",range:ytvs.dataSourceTypes}		
	];
};
ytvs.DataSourceBase.prototype={
	varMap:{},
	formJson:[],
	/*
	 * 开启状态
	 */
	openState:"true",
	/*
	 * format数据函数
	 */
	formatFunStr:null,
	formatFun:null,
	/*
	 * 必调用初始化函数 调用set
	 */
	init : function(params){
		this.openState = params["api_open_"+this.key];
		var formatFunStr = params["api_data_format_"+this.key];
		var formatFun = null;
		if(formatFunStr!=null&&formatFunStr!=''){
			try{
				formatFun=eval("("+formatFunStr+")");
			}catch(e){
				
			}
		}
		this.formatFunStr=formatFunStr;
		this.formatFun=formatFun;
		this.set(params);
	},
	set:function(params){
	},
	getData:function(){
		return null;
	},
	replaceUrlParam:function(urlTemp){
		var url = urlTemp;
		if(typeof url == "object"){
			url = JSON.stringify(url);
		}
		if(url.indexOf("#")>=0){
			var params = url.split("#{");
			for(var i=0;i<params.length;i++){
				if(params[i].indexOf("}")>0){
					var param = params[i].split("}")[0];
					var paramValue = eval("("+param+")");
					if(typeof paramValue == "object"){
						paramValue = JSON.stringify(paramValue);
					}
					this.varMap[param]=paramValue;
					params[i]=paramValue+params[i].split("}")[1];
				}
			}
			url = params.join("");
			
		}
		return url;
	}
};
/*
 * 静态数据源
 */
ytvs.DataSourceStatic=function(){
	ytvs.DataSourceStatic.superclass.constructor.apply(this, arguments);
	//参数控件追加
	var defaultValue = {"0":"0"};
	if(this.datasource!=null&&this.key!=null){
		defaultValue=this.datasource.component.templete.config.api_data[this.key];
	}
	this.formJson=[
		{label:"api_static_data_"+this.key,type:"textarea",name:"静态数据",default:JSON.stringify(defaultValue)}
	];
};
ytvs.extend(ytvs.DataSourceStatic,ytvs.DataSourceBase,{
	/*
	 * 静态数据
	 */
	staticData:null,
	set:function(params){
		this.staticData=params["api_static_data_"+this.key];
	},
	getData:function(callback){
		callback(
				this.formatFun!=null?
						this.formatFun(this.staticData):this.staticData
		);
	}
});
/*
 * 内部ajax数据源
 */
ytvs.DataSourceAjax=function(){
	ytvs.DataSourceAjax.superclass.constructor.apply(this, arguments);
	//参数控件追加
	this.formJson=[
		//内部ajax
		{label:"api_ajax_data"+"_"+this.key,type:"text",name:"ajax地址",default:"~/app/test"},
		{label:"api_ajax_params"+"_"+this.key,type:"textarea",name:"ajax参数",default:""}
	];
	
};

ytvs.extend(ytvs.DataSourceAjax,ytvs.DataSourceBase,{
	url:"",
	params:"",
	callback:function(){},
	set:function(params){
		this.url = params["api_ajax_data_"+this.key];
		this.params = params["api_ajax_params_"+this.key];
		this.url=this.replaceUrlParam(this.url);
		this.params=this.replaceUrlParam(this.params);
		this.params = JSON.parse(this.params);
		this.callback=params["callback"];
	},
	getData:function(callback){
		this.replaceUrlParam(this.params);
		var _this = this;
		$.send({
			url:this.url,
			type:"post",
			data:JSON.stringify(this.params),
			dataType:"json",
			contentType: 'application/json',
			success:function(data){
				callback(_this.formatFun!=null?
						_this.formatFun(data):data);
			}
		});
	}
});
/*
 * 自定义函数数据源
 */
ytvs.DataSourceCustomFunction=function(){
	ytvs.DataSourceCustomFunction.superclass.constructor.apply(this, arguments);
	//参数控件追加
	this.formJson=[
		// 自定义数据函数
		{label:"api_customfunction_data_"+this.key,type:"text",name:"函数名",default:null}
	];
};
ytvs.extend(ytvs.DataSourceCustomFunction,ytvs.DataSourceBase,{
	customFun:null,
	set:function(params){
		try{
			this.customFun = eval("("+params["api_customfunction_data_"+this.key]+")");
		}catch(e){
			
		}
	},
	getData:function(callback){
		if(this.customFun){
			this.customFun(callback);
		}
	}
});
/*
 * 数据服务数据源
 */
ytvs.DataSourceDataEngine=function(){
	ytvs.DataSourceDataEngine.superclass.constructor.apply(this, arguments);
	//参数控件追加
	this.formJson=[
		//数据服务
		{label:"api_dataengine_data_"+this.key,type:"text",name:"数据服务名称",default:"cross"},
		{label:"api_dataengine_params_"+this.key,type:"textarea",name:"数据服务参数",default:""}
	];
};
ytvs.extend(ytvs.DataSourceDataEngine,ytvs.DataSourceBase,{
	url:null,
	params:null,
	set:function(params){
		this.url = bundleUrl+"dataengine/api/getData?interfacecode="+params["api_dataengine_data_"+this.key];
		this.params = params["api_dataengine_params_"+this.key];
		//this.params=this.replaceUrlParam(this.params);
		//this.params = {filter:JSON.stringify(this.params)};
		try{
			if(typeof(this.url)!="object"
				&&this.params!=""){
				this.params = JSON.parse(this.params);
			}
		}catch(e){
			//console.log(this.params)
		}
		if(this.params!=null&&this.params!=""){
			for(var key in this.params){
				if(this.params[key].indexOf("#{")>=0){
					var param = this.params[key].replace("#{","").split("}")[0];
					var paramValue = eval("("+param+")");
					this.varMap[param]=paramValue;
					this.params[key]=this.params[key].replace("#{"+param+"}",paramValue);
				}
			}
		}else{
			this.params={};
		}
		this.params = {filter:JSON.stringify(this.params)};
	},
	
	getData:function(callback){
		var _this = this;
		//this.params=this.replaceUrlParam(this.params);
		//this.params = {filter:JSON.stringify(this.params)};
		$.ajax({
			url:this.url,
			data:this.params,
			success:function(result){
				var data = result.data.data;
				if(_this.params.pageIndex!=null){
					data = {total:result.data.total[0].total,data:result.data.data};
				}
				callback(_this.formatFun!=null?
						_this.formatFun(data):data);
			}
		})
	}
});
/*
 * 跨域ajax数据源
 */
ytvs.DataSourceCrossAjax=function(){
	ytvs.DataSourceAjax.superclass.constructor.apply(this, arguments);
	this.formJson=[
		//内部ajax
		{label:"api_crossajax_data_"+this.key,type:"text",name:"ajax地址",default:"~/app/test"},
		{label:"api_crossajax_params_"+this.key,type:"textarea",name:"ajax参数",default:""}
		
	];
};
ytvs.extend(ytvs.DataSourceCrossAjax,ytvs.DataSourceAjax,{
	set:function(params){
		this.url = params["api_crossajax_data_"+this.key];
		this.params = params["api_crossajax_params_"+this.key]; 
		this.url=this.replaceUrlParam(this.url);
		this.params=this.replaceUrlParam(this.params);
		this.callback=params["callback"];
	}
});
/**----------------生产组建的工厂------------------------**/
/*
 * 默认工厂
 */
ytvs._defaultFactory={
	theme:{},
	getThemeStyle:function(style){
		var comstyle = style;
		if(comstyle!=null&&comstyle!=""){
			while(comstyle.indexOf(ytvs.themeName)>=0){
				var themeindex = comstyle.indexOf(ytvs.themeName);
				var themeValue = comstyle.substring(themeindex,themeindex+10);
				comstyle=comstyle.replace(themeValue,this.theme[ytvs.theme].colors[themeValue.substring(9,themeValue.length+1)]);
			}
			
		}else{
			comstyle="";
		}
		return comstyle;
	},
	parseParams:function(params){
		if(typeof params.templete.config=="string"){
			params.templete.config = JSON.parse(params.templete.config);
		}
		if(typeof params.value.style=="string"){
			params.value.style = JSON.parse(params.value.style);
		}
		if(typeof params.value.event=="string"){
			params.value.event = JSON.parse(params.value.event);
		}
		if(typeof params.value.datasource=="string"){	
			params.value.datasource = JSON.parse(params.value.datasource);
		}
		if(typeof params.templete.style=="string"){	
			params.templete.style = this.getThemeStyle(params.templete.style);
		}
	},
	/*
	 * 创建组件
	 */
	create:function(params){
		var value = params.value;
		while(value.style.indexOf("YTVSTheme")>=0){
			var themeindex = value.style.indexOf("YTVSTheme");
			var themeValue = value.style.substring(themeindex,themeindex+10);
			value.style=value.style.replace(themeValue,this.theme[ytvs.theme].colors[themeValue.substring(9,themeValue.length+1)]);
		}
		
		this.parseParams(params);
		var theme = this.theme[ytvs.theme];
		var component = new ytvs.Component(params);
		if(theme!=null&&typeof theme== "object"&&theme[params.templete.code]!=null){
			var recursiveMergeConfig = function(parent,parentTheme,key){
				var node = parent[key];
				if(node==null||node=="null"||(typeof node =="Array" && node[0]=="null")){
					parent[key] = parentTheme[key];
					return;
				}
				if(typeof node == "object"){
					for(var index in parent[key]){
						recursiveMergeConfig(parent[key],parentTheme[key],index);
					}
				}
			}
			recursiveMergeConfig(component,{"mergeConfig":theme[params.templete.code]},"mergeConfig");
		}
		
		
		
		
		return component;
	}
};
ytvs._miniuiFactory={
};
ytvs.copyTo(ytvs._miniuiFactory,ytvs._defaultFactory);
ytvs._mapFactory={
	
}
ytvs.copyTo(ytvs._mapFactory,ytvs._defaultFactory);
ytvs._mapFactory.create=function(params){
	this.parseParams(params);
	var component = new ytvs.Component(params);
	component.mapUtil = YTMapUtil;
	return component;
}
ytvs._echartsFactory={
		
};
ytvs.copyTo(ytvs._echartsFactory,ytvs._defaultFactory);
ytvs._echartsFactory.theme={};

ytvs._echartsFactory.create=function(params){
	this.parseParams(params);
	var component = new ytvs.Component(params);
	if(component.mergeConfig.series){
		for(var i=0;i<component.mergeConfig.series.length;i++){
			var sery = component.mergeConfig.series[i];
			if(sery.areaStyle!=null&&sery.areaStyle.color!=null){
				try{
					component.mergeConfig.series[i].areaStyle.color = eval(sery.areaStyle.color);
				}catch(e){
					
				}
			}
		}
	}
	
	var recursiveMergeConfig = function(parent,key){
		var node = parent[key];
		if(node==null||node=="null"||(typeof node =="Array" && node[0]=="null")){
			delete parent[key];
			return;
		}
		if(typeof node == "object"){
			for(var index in parent[key]){
				recursiveMergeConfig(parent[key],index);
			}
			
		}
	}
	recursiveMergeConfig(component,"mergeConfig");
	if(this.theme[ytvs.theme].colors!=null){
		component.mergeConfig.color = this.theme[ytvs.theme].colors;
		component.ec=echarts.init(document.getElementById(component.containerid));
	}else if(this.theme[ytvs.theme]!=null&&typeof this.theme[ytvs.theme] == "object"){
		var theme = this.theme[ytvs.theme];
		echarts.registerTheme(ytvs.theme,theme);
		component.ec=echarts.init(document.getElementById(component.containerid),ytvs.theme);
	}
	return component;
}	
document.write("<script src='./vs/greyBlack.js'></script>");
document.write("<script src='./vs/lightBlueBlack.js'></script>");
document.write("<script src='./vs/blueBlack.js'></script>");
document.write("<script src='./vs/default.js'></script>");
/**----------------客户端------------------------**/
/*
 * 编辑客户端
 */
ytvs.client={
	configFormId:"comBaseForm",
	configFormContextId:"comBaseFormContext",
	apiFormId : "comApiForm",
	apiFormContextId:"comApiFormContext",
	apiFormContextGlobalId:"comApiFormContextGlobal",
	eventFormId : "comEventForm",
	eventFormContextId : "comEventFormContext",
	/*
	 * 目标页面对象
	 */
	target:null,
	getAppData : function(appCode,callback){
		pf.ajax({
			url : rootUrl + "vs/vsApp/viewByCode?code="+appCode,
			success:callback
		});
	},
	getAppComData : function(appCode,callback){
		pf.ajax({
			url : rootUrl + "vs/vsAppCom/query",
			data : {
				filter : JSON.stringify({
					appid : appCode
				})
			},
			success : callback
		});
	},
	getComData:function(callback){
		var _this = this;
		var appCode = pf.get("ytvsAppCode").getValue();
		this.getAppData(appCode,function(app){
			if(app.theme!=null&&app.theme!=""){
				ytvs.theme = app.theme;
			}
			_this.getAppComData(appCode,function(data){
				var appComs = data.data;
				var comData = [];
				for(var i=0;i<appComs.length;i++){
					var appCom = appComs[i];
					var comConfig = {
							style:appCom.attrstyle,
							event:appCom.attrevent,
							datasource:appCom.attrdatasource
					};
					comData.push({templete:appCom.component,value:comConfig,containerid:appCom.containerid});
				}
				callback(comData);
			});
		})
		
	},
	refreshComponent:function(appCom,component,container){
		var comConfig = {
				style:appCom.attrstyle==null?"{}":appCom.attrstyle,
				event:appCom.attrevent==null?"{}":appCom.attrevent,
				datasource:appCom.attrdatasource==null?"{}":appCom.attrdatasource
		};
		ytvs.addCss(component.style,component.code);
		ytvs.addJs(component.js,component.code);
		var com = ytvs.create({templete:component,value:comConfig,containerid:container});
		com.superInit();
		com.superRender();
	},
	/**
	 * 展示工艺单模板
	 */
	showProcessList : function(comData, component, containerid) {
		var config;
		if(typeof component.config=="string"){
			config = JSON.parse(component.config);
		}else{
			config = component.config;
		}
		var attrdatasource = {};
		var attrevent = {};
		var attrstyle = {};
		try{
			attrstyle = JSON.parse(comData.attrstyle);
			attrdatasource = JSON.parse(comData.attrdatasource);
			attrevent = JSON.parse(comData.attrevent);
		}catch(e){
			
		}
		
		this.renderConfig(config,attrstyle,containerid);
		this.renderApi(config,attrdatasource);
		this.renderEvent(config,attrevent,containerid);
	},
	/**
	 * 获取工艺单数据
	 */
	getProcessData : function(component, containerid) {
		var config;
		if(typeof component.config=="string"){
			config = JSON.parse(component.config);
		}else{
			config = component.config;
		}
		var formData = window[this.configFormId].getData();
		var apidata = window[this.apiFormId].getData();
		var eventdata =  window[this.eventFormId].getData();
		
		var recursiveObj = new ytvs.controlFactory.recursive();
		recursiveObj.nodeParse(config.config, "config", config, {},
				function(parentKey, parentNode, data, obj, label) {
					var node = parentNode[parentKey];
					if(ytvs.isNode(node)==true){
						var value = formData[label];
						if (value == null) {
							value = formData;
						}
						// 递归设置data
						parentNode[parentKey] = eval("ytvs.controlFactory." + node.type
								+ "Data(value,node['default'],label)");
					}
				}, containerid);
		for (var key in apidata) {
			try{
				apidata[key] = JSON.parse(apidata[key]);
			}catch(e){
				
			}
		}
		if(JSON.stringify(eventdata)=="{}"){
			eventdata={0:0};
		}
		return {
			attrstyle : JSON.stringify(config.config),
			attrdatasource : JSON.stringify(apidata),
			attrevent:JSON.stringify(eventdata)
		};
	},
	
	/*
	 * 渲染事件控件
	 */
	renderEvent:function(config,attrevent,containerid){
		$("#"+this.eventFormId).empty();
		$("#"+this.eventFormId).append("<table style='width:100%' id='"+this.eventFormContextId+"'></table>");
		this.render(config,"event",attrevent,containerid,this.eventFormContextId);
	},
	/*
	 * 渲染config配置控件
	 */
	renderConfig:function(config,attrstyle,containerid){
		$("#"+this.configFormId).empty();
		$("#"+this.configFormId).append("<table class='form-table' style='width:100%' id='"+this.configFormContextId+"'></table>");
		
		this.render(config,"config",attrstyle,containerid,this.configFormContextId);
	},
	/*
	 * 渲染数据控件
	 */
	renderApi : function(config,attrdatasource){
		$("#"+this.apiFormId).empty();
		var api = config.api;
		var datasourceCenter = new ytvs.DataSourceCenter({templete:{config:config}});
		for ( var key in api) {
			var oneApi = api[key];
			var formJson = [];
			for ( var fieldKey in oneApi.fields) {
				var field = oneApi.fields[fieldKey];
				var fieldName = "api_"+key+"_"+fieldKey;
				formJson.push({label:fieldName,type:"text",name:field.descript + "映射key",default:fieldKey});
			}
			var datasource=new ytvs.DataSourceBase(key);
			formJson=formJson.concat(datasource.baseFormJson);
			for(var i=0;i<ytvs.dataSourceTypes.length;i++){
				datasource = new ytvs[ytvs.dataSourceTypes[i].obj](key,datasourceCenter);
				formJson=formJson.concat(datasource.formJson);
			}
			var tableid = this.apiFormContextId+key;
			this._showApiPanelByJson(formJson,tableid,oneApi.descript,attrdatasource);
		}
		
		
		this._showApiPanelByJson(datasourceCenter.formJson,
				this.apiFormContextGlobalId,"全局配置",attrdatasource);
		pf.parse();
		for(var key in api){
			var datasourceTypeValue = attrdatasource["api_source_type_"+key];
			if(datasourceTypeValue==null){
				datasourceTypeValue="static";
				
			}
			
			ytvs.client.datasourceTypeChangeCallback(datasourceTypeValue, key);
		}
		
		
		
		var formObj = eval("("+this.apiFormId+")");
		var formFields = formObj.getFields();
		for(var i=0;i<formFields.length;i++){
			var formField = formFields[i];
			if(formField.name.indexOf("api_source_type")>=0){
				formField.on("valuechanged",ytvs.client.datasourceTypeChange)
			}
		}
		
	
	},
	render:function(config,key,value,containerid,id){
		var recursiveObj = new ytvs.controlFactory.recursive();
		recursiveObj.htmlstr = "";
		var formatValue = {};
		formatValue[key]=value;
		recursiveObj.nodeParse(config[key],key,config,formatValue,
			function(parentKey, parentNode, data, obj, label){
				var htmlstr = "";
				var node = parentNode[parentKey];
				var nodeData = "";
				if(key=="config"){
					nodeData = data == null ? null : data[parentKey];
				}else{
					nodeData = data == null ? null : data[containerid+"_"+parentKey];
				}
				if(ytvs.isNode(node)==true){
					htmlstr = eval("ytvs.controlFactory." + node.type
							+ "Control(node,nodeData,label)");
					recursiveObj.htmlstr += htmlstr;
				}
		},containerid);
		$("#"+id).append(recursiveObj.htmlstr);
		pf.parse();
	},
	
	_showApiPanelByJson:function(formJson,tableid,title,attrdatasource){
		var panelStr = ytvs.controlFactory
		.getControl(
				"panel",
				{
					collapseOnTitleClick : true,
					showCollapseButton : true,
					skin : "green",
					title : title,
					style : "width:100%",
					children : "<table style=\"width:100%;\"  id=\""+tableid+"\"  class=\"form-table\"></table>"
				});
		$("#"+this.apiFormId).append(panelStr);
		
		for(var i=0;i<formJson.length;i++){
			var oneForm = formJson[i];
			var inputValue = attrdatasource[oneForm.label];
			if(typeof(inputValue)=="object"){
				inputValue = JSON.stringify(inputValue);
			}
			var formHtml = eval("ytvs.controlFactory." + oneForm.type
					+ "Control(oneForm,inputValue,oneForm.label)");
			$("#"+tableid).append(formHtml);
		}
	},
	/**
	 * 数据源类型控件valueexchanged事件
	 */
	datasourceTypeChange : function() {
		var value = this.getValue();
		var key = this.name.split("_")[3];
		ytvs.client.datasourceTypeChangeCallback(value, key);
	},
	datasourceTypeChangeCallback : function(type, key) {
		var inputFields = window[ytvs.client.apiFormId].getFields();
		
		var datasourceTypes = ytvs.dataSourceTypes;
		for(var i=0;i<datasourceTypes.length;i++){
			var typeValue = datasourceTypes[i].value;
			var name = "api_"+typeValue.toLowerCase();
			for(var j=0;j<inputFields.length;j++){
				if(inputFields[j].name.indexOf(name)>=0){
					if(type==typeValue){
						inputFields[j].setVisible(true);
					}else{
						inputFields[j].setVisible(false);
					}
					
				}
			}
		}
		return;
	},
	/**
	 * 数组点击事件
	 */
	arrayAdd : function(e) {
		var tabid = e.source.id.replace("panel", "tab");
		var label = e.source.id.replace("_panel", "");
		var tabs = pf.get(tabid);
		var lengthOfTab = tabs.getTabs().length;
		var containerid = label.split("_")[0];

		// 递归得到default
		var com = ytvs.client.target.ytvs.get(containerid);
		var arrayDefault = com.templete.config.config;
		var keys = label.split("_");
		for (var i = 1; i < keys.length; i++) {
			arrayDefault = arrayDefault[keys[i]];
		}
		var title = arrayDefault.name;
		arrayDefault = arrayDefault["default"];
		var recursiveObj = new ytvs.controlFactory.recursive();
		recursiveObj.nodeParse(arrayDefault[0], 0, arrayDefault, {
			0 : 0
		}, function(parentKey, parentNode, data, obj, label2) {
			var node = parentNode[parentKey];
			if(ytvs.isNode(node)==true){
				recursiveObj.htmlstr += eval("ytvs.controlFactory." + node.type
					+ "Control(node,null,label2)");
			}
		}, label + "_" + lengthOfTab);

		switch (e.name) {
		case "add":
			var tab = {
				title : title + "_" + (lengthOfTab + 1)
			};
			tabs.addTab(tab, lengthOfTab);
			tabs.getTabBodyEl(tabs.getTab(lengthOfTab)).innerHTML = '<table>'
					+ recursiveObj.htmlstr + '</table>';
			pf.parse();
			break;
		case "delete":
			tabs.removeTab(lengthOfTab-1);
			break;
		}
	}
}

/*------------gis适配-----------------*/


/**
 * 原料厂商(控件)
 */
ytvs.controlFactory={
	getControl : function(type, attrs) {
		return eval("this." + type + "(attrs)");
	},
	text : function(attrs) {
		var htmlstr = '<input class="mini-textbox" ';
		for ( var key in attrs) {
			htmlstr += key + '="' + attrs[key] + '" ';
		}
		htmlstr += " />";
		return htmlstr;
	},
	int : function(attrs) {
		var htmlstr = '<input class="mini-textbox" ';
		for ( var key in attrs) {
			htmlstr += key + '="' + attrs[key] + '" ';
		}
		htmlstr += " />";
		return htmlstr;
	},
	textarea : function(attrs) {
		var htmlstr = "<input class='mini-textarea' ";
		for ( var key in attrs) {
			htmlstr += key + "='" + attrs[key] + "' ";
		}
		htmlstr += " />";
		return htmlstr;
	},
	boolean : function(attrs) {
		var htmlstr = '<div class="mini-checkbox" ';
		for ( var key in attrs) {
			htmlstr += key + '="' + attrs[key] + '" ';
		}
		htmlstr += " />";
		return htmlstr;
	},
	select : function(attrs) {
		var htmlstr = '<input class="mini-combobox" ';
		for ( var key in attrs) {
			htmlstr += key + '="' + attrs[key] + '" ';
		}
		htmlstr += " />";
		return htmlstr;
	},
	array : function(attrs) {
		var htmlstr = '<div class="mini-tabs" ';
		for ( var key in attrs) {
			htmlstr += key + '="' + attrs[key] + '" ';
		}
		htmlstr += ">";
		for (var i = 0; i < attrs.tabs.length; i++) {
			htmlstr += '<div title="' + attrs.tabs[i].title + '">'
					+ attrs.tabs[i].children + '</div>';
		}
		htmlstr += '</div>';
		return htmlstr;
	},
	panel : function(attrs) {
		var htmlstr = '<div class="mini-panel" ';
		for ( var key in attrs) {
			if (key != "children") {
				htmlstr += key + '="' + attrs[key] + '" ';
			}
		}
		if (attrs.children != null) {
			htmlstr += ">" + attrs.children;
		}
		htmlstr += "</div>";
		return htmlstr;
	},
	color : function(attrs) {
		var htmlstr = '<input class="mini-textbox" ';
		for ( var key in attrs) {
			htmlstr += key + '="' + attrs[key] + '" ';
		}
		htmlstr += " />";
		return htmlstr;
	},
	intControl :  function(nodeTemplete, nodeData, label) {
		return "<tr><td>" + ytvs.controlFactory.getControl("text", {
			value : nodeData != null ? nodeData : nodeTemplete["default"],
			label : nodeTemplete.name,
			name : label,
			labelField : true
		}) + "</tr></td>";
	},
	arrayStringControl : function(nodeTemplete, nodeData, label) {
		return "<tr><td>" + ytvs.controlFactory.getControl("text", {
			value : nodeData != null ? nodeData : nodeTemplete["default"],
			label : nodeTemplete.name,
			name : label,
			labelField : true
		}) + "</tr></td>";
	},
	textControl : function(nodeTemplete, nodeData, label) {
		return "<tr><td>" + ytvs.controlFactory.getControl("text", {
			value : nodeData != null ? nodeData : nodeTemplete["default"],
			label : nodeTemplete.name,
			name : label,
			width : "80%",
			labelField : true
		}) + "</tr></td>";
	},
	textareaControl : function(nodeTemplete, nodeData, label) {
		return "<tr><td>" + ytvs.controlFactory.getControl("textarea", {
			value : nodeData != null ? nodeData : nodeTemplete["default"],
			label : nodeTemplete.name,
			name : label,
			width : "80%",
			height : "200",
			labelField : true
		}) + "</tr></td>";
	},
	booleanControl : function(nodeTemplete, nodeData, label) {
		return "<tr><td>" + ytvs.controlFactory.getControl("boolean", {
			value : nodeData != null ? nodeData : nodeTemplete["default"],
			text : nodeTemplete.name,
			name : label
		}) + "</tr></td>";
	},
	selectControl : function(nodeTemplete, nodeData, label) {
		var rangeData = JSON.stringify(nodeTemplete.range).replace(/["]/g,"'");
		return "<tr><td>" + ytvs.controlFactory.getControl("select", {
			value : nodeData != null ? nodeData : nodeTemplete["default"],
			data : rangeData,
			valueField : "value",
			textField : "name",
			label : nodeTemplete.name,
			name : label,
			labelField : true
		}) + "</tr></td>";
	},
	objectControl : function(nodeTemplete, nodeData, label){
		if(typeof nodeData == "string"){
			var reg = new RegExp( "\"" , "g" )
			nodeData=nodeData.replace(reg,"'");
		}
		return "<tr><td>" + ytvs.controlFactory.getControl("text", {
			value : nodeData != null ? nodeData : nodeTemplete["default"],
			label : nodeTemplete.name,
			name : label,
			labelField : true
		}) 
	},
	arrayControl : function(nodeTemplete, nodeData, label) {
		var _this = this;
		var tabs = [];

		var nodeTemp = {
			"default" : []
		};
		if (nodeData == null || nodeData.length <= 0) {
			nodeTemp["default"].push(JSON.parse(JSON
					.stringify(nodeTemplete["default"][0])));
		} else {
			for (var i = 0; i < nodeData.length; i++) {
				nodeTemp["default"].push(JSON.parse(JSON
						.stringify(nodeTemplete["default"][0])));
			}
		}
		for (var i = 0; i < nodeTemp["default"].length; i++) {
			if(typeof(nodeTemp["default"][i])!="object"){
				
			}
			var recursiveObj = new ytvs.controlFactory.recursive();
			recursiveObj.nodeParse(nodeTemp["default"][i], i,
					nodeTemp["default"], nodeData, function(parentKey,
							parentNode, data, obj, label) {
						var htmlstr = "";
						var node = parentNode[parentKey];
						var nodeData2 = data == null ? null : data[parentKey];
						if (node.name == null || node.type == null || typeof(node.type)!="string" ) {
							return htmlstr;
						}
						try{
							htmlstr = eval("_this." + node.type
									+ "Control(node,nodeData2,label)");
						}catch(e){
							
						}
						recursiveObj.htmlstr += htmlstr;
					}, label + "_" + i);
			tabs.push({
				title : nodeTemplete.name + "_" + (i + 1),
				children : "<table>" + recursiveObj.htmlstr + "</table>"
			});
		}
		var arrayAttrs = {
			id : label + "_tab",
			data : JSON.stringify(nodeTemplete["default"]),
			style : "width:99%;height:auto",
			tabs : tabs
		};
		var htmlstrTemp = ytvs.controlFactory.getControl("array",
				arrayAttrs);
		var htmlstr = "<tr><td>"
				+ ytvs.controlFactory.getControl("panel", {
					id : label + "_panel",
					buttons:"add delete",
					onbuttonclick:"ytvs.client.arrayAdd",
					children : htmlstrTemp,
					title : nodeTemplete.name,
					showToolbar:"true",
					style : "width:98%;height:auto"
				}) + "</tr></td>";
		
		return htmlstr;
	},

	booleanData : function(value, defaultValue) {
		return value == null ? defaultValue : (value == "true" ? true
				: false);
	},
	textData : function(value, defaultValue) {
		//console.log(value);
		//if(value=="null"){
		//	return null;
		//}
		return value == null || typeof value == "object" ? defaultValue : value;
	},
	objectData : function(value, defaultValue) {
		return this.textData(value,defaultValue);
	},
	intData : function(value,defaultValue){
		return value == null || typeof value == "object" ? parseInt(defaultValue) : parseInt(value);
	},
	colorData : function(value, defaultValue) {
		return value == null || typeof value == "object" ? defaultValue : value;
	},
	selectData : function(value, defaultValue) {
		return value == null ? defaultValue : value;
	},
	arrayStringData : function(value, defaultValue) {
		if(value!=null && typeof value == "string"){
			return value.split(",");
		}else{
			return defaultValue;
		}
	},
	arrayData : function(value, defaultValue, label) {
		var _this = this;
		if (value == null) {
			value = {};
		}
		var _value = value;
		var valueLength = 1;
		for (var i = valueLength; i < 10; i++) {
			for ( var key in value) {
				if (key.indexOf(label + "_" + i) >= 0) {
					valueLength++;
					break;
				}
			}
		}
		var nodeTemp = [];
		for (i = 0; i < valueLength; i++) {
			nodeTemp.push(JSON.parse(JSON.stringify(defaultValue[0])));
		}
		for (var i = 0; i < nodeTemp.length; i++) {
			var recursiveObj = new ytvs.controlFactory.recursive();
			recursiveObj.nodeParse(nodeTemp[i], i, nodeTemp, {}, function(
					parentKey, parentNode, data, obj, label2) {
				var node = parentNode[parentKey];
				var check = 0;
				for(var key in node){
					if(key=='name'||key=='default'||key=='type'){
						check++;
					}
				}
				if(check==3){
					parentNode[parentKey] = eval("_this." + node.type
							+ "Data(_value[label2],node['default'],label2)");
				}
				
			}, label + "_" + i);
		}
		return nodeTemp;
	},
	recursive : function() {
		this.htmlstr = "";
		/**
		 * 递归遍历
		 */
		this.nodeParse = function(node, parentKey, parentNode, data,
				callback, label) {
			if (!node) {
				return;
			}
			if (typeof node != 'object') {
				return;
			}
			callback(parentKey, parentNode, data, this, label);
			for ( var key in node) {
				if (key != "default") {
					var labelTemp = label + "_" + key;
					if (data == null) {
						data = {};
					}
					this.nodeParse(node[key], key, node, data[parentKey],
							callback, labelTemp);
				}
			}
		};
	}
}

var YTVSInterval={
	intervalMap:{},
	add:function(label,interval,that,callback){
		if(this.intervalMap[interval]==null){
			var intervalid = setInterval(function(){
				YTVSInterval.intervalCallback(interval);
			},interval);
			this.intervalMap[interval]={intervalid:intervalid,data:{}};
		}
		this.intervalMap[interval].data[label]={callback:callback,that:that};
	},
	intervalCallback:function(interval){
		var map = YTVSInterval.intervalMap[interval];
		for(var key in map.data){
			var intervalOne = map.data[key];
			intervalOne.callback(key,intervalOne.that);
		}
	}
	
}
/**
 * 轮播工具
 */
var YTVSAlternatePlay={
	/*
	 * 轮播鼠标状态
	 */
	status:"start",
	/*
	 * 鼠标停止计时
	 */
	mouseStopInterval:0,
	/*
	 * 停止多少秒后开启
	 */
	mouseStopMaxInterval:5,
	setMouseStopMaxInterval:function(interval){
		this.mouseStopMaxInterval=interval;
	},
	/*
	 * intervalid
	 */
	mouseStopIntervalId:0,
	
	/*
	 * 事件周期
	 */
	playInterval:2000,
	setPlayInterval:function(interval){
		this.playInterval=interval;
	},
	
	/*
	 * 轮播组件
	 */
	currentComPos:0,
	comContainers:[
	],
	
	
	init:function(){
		var _this = this;
		$("body").bind("mousemove",function(){
			_this.status="stop";
			_this.mouseStopInterval=0;
	 		if(_this.mouseStopIntervalId!=0){
	 			clearInterval(_this.mouseStopIntervalId);
	 			_this.mouseStopIntervalId=0;
	 		}
	 		_this.mouseStopIntervalId=setInterval(function(){
	 			_this.mouseStopInterval++;
				if(_this.mouseStopInterval>_this.mouseStopMaxInterval){
					clearInterval(_this.mouseStopIntervalId);
					_this.status="start";
				}
			},1000);
	 	})
	
		setTimeout(function(){
			_this.clickTrigger();
		},1000);
	},
	clickTrigger:function(){
		var _this = YTVSAlternatePlay;
		if(_this.currentComPos>=_this.comContainers.length){
			_this.currentComPos=0;
		}
		var comContainer = _this.comContainers[_this.currentComPos];
		var callback = _this[comContainer.callback];
		_this.currentComPos=(_this.currentComPos+1) % _this.comContainers.length;
		if(comContainer.type=="ytvs"){
			var com = YTVS.getCom(comContainer.id);
			callback(com,comContainer.params,_this.clickTrigger);
		}else{
			var com = pf.get(comContainer.id);
			callback(com,comContainer.params,_this.clickTrigger);
		}
		
	},
	tabClick:function(tab,params,callback){
		var activeIndex=params.index;
		if(activeIndex>=tab.getTabs().length){
			activeIndex=0;
		}
		tab.activeTab(tab.getTab(activeIndex));
		callback();
	},
	highlightEcharts:function(com,params,callback){
		var _this = YTVSAlternatePlay;
		
		var callbackData={seriesIndex:0,dataIndex:0};
		var callbackDataTemp = {seriesIndex:0,dataIndex:0};
		var intervalid = setInterval(function(){
			if(_this.status!="start"){
				return;
			}
			var ec = com.ec;
			var option = ec.getOption();
			
			
		   var sery = option.series[callbackData.seriesIndex];
		   if(callbackData.dataIndex>=sery.data.length){
		    	callbackData.dataIndex=0;
		    	callbackData.seriesIndex++;
		    	sery = option.series[callbackData.seriesIndex];
		    	if(sery!=null&&(sery.silent!=null&&sery.silent==true)){
		    		sery = option.series[++callbackData.seriesIndex];
		    	}
		    	if(sery==null){
		    		clearInterval(intervalid);
		    		callbackDataTemp.type = 'downplay';
					ec.dispatchAction(callbackDataTemp);
					callbackDataTemp.type = 'hideTip';
					ec.dispatchAction(callbackDataTemp);
		    		callback();
		    		return;
		    	}
		    	
		    }
			
			callbackDataTemp.type = 'downplay';
			ec.dispatchAction(callbackDataTemp);
			callbackDataTemp.type = 'hideTip';
			ec.dispatchAction(callbackDataTemp);
			callbackData.type = 'highlight';
			ec.dispatchAction(callbackData);
			callbackData.type = 'showTip';
			ec.dispatchAction(callbackData);
			callbackDataTemp.dataIndex=callbackData.dataIndex;
			callbackDataTemp.seriesIndex=callbackData.seriesIndex;
		    
		   callbackData.dataIndex++;
		   
		},_this.playInterval);		
	}
		
}