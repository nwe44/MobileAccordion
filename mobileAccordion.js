/*
* A basic touch aware accordion, with tweaks for small screens
* depends on zepto (or jQuery if you must).
*
* v 0.2
* Usage:
*
* makeAccordion('#myElement', { slideDown: mySlideDownFunction });
*
* Options
* ===========
* headerSelector  -- Choose the tag to use for headers (default is h3)
* transitionSpeed -- time (in ms) for all transitions
*
* Callbacks:
* ===========
* slideDown       -- called at start of slide up animation
* slideDownFinish -- called at end of slide down animation,
*                    receives the header (as a zepto object) of the element as an argument (useful for scrollTo positions)
* slideUp         -- called at begining of slide up animation
*                    receives the header (as a zepto object) of the closed element as an argument
* slideUpFinish   -- called at end of slide up animation
*                    receives the header (as a zepto object) of the closed element as an argument
* slideFinish     -- fires at the end of all animation, no matter what
*
* Copyright (c) 2011 Nick Evans
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*/
(function (window) {
    
    var mobileAccordion = function () {
        return new mbAccordion();
    };
    var mbAccordion = function () {};
    
    mbAccordion.prototype.init = function (el, options){
        var that = this,
        headerSelector = options.headerSelector || 'h3';
        this.options = options || {};
        this.options.transitionSpeed = options.transitionSpeed || 400;
        this.headers = $( el ).children( headerSelector );
        this.content = $( el ).children( 'div' );
        
        // initialize functions
        $( el ).addClass( 'zp-accordion');
        this.headers.bind( 'click', function (event) { 
            that.parseAccordion(event); }).addClass( 'zp-accordion-header');
        this.content.addClass( 'zp-accordion-content').css('overflow', 'hidden').hide();
        $( el ).find('.zp-accordion-header-open').next().show();
    };
    
    mbAccordion.prototype.hideSection = function (section) {
        $(section).hide().css('height', 'auto');
    };

    mbAccordion.prototype.slideUpSection = function ($header) {
        var that = this,
        section = ($header.next())[0];
        $(section).css('height', '0');
        var t = setTimeout(function () {

            that.hideSection(section);

            $header.removeClass('zp-accordion-header-open');

            if (that.options.slideUpFinish) {
                that.options.slideUpFinish($header);
            }

        }, this.options.transitionSpeed);
    };

    mbAccordion.prototype.setTransitionDuration = function (object, time) {
        var props = ["transition-duration", "-moz-transition-duration", "-webkit-transition-duration", "-o-transition-duration"];
        for (var i = 0; i < props.length; i++) {
            $(object).css(props[i], time + 'ms');
        }
    };

    mbAccordion.prototype.slideDownSection = function ($header) {

        var section = ($header.next())[0],
        $section = $(section),
        that = this;

        //grab the "normal" height of the content
        $section.show().css("height", "auto");
        that.setTransitionDuration(section, 0);
        var mySectionHeight = $section.height();
        $section.css('height', "0px"); // reset the height ready for animation
        that.setTransitionDuration(section, that.options.transitionSpeed);// set animation length
        $section.css('height', mySectionHeight + "px"); // Open it, if you're wondering, height: auto doesn't work
        if (that.options.slideDownFinish) {
            var t = setTimeout(function (that) {
                that.options.slideDownFinish($header); 
                }, that.options.transitionSpeed);
        }

        // declare the accordion open
        $header.addClass('zp-accordion-header-open');
     };

    mbAccordion.prototype.destroy = function (event) {
        this.headers.unbind('click').removeClass('zp-accordion-header-open').removeClass('zp-accordion-header');
    };
    mbAccordion.prototype.parseAccordion = function (event) {
        var that = this;
        //cover our backs if some child element fires the event
        var $header = $(event.target).hasClass('zp-accordion-header') ? $(event.target) : $(event.target).closest('.zp-accordion-header');
        
        //if section is open
        if ( $header.hasClass('zp-accordion-header-open') ) {
           if (that.options.hasOwnProperty("slideUp")) {  that.options.slideUp(this); }
           that.slideUpSection($header, that.options.slideUpFinish);
        } else {
           //if section is shut
           
           // Fire slideDown hook
           if (that.options.hasOwnProperty("slideDown")) {  that.options.slideDown(); }
           
           that.slideDownSection($header);
           $header.parent().addClass('zp-accordion-open');
        }      
        
        //close others
        $header.siblings( '.zp-accordion-header-open' ).each( function () {
            if (that.options.hasOwnProperty("slideUp")) {  that.options.slideUp(this); }
            that.slideUpSection($(this)); 
        });
        if(that.options.hasOwnProperty("slideFinish")){
            var t = setTimeout(function () { that.options.slideFinish(); }, that.options.transitionSpeed);
        }
    };

  window.mobileAccordion = mobileAccordion;
  
})(window);
