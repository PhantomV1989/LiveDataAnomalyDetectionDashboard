/*
The different fields are
.titleInput
.graphTypeInput
.subGraphTypeInput

*/


var graphTypeHTMLArray = ['','Scatter','Histogram','Circular'];
var graphTypeInput='graphTypeInput',
	subgraphTypeInput='subgraphTypeInput';

var settingsObj={};

var colNames=[];

var lastUsedSettings=[];

function attachGraphSettingsScript(panelObj,readerResult)
{
	var dataCols = d3.csvParse(readerResult);
	colNames=Object.keys(dataCols[0]);colNames.unshift('');

	var popup = $('.cd-popup');
	popup.append(mainGraphSettings.settingsPopupHTML());// graph settings popup
	mainGraphSettings.attachEvents();//attach dropdown event to graph type

	popup.toggleClass('is-visible');

	$('button#submit').click(function()
	{
		popup.toggleClass('is-visible');
		submitSettings(panelObj,readerResult);
	});
};

var mainGraphSettings =
{
	settingsPopupHTML:function()
	{
		var lastUsedOptions=lastUsedSettings.map(function(a){return a.title;});
		lastUsedOptions.unshift('');
		var s =
		'<div class="settings" style="width: 49.5vw;height: 25.5vw;">' +			
			'<div class="form-inline">' +//action="DA_engine.html" method="post"
				this.mainTableHTML() +
				'<button id="submit" type="submit" class="btn btn-default align-bottom" style="position:fixed;right: 27vw;top: 32vw;">Submit</button>' +
			'</div>' +
			'<svg class="closeButton" preserveAspectRatio="xMaxYMax" style="position: absolute;top: 0px;right: 0px; cursor: pointer;width: 2vw;" viewBox="0 0 9.15 9.15">' +
			  '<g>' +
			    '<path style="opacity:1;fill:none;fill-opacity:1;stroke:#000000;stroke-width:0.87900001;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 1.1718002,0.4395 c -0.18793031,0 -0.37590407,0.0720939 -0.51990596,0.21609581 -0.28800418,0.28800418 -0.28800418,0.75140969 0,1.03941369 L 2.2116125,3.254728 0.65189424,4.8144464 c -0.28800418,0.2880042 -0.28800418,0.7518084 0,1.0398123 0.28800398,0.2880042 0.75180806,0.2880042 1.03981226,0 L 3.2514248,4.2945403 4.8107446,5.8542587 c 0.2880042,0.2880042 0.7518084,0.2880042 1.0398124,0 0.2880041,-0.2880039 0.2880041,-0.7518081 0,-1.0398123 L 4.2908385,3.254728 5.850557,1.6950095 c 0.2880041,-0.288004 0.2880041,-0.75140951 0,-1.03941369 -0.288004,-0.28800397 -0.7518082,-0.28800397 -1.0398124,0 L 3.2514248,2.2153145 1.6917065,0.65559581 C 1.5477045,0.51159393 1.3597306,0.4395 1.1718002,0.4395 Z" id="rect862-7-3" inkscape:connector-curvature="0"></path>' +
			  '</g>' +
			'</svg>' +
			'<div class="lastUsed" style="position: fixed;top: 11.45vw;left: 46vw; cursor: pointer;">'+
				createDropdown('Load last used settings',['lastUsedOptions'],lastUsedOptions,'style="width: 13vw;height: 2vw;margin-left: 1vw;"')+
			'</div>'+
		'</div>';
		return s;
	},

	mainTableHTML:function()
	{
		var s = 		
		'<table class="mainSettingsTable table borderless">' +
			'<colgroup>' +
				'<col class="col-md-8">' +				
			'</colgroup>' +			
			'<tbody>' +
			'<tr>' + //first row
				'<td>' + this.titleHTML() + '</td>' +				
			'</tr>' +
			'<tr>' + //2nd row
				'<td>' + this.graphTypeHTML() + '</td>' +				
			'</tr>' +
			'<tr>' + //3rd row
				'<td class="tableA"></td>' +				
			'</tr>' +
			'</tbody>' +
		'</table>';
		return s;
	},

	titleHTML:function()
	{	
		settingsObj.title='';
		var s =
		'<div>' +
				'<label>Title</label>' +
			  	'<input name="title" class="titleInput text" placeholder="Optional" style="margin-left: 1vw;">' +
		'</div>';
		return s;
	},

	graphTypeHTML:function()
	{
		var s = 		
		'<table class="table borderless">' +
			'<colgroup>' +
				'<col class="col-md-4">' +		
				'<col class="col-md-4">' +			
			'</colgroup>' +			
			'<tbody>' +
			'<tr>' + //r1
				'<td class="graphType">' + createDropdown('Graph Type',[graphTypeInput],graphTypeHTMLArray) + '</td>' + //r1c1
				'<td class="subgraphType"></td>' + //r1c2
			'</tr>' +			
			'</tbody>' +
		'</table>';		
		return s;
	},

	graphTypeEvent_Dropdown:function()
	{
		$('.'+graphTypeInput).change(function()
		{
			settingsObj.graphType=this.value;
			switch(this.value)
			{
				case "Scatter":
					scatter.appendTableA();
					break;
				case "Histogram":
					histogram.appendTableA();
					break;
				case "Circular":
					break;
				case "Bubble":
					break;
			}
		});
	},

	closeButtonClick:function(){$('.closeButton').click(function(){$('.settings').remove();$('.cd-popup').removeClass('is-visible');})},

	titleChangeEvent:function()	{$('.titleInput').change(function(){settingsObj.title=this.value;});},

	lastUsedChangeEvent:function(){$('.lastUsedOptions').change(function()
	{
		var chosenSettings=lastUsedSettings[$('.lastUsedOptions')[0].selectedIndex-1].content;
		//settingsObj=jQuery.extend(true, {}, chosenSettings);






















	});},

	attachEvents:function(){
		this.graphTypeEvent_Dropdown();
		this.titleChangeEvent();
		this.closeButtonClick();
		//this.lastUsedChangeEvent();
	},
};	
	

var scatter = 
{
	subg:['','2D', '3D'],
	g2d:['','Dot', 'Line', 'Area', 'Density Contour', 'Dot-Line', 'Timed'], //optionA
	g3d:['','Dot', 'Line', 'Dot-Line', 'Surface', 'Timed'], //optionA

	
	appendTableA:function()
	{
		var s = 
		'<table class="table borderless tableA">' +
			'<colgroup>' +
				'<col class="col-md-5">' +	//c1	
				'<col class="col-md-5">' +	//c2		
			'</colgroup>' +			
			'<tbody>' +
			'<tr>' + //r1
				'<td class="tableAA"></td>' +	//r1c1
				'<td class="tableAB"></td>' +	//r1c2					
			'</tr>' +
			'</tbody>' +
		'</table>';
	
		customAppend($('.tableA'),s);		
		this.appendSubgraph();		
	},

	appendSubgraph:function()
	{				
		var Graph2D = this.Graph2D;
		var Graph3D = this.Graph3D;
		var parent =  this;
		customAppend($('.subgraphType'),createDropdown('Sub Graph Type',[subgraphTypeInput],this.subg)); 

		$('.'+subgraphTypeInput).change(function()
		{			
			settingsObj.subgraphType=this.value;
			var rs = ['Graph Options', 'optionA'];		
			switch(this.value)//this is jQ object
			{
				case "2D":
					Graph2D.populate(parent,rs);					
					break;
				case "3D":
					Graph3D.populate(parent, rs);					
					break;			
			}
		});			
	},

	appendGraphOptionsA:function(title,classes,items)
	{
		customAppend($('.tableAB'),createDropdown(title,classes,items));
	},

	appendAxesTable:function(dim,kwAxesNames)//for kw, use x,y,z
	{		
		var s = '';
		if(dim==3)
		{
			var s = 
				'<td>' + 					
					createDropdown('z-axis', ['z-axis'],colNames) + 
				'</td>';
		}		
		
		var vertical = 
		'<table class="table borderless">' +
			'<colgroup>' +
				'<col class="col-md-8">' +	//c1						
			'</colgroup>' +			
			'<tbody>' +
			'<tr class="axesContent">' + //r1
				'<td>' + 					
					createDropdown('x-axis', ['x-axis'],colNames) + 
				'</td>' +	//r1c1					
			'</tr>' +
			'<tr class="axesContent">' + //r2
				'<td>' + 					
					createDropdown('y-axis', ['y-axis'],colNames) + 
				'</td>' +	//r2c1							
			'</tr>' +
			'<tr class="axesContent">' + //r3
				s
			'</tr>' +
			'</tbody>' +
		'</table>';	
		customAppend($('.tableAA'),vertical);	

		$('.x-axis').change(function(){settingsObj.x=this.value;});
		$('.y-axis').change(function(){settingsObj.y=this.value;});
	},
	
	Graph2D:
	{
		populate:function(parent, rs)
		{			
			var s = 		
			'<table class="table borderless">' +	
				'<colgroup>' +
					'<col class="col-md-8">' +				
				'</colgroup>' +				
				'<tbody>' +
					'<tr>' + //r1
						'<td class="tableABA"></td>' + 				
					'</tr>' +	
					'<tr>' + //r1
						'<td class="tableABB"></td>' + 				
					'</tr>' +
				'</tbody>' +						
			'</table>';		
			customAppend($('.tableAB'),s); //optionA
			customAppend($('.tableABA'),createDropdown(rs[0],[rs[1]],parent.g2d)); //optionA
			this.attachOptionA_Events();
			parent.appendAxesTable(2,2);
			
		},

		attachOptionA_Events:function()
		{
			$('.optionA').change(function()
			{
				customAppend($('.tableABB'),'');	
				settingsObj.optionA=this.value;
				/*				
				if(this.value=='Dot')
				{
					var s = '<label><input type="checkbox">Density Contour</label>';
					customAppend($('.tableABB'),s);					
				}
				else if(this.value=='Line')
				{
					var s = '<label><input type="checkbox">Area</label>';
					customAppend($('.tableABB'),s);			
				}*/
			});
		},		
	},

	Graph3D:
	{
		populate:function(parent, rs)
		{
			var s = 		
			'<table class="table borderless">' +	
				'<colgroup>' +
					'<col class="col-md-8">' +				
				'</colgroup>' +				
				'<tbody>' +
					'<tr>' + //r1
						'<td class="tableABA"></td>' + 				
					'</tr>' +	
					'<tr>' + //r1
						'<td class="tableABB"></td>' + 				
					'</tr>' +
				'</tbody>' +						
			'</table>';		
			customAppend($('.tableAB'),s); //optionA
			customAppend($('.tableABA'),createDropdown(rs[0],[rs[1]],parent.g3d)); //optionA		
			parent.appendAxesTable(3,2);
		},		
	},
};


var histogram = 
{	
	appendTableA:function()
	{
		var s = 
		'<table class="table borderless tableA">' +
			'<colgroup>' +
				'<col class="col-md-5">' +	//c1	
				'<col class="col-md-5">' +	//c2		
			'</colgroup>' +			
			'<tbody>' +
			'<tr>' + //r1
				'<td class="tableAA"></td>' +	//r1c1
				'<td class="tableAB"></td>' +	//r1c2					
			'</tr>' +
			'</tbody>' +
		'</table>';
	
		customAppend($('.tableA'),s);					
		this.appendSubgraph();
		//this.appendAxesTable();
	},

	appendSubgraph:function()
	{
		customAppend($('.subgraphTypeHTML'),createDropdown('',[],['Simple', 'Pyramid', 'Stacked']));				
	},

	appendAxesTable:function(dim,kwAxesNames)//for kw, use x,y,z
	{
		var vertical = 
		'';	
		customAppend($('.tableAA'),vertical);	
	},	
};

function submitSettings(panelObj,readerResult)
{
	var graphFunction=graphTypeController();
	if(graphFunction)
	{
		if(graphFunction(panelObj,readerResult,settingsObj))
		{
			updateLastUsedSettings();	
			$('.settings').remove();
			settingsObj={};
		};
	}
	else alert('Please Choose a graph type.');		
};

function customAppend(jqObj,appendContent)
{
	jqObj.children().remove();
	jqObj.append(appendContent);
};


function createDropdown(label,extraClasses,items,etc)
{
	var classesS = 'dropdown';
	var itemsS = '';
	for(var c in extraClasses){classesS += ' ' + extraClasses[c];}
	for(var i in items){itemsS += '<option>' + items[i] + '</option>';}
	var s = 
		'<label>' + label + '</label>' + 
		'<select class="' + classesS +'"'+etc+'>' +//etc='style="width: 225px;height: 34px;margin-left: 1vw;"'
					itemsS +			
		'</select>';
	return s;
};


function activateTooltipOnObject(text,eventObjToFollow)//
{
  var jqObj=$(eventObjToFollow);
  var ttObj=$('#tooltip')[0];
  var offset=15;     

  jqObj.mouseover(function(e)
  {    
    ttObj.innerHTML=text;
    ttObj.style.visibility='visible';
  });

  jqObj.mousemove(function(e)
  {
    ttObj.style.left = (e.pageX+offset).toString() + "px";
    ttObj.style.top = (e.pageY-offset).toString() + "px";
  });
  jqObj.mouseleave(function(e)
  {
    ttObj.style.visibility='hidden';
  });  
};

function graphTypeController()
{
	var gt=settingsObj.graphType;
	switch(gt)
	{
		case 'Scatter'://['','Scatter','Histogram','Circular']
			return scatterGraph.generateScatter.generate;
		case 'Histogram':
			return '';
		case 'Circular':
			return '';
		default:
			return false;
	};
};

function updateLastUsedSettings()
{
	var item=
	{
		title:'~'+settingsObj.title+'~',
		content:jQuery.extend(true, {}, settingsObj),
	};

	lastUsedSettings.unshift(item);

	if(lastUsedSettings.length>15)
		lastUsedSettings.pop(-1);	
};


var abstractGraph=//var newObject = jQuery.extend(true, {}, oldObject);
{
	graphScaleWidth:0.85,
	graphScaleHeight:0.7,
	unitSize:unitSize,//unitSize declared in globalVariables.js
	dotSize:unitSize/100,
	lineThickness:unitSize/200,
	contourDensityValue:20,

	generateSVG:function(panelObj)
	{
		var panelInfo = panelInfoSelector.selectByPanel(panelObj);

		var width = panelInfo.w*unitSize,
		height = panelInfo.h*unitSize;
		paintWidth = width*graphScaleWidth,
		paintHeight = height*graphScaleHeight;

		panelObj.find($('.wrapper'))[0].innerHTML='<svg></svg>';//clear contents
		var svg = d3.select('#'+panelObj[0].id).select("svg");
		svg.attr("width","100%")// '<svg width="100%" height="100%" preserveAspectRatio="xMaxYMax" viewBox="0 0 9.15 9.15"></svg>'+
		.attr("height","100%")
		.attr("preserveAspectRatio","xMaxYMax")
		.attr("viewBox","0 0 "+width+" "+height+"");

		this.svgInfo=
		{
			width:width,
			height:height,
			paintWidth:paintWidth,
			paintHeight:paintHeight,
		};

		this.svgObj=svg;

		return svg;
	},

	createTitle:function(svg,text)
	{
		svg.append("text")
		.attr("x",this.svgInfo.width/2)
		.attr("y",30)
		.attr("font-family","Verdana")//text-anchor="middle"
		.attr("text-anchor","middle")
		.attr("font-size",'25')
		.html(text);
	},
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

