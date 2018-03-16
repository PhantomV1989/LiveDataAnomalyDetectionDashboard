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
	settingsObj.data=[];

var colNames=[];

var lastUsedSettings=[];

function updatePopup(jqObj, txt, eventFunctions)
{	
	var popup = $('.cd-popup');
	popup.find('.popupBody').html('<div class="settings form-inline" style="height: 25.5vw;">' +
	'	<button id="submit" type="submit" class="btn btn-default align-bottom" style="position:absolute;bottom: 0vw;margin: 2vw;right: 0vw;">'+txt+'</button>' +
	'</div>');
	$('button#submit').click(function()	{$('.cd-popup').removeClass('is-visible');}); // this is for default button fn if button fn is not implemented

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
	subg:
	{
		'':'',
		'2D':['','Marker', 'Line', 'Area', 'Density Contour', 'Marker-Line', 'Timed'],
		'3D':['','Marker', 'Line', 'Marker-Line', 'Surface', 'Timed'],		
	},
	
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
		var parent =  this;
		var subg = this.subg;
		customAppend($('.subgraphType'),createDropdown('Sub Graph Type',[subgraphTypeInput],Object.keys(subg))); 

		$('.'+subgraphTypeInput).change(function()
		{			
			settingsObj.subgraphType=this.value;
		
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
			customAppend($('.tableABA'),createDropdown('Graph Options',['optionA'],subg[this.value])); //optionA
			
			if(this.value=='2D'){parent.appendAxesTable(2);}
			else if(this.value=='3D'){parent.appendAxesTable(3);}

			$('.optionA').change(function()
			{
				customAppend($('.tableABB'),'');	
				settingsObj.optionA=this.value;				
			});

		});			
	},

	appendGraphOptionsA:function(title,classes,items)
	{
		customAppend($('.tableAB'),createDropdown(title,classes,items));
	},

	appendAxesTable:function(dim)//for kw, use x,y,z
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

		var data = {};

		$('.x-axis').change(function(){data.x=this.value;settingsObj.data[]=this.value;});
		$('.y-axis').change(function(){data.y=this.value;settingsObj.y=this.value;});
	},

};


var histogram = 
{	
	subg:
	{
		'':'',
		'Simple':['','Gaussian'], //kernel density estimation
		'Pyramid':[],		
		'Stacked':[],		
	},

	bin:[5,10,20,40,60,100],

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
		var parent =  this;
		var subg = this.subg;
		var bin = this.bin;
		customAppend($('.subgraphType'),createDropdown('Sub Graph Type',[subgraphTypeInput],Object.keys(subg))); 

		$('.'+subgraphTypeInput).change(function()
		{			
			settingsObj.subgraphType=this.value;
		
			var s = 	//1 col 2 rows for AB	
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
			customAppend($('.tableAA'),createDropdown('No. Of Bins (density)',['bins_count'],bin)); //bins_count

			customAppend($('.tableAB'),s); //optionA

			//table AB
			//table ABA
			customAppend($('.tableABA'),createDropdown('Column',['x-axis'],colNames));
			$('.x-axis').change(function(){settingsObj.x=this.value;});		
			//table ABB



			/*
			customAppend($('.tableABA'),createDropdown('Graph Options',['optionA'],subg[this.value])); //optionA	

			$('.optionA').change(function()
			{
				customAppend($('.tableABB'),'');	
				settingsObj.optionA=this.value;				
			});*/

		});			
	},

	appendGraphOptionsA:function(title,classes,items)
	{
		customAppend($('.tableAB'),createDropdown(title,classes,items));
	},

	appendAxesTable:function()//for kw, use x,y,z
	{		
		var s = '';	
		
		var vertical = 
		'<table class="table borderless">' +
			'<colgroup>' +
				'<col class="col-md-8">' +	//c1						
			'</colgroup>' +			
			'<tbody>' +
			'<tr class="axesContent">' + //r1
				'<td>' + 					
					createDropdown('Column 1', ['x-axis'],colNames) + 
				'</td>' +	//r1c1					
			'</tr>' +

			'</tbody>' +
		'</table>';	
		customAppend($('.tableAA'),vertical);	

		$('.x-axis').change(function(){settingsObj.x=this.value;});		
	},
};

function submitSettings(panelObj,readerResult)
{
	var graphFunction=graphTypeController();
	if(graphFunction)
	{
		if(!graphFunction(panelObj,readerResult,settingsObj))
		 {$('.cd-popup').addClass('is-visible');}		
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
			return histogramGraph.generateHistogram.generate;
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


function AppendSettings(graphObj, content, event)
{
  var svgObj = graphObj.svgObj;
  var width = graphObj.svgInfo.width;
  var height = graphObj.svgInfo.height;
  var id = 'settings';

  var gear = svgObj.append('svg').attr('id','settings').attr('transform','translate('+String(width-30)+','+String(8)+')')
  .attr('width','18').attr('height', '18').attr('viewBox','0 0 24 24');
  gear.html('<path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>');
 
  var gearBox = svgObj.append('rect').attr('id','settings').attr('width','18').attr('height','18').attr('style','opacity: 0').attr('transform','translate('+String(width-30)+','+String(8)+')');
  
  gearBox.on('click',function() 
  {
    updatePopup(content, 'Update', event)  
  });

  return id;
};

function CreateCheckBox(label,id)
{
  var s =
  '<input class='+id+' type="checkbox">' + 
  '<label  class='+id+'_label'+' style="position: absolute;font-size: 1vw;color: black;margin-left: 1vw;">'+label+'</label>' +
  '</input>';
  return s;
};

var abstractGraph=//var newObject = jQuery.extend(true, {}, oldObject);
{
	graphScaleWidth:0.85,
	graphScaleHeight:0.7,
	unitSize:unitSize,//unitSize declared in globalVariables.js
	MarkerSize:unitSize/100,
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

