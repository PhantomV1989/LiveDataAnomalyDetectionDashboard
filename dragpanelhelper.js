
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
var panelColor='rgb(100,30,30)';

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

  initiate:function()
  {
    // START PACKERY
    // ---------------------------------------------

    var $grid = $('.grid').packery({
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

  createPanelTemplateButton:function(no)
  {
    var panelInfo = panelInfoList[no];
    var w=panelInfo.w,
    h=panelInfo.h,
    panelButtonID=panelInfo.panelButtonID,
    panelClassType=panelInfo.panelClassType;
    $('#panelSelectionWindow').append('<button type="button" id="'+panelInfo.panelButtonID+'" class="btn btn-new-panel">'+panelInfo.panelButtonText+'</button>');
    this.createPanelTemplate(w,h,panelButtonID,panelClassType);   
  },

  createPanelTemplate:function(w,h,panelButtonID,panelClassType)
  {
    $grid=this.sharedVariables.$grid;
    var thisNamespace=this;
    $('#'+panelButtonID).click(function() 
    {
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






overheads.initiate();