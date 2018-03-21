var graphScaleWidth = graphScaleWidth;// declared in globalVariables.js
var graphScaleHeight = graphScaleHeight;
var unitSize = unitSize;

var histogramGraph = jQuery.extend(true, {}, abstractGraph);//object inheritance

histogramGraph.generateHistogram=
{
	generate:function(panelObj,dataCols,settingsObj)
	{    
		if(settingsObj.subgraphType)
		{
		  switch(settingsObj.subgraphType)
		  {
		    case 'Simple':
		      if(histogramGraph.generateHistogram.generateSimple(panelObj,dataCols,settingsObj))
		        return true;
		      else
		        return false
		    case 'Pyramid':
		      if(histogramGraph.generateHistogram.generatePyramid(panelObj,dataCols,settingsObj))
		        return true;
		      else
		        return false
		    case 'Stacked':
		      if(histogramGraph.generateHistogram.generateStacked(panelObj,dataCols,settingsObj))
		        return true;
		      else
		        return false
		    default:
		      alert('Sub graph type not found.');
		      return false;
		  }
		}
		else
		{
		  alert("Please choose a sub graph type.");
		  return false
		}
	},

	generateSimple:function(panelObj,dataCols,settingsObj)
	{
		if(!settingsObj.data[0].x)
		{
		  alert('Please choose a column.');
		  return false;
		};

		//histogram code
		var svg = histogramGraph.generateSVG(panelObj)//this line must come first before svgInfo
		    w=histogramGraph.svgInfo.width,
		    h=histogramGraph.svgInfo.height,
		    pw=histogramGraph.svgInfo.paintWidth*1.1,
		    ph=histogramGraph.svgInfo.paintHeight*1.15;

		var d_raw = [];
		var d_hist = [];

		var xMax=+(dataCols[0][settingsObj.data[0].x]),xMin=+(dataCols[0][settingsObj.data[0].x]);

		for(var i in settingsObj.data)
		{
			var n = settingsObj.data[i].x;	
			var data = dataCols.map(x=>+(x[n]));
			d_raw.push(data);

			if (Math.max.apply(Math,data)>xMax) xMax=Math.max.apply(Math,data);
			if (Math.min.apply(Math,data)<xMin) xMin=Math.min.apply(Math,data);
		};

		var buffer = (xMax-xMin)/(settingsObj.bins-2);
		var x = d3.scaleLinear().domain([xMin-buffer, xMax+2*buffer]).range([0, pw]);

		for(var i in d_raw)
		{						
			var temp_his = d3.histogram().thresholds(x.ticks(settingsObj.bins))(d_raw[i].map(x=>+(x)));
			d_hist.push(temp_his);	  //max value = d.slice(-1)[0].x1, min value = d[0].d0	
		};


		function getMaxCount(data)
		{
			var max=0;
			for(var d in data) data[0].forEach(function(e){if(e.length>max) max=e.length;});
			return max;
		};


		// A formatter for counts.
		var formatCount = d3.format(",.0f");

		var y = d3.scaleLinear()
		    .domain([0, getMaxCount(d_hist)*1.4])
		    .range([ph, 0]);

		var xAxis = d3.axisBottom(x);
			
			
		var getRNG_Color=function(){return 'rgb('+String(parseInt(Math.random()*255))+','
		                                         +String(parseInt(Math.random()*255))+','
		                                         +String(parseInt(Math.random()*255))+')';};			
		for(var i in d_hist)
		{
			var group = svg.append("g").attr("class","data group_"+i).attr("style","stroke-width: 1px;stroke: black;");
			var bar = group.selectAll(".bar")
			.data(d_hist[i])
			.enter().append("g")		       
			.attr("transform", function(d) { 
			return "translate(" + x(+(d.x0)) + "," + y(d.length) + ")"; 
			});

			//assuming every bar is of same thickness
			var thickness = x(+(d_hist[i][1].x1))-x(+(d_hist[i][1].x0));//need to readjust x0 for 1st ele and x1 for last












































			bar.append("rect")
			.attr("x", 1)
			.attr("width", function(d){return thickness;})
			.attr("height", function(d) { return (ph - y(d.length));})
			.attr("fill", getRNG_Color())
			.attr("opacity", 1)
			//.on("mouseover",  function (d){onMouseOver(d)})
			//.on("mouseout", function (d){onMouseOut(d);})
			;


			bar.append("text")  
			.attr("dy", ".75em")
			.attr("y", -8)
			.attr("x", function(d){return (x(+(d.x1)) - x(+(d.x0)))/2;})
			.attr("text-anchor", "middle")
			.attr("style","font-size: 8px;stroke-width: 0.2px;fill:"+"rgb(255,255,255)"+";")
			.text(function(d) { return d.length; });
		};

			

		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + ph + ")")
		.call(xAxis)
		.selectAll(".tick text")
		.attr("transform", "rotate(90) translate(5,-15)")	
		.attr("style","text-anchor: start");



		//end of histogram code

		if(settingsObj.title==''){settingsObj.title=panelObj.fileName+'_'+settingsObj.data[0].x;}
		histogramGraph.createTitle(svg,settingsObj.title);//title last to paint to set it infront
		return true;
	},
	
	generatePyramid:function(panelObj,dataCols,settingsObj)
	{
		alert('Pyramid not done');
	},

	generateStacked:function(panelObj,dataCols,settingsObj)
	{
		alert('Stacked not done');
	},
};
