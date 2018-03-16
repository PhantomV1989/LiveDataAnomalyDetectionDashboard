var graphScaleWidth = graphScaleWidth;// declared in globalVariables.js
var graphScaleHeight = graphScaleHeight;
var unitSize = unitSize;

var histogramGraph = jQuery.extend(true, {}, abstractGraph);//object inheritance

histogramGraph.generateHistogram=
{
  generate:function(panelObj,readerResult,settingsObj)
	  {    
	    if(settingsObj.subgraphType)
	    {
	      switch(settingsObj.subgraphType)
	      {
	        case 'Simple':
	          if(histogramGraph.generateHistogram.generateSimple(panelObj,readerResult,settingsObj))
	            return true;
	          else
	            return false
	        case 'Pyramid':
	          if(histogramGraph.generateHistogram.generatePyramid(panelObj,readerResult,settingsObj))
	            return true;
	          else
	            return false
	        case 'Stacked':
	          if(histogramGraph.generateHistogram.generateStacked(panelObj,readerResult,settingsObj))
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

  generateSimple:function(panelObj,readerResult,settingsObj)
	  {
	    if(!settingsObj.x)
	    {
	      alert('Please choose a column.');
	      return false;
	    };


	    var svg = histogramGraph.generateSVG(panelObj)//this line must come first before svgInfo
	        w=histogramGraph.svgInfo.width,
	        h=histogramGraph.svgInfo.height,
	        pw=histogramGraph.svgInfo.paintWidth,
	        ph=histogramGraph.svgInfo.paintHeight;

	    var x = d3.scaleLinear().range([0, pw]),
	    y = d3.scaleLinear().range([ph, 0]);

	    var xAxis = d3.axisBottom(x),
	    yAxis = d3.axisLeft(y);

	    var zoom = d3.zoom()
	    .scaleExtent([1, 32])
	    .translateExtent([[0, 0], [pw, ph]])
	    .extent([[0, 0], [pw, ph]])
	    .on("zoom", zoomed);

	    var g = svg.append("g")
	    .attr("transform", "translate(" + (1-graphScaleWidth)/2*w + "," + (1-graphScaleHeight)/2*(h*1.2) + ")");//left top

	    var dataCols = d3.csvParse(readerResult);

	    update(dataCols);

	    function update(data)
	    {    
	      var xRng = {
	        min:d3.min(data, function(d) { return parseFloat(d[settingsObj.x]); }),
	        max:d3.max(data, function(d) { return parseFloat(d[settingsObj.x]); }),
	      };
	      var yRng = {
	        min:d3.min(data, function(d) { return parseFloat(d[settingsObj.y]); }),
	        max:d3.max(data, function(d) { return parseFloat(d[settingsObj.y]); }),
	      };
	      x.domain([xRng.min,xRng.max]);
	      y.domain([yRng.min,yRng.max]);

	     
	      switch(settingsObj.optionA)//g2d:['','Marker', 'Line', 'Marker-Line', 'Timed']
	      {
	        case 'Marker':
	          g.append("g").attr("class","Marker").selectAll("g")
	          .data(data)
	          .enter().append("circle")
	          .attr("r", MarkerSize)
	          .attr("cx",function(d){return x(d[settingsObj.x]);})
	          .attr("cy",function(d){return y(d[settingsObj.y]);})
	          .attr('',function(d){var s='x:'+d[settingsObj.x] + '  y:'+d[settingsObj.y]; activateTooltipOnObject(s,this);});
	          break;
	        case 'Line':
	          var line = d3.line()
	          .x(function(d) { return x(d[settingsObj.x]); })
	          .y(function(d) { return y(d[settingsObj.y]); });
	          g.append("path")
	          .datum(data)
	          .attr("fill", "none")
	          .attr("stroke", "steelblue")
	          .attr("stroke-linejoin", "round")
	          .attr("stroke-linecap", "round")
	          .attr("stroke-width", lineThickness)
	          .attr("d", line);
	          break;
	        case 'Area':
	          var area = d3.area()
	          .x(function(d) {console.log(d[settingsObj.x]);return x(d[settingsObj.x]); })
	          .y0(paintHeight)
	          .y1(function(d) { return y(d[settingsObj.y]); });
	          g.append("path")
	          .datum(data)
	          .attr("fill", "steelblue")
	          .attr("d", area);
	          break;
	        case 'Density Contour':
	          var startColor=panelObj[0].style.backgroundColor;

	           g.append("g").attr("class","Marker").selectAll("g")
	          .data(data)
	          .enter().append("circle")
	          .attr("r", MarkerSize)
	          .attr("cx",function(d){return x(d[settingsObj.x]);})
	          .attr("cy",function(d){return y(d[settingsObj.y]);})
	          .attr('',function(d){var s='x:'+d[settingsObj.x] + '  y:'+d[settingsObj.y]; activateTooltipOnObject(s,this);});

	          function customColorGradient(start,end,interval)//rgb(230, 240, 250)
	          { 
	            var startColor=start.split("(")[1].split(")")[0].split(","),
	            endColor=end.split("(")[1].split(")")[0].split(",");
	            function h(n){return ((+endColor[n])-(+startColor[n]))*interval+(+startColor[n]);};
	            return 'rgb('+h(0)+','+h(1)+','+h(2)+')';
	          };

	          var contourObj=d3.contourDensity().x(function(d) { return x(d[settingsObj.x]); }).y(function(d) 
	          { return y(d[settingsObj.y]); }).size([paintWidth, paintHeight]).bandwidth(contourDensityValue)(data);//d3.max(contourObj,function(d){return d.value;})
	          var colorDivisor=d3.max(contourObj,function(d){return d.value;});//normalize contourObj values against its highest value

	          g.insert("g", "g")
	          .attr("class","contour")
	          .attr("fill", "none")
	          .attr("stroke", "#000")//<-----contour line setting
	          .attr("stroke-width", 0.3)
	          .attr("stroke-linejoin", "round")
	          .selectAll("path")
	          .data(contourObj)
	          .enter().append("path")
	          .attr("fill",  function(d) {return customColorGradient(startColor,'rgb(0,255,0)',d.value/colorDivisor);})
	          .attr("d", d3.geoPath());

	          // the following part for external settings
	          var clID = panelObj[0].id + 'cl';panelObj.clID=true;
	          var mID = panelObj[0].id + 'M';panelObj.mID=true;
	          var checkboxContourlines = CreateCheckBox('Contour Lines', clID);
	          var checkboxMarkers = CreateCheckBox('Marker',mID);
	         //AppendSettings(graphObj, content, event)
	          var s = 
	          '<div>' +
	          checkboxContourlines+'<br>' +
	          checkboxMarkers+
	          '</div>';

	          var f = function()
	          {            
	            $('#'+clID).prop('checked',panelObj.clID);
	            $('#'+mID).prop('checked',panelObj.mID);


	            $('#'+clID).change(function()
	              {
	                if(this.checked){g.selectAll(".contour").attr("stroke-width", "0.3");}//
	                else{g.selectAll(".contour").attr("stroke-width", "0");};
	                panelObj.clID=this.checked;
	              });

	            $('#'+mID).change(function()
	              {
	                if(this.checked){g.selectAll(".Marker").attr("style", "visibility: visible;");}
	                else{g.selectAll(".Marker").attr("style", "visibility: hidden;");};
	                panelObj.mID=this.checked;
	              });
	          };

	          AppendSettings(histogramGraph, s, f);
	          break;
	      };

	      g.append("g")
	      .attr("class", "axis axis--x")
	      .attr("transform", "translate(0," + unitSize*graphScaleHeight + ")")
	      .attr("width","100%")
	      .call(xAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("x", paintWidth)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text(settingsObj.x);

	      g.append("g")
	      .attr("class", "axis axis--y")
	      .call(yAxis)
	      .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text(settingsObj.y);

	      svg.call(zoom).transition();

	     
	    };

	    function zoomed() 
	    {
	      var t = d3.event.transform, 
	      xt = t.rescaleX(x),
	      yt=t.rescaleY(y);  //y is the scale range defined earlier
	      var transitionInfo=g.transition().duration(100);
	      g.selectAll("circle").transition(transitionInfo)
	        .attr("cx", function(d) { return xt(d[settingsObj.x]);})   
	        .attr("cy", function(d) { return yt(d[settingsObj.y]);});   
	      g.select(".axis--x").transition(transitionInfo).call(xAxis.scale(xt)); //g.select(".axis--x").call(xAxis.scale(xt));
	      g.select(".axis--y").transition(transitionInfo).call(yAxis.scale(yt));
	      g.selectAll("path").transition(transitionInfo).attr("transform", d3.event.transform);//for density contour
	    };

	 
	    if(settingsObj.title==''){settingsObj.title=panelObj.fileName+'_'+settingsObj.x+'_'+settingsObj.y;}
	    histogramGraph.createTitle(svg,settingsObj.title);//title last to paint to set it infront
	    return true;
	  },

  generatePyramid:function(panelObj,readerResult,settingsObj)
  {alert('Pyramid not done');},

  generateStacked:function(panelObj,readerResult,settingsObj)
  {alert('Stacked not done');},
};
