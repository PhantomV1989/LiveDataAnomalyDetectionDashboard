var graphScaleWidth = graphScaleWidth;// declared in globalVariables.js
var graphScaleHeight = graphScaleHeight;
var unitSize = unitSize;

var MarkerSize = unitSize/150;
var lineThickness= unitSize/200;
var contourDensityValue=4;

var resolution = 1;


function AutomatedDateTimeParser(dataSample)  //['1pm', '2pm']
{
  /*
  //a datetime parser b smart estimation
  var lineA=dataSample[0];
  var lineB = dataSample[1];

  var aSplit = [], bSplit = [];

  if(lineA.search(' ')>0)
  {
    aSplit = lineA.split(' ');
  }
  else if (lineA.search(',')>0)
  {
    aSplit = lineA.split(',');
  };

  var twelveHourFormat = aSplit.find(function(e){
    var f(s){return e.toLowerCase().search(s)>0?true:false;};
    return f('am')||f('pm')?true:false;
  });*/
  return "";
};


var scatterGraph=jQuery.extend(true, {}, abstractGraph);//object inheritance

scatterGraph.generateScatter=
{
  generate:function(panelObj,dataCols,settingsObj)
  {    
    if(settingsObj.subgraphType)
    {
      switch(settingsObj.subgraphType)
      {
        case '2D':
          if(scatterGraph.generateScatter.generate2D(panelObj,dataCols,settingsObj))
            return true;
          else
            return false
        case '3D':
          if(scatterGraph.generateScatter.generate3D(panelObj,dataCols,settingsObj))
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

  generate2D:function(panelObj,dataCols,settingsObj)
  {
    var panelBGColor=panelObj[0].style.backgroundColor;
    var colorSet = colorSphereV2.GetHarmonicColorsFromRGB(panelBGColor,7);
    colorSet.shift();

    var getRngColor = function(){return colorSet[Math.floor(Math.random() * colorSet.length)]};
    

    function xaxisStyle(xaxisObj)
    {
      xaxisObj
      .selectAll(".tick text")
      .attr("transform", "rotate(90) translate(5,-15)")
      .attr("style","text-anchor: start")      
      .attr('font-size','6');
      return;
    };

    function yaxisStyle(yaxisObj)
    {
      yaxisObj
      .selectAll(".tick text")    
      .attr("style","text-anchor: start")      
      .attr('font-size','6');
      return;
    };

    if(!settingsObj.optionA)
    {
      alert('Please choose a sub graph option.');
      return false;
    };

    if(!settingsObj.data[0].x)
    {
      //alert('Please choose the x-axis.');
      //return false;
    };

    if(!settingsObj.data[0].y)
    {
      alert('Please choose the y-axis.');
      return false;
    };


    var svg = scatterGraph.generateSVG(panelObj)//this line must come first before svgInfo
        w=scatterGraph.svgInfo.width,
        h=scatterGraph.svgInfo.height,
        pw=scatterGraph.svgInfo.paintWidth*resolution,
        ph=scatterGraph.svgInfo.paintHeight*resolution;

    var x = settingsObj.xtimeparse?d3.scaleTime().range([0, pw]):d3.scaleLinear().range([0, pw]);
    var y = d3.scaleLinear().range([ph, 0]);

    var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y);

    var zoom = d3.zoom()
    .scaleExtent([1, 32])
    .translateExtent([[0, 0], [pw, ph]])
    .extent([[0, 0], [pw, ph]])
    .on("zoom", zoomed);

    var g = svg.append("g")
    .attr("transform", "translate(" + (1-graphScaleWidth)/2*w + "," + (1-graphScaleHeight)/2*(h*1.2) + ")");//left top

   

    update(dataCols);

    function update(data)
    {    

      //AutomatedDateTimeParser(data.map(x=>x[settingsObj.data[0].x]));
      if(!settingsObj.data[0].x)
      {
        var uniqueKey = 'count';
        var length = data.map(x=>x[settingsObj.data[0].y]).length;
        var incrementalArray = [...Array(length).keys()];

        for (i=0;i<length;i++)
        {
          data[i][uniqueKey]=incrementalArray[i];
        }
        settingsObj.data[0].x = uniqueKey;
      };



      if(settingsObj.xtimeparse)
      {
        var parseDate = d3.timeParse(settingsObj.xtimeparse);
        for(var i in data)
        {
          data[i][settingsObj.data[0].x]=parseDate(data[i][settingsObj.data[0].x]);
        };
      };


      var xRng = {
        min:d3.min(data, function(d) { return parseFloat(d[settingsObj.data[0].x]); }),
        max:d3.max(data, function(d) { return parseFloat(d[settingsObj.data[0].x]); }),
      };
      var yRng = {
        min:d3.min(data, function(d) { 
          return parseFloat(d[settingsObj.data[0].y]); }),
        max:d3.max(data, function(d) { return parseFloat(d[settingsObj.data[0].y]); }),
      };
     x.domain(d3.extent(data, function(d) { return d[settingsObj.data[0].x]; }));
     y.domain([yRng.min,yRng.max]);

     
      switch(settingsObj.optionA)//g2d:['','Marker', 'Line', 'Marker-Line', 'Timed']
      {
        case 'Marker':
          g.append("g").attr("class","Marker").attr("fill",getRngColor()).selectAll("g")
          .data(data)
          .enter().append("circle")
          .attr("r", MarkerSize)
          .attr("cx",function(d){
            return x(d[settingsObj.data[0].x]);})
          .attr("cy",function(d){return y(d[settingsObj.data[0].y]);})
          .attr('',function(d){var s='x:'+d[settingsObj.data[0].x] + '  y:'+d[settingsObj.data[0].y]; activateTooltipOnObject(s,this);});
          break;

        case 'Line':
          var line = d3.line()
          .x(function(d) { return x(d[settingsObj.data[0].x]); })
          .y(function(d) { return y(d[settingsObj.data[0].y]); });
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
          .x(function(d) {console.log(d[settingsObj.data[0].x]);return x(d[settingsObj.data[0].x]); })
          .y0(paintHeight)
          .y1(function(d) { return y(d[settingsObj.data[0].y]); });
          g.append("path")
          .datum(data)
          .attr("fill", "steelblue")
          .attr("d", area);
          break;

        case 'Density Contour':
           g.append("g").attr("class","Marker").attr("style", "visibility: hidden;").selectAll("g")
          .data(data)
          .enter().append("circle")
          .attr("r", MarkerSize)
          .attr("cx",function(d){return x(d[settingsObj.data[0].x]);})
          .attr("cy",function(d){return y(d[settingsObj.data[0].y]);})
          .attr('',function(d){var s='x:'+d[settingsObj.data[0].x] + '  y:'+d[settingsObj.data[0].y]; activateTooltipOnObject(s,this);});
       
          var group = g.append("g", "g")
          .attr("class","contour")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-width", 0)//<-----contour line setting
          .attr("stroke-linejoin", "round");

          var contourDensity = [];
          for(i=1;i<10;i++)
          {
            contourDensity.push(i*2);
             var contourObj=d3.contourDensity().x(function(d) { return x(d[settingsObj.data[0].x]); }).y(function(d) 
            { return y(d[settingsObj.data[0].y]); }).size([pw, ph]).bandwidth(i*2)(data);//d3.max(contourObj,function(d){return d.value;})
          

            group.append("g").attr("class",panelObj[0].id+"_density "+i*2)
            .attr("visibility",function(){return i*2==6?"visible":"hidden"})
            .selectAll("path")
            .data(contourObj)
            .enter().append("path")
            .attr("fill",  function(d){return getRngColor();})
            .attr('style','opacity: '+1/contourObj.length+';')
            .attr("d", d3.geoPath());
          }       

          // the following part for external settings
          var clClass = panelObj[0].id + 'cl';panelObj.clClass=false;
          var mClass = panelObj[0].id + 'M';panelObj.mClass=false;
          var checkboxContourlines = CreateCheckBox('Contour Lines', clClass);
          var checkboxMarkers = CreateCheckBox('Marker',mClass);
       
          var densityCloudDropdown = createDropdown('Density Cloud',[panelObj[0].id + 'contour_density_cloud'],contourDensity);
          panelObj.contourDensity=6;
         //AppendSettings(graphObj, content, event)
          var s = 
          '<div>' +
          checkboxContourlines +'<br>' +
          checkboxMarkers +'<br>' +
          densityCloudDropdown
          '</div>';

          var f = function()
          {            
            var fh = function(label,f1,proptyName)
            {
              $('.'+label).prop('checked',panelObj[proptyName]);

              $('.'+label+'_label').mousedown(function()
                {                
                  $('.'+label)[0].checked = $('.'+label)[0].checked?false:true; 
                  f1(label,proptyName);              
                });
              $('.'+label).change(function(){f1(label,proptyName);});

              $('.'+panelObj[0].id + 'contour_density_cloud')[0].value=panelObj.contourDensity;
              $('.'+panelObj[0].id + 'contour_density_cloud').change(
                function(){
                 $('.'+panelObj[0].id+"_density").attr("visibility","hidden");
                 $('.'+panelObj[0].id+"_density."+this.value).attr("visibility","visible");
                 panelObj.contourDensity=this.value;
                 })
            };

            var f1 = function(label,proptyName)
            {
                if($('.'+label)[0].checked){g.selectAll(".contour").attr("stroke-width", "0.3");}
                else{g.selectAll(".contour").attr("stroke-width", "0");};
                panelObj[proptyName]=$('.'+label)[0].checked;
            };

            fh(clClass,f1,'clClass');

            var f2 =  function(label,proptyName)
            {
                if($('.'+label)[0].checked){g.selectAll(".Marker").attr("style", "visibility: visible;");}
                else{g.selectAll(".Marker").attr("style", "visibility: hidden;");};
                panelObj[proptyName]=$('.'+label)[0].checked;
            };
            fh(mClass,f2,'mClass');
          };

          AppendSettings(scatterGraph, s, f);
          break;
      };

      var xx= g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + unitSize*graphScaleHeight + ")")
      .attr("width","100%")
      .call(xAxis);    
      xx.append("text")
      .attr("x", paintWidth)
      .attr("y", -6)
      .attr("style","text-anchor: end")
      .attr("font-size","6")
      .text(settingsObj.data[0].x);
      xaxisStyle(xx);

      var yy = g.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);
      yy.append("text")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("style","text-anchor: start")
      .attr("font-size","6")
      .text(settingsObj.data[0].y);
      yaxisStyle(yy);

      svg.call(zoom).transition();     
    };

    function zoomed() 
    {
      var t = d3.event.transform, 
      xt = t.rescaleX(x),
      yt=t.rescaleY(y);  //y is the scale range defined earlier
      var transitionInfo=g.transition().duration(100);
 

      var xx= g.select(".axis--x").transition(transitionInfo).call(xAxis.scale(xt));
      xaxisStyle(xx);

      var yy = g.select(".axis--y").transition(transitionInfo).call(yAxis.scale(yt));
      yaxisStyle(yy);

      g.selectAll("circle").transition(transitionInfo).attr("transform", d3.event.transform);//for density contour
      g.selectAll("path").transition(transitionInfo).attr("transform", d3.event.transform);//for density contour
    };
 
    if(settingsObj.title==''){settingsObj.title=panelObj.fileName+'_'+settingsObj.data[0].x+'_'+settingsObj.data[0].y;}
    scatterGraph.createTitle(svg,settingsObj.title);//title last to paint to set it infront
    return true;
  },

  generate3D:function(panelObj,dataCols,settingsObj)
  {alert('3D not done');},
};









