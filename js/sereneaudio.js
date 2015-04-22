//we'll use a window.onload for simplicity, but typically it is best to use either jQuery's $(document).ready() or $(window).load() or cross-browser event listeners so that you're not limited to one.



$( document ).ready(function() {
    var body = document.body,
        timer;
    var winHeight = $(window).height();
    $('.section').height(winHeight);


    /*Dissable hover for better scrolling performance
    window.addEventListener('scroll', function() {

        clearTimeout(timer);
        if(!body.classList.contains('disable-hover')) {
            body.classList.add('disable-hover')
        }

        timer = setTimeout(function(){
            body.classList.remove('disable-hover')
        },500);
    }, false);

*/
    //var ScrollMagic_ctrl = new ScrollMagic();
    /*
    ScrollMagic_ctrl.scrollTo(function (newpos) {
        TweenMax.to(window, 1, {
            scrollTo: {y: newpos, autoKill:false},
            ease: Power2.easeInOut
        });
    });


    var wiring_tl = new TimelineMax();
    wiring_tl.fromTo($('#leftWire'),1, {css: {bottom: "70px"}}, {css:{bottom:0}} ).
    fromTo($('#horizWire'),2, {width:"0%"}, {width:"100%"}).
    fromTo($('#rightWire'),1, {css: {top:"70px"}}, {css:{top:"-5px"}}).
    fromTo($('#sound_pulse'),1, {css:{scale:0.4, opacity:0}},{css:{scale:1.9, opacity: 1}, ease: Power2.easeIn},'-=0.5').
    to($('#sound_pulse'),6, {css:{scale:3.4, opacity:0}, ease: Power2.easeOut});

    var applcation_scene = new ScrollScene({triggerElement: "#application_trigger", duration: winHeight/2})
    .setPin("#application")
    //.setTween(wiring_tl)
    .addTo(ScrollMagic_ctrl)
    .triggerHook(0);
    //.addIndicators({zindex: 100, colorEnd: "#FFFFFF"});

    var gallery_scene = new ScrollScene({triggerElement: "#gallery_trigger", duration: winHeight/2})
    .setPin("#gallery")
    .addTo(ScrollMagic_ctrl)
    .triggerHook(0);
    //.addIndicators({zindex: 100, colorEnd: "#FFFFFF"});
    */



    var $window = $(window);
    var scroll_tween = TweenMax.to($window, 1, {
        scrollTo : { y: 0, autoKill:false },
        ease: Power2.easeOut,
    });

    scroll_tween.pause();

    /*scroll nav side bar clicks*/
    $(document).on("click", "a[href^=#]", function (e) {
        var id = $(this).attr("href");
        if ($(id).length > 0) {
            e.preventDefault();
            //$('html, body').animate({ scrollTop:$(id).offset().top });

            scroll_tween.updateTo({scrollTo : { y: $(id).offset().top, autoKill:false }} , true);
            scroll_tween.restart();

            // if supported by the browser we can even update the URL.
            if (window.history && window.history.pushState) {
                history.pushState("", document.title, id);
            }
        }
    });

    var scrollTop, finalScroll, lastUpdateTime = 0;


    $window.on("mousewheel DOMMouseScroll", function(event){
        //scrolls the window one block
        event.preventDefault();
        event.stopPropagation();
        //return;
        var delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
        //console.log('delta: ', delta);


        if(!scroll_tween.isActive() ){

            if ((Math.abs(delta) < 0.1) ) {return false};
            //console.log("time since last animation: ", $.now() -  lastUpdateTime);
            scrollTop = $window.scrollTop();
            finalScroll = scrollTop + (delta<0 ? winHeight : -winHeight);

            scroll_tween.updateTo({scrollTo : { y: finalScroll, autoKill:false }} , true);
            scroll_tween.restart();
            lastUpdateTime = $.now();

            //console.log('setting new scroll target');
        }else if ((Math.abs(delta) >= 2.5) && ($.now() -  lastUpdateTime > 600)){
            //return false;
            //if if the user scrolled again while the tween is playing, we update the scroll
            finalScroll = finalScroll + (delta<0 ? winHeight : -winHeight);
            scroll_tween.updateTo({scrollTo : { y: finalScroll, autoKill:false }} , true);
            lastUpdateTime = $.now();
            console.log('updating scroll target');

        }

        //console.log('just scrolling bro');
        return false;
    });



    $('html').keydown(function(e){
        //Arrow keys create a fake mousewheel event.
        //This way, I can use the same fucntion that I use for handling mousewheel events for arrow keys as well
        event.preventDefault();
        var fakeEvent = jQuery.Event( "mousewheel" );
        fakeEvent.originalEvent = {};
        if(e.which == 38){
            //up
            fakeEvent.originalEvent.wheelDelta = 300;
            $window.trigger(fakeEvent);
        }else if(e.which == 40){
            //down
            fakeEvent.originalEvent.wheelDelta = -300;
            $window.trigger(fakeEvent);
        }
    });


    var scrollTimer;
    $window.scroll(function(){
        /*When user manually drags the scroll bar on the window, we want to adjust the scroll position so that a whole block is visible.
            This won't allow for scroll position to be in between blocks*/
        clearTimeout(scrollTimer);
        scrollTimer=setTimeout(function(){
            adjustScroll();
        }, 500);
    });

    var wiring_tl = new TimelineLite();
    wiring_tl.fromTo($('#leftWire'),0.6, {height: 0}, {height: 80} ).
    fromTo($('#horizWire'),1, {width:"0%"}, {width:"100%"}).
    fromTo($('#rightWire'),0.6, {height: 0}, {height: 80}).
    fromTo($('#sound_pulse'),1, {css:{scale:0.4, opacity:0}},{css:{scale:1.9, opacity: 1}, ease: Power2.easeIn},'-=0.5').
    to($('#sound_pulse'),1, {css:{scale:3.4, opacity:0}, ease: Power2.easeOut});
    wiring_tl.pause();
    $('#wiring').appear(function(){
        wiring_tl.restart();
    }, {one: false});

var soundAnimationTimer
    $('.appear_mark').appear(function(){

        clearTimeout(soundAnimationTimer);
        var appeared_block_id = $(this).parent().attr('id');
        //console.log($(this).parent().attr('id'));
        $('#scrollNav > ul > li > a').each(function(){
            var href = $(this).attr('href');
            if(href.indexOf(appeared_block_id) >= 0){
                $(this).addClass('current');
                //Tracking block views
                ga('send', 'event', 'ViewTalismanBlock', 'view',  appeared_block_id);
            }else{
                $(this).removeClass('current');
            }
        });

        if(appeared_block_id == 'sound'){
            $('.isotopeSummary').removeClass('enableHover');
            $('.animated_bg_img').removeClass('animated_bg_img_hover');
            soundAnimationTimer = setTimeout(function(){
                //The timeout causes the scroll animation to run smoother
                var sound_tl = new TimelineLite({onComplete:function(){
                    $('.isotopeSummary').addClass('enableHover');
                    $('.animated_bg_img').addClass('animated_bg_img_hover');

                    $('.animated_bg_img_hover').hover(function(event){
                        /*console.log( $(this).children(".sharp_img").attr('class'));*/
                        //hoverIn for image tiles in gallery
                        TweenLite.to( $(this).children(".scale_blur_img_container"), 0.4,
                                     {css:{force3D:true, top: 0 },
                                      ease:Power2.easeOut
                                     });
                        TweenLite.to( $(this).children(".scale_blur_img_container").children(".sharp_img"), 0.4,
                                     {css:{force3D:true, scale:0.4, opacity: 0 },
                                      ease:Power2.easeOut
                                     });
                        TweenLite.to( $(this).children(".scale_blur_img_container").children(".blur_img"), 0.4,
                                     {css:{force3D:true, scale:0.4, opacity: 0.8},
                                      ease:Power2.easeOut
                                     });
                    }, function(){
                        //hoverOut for image tiles in gallery
                        TweenLite.to( $(this).children(".scale_blur_img_container"), 0.4,
                                     {css:{force3D:true, top: "15%" },
                                      ease:Power2.easeOut
                                     });
                        TweenLite.to( $(this).children(".scale_blur_img_container").children(".sharp_img"), 0.4,
                                     {css:{force3D:true, force3D:true, scale:1, opacity: 1},
                                      ease:Power2.easeOut
                                     });
                        TweenLite.to( $(this).children(".scale_blur_img_container").children(".blur_img"), 0.4,
                                     {css:{force3D:true, scale:1, opacity: 0},
                                      ease:Power2.easeOut
                                     });
                    });

                }, delay:0.5});


                sound_tl
                //Driver
                    .to($('#driver'), 0.3,
                        { css: {force3D:true, transform:'translateX(0px) translateY(-90px) scale(1)' }, ease: Linear.ease})
                    .to($('#driver'), 0.3,
                        { css: {force3D:true, transform:'translateX(0px) translateY(0px) scale(1)' }, ease: Linear.ease})
                    .fromTo($('#driver > .isotopeDetailed'), 0.2,
                            { css: {opacity:1}},
                            { css: {opacity:0}, ease: Expo.easeOut, onComplete: function(){
                                $('#driver > .isotopeDetailed').css('opacity','');
                            }},
                            0.3)
                //Eclosure
                    .to($('#enclosure'), 0.3,
                        { css: {force3D:true, transform:'translateX(0px) translateY(-90px) scale(1)' }, ease: Linear.ease}, 0.1)

                    .to($('#enclosure'), 0.3,
                        { css: {force3D:true, transform:'translateX(0px) translateY(0px) scale(1)' }, ease: Linear.ease}, 0.4)

                    .fromTo($('#enclosure > .isotopeDetailed'), 0.2,
                            { css: {opacity:1}},
                            { css: {opacity:0}, ease: Linear.ease, onComplete: function(){
                                $('#enclosure > .isotopeDetailed').css('opacity','');
                            }},
                            0.4)
                    .to($('#amplifier'), 0.3,
                        { css: {force3D:true, transform:'translateX(0px) translateY(-90px) scale(1)' }, ease: Linear.ease}, 0.2)

                    .to($('#amplifier'), 0.3,
                        { css: {force3D:true, transform:'translateX(0px) translateY(0px) scale(1)' }, ease: Linear.ease}, 0.5)

                    .fromTo($('#amplifier > .isotopeDetailed'), 0.2,
                            { css: {opacity:1}},
                            { css: {opacity:0}, ease: Linear.ease, onComplete: function(){
                                $('#amplifier > .isotopeDetailed').css('opacity','');
                            }},
                            0.5)
                    .timeScale( 1 );
            }, 1000);

            //Runs the animation that lets the user know the content is hoverable

        }


    }, {one: false, accX: 0, accY: -2});





    function RunBlockAnimation(scrollToBlockId){
        if(scrollToBlockId == 'application'){

        }
    }

    $( window ).resize(function() {
        /*Adjust block heights and scroll position on window resize*/
        winHeight = $(window).height();
        $('.section').height(winHeight);
        adjustScroll();
        //applcation_scene.duration(winHeight/2);
        //gallery_scene.duration(winHeight/2);
    });

    function    adjustScroll(){
        /*Adjust scroll position when a block is not perfectly aligned with the viewport*/
        $('.block_wrapper').each(function(){
            //console.log($(this).offset().top);
            var viewportTop = $(this).offset().top - $(window).scrollTop()
            if((viewportTop > 0) && (viewportTop < winHeight/2)){
                TweenMax.to($window, 0.5, {
                    scrollTo : { y: $(this).offset().top, autoKill:false },
                    ease: Power2.easeInOut,
                    overwrite: "all",
                    onComplete: function(){
                    }
                })
            }else if((viewportTop < winHeight) && (viewportTop > winHeight/2)){
                TweenMax.to($window, 0.5, {
                    scrollTo : { y: $(this).offset().top - winHeight, autoKill:false },
                    ease: Power2.easeInOut,
                    overwrite: "all",
                    onComplete: function(){
                    }
                })
            }
        });
    }
    //TweenLite.to(window, 1, { css:{top:designOffset}, overwrite:true } );
});

