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

function updatePopup(jqObj, txt, eventFunctions)
{
	var popup = $('.cd-popup');
	popup.find('.popupBody').html('<div class="settings form-inline" style="height: 25.5vw;">' +
	'	<button id="submit" type="submit" class="btn btn-default align-bottom" style="position:absolute;bottom: 0vw;margin: 2vw;right: 0vw;">'+txt+'</button>' +
	'</div>');
	popup.find('.settings').append(jqObj);

	eventFunctions();

	popup.toggleClass('is-visible');
};


function attachGraphSettingsScript(panelObj,readerResult)
{
	var dataCols = d3.csvParse(readerResult);
	colNames=Object.keys(dataCols[0]);colNames.unshift('');

	myFunc=function()
	{
		mainGraphSettings.attachEvents();
		$('button#submit').click(function()
		{
			$('.cd-popup').removeClass('is-visible');
			submitSettings(panelObj,readerResult);
		});
	};

	updatePopup(mainGraphSettings.settingsPopupHTML(),'Submit',myFunc);
};

var mainGraphSettings =
{
	settingsPopupHTML:function()
	{
		//var lastUsedOptions=lastUsedSettings.map(function(a){return a.title;});
		//lastUsedOptions.unshift('');
		var s =	this.mainTableHTML();
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
		mainGraphSettings.graphTypeEvent_Dropdown();
		mainGraphSettings.titleChangeEvent();
		mainGraphSettings.closeButtonClick();

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

