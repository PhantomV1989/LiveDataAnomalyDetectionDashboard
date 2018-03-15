 window.console = window.console || function(t) {};
     if (document.location.search.match(/type=embed/gi)) {
      window.parent.postMessage("resize", "*");
    }

// START PACKERY
  // ---------------------------------------------
  var $grid = $('.grid').packery({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
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


  // ORDER AFTER LAYOUT CHANGE
  // ---------------------------------------------
  function orderItems() {
    var itemElems = $grid.packery('getItemElements');
    $( itemElems ).each( function( i, itemElem ) {
      $(itemElem).html('<span>' + (i + 1) + '</span');
    });
  }
  $grid.on( 'layoutComplete', orderItems );
  $grid.on( 'dragItemPositioned', orderItems );


  // APPEND ITEMS
  // ---------------------------------------------
  $('.append-button').click( function() {
    var num = $('.grid-item').length;
    var items = '<div class="grid-item"><span>' + (num+1) + '</span></div>' +
        '<div class="grid-item grid-item--height3"><span>' + (num+2) + '</span></div>' +
        '<div class="grid-item"><span>' + (num+3) + '</span></div>' +
        '<div class="grid-item grid-item--height2"><span>' + (num+4) + '</span></div>' +
        '<div class="grid-item grid-item--height3"><span>' + (num+5) + '</span></div>' +
        '<div class="grid-item"><span>' + (num+6) + '</span></div>' +
        '<div class="grid-item grid-item--height2"><span>' + (num+7) + '</span></div>';
    var $items = $(items);
    // add to packery layout
    $grid.append( $items )
      .packery( 'appended', $items )
    // make item elements draggable
    $items.each( makeEachDraggable );
  });

  function makeEachDraggable( i, itemElem ) {
      // make element draggable with Draggabilly
      var draggie = new Draggabilly( itemElem );
      // bind Draggabilly events to Packery
      $grid.packery( 'bindDraggabillyEvents', draggie );
    }
    //# sourceURL=pen.js