var graphScaleWidth = 0.85;
var graphScaleHeight = 0.7;

var unitSize = unitSize;//unitSize declared in globalVariables.js

var dotSize = unitSize/150;
var lineThickness= unitSize/200;
var contourDensityValue=6;



var scatterGraph=jQuery.extend(true, {}, abstractGraph);//object inheritance

function AppendSettings(graphObj)
{
  var svgObj = graphObj.svgObj;
  var width = graphObj.svgInfo.width;
  var height = graphObj.svgInfo.height;
  var id = 'settings';
  var gear = svgObj.append('svg').attr('id','settings').attr('transform','translate('+String(width-30)+','+String(8)+')')
  .attr('width','18').attr('height', '18').attr('viewBox','0 0 24 24');
  gear.html('<path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>');
  gear.on('click',function()
  {
    var popup = $('.cd-popup');
    popup.toggleClass('is-visible');
  });

  return id;
};

function AppendCheckBox(svgObj,label,position)
{
  //label eg 'Boy', position eg '[10,10]'
  var chkbxObj = svgObj.append('g').attr('id', label);;
  var id = label+'_check'; 
  chkbxObj.append('rect').attr('transform','translate('+position[0]+','+position[1]+')').attr('width','8').attr('height','8').attr('fill','#FFFFFF').attr('stroke','#00ABBB').attr('stroke-width','0');


   chkbxObj.append('polygon').attr('id',id).attr('transform','translate('+String(position[0]-3.5)+','+String(position[1]+0.5)+')')//6.5,10.5
  .attr('points','6.736691468, 4.348678044 3.794815034, 3.069598093 3.155282512, 3.28278057 6.736691468, 6.906823039 11.89564479, 0.426171164 11.00029627, 0.426171164')
  .attr('fill','#000000');

  chkbxObj.append('text').attr('transform','translate('+String(position[0]+9)+','+String(position[1]+7)+')')
  .style('font-size','6px').html(label);
 
  return id;
};


scatterGraph.generateScatter=
{
  generate:function(panelObj,readerResult,settingsObj)
  {    
    if(settingsObj.subgraphType)
    {
      switch(settingsObj.subgraphType)
      {
        case '2D':
          if(scatterGraph.generateScatter.generate2D(panelObj,readerResult,settingsObj))
            return true;
          else
            return false
        case '3D':
          if(scatterGraph.generateScatter.generate3D(panelObj,readerResult,settingsObj))
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

  generate2D:function(panelObj,readerResult,settingsObj)
  {

    if(!settingsObj.optionA)
    {
      alert('Please choose a sub graph option.');
      return false;
    };

    if(!settingsObj.x)
    {
      alert('Please choose the x-axis.');
      return false;
    };

    if(!settingsObj.y)
    {
      alert('Please choose the y-axis.');
      return false;
    };


    var svg = scatterGraph.generateSVG(panelObj)//this line must come first before svgInfo
        w=scatterGraph.svgInfo.width,
        h=scatterGraph.svgInfo.height,
        pw=scatterGraph.svgInfo.paintWidth,
        ph=scatterGraph.svgInfo.paintHeight;

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

     
      switch(settingsObj.optionA)//g2d:['','Dot', 'Line', 'Dot-Line', 'Timed']
      {
        case 'Dot':
          g.append("g").selectAll("g")
          .data(data)
          .enter().append("circle").attr("class","dot")
          .attr("r", dotSize)
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

           g.append("g").selectAll("g")
          .data(data)
          .enter().append("circle").attr("class","dot")
          .attr("r", dotSize)
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

         
          AppendSettings(scatterGraph);
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

 
    scatterGraph.createTitle(svg,settingsObj.title);//title last to paint to set it infront
    return true;
  },

  generate3D:function(panelObj,readerResult,settingsObj)
  {alert('3D not done');},
};









