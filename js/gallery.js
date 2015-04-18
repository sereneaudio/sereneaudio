---
---

/*
This code manages the gallery block
*/
/*global $, jQuery*/
$(document).ready(function() {
    var gallery = {};
    gallery.isZoomed = false;

    $('.gallery > div').click(function(){
        var windowHeight = $(window).height(),
            windowWidth = $(window).width();
        if(gallery.isZoomed == true){
            //Zoom out
            var imageTile = $(this);
            var tl = new TimelineLite();
            tl.to($('#zoomedImageContainer'), 0.3, {
                autoAlpha : 0,
                ease: Power2.easeOut,
                overwrite: 5
            }).to($('.gallery'), 0.5, {
                css: {force3D:true, transform:'translateX(0px) translateY(0px) scale(1)' },
                ease: Power2.easeInOut,
                onComplete: function(){
                    gallery.isZoomed = false;
                    $('#hiresImage').remove();
                }
            }).to($(this).children('.imageTile'), 0.3, {
                autoAlpha : 1,
                ease: Power2.easeOut,
                overwrite: 5
            });
        } else{
            //Zoom in
            //Storing the zoom state. doesn't make sense to store this in this element, but it does the job
            //$(this).data('zoomData' , {isZoomed : true});
            gallery.isZoomed = true;
            //calculating the scale and translate for the image we are going to zoomed on
            var transformMatrix = matrixToArray($(this).css('transform'));
            var tileWidth = $(this).width();
            var tileHeight = $(this).height();
            var scaleFactor = (windowWidth/tileWidth);
            //scaleFactor = Math.max( (windowWidth/tileWidth), (windowHeight/tileHeight) );
            var x_translate = ((windowWidth/2) - transformMatrix[4] - (tileWidth/2))*scaleFactor;
            var y_translate = windowHeight/2 - 2*transformMatrix[5];
            //Get hi-res image url
            var hires_src = $(this).attr('data-zoomImg');
            var hires_bgSize = $(this).attr('data-bgSize');
            var tl = new TimelineLite();
            tl.to($(this).children('.imageTile'), 0.3, {
                autoAlpha : 0,
                ease: Power2.easeOut,
                overwrite: 5
            }).to($('.gallery'), 0.5, {
                css: {force3D:true, transform:'translateX('+ x_translate +'px) translateY('+y_translate+'px) scale('+scaleFactor+')' },
                ease: Power2.easeInOut,
            }).to($('#zoomedImageContainer'), 0.3, {
                autoAlpha : 1,
                ease: Power2.easeOut,
                overwrite: 5,
                onComplete: function(){
                    spinner.spin(spinnerTarget);
                    loadingIcon.animateIn();
                    var img = $("<img />").attr({'src': {{ site.baseurl | prepend: '"' | append: '" +' }} hires_src, 'id' : 'hiresImage'}).css('opacity', 0)
                    .load(function() {
                        if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                            alert('broken image!');
                        } else {
                            //$("#zoomedImageContainer").append(img);
                            $("#zoomedImageContainer").prepend($("<div></div>").attr({'id' : 'hiresImage'}).css({'opacity': 0, 'background-image':'url( {{ site.baseurl | prepend: '"' | append: '" +' }}  '+hires_src+')', 'background-size': hires_bgSize}).addClass('imageTile'));
                            var imgLoad_tl = new TimelineLite();
                            imgLoad_tl.add(loadingIcon.animateOut()).to($('#hiresImage'), 0.5, {autoAlpha:1});
                        }
                    });
                }
            });

        }

    });



    function calcGalleryLayout(){
        /*This function calculates size and position of gallery and it's tiles*/
        var winHeight = $(window).height();
        var winWidth = $(window).width();
        $('.gallery_container').height(winHeight);
        $('.gallery_container').width(winWidth);
        $('.image1_container').width(winWidth/5);
        $('.image1_container').height(winHeight);
        $('.image1_container').css('transform', 'translate3d(0,0,0)');
        $('.image2_container').width(winWidth/5);
        $('.image2_container').height(winHeight/2);
        $('.image2_container').css('transform', 'translate3d('+winWidth/5 +'px,0,0)');
        $('.image3_container').width(winWidth/2.5);
        $('.image3_container').height(winHeight/2);
        $('.image3_container').css('transform', 'translate3d('+2*winWidth/5+'px,0,0)');
        $('.image4_container').width(winWidth/5);
        $('.image4_container').height(winHeight/2);
        $('.image4_container').css('transform', 'translate3d('+4*winWidth/5+'px,0,0)');
        $('.image5_container').width(winWidth/2.5);
        $('.image5_container').height(winHeight/2);
        $('.image5_container').css('transform', 'translate3d('+winWidth/5+'px,'+winHeight/2+'px,0)');
        $('.image6_container').width(winWidth/2.5);
        $('.image6_container').height(winHeight/2);
        $('.image6_container').css('transform', 'translate3d('+2*winWidth/3.33+'px,'+winHeight/2+'px,0)');
        $('.image7_container').width(winWidth/2.5);
        $('.image7_container').height(winHeight/2);
        $('.image7_container').css('transform', 'translate3d('+3*winWidth/5+'px,'+winHeight/2+'px,0)');
    }

    calcGalleryLayout();
    $( window ).resize(function() {
        calcGalleryLayout();
    });

    $('.imageTile').hover(function(event){
        //hoverIn for image tiles in gallery
        TweenLite.to( $(this), 0.3,
                     {css:{scale:1.1},
                      ease:Power2.easeOut
                     });
    }, function(){
        //hoverOut for image tiles in gallery
        TweenLite.to($(this), 0.3,
                     {css:{scale:1},
                      ease:Power2.easeOut
                     });
    });


    var opts = {
        lines: 15, // The number of lines to draw
        length: 24, // The length of each line
        width: 2, // The line thickness
        radius: 60, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 36, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#9d6530', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 40, // Afterglow percentage
        //shadow: true, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var spinnerTarget = document.getElementById('loader_wrapper');
    var spinner = new Spinner(opts);

    var loadingIcon = {
        fadeTime : 0.4,
        animateIn : function(){
            spinner.spin(spinnerTarget);
            var tl = new TimelineLite();
            tl.to($('.spinner'), this.fadeTime, {
                autoAlpha:1,
            } ).to($(' #gallery_emblem'), this.fadeTime, {
                autoAlpha: 0.2,
            }, 0);
            return tl;
        },
        animateOut : function(){
            var tl = new TimelineLite();
            tl.to($('.spinner, #gallery_emblem'), this.fadeTime, {
                autoAlpha:0,
                onComplete: function(){
                    spinner.stop();
                }
            });
            return tl;
        }
    }

    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            // esc
            if(gallery.isZoomed == true)  $('.gallery > div').click();    //triggers zoom out
        }
    });


    function matrixToArray(str){
        /*Get a string matrix and returns an array*/
        return str.match(/(-?[0-9\.]+)/g);
    };
});
