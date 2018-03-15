 window.console = window.console || function(t) {};
     if (document.location.search.match(/type=embed/gi)) {
      window.parent.postMessage("resize", "*");
    }

// START PACKERY
  // ---------------------------------------------
  var $grid = $('.grid').packery({
    itemSelector: '.grid-item',
    gutter: '.gutter-sizer',
    percentPosition: true
  });


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



  $("body").keydown(function(e)
  {
    try
    {
      var obj = $(':hover').eq(5);
      switch(e.which)
      {
        case 46:
          $(obj).remove();
          break;
        case 49:
          obj.removeClass('two');
          obj.removeClass('three');
          obj.removeClass('four');  
          obj.removeClass('five');  
          obj.removeClass('six');  
          break;

        case 50:
          obj.toggleClass('two');
          obj.removeClass('three');
          obj.removeClass('four');  
          obj.removeClass('five');  
          obj.removeClass('six');  
          break;

        case 51:
          obj.removeClass('two');
          obj.toggleClass('three');
          obj.removeClass('four'); 
          obj.removeClass('five');  
          obj.removeClass('six');           
          break;
        case 52:
          obj.removeClass('two');
          obj.removeClass('three');
          obj.toggleClass('four');  
          obj.removeClass('five');  
          obj.removeClass('six');  
          break;
        case 53:
          obj.removeClass('two');
          obj.removeClass('three');
          obj.removeClass('four');  
          obj.toggleClass('five');  
          obj.removeClass('six');  
          break;
        case 54:
          obj.removeClass('two');
          obj.removeClass('three');
          obj.removeClass('four');  
          obj.removeClass('five');  
          obj.toggleClass('six');  
          break;
      }       
      setTimeout(function() {       
        $grid.packery('layout');
      }, 400);   
    }    
    catch(err)
    {
      alert(err);
    }        
  });

 

  $(".btn-new-panel").click(function() {      
    var $item = $(
      '<div class="grid-item">'+
        '<div class="wrapper">'+
            '<div class="drop" style="border: 3px dashed rgb(218, 223, 227); background: transparent;">'+
              '<div class="cont">'+
                '<i class="fa fa-cloud-upload"></i>'+
                '<div class="tit">'+
                  '<h4>Drag &amp; Drop</h4>'+
                '</div>'+               
                '<div class="browse">'+
                  '<h4>Click to browse</h4>'+              
                '</div>'+
              '</div>'+
              '<output id="list"></output>'+
              '<input id="files" multiple="true" name="files[]" type="file">'+
            '</div>'+
          '</div>'+
      '</div>');


    $grid.append($item).packery( 'appended', $item );   
     var draggie = new Draggabilly( $item[0] );
    $grid.packery( 'bindDraggabillyEvents', draggie );

    var drop = $("input").last();
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


      function handleFileSelect(evt) {
           
        $('body').append(mainGraphSettings.settingsPopup());// graph settings popup
        functionObj.dropdown();
        $('button#submit').click(function()
        {
          alert('submitted');
        });

        var files = evt.target.files; // FileList object
        var js_grid_item = evt.currentTarget.parentElement.parentElement.parentElement;
        var output_obj = $(js_grid_item).eq(0).find('output');
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {if (window.CP.shouldStopExecution(1)){break;}


          // Only process image files.
          if (!f.type.match('image.*')) {
            continue;
          }

          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              // Render thumbnail.
              var span = document.createElement('span');
              span.innerHTML = ['<img class="thumb" src="', e.target.result,
                                '" title="', escape(theFile.name), '"/>'].join('');
              $(output_obj).append(span);    
            };
          })(f);

          // Read in the image file as a data URL.
          reader.readAsDataURL(f);
        }
      window.CP.exitedLoop(1);
      }

      drop.change(handleFileSelect);
      //# sourceURL=pen.js
    }
  )