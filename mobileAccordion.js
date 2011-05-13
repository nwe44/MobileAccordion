/*
* A basic touch aware accordion, with tweaks for small screens
* depends on emile and zepto (or jQuery if you must)
* At the moment probably not compatible with things that 
* rewrite the scrolling mechanism (ie. iScroll)
* Some options to come, suggestions welcome
*
* usage:
* 
* $(document).ready(function () { 
*    makeAccordion('#myElement', {scrollTo: true});
* });
*
* Copyright (c) 2011 Nick Evans
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses. 
*
*/
(function (makeAccordion, container) {

    function hideSection(content) {
        $(content).hide().css('height', 'auto');
    }
    
    function slideUpSection($header) {
        var content = ($header.next())[0];
        emile(content, "height:0px", { duration: 400 }, function () {   hideSection(content); });
        $header.removeClass('zp-accordion-header-open');
    }

   function slideDownSection($header, scrollTo) {
      var content = ($header.next())[0],
          $content = $(content);

      //grab the "normal" height of the content
      $content.show();
      var mySectionHeight = $content.height();
      $content.css('height', "0px"); // reset the height ready for animation
      
      //do the animation
      emile( content , "height:" + mySectionHeight +"px", { duration: 400 },
          function () { if(scrollTo){ scrollToPosition(($header.offset()).left, ($header.offset()).top); } }
      );
      $header.addClass('zp-accordion-header-open');
      
   }
    
   function parseAccordion(event, options) {

      //cover our backs if some child element fires the event
      var $header = $( event.target ).hasClass('zp-accordion-header') ? $( event.target ) : $( event.target ).closest('.zp-accordion-header'),
      scrollTo = options.scrollTo || false;
      //if section is open
      if ( $header.hasClass('zp-accordion-header-open') ) {
         slideUpSection($header);
      } else {
         //if section is shut
         slideDownSection($header, scrollTo);
      }      
      
      //close others
      $header.siblings( '.zp-accordion-header-open' ).each( function () {
          slideUpSection($(this)); 
      });
   }
  
   container[makeAccordion] = function (el, options) {
      options = options || {};
      // initialize functions
      $( el ).children( 'h3' ).bind( 'click', function (event) { parseAccordion(event, options); }).addClass( 'zp-accordion-header');
      $( el ).children( 'div' ).addClass( 'zp-accordion-content').css('overflow', 'hidden').hide();
   };

})('makeAccordion', this);


