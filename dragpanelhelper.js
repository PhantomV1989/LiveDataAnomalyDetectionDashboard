
/*
:root
{
  --gap: 5px;
  --unit-size: 200px;
}

.grid {
  background: #0D454C;
}

*/


var unitSize = unitSize,//unitSize declared in globalVariables.js
gap=5;//5px

var panelCount=0;//to keep track of panel id
var panelColor='rgb(0,255,255)';



var panelInfoList=
[
  {
    panelButtonID:'panelButtonOne',
    panelButtonText:'Add 1x1 Panel',
    panelClassType:'panelTypeOne',
    w:1,
    h:1,
  },
  {
    panelButtonID:'panelButtonTwo',
    panelButtonText:'Add 2x1 Panel',
    panelClassType:'panelTypeTwo',
    w:2,
    h:1,
  },
];

var panelInfoSelector=
{
  selectByClass:function(panelClass)
  {
    var panelInfo;
    for(i=0;i<panelInfoList.length;i++)
    {
      if(panelClass==panelInfoList[i].panelClassType)
      {
        panelInfo = panelInfoList[i];
        break;
      }
    };
    return panelInfo;
  },

  selectByPanel:function(panelObj)
  {
    return this.selectByClass(panelObj[0].classList[1]);
  },

};



var styling =
{
  generateStyle:function()
  {
    var style=document.createElement('style');
    style.type='text/css';
    var styleContent = 
    'body' +
    '{' +
    ' background-color: #001EFF;' +
    ' color:#FFFFFF;' +
    '}';
    if(style.styleSheet)
    {
      style.styleSheet.cssText=styleContent;
    }
    else
    {
      style.appendChild(document.createTextNode(styleContent));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
  },

  calculateDimension:function(u){return unitSize * u + gap * (u-1);},//for both width and height, u is unit, for grid-item,

  unitStyle:function(w,h)
  {
    var s = 
    '.grid-item.six' +
    '{' +
    'width: calc(var(--unit-size) * ' + w + ' + var(--gap) * ' + w-1 + ');   ' +
    'height: calc(var(--unit-size) * ' + h + ' + var(--gap) * ' + h-1 + ');' +
    '}';
    return s;
  },

  parseDimension:function(s)
  {
    var pos=0;
    for(i=0;i<s.length;i++)
    {
      if(s[i].match(/[a-z]/i))
      {
        pos=i;
        break;
      }
    }

    var unit = s.slice(i);
    var value = s.replace(unit,'');
    return [parseFloat(value),unit];
  },

  scaleDimensionString:function(s,k)
  {
    var rS = this.parseDimension(s);
    var newValue = parseFloat(rS[0])*k+rS[1];
    return newValue;
  },
};


var overheads =
{
  sharedVariables:
  {
    $grid:$('.grid'),
  },

  initiate:function(gridName)//gridName = '.grid'
  {
    // START PACKERY
    // ---------------------------------------------

    var $grid = $(gridName).packery({
    itemSelector: '.grid-item',
    gutter: '.gutter-sizer',
    percentPosition: true
    });

    this.sharedVariables.$grid = $grid;


    // MAKE ALL GRID ITEMS DRAGGABLE
    // ---------------------------------------------
    $grid.find('.grid-item').each( function( i, gridItem ) {
    var draggie = new Draggabilly( gridItem );
    // bind drag events to Packery
    $grid.packery( 'bindDraggabillyEvents', draggie );
    });


    // REARRANGE ITEMS FTER DRAG
    // ---------------------------------------------
    $grid.on( 'dragItemPositioned',
    function( event, draggedItem ) {
      //console.log( 'Packery drag item positioned', draggedItem.element );
      setTimeout(function() {
        $grid.packery('layout');
      }, 10);
    }
    );
    this.attachDocumentHotkeys();

    for(i=0;i<panelInfoList.length;i++)
    {
      panelling.createPanelTemplateButton(i);
    };
  },

  attachDocumentHotkeys:function()//in initiate
  {
    function customToggleResize(obj,classLabel,k)
    {      
      var panelClass = obj.classList[1];//assume panelClass is 2nd ele
      var panelInfo=panelInfoSelector.selectByClass(panelClass);

      if(!obj.classList.contains(classLabel))
      {

        obj.style.width=styling.calculateDimension(panelInfo.w*k)+'px';
        obj.style.height=styling.calculateDimension(panelInfo.h*k)+'px';

        obj.classList = ['grid-item'];
        obj.classList.add(panelInfo.panelClassType); //assume default only 1 class that is grid-item, need to clear other classes
        obj.classList.toggle(classLabel);
      }
      else
      {
        obj.style.width=styling.calculateDimension(panelInfo.w)+'px';
        obj.style.height=styling.calculateDimension(panelInfo.h)+'px';   
        obj.classList.toggle(classLabel);
      };
    };

    $("body").keydown(function(e)
    {
      try
      {
        var obj = $(':hover').eq(5)[0];//obj[0].style.width
        var k = 1;
        switch(e.which)//
        {
          case 46:
            $grid.packery( 'remove', obj ).packery('layout');
            //$(obj).remove();

            /*
            $grid.on( 'click', '.grid-item', function( event ) 
            {            
            $grid.packery( 'remove', event.currentTarget ).packery('shiftLayout');
            });*/
            break;
          case 49:
            customToggleResize(obj,'expandedOne',1);           
            break;
          case 50:       
            customToggleResize(obj,'expandedTwo',2);
            break;
          case 51:
            customToggleResize(obj,'expandedThree',3);
            break;
          case 52:
            customToggleResize(obj,'expandedFour',4);
            break;
          case 53:
            customToggleResize(obj,'expandedFive',5);
            break;
          case 54:            
            customToggleResize(obj,'expandedSix',6);
            break;
        };        
        setTimeout(function() 
        {
          $grid.packery('layout');
           setTimeout(function() 
            {
              $grid.packery('layout');
            }, 100);//this is 1st adjustment
        }, 200);//this is 2nd adjustment, at least same time as main transition
      }
      catch(err)
      {
        //do nothing, obj undefined error because user mouse on unintended target.
      }        
    });
  },

}

var panelling =
{
  sharedVariables:
  {
    $grid:overheads.sharedVariables.$grid,//panelling must happen after overheads.initiate
  },



  createRealTimeDataPanel:function(myData,gridName)
  {    
    var myPanelArray = myData.map(x=>[x[0], x[1],this.createPanel(panelInfoList[0],gridName)]);

    myPanelArray.forEach(function(dp)
    {      
      var title = dp[0];
      var dataCol = dp[1];
      var panelObj = dp[2];

      var panelBGColor=panelObj[0].style.backgroundColor;   

      var data = [];     
      var globalX = 0;
      var duration = 10;
      var max = 500;
      var step = 1;

      var svg = scatterGraph.generateSVG(panelObj)//this line must come first before svgInfo
          w=scatterGraph.svgInfo.width,
          h=scatterGraph.svgInfo.height,
          width=scatterGraph.svgInfo.paintWidth*resolution,
          height=scatterGraph.svgInfo.paintHeight*resolution;


      var maxY = d3.max(dataCol, function(d) { return parseFloat(d); })
      var minY = d3.min(dataCol, function(d) { return parseFloat(d); })
      var x = d3.scaleLinear().domain([0, 500]).range([0, width]);
      var y = d3.scaleLinear().domain([minY, maxY]).range([h*8/9, 0]);
      // -----------------------------------

      var lineArea = d3.area()
                .x(function(d){ return x(d.x); })
                .y0(y(0))
                .y1(function(d){ return y(d.y); })
                .curve(d3.curveCardinal);


      var area = d3.area()
          .x(function(d) {return x(d.x); })
          .y0(y(minY))
          .y1(function(d) { return y(d.y); });
      // -----------------------------------
      // Draw the axis
      var xAxis = d3.axisBottom(x),
      yAxis = d3.axisLeft(y);
      //var xAxis = d3.axisBottom().scale(x);
      //var axisX = svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(xAxis);

      var g = svg.append("g")
      .attr("transform", "translate(" + (1-graphScaleWidth)/2*w + "," + (1-graphScaleHeight)/2*(h*1.2) + ")");//left top

      var xx= g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + unitSize*graphScaleHeight + ")")
      .attr("width","100%")
      .call(xAxis);       

      var yy = g.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);
    



    
      // Append the holder for line svg and fill area     
      var areaPath = svg.append('path');

      var cloneData = []
      // Main loop
      function tick() {
        // Generate new data
        if(cloneData.length==0) cloneData = dataCol.map(x=>x);

        var point = {
          x: globalX,
          y: cloneData.shift()
        };
        data.push(point);
        globalX += step;
        
        // Draw new fill area
        areaPath.datum(data)
          .attr('fill', 'steelblue')
          .attr('d', area);
        // Shift the svg left
        var newX_domain = [globalX - (max - step), globalX];

        x.domain(newX_domain);
        xx.transition()
           .duration(duration)
           .ease(d3.easeLinear,2)
           .call(xAxis);       
        areaPath.attr('transform', null)
          .transition()
          .duration(duration)
          .ease(d3.easeLinear,2)
          .attr('transform', 'translate(' + x(globalX - max) + ')')
          .on('end', tick)
        // Remote old data (max 50 points)
        if (data.length > 800) data.shift();
      }


      text = title.slice(0,11);
      svg.append("text")
      .attr("x",width/2)
      .attr("y",30)
      .attr("font-family","Verdana")//text-anchor="middle"
      .attr("text-anchor","middle")
      .attr("font-size",'18')
      .html(text);

      tick();    

    });
    
  },

  createRealTimeDataPanelWithTrigger:function(myData,gridName,gridName2, trigger)
  {    
    var myPanelArray = myData.map(x=>[x[0], x[1],this.createPanel(panelInfoList[0],gridName)]);

    function GenerateGraph(dp,domainXY)
    {
      var title = dp[0];
      var dataCol = dp[1];
      var panelObj = dp[2];
      var triggerCount = 0;

      var panelBGColor=panelObj[0].style.backgroundColor;   

      var data = [];     
      var globalX = 0;
      var duration = 10;
      var max = 500;
      var step = 1;

      var svg = scatterGraph.generateSVG(panelObj)//this line must come first before svgInfo
          w=scatterGraph.svgInfo.width,
          h=scatterGraph.svgInfo.height,
          width=scatterGraph.svgInfo.paintWidth*resolution,
          height=scatterGraph.svgInfo.paintHeight*resolution;


     
      var g = svg.append("g")
      .attr("transform", "translate(" + (1-graphScaleWidth)/2*w + "," + (1-graphScaleHeight)/2*(h*1.2) + ")");//left top

      if(typeof domainXY=='undefined')
      {        
        var maxY = d3.max(dataCol, function(d) { return parseFloat(d); })
        var minY = d3.min(dataCol, function(d) { return parseFloat(d); })

        var x = d3.scaleLinear().domain([0, 500]).range([0, width]);
        var y = d3.scaleLinear().domain([minY, maxY]).range([h*8/9, 0]);
        // -----------------------------------
          // Draw the axis
        var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);
        //var xAxis = d3.axisBottom().scale(x);
        //var axisX = svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(xAxis);

        var xx= g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + unitSize*graphScaleHeight + ")")
        .attr("width","100%")
        .call(xAxis);       

        var yy = g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);


        var area = d3.area()
            .x(function(d) {return x(d.x); })
            .y0(y(minY))
            .y1(function(d) { return y(d.y); });
        // -----------------------------------
        // Append the holder for line svg and fill area
        var areaPath = svg.append('path');

        var cloneData = [];
        // Main loop
        function tick() {
          // Generate new data
          if(cloneData.length==0) cloneData = dataCol.map(x=>x);

          var point = {
            x: globalX,
            y: cloneData.shift()
          };
          data.push(point);
          globalX += step;
          
          // Draw new fill area
          areaPath.datum(data)
            .attr('fill', 'steelblue')
            .attr('d', area);
          // Shift the svg left
          var newX_domain = [globalX - (max - step), globalX];
          x.domain(newX_domain);
          xx.transition()
             .duration(duration)
             .ease(d3.easeLinear,2)
             .call(xAxis);       
          areaPath.attr('transform', null)
            .transition()
            .duration(duration)
            .ease(d3.easeLinear,2)
            .attr('transform', 'translate(' + x(globalX - max) + ')')
            .on('end', tick)
          // Remote old data (max 50 points)
          if (data.length > 800) data.shift();

          var myPath = this;
          if(triggerCount==trigger && Math.random()>0.7) //x% chance of triggering
          {            
            var outputPanel = panelling.createPanel(panelInfoList[0],gridName2);

            //asynchrounous function, Impt! data format has changed totally
            setTimeout(GenerateGraph([dp[0],data,outputPanel],[newX_domain,[minY, maxY]]),1000);

            myPath.style.fill="red";
            $(myPath).one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function()
            {
              myPath.style.fill="steelblue";
            });
          }
          triggerCount++;
        }


        text =  title.slice(0,11);
        svg.append("text")
        .attr("x",width/2)
        .attr("y",30)
        .attr("font-family","Verdana")//text-anchor="middle"
        .attr("text-anchor","middle")
        .attr("font-size",'18')
        .html(text);

        tick();   

      }
      else
      {
      

        var x = d3.scaleLinear().domain(domainXY[0]).range([0, width]);
        var y = d3.scaleLinear().domain(domainXY[1]).range([height, 0]);
        // -----------------------------------
          // Draw the axis
        var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);
        //var xAxis = d3.axisBottom().scale(x);
        //var axisX = svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0, 500)').call(xAxis);


      
         var area = d3.area()
        .x(function(d) {return x(d.x); })
        .y0(y(domainXY[1][0]))
        .y1(function(d) { return y(d.y); });

        var areaPath = g.append('path');
        areaPath.datum(dataCol)
        .attr('fill', 'steelblue')
        .attr('d', area);



        var xx= g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + unitSize*graphScaleHeight + ")")
        .attr("width","100%")
        .call(xAxis);       

        var yy = g.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);



        var group = g.append("g")
        .attr("class","contour")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 0)//<-----contour line setting
        .attr("stroke-linejoin", "round");

     

        var rngGenerator = Array.apply(null,{length:dataCol.length}).map(Number.call,Number);
        var rngA = Math.random();
        var rngB = Math.random();
        rngGenerator = rngGenerator.map(x=>Math.sin(x*3.14/dataCol.length*rngA+rngB*100));

        var rngData = dataCol.filter(x=>Math.random()>rngGenerator.shift()+0.4);

        var contourObj=d3.contourDensity().x(function(d) { return x(d.x); }).y(function(d) 
        { return y(d.y); }).size([width, height]).bandwidth(4)(rngData);//d3.max(contourObj,function(d){return d.value;})

        group.append("g").attr("class",panelObj[0].id+"_density")
        .attr("visibility","visible")
        .selectAll("path")
        .data(contourObj)
        .enter().append("path")
        .attr("fill",  function(d){return GetOpposingRngColor(panelBGColor,2);})
        .attr('style','opacity: '+1/contourObj.length+';')
        .attr("d", d3.geoPath());
        

      };
     
    };

    myPanelArray.forEach((dp)=>GenerateGraph(dp));    
  },



  createXPanel:function(n,gridName)
  {      
    var panelInfo = panelInfoList[0];   

    for(i=0;i<n;i++)
    {
      this.createPanel(panelInfo,gridName);
    }   
  },

  createPanel:function(panelInfo,gridName)
  {
      var $grid = $(gridName);
      var w=panelInfo.w,
        h=panelInfo.h,
        panelButtonID=panelInfo.panelButtonID,
        panelClassType=panelInfo.panelClassType;

      var thisNamespace=this;
      var cw=styling.calculateDimension(w),
      panelID = 'panel_'+panelCount,
      ch=styling.calculateDimension(h);
      var $item = $(
        '<div class="grid-item '+panelClassType+'" id="'+panelID+'" style="width:'+cw+'px;height:'+ch+'px;background:'+panelColor+';">'+
          '<div class="wrapper">'+
              '<div class="drop" style="border: 3px dashed rgb(218, 223, 227); background: transparent;">'+
                '<div class="cont">'+
                  '<i class="fa fa-cloud-upload"></i>'+ //for drag drop
                  '<div class="tit">'+
                    '<h4>Drag &amp; Drop</h4>'+
                  '</div>'+               
                  '<div class="browse">'+
                    '<h4>Click to browse</h4>'+              
                  '</div>'+
                '</div>'+              
                /*
                REMEMBER TO CORRECT VIEWBOX DIMENSIONS
                */               
                '<input id="files" multiple="true" name="files[]" type="file">'+//to hold input
              '</div>'+
            '</div>'+
        '</div>');
      panelCount++;
      $grid.append($item).packery( 'appended', $item );   
       var draggie = new Draggabilly( $item[0] );
      $grid.packery( 'bindDraggabillyEvents', draggie );


      var panelObj=$('#'+panelID);
      thisNamespace.attachDragDrop(panelObj);
      thisNamespace.attachUploadSelectionPopup(panelObj);

      return panelObj;
  },

  createPanelTemplateButton:function(no)
  {
    var panelInfo = panelInfoList[no];
    var thisNamespace=this;//better to declare this because onevent cannot access its original class with 'this'
  
    $('#panelSelectionWindow').append('<button type="button" id="'+panelInfo.panelButtonID+'" class="btn btn-new-panel">'+panelInfo.panelButtonText+'</button>');
    $grid=this.sharedVariables.$grid;
    

    $('#'+panelInfo.panelButtonID).click(function() 
    {
      thisNamespace.createPanel(panelInfo,'.grid');   
    });
  },


  attachDragDrop:function(panelObj)
  {   
    var drop = panelObj.find($('input'));
    drop.on('dragenter', function (e) {
      $(".drop").css({
        "background": "rgba(0, 153, 255, .05)"
      });
      $(".cont").css({
        "color": "#09f"
      });    
    }).on('dragleave dragend mouseout drop', function (e) {
      $(".drop").css({     
        "background": "transparent"
      });
      $(".cont").css({
        "color": "#FFFFFF"
      });
    });
  },

  attachUploadSelectionPopup:function(panelObj)
  {
    var drop = panelObj.find($('input'));
    function handleFileSelect(evt) 
    {       
      var files = evt.target.files; // FileList object
      for (var i = 0, f; f = files[i]; i++) 
      {
        if (window.CP.shouldStopExecution(1)){break;}

        var fileType = f.name.split('.').pop();
        if(fileType=='csv')
        {
          var reader = new FileReader();
          reader.readAsText(f);
          reader.onload = function(e) 
          { 
            panelObj.fileName = files[0].name;
            attachGraphSettingsScript(panelObj,reader.result);//graphSettingsController.js             
          };         
        }
        else//for debugging
        {
         alert("Please upload a CSV file.")
        };
      }
      window.CP.exitedLoop(1);
    };

    drop.change(handleFileSelect);
  },

}





