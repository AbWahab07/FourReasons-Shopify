// Home grid section height
$(document).ready(function() {
  	// $("html").easeScroll();
  
    var images = document.querySelectorAll('img.img-parallax');
    new simpleParallax(images);
  
    $("html").easeScroll({
      frameRate: 60,
      animationTime: 1600,
      stepSize: 120,
      pulseAlgorithm: 2,
      pulseScale: 8,
      pulseNormalize: 1,
      accelerationDelta: 20,
      accelerationMax: 1,
      keyboardSupport: true,
      arrowScroll: 50,
      touchpadSupport: true,
      fixedBackground: true
    });  

  	var windowSize = window.innerWidth;
  
  	if (windowSize > 768 && windowSize <= 1200) {
        var product_card_grid = $('.product-card');
        var product_card_grid_height = parseInt($('.product-card').height(), 10);
        var section_grid_height = product_card_grid_height + 660;
        $('.product-grid-home-section').css('height', section_grid_height);
        $('.product-grid-home-section .btn-wrap').css('margin-top', product_card_grid_height + 280);
    }
    else if (windowSize > 1200) {
      	var product_card_grid = $('.product-card');
      	var product_card_grid_height = parseInt($('.product-card').height(), 10);
      	var section_grid_height = product_card_grid_height + 820;
      	$('.product-grid-home-section').css('height', section_grid_height);
      	$('.product-grid-home-section .btn-wrap').css('margin-top', product_card_grid_height + 280);
    }
  
  	$(window).on('resize', function() {
      	var windowSize = window.innerWidth;
      
        if (windowSize <= 1200 && windowSize > 768) {
            var product_card_grid = $('.product-card');
            var product_card_grid_height = parseInt($('.product-card').height(), 10);
            var section_grid_height = product_card_grid_height + 660;
            $('.product-grid-home-section').css('height', section_grid_height);
            $('.product-grid-home-section .btn-wrap').css('margin-top', product_card_grid_height + 280);
        }
        else if (windowSize > 1200) {
            var product_card_grid = $('.product-card');
            var product_card_grid_height = parseInt($('.product-card').height(), 10);
            var section_grid_height = product_card_grid_height + 820;
            $('.product-grid-home-section').css('height', section_grid_height);
            $('.product-grid-home-section .btn-wrap').css('margin-top', product_card_grid_height + 280);
        }
    });
  
  	$(".slide-wrapper").slick({
	  speed: 500
    });
 
  // panel slider init
  panelSlider();
  
  // Grid script init  
  gridScript();
  
  $('video#js-video').click(function() {
    if (!this.paused) {
      this.pause();
      $("div#video-play-button").show();
      // $('img.img-play-button').show();
    } else {
      this.play();
      // $('img.img-play-button').hide();
      $("div#video-play-button").hide();
    }
  });
  
  //Product Image Scrolling
  
  
});

const panelSlider = () => {
  let sliderIndex = 1, maxIndex = 4;
  
  const $contentWidth =$('.content-width');
  const $contentitems = 100 / maxIndex;
  const $btnHomeGalleryArrowLeft = $('.home-gallery__arrow-left');
  const $btnHomeGalleryArrowRight = $('.home-gallery__arrow-right');
  const $homeGalleryContentWrapper = $('.home-image-gallery-content');
  const $homeGalleryContent = $('.home-gallery-content');
  const $currentContent= $('.current-content');

  $homeGalleryContentWrapper.addClass('active-index');
  
  $currentContent.text(`${sliderIndex}`);
  
  $contentWidth.css('width', $contentitems*sliderIndex + '%');

  $btnHomeGalleryArrowRight.on('click', () => {
	$homeGalleryContentWrapper.removeClass('active-index');
    $homeGalleryContentWrapper.removeClass('active-last');
  
    sliderIndex++;

    if (sliderIndex > maxIndex) { 
   	  sliderIndex = 1;
  	}
 
    if (sliderIndex == 1) {
      $homeGalleryContentWrapper.addClass('active-index');
    }
  	
    if (sliderIndex == maxIndex) {
      $homeGalleryContentWrapper.addClass('active-last');
    }
  
  	$contentWidth.css('width', $contentitems*sliderIndex + '%');
  
  	$homeGalleryContent.hide();

    const $activeGalleryContent = $(`.home-gallery-content__${sliderIndex}`);
 
  	$activeGalleryContent.show();
  
    $currentContent.text(`${sliderIndex}`);
  
    $('img.home-gallery-img').hide();
    $(`img.home-gallery-img__${sliderIndex}`).show();
  });
  
  $btnHomeGalleryArrowLeft.on('click', () => {
  	$homeGalleryContentWrapper.removeClass('active-index');
    $homeGalleryContentWrapper.removeClass('active-last');

    sliderIndex--;

    if (sliderIndex < 1) { 
   	  sliderIndex = maxIndex;
  	}
 
	if (sliderIndex == 1) {
      $homeGalleryContentWrapper.addClass('active-index');
    }
  	
    if (sliderIndex == maxIndex) {
      $homeGalleryContentWrapper.addClass('active-last');
    }

	$contentWidth.css('width', $contentitems*sliderIndex + '%');

  	$homeGalleryContent.hide();

    const $activeGalleryContent = $(`.home-gallery-content__${sliderIndex}`);
 
  	$activeGalleryContent.show();

	$currentContent.text(`${sliderIndex}`);

    $('img.home-gallery-img').hide();
    $(`img.home-gallery-img__${sliderIndex}`).show();
  });
}

const gridScript = () => {
  const $gridButton = $('.grid-header-title');
  const $gridSection = $('.grid-content');

  $gridButton.on('mouseover', function () {
    const slug = $(this).data('slug');
    const $gridWrapper = $(`.grid-content_${slug}`);

    $gridButton.removeClass('active');
    $gridSection.removeClass('active');
    $(this).addClass('active');
    $gridWrapper.addClass('active');
  });
}

function fixedContent_handled_custom(select, breakpoint = 992){

  var img          = $(select);
  $(window).scroll(function(e){
    if (AT_Main.getWidthBrowser() < breakpoint) {return}
    var _wd_pos       = $(window).scrollTop();
    var review_section = $("#product-detail_tabs").offset().top;
    var offset_val = _wd_pos;
    
    img.addClass('custom-relative');
    $('#product-image .product-image-inner').addClass('fixed-content');

    if( _wd_pos < review_section + 120) {
      $("#product-image .slider-main-image").css("overflow", "inherit");
      img.css("transform", "translateY(" + offset_val + "px)");
    } else {
      img.removeClass('custom-relative');
      $('#product-image .product-image-inner').removeClass('fixed-content');
    }
    
    if (_wd_pos < 1 ){
      img.removeClass('custom-relative');
      $('#product-image .product-image-inner').removeClass('fixed-content');
    }
  });

}
$(document).ready(function(){
  fixedContent_handled_custom('#product-image .slider-main-image img', 992);
  $(window).resize(function(){ fixedContent_handled_custom('#product-image .slider-main-image img', 992)});
});
