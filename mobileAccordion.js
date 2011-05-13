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
    
    function slideUpSection($header, callback) {
        var content = ($header.next())[0];
        emile(content, "height:0px", { duration: 400 }, function () {   
            hideSection(content); 
            
            // Fire a callback, if any
            if(callback) { callback($header); }
            
            $header.removeClass('zp-accordion-header-open');
            
        });
        
    }
    
   function slideDownSection($header, callback) {

  
      var content = ($header.next())[0],
          $content = $(content);

      //grab the "normal" height of the content
      $content.show();
      var mySectionHeight = $content.height();
      $content.css('height', "0px"); // reset the height ready for animation
      
      //do the animation
      emile( content , "height:" + mySectionHeight +"px", { duration: 400 }, function(){
          // Fire slideDown hook
        if(callback){ callback($header);}

      } );
      
      // declare the accordion open
      $header.addClass('zp-accordion-header-open');

   }
    
   function parseAccordion(event, options) {

      //cover our backs if some child element fires the event
      var $header = $( event.target ).hasClass('zp-accordion-header') ? $( event.target ) : $( event.target ).closest('.zp-accordion-header'),
      scrollTo = options.scrollTo || false;
      //if section is open
      if ( $header.hasClass('zp-accordion-header-open') ) {
         slideUpSection($header, options.slideUpFinish);
      } else {
         //if section is shut
         
         // Fire slideDown hook
         if(options.hasOwnProperty("slideDown")) {  options.slideDown(); }
         
         slideDownSection($header, options.slideDownFinish);
         $header.parent().addClass('zp-accordion-open');
      }      
      
      //close others
      $header.siblings( '.zp-accordion-header-open' ).each( function () {
            if(options.hasOwnProperty("slideUp")) {  options.slideUp(this); }
          slideUpSection($(this),  options.slideUpFinish); 
      });   
   }
  
   container[makeAccordion] = function (el, options) {
      options = options || {};
      var headerSelector = options.headerSelector || 'h3';
      // initialize functions
      $( el ).addClass( 'zp-accordion').children( headerSelector ).bind( 'click', function (event) { parseAccordion(event, options); }).addClass( 'zp-accordion-header');
      $( el ).children( 'div' ).addClass( 'zp-accordion-content').css('overflow', 'hidden').hide();
   };

})('makeAccordion', this);