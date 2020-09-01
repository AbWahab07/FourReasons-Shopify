var old_width = 0;

var AT_Main = {
  getWidthBrowser : function() { /*Get width browser*/
    var myWidth;

    if( typeof( window.innerWidth ) == 'number' ) {
      /*Non-IE*/
      myWidth = window.innerWidth;
    }
    else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      /*IE 6+ in 'standards compliant mode'*/
      myWidth = document.documentElement.clientWidth;
    }
    else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
      /*IE 4 compatible*/
      myWidth = document.body.clientWidth;
    }

    return myWidth;
  }

  ,getHeightBrowser : function() { /*Get width browser*/
    let result;

    if( typeof( window.innerHeight ) == 'number' ) {
      /*Non-IE*/
      result = window.innerHeight;
    }
    else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      /*IE 6+ in 'standards compliant mode'*/
      result = document.documentElement.clientHeight;
    }
    else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
      /*IE 4 compatible*/
      result = document.body.clientHeight;
    }

    return result;
  }

  ,debounceTime : function(func, time){
    var timeout;
    return function(){
      var context = this, args = arguments;
      var excuteFn = function(){
        func.apply(context, args);
      }

      clearTimeout(timeout);
      timeout = setTimeout(excuteFn,time);
    };
  }

  ,_requestAjax : (data = {}, type = 'POST', url = '/cart/change.js', dataType = 'json')=>{
    return $.ajax({
      type: type,
      url: url,
      data: data,
      dataType: dataType
    })
  }

  ,checkLayout : function() { /* Function to check level of layout*/
    if(jQuery("#checkLayout .d-sm-block").css("display") == "block")
      return 1; /*mobile layout*/
    else if(jQuery("#checkLayout .d-md-block").css("display") == "block")
      return 2; /*tablet potrait layout*/
    else if(jQuery("#checkLayout .d-lg-block").css("display") == "block")
      return 3; /*tablet landscape/medium desktop layout*/
    else if(jQuery("#checkLayout .d-xl-block").css("display") == "block")
      return 4; /*desktop layout*/
  }

  ,checkScrollbar : function(){
    let t = document.body.getBoundingClientRect();
    if (t.left + t.right < window.innerWidth)
      return window.innerWidth - (t.left + t.right);
    return 0;
  }

  ,homeSlideshow : function(){
    jQuery('.slideshow-catalog-wrapper').each(function(){
      var id              = jQuery(this).data('section-id'),
        galleryThumbs     = false,
        thumbElem         = '.gallery-thumbs-'+id,
        swiper_container  = '.swiper-container-'+id,
        slideElement      = $(swiper_container),
        _delay_time       = slideElement.data('time');

      if (!slideElement.hasClass('swiper-container-initialized') && slideElement.find('.swiper-slide').length) {
        var _direction  = slideElement.data('direction') || 'horizontal'
              ,_touch   = slideElement.data('touch') ? true : false
              ,_view    = Number(slideElement.data('slide-view')) || 1
              ,_active  = slideElement.data('slide-active') || 0
              ,_center  = slideElement.data('center')
              ,_loop    = slideElement.data('loop');

        if (slideElement.find('.home-slideshow .swiper-slide').length == 1 ) {_touch = false;}

        if ($(thumbElem).length) {
          $(thumbElem).removeClass('hide');
          $(swiper_container).find('.wrap-thumb-slide').remove();

          let thumb_view = $(thumbElem).data('view')
          ,thumb_view_md = Number($(thumbElem).data('view-md')) || 1
          ,thumb_spc = $(thumbElem).data('spacing')

          galleryThumbs = new Swiper(thumbElem, {
            spaceBetween: thumb_spc
            ,slidesPerView: thumb_view
            ,freeMode: true
            ,watchSlidesVisibility: true
            ,breakpoints: {
                991: {
                  slidesPerView: thumb_view_md,
                  spaceBetween: 20
                }
              }
          });
        }

        var swiper = new Swiper(swiper_container, {
          autoplay: {delay: _delay_time,disableOnInteraction: false}
          ,loop: _loop
          ,slidesPerView: _view
          ,centeredSlides: _center
          ,direction: _direction
          ,simulateTouch: _touch
          ,allowTouchMove: _touch
          ,updateOnImagesReady: false
          ,grabCursor: true
          ,initialSlide: _active
          ,pagination: {
            el: '.slideshow-'+id+' .swiper-pagination'
            ,type: 'bullets'
            ,clickable: true
            ,renderBullet:function (index, className) {
              var i = index + 1
              ,src = jQuery(swiper_container+' .thumb-slide[data-index="'+i+'"]').data('src')
              ,text = jQuery(swiper_container+' .thumb-slide[data-index="'+i+'"]').data('text')
              ,layout = '';

              text = typeof text == 'undefined' ? '' : text;

              if (src) {layout += `<span class="thumb-img"><img class="lazyload" data-src="${src}"></span>`; }
              if (text) {layout += `<span class="thumb-text">${text}</span>`;}

              if (src || text) {
                return `<div class="${className} has-thumbnail" data-index="${i}">${layout}</div>`;
              }
              else if(slideElement.data('style') == '8'){
                i = i < 10 ? '0'+i : i;
                return '<span class="' + className + '" data-index="'+i+'">'+i+'</span>';}
              else{return '<span class="' + className + '" data-index="'+i+'"></span>';}
            }
          }
          ,keyboard: {
            enabled: true,
            onlyInViewport: false,
          }
          ,navigation: {
            nextEl: '.slideshow-'+id+' .swiper-button-next',
            prevEl: '.slideshow-'+id+' .swiper-button-prev',
          }
          ,thumbs: {swiper: galleryThumbs}
          ,effect: slideElement.data('animation')
          ,fadeEffect: {crossFade: true}
          ,cubeEffect: {slideShadows: false}
          ,setWrapperSize: false
          ,a11y:{enabled:false}
          ,breakpoints: {991: {slidesPerView: 1}}
          ,on :{
            imagesReady: function(){
              slideElement.find('.swiper-slide').each(function(){
                var _this = jQuery(this);
                _this.find('.video-slide').show();
              });
              slideElement.data('parallax') && AT_Main.parallaxScroll(slideElement,slideElement.find('.swiper-slide .slider-layer img'));
            }
          }
        });
        slideElement.data('autoplay') ? swiper.autoplay.start() : swiper.autoplay.stop();
      }
    })
  }

  ,homeIE : function(){
    console.log('slideshow IE');
    jQuery('.slideshow-catalog-wrapper').each(function(){
      var id = jQuery(this).data('section-id');
      var swiper_container = '.swiper-container-'+id;
      var _delay_time = jQuery(swiper_container).data('time');

      var swiper = new Swiper(swiper_container, {
        autoplay: {delay: _delay_time,disableOnInteraction: false}
        ,loop: true
        ,simulateTouch: true
        ,updateOnImagesReady: true
        ,pagination: {
          el: '.slideshow-'+id+' .swiper-pagination',
          type: 'bullets',
          clickable: true
        }
        ,navigation: {
          nextEl: '.slideshow-'+id+' .swiper-button-next',
          prevEl: '.slideshow-'+id+' .swiper-button-prev',
        }
        ,effect: 'fade'
        ,fadeEffect: {crossFade: true}
        ,setWrapperSize: false
        ,on :{
          imagesReady: function(){
            jQuery(swiper_container).find('.swiper-slide .slider-layer img').css('visibility','visible');
            jQuery(swiper_container).find('.swiper-slide').each(function(){
              var _this = jQuery(this);
              _this.find('.video-slide').show();
              if (!_this.find('.video-slide').data('full-height')) {
                _this.find('.video-slide video').css({
                  position: 'relative',
                  width: '100%'
                });
              }
              else{
                _this.find('.video-slide video').css({
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                });
              }
            });


            var el = jQuery('.slideshow-'+id);
            if(el.data('adapt')){
              var min_height = el.width() / el.data('min-aspect-ratio');
              el.height(min_height);
              jQuery(swiper_container).height(min_height);
              jQuery(window).resize(function(){
                var min_height = el.width() / el.data('min-aspect-ratio');
                el.height(min_height);
                jQuery(swiper_container).height(min_height);
              });
            }
          }
        }
      });
      jQuery(swiper_container).data('parallax') ? AT_Main.parallaxScroll(jQuery(swiper_container),jQuery(swiper_container).find('.swiper-slide')) : null;
      jQuery(swiper_container).data('autoplay') ? swiper.autoplay.start() : swiper.autoplay.stop();

    })
  }

  ,parallaxSlideshow : function(){
    $('.parallax[data-parallax="true"]').length && $('.parallax[data-parallax="true"]').each((i,value)=>{
      var scence = jQuery(value)[0];
      var pa = new Parallax(scence,{hoverOnly: true});
    });
  }

  ,stickAddToCart : function() {
    if (!$('.add-to-cart-sticky').length){return;}

    let form = $('.product-detail_cart-action form');

    $(window).on('scroll' ,function(){
      if (!$('#add-to-cart').length) {return}

      let ps         = jQuery(this).scrollTop()
      ,target        = ($('#add-to-cart').offset().top)
      ,pos_sticky    = $('.add-to-cart-sticky').data('pos');

      if ( target < ps ) {
        $('.add-to-cart-sticky').addClass('show');
        if (pos_sticky == 'top' ) {
          AT_Main.getWidthBrowser() > 991 && $('.header-desktop').data('sticky') && $('.add-to-cart-sticky').css('top', $('.header-desktop')[0].clientHeight);
          AT_Main.getWidthBrowser() <= 991 && $('.header-mobile').data('sticky') && $('.add-to-cart-sticky').css('top', $('.header-mobile')[0].clientHeight);
        }
        pos_sticky == 'bottom' && $('.boxed-wrapper').css('margin-bottom', $('.add-to-cart-sticky')[0].clientHeight);
      }
      else {
        $('.add-to-cart-sticky').removeClass('show');
        pos_sticky == 'bottom' && $('.boxed-wrapper').removeAttr('style');
      }
    });

    $(document)
    .on('click','.sticky-add-cart', function() {
      let cartBtn = form.find('.add-to-cart');
      cartBtn.length && cartBtn.trigger('click');
    })
    .on('click','.add-to-cart-sticky .btn-pre-order',function(){
      let target = $('.page-product .btn-pre-order');
      target.lengthh && target.trigger('click');
    })

    .on('change','.add-to-cart-sticky .swatch :radio', function(){
      let optionIndex = jQuery(this).closest('.swatch').attr('data-option-index')
      ,optionValue = jQuery(this).val();

      form.find('.single-option-selector')
          .eq(optionIndex)
          .val(optionValue)
          .trigger('change');

      radioButton = optionValue.includes('"') ? form.find(`.swatch[data-option-index="${optionIndex}"] :radio[data-value="${AT_Main.swatchValue_decode(optionValue)}"]`) : form.find(`.swatch[data-option-index="${optionIndex}"] :radio[value="${optionValue}"]`);

      if (radioButton.length){
        radioButton.get(0).checked = true;
      }
    })
    .on('change','.add-to-cart-sticky .sticky-select-option',function(){
      let _this = $(this)
      ,_value = _this.val()
      ,_index = _this.data('option-index')
      ,_target = $(`.single-option-selector[data-option="option${_index}"]`);

      _target.length && _target.val(_value).trigger('change');
    })
  }

  ,handleGridList : function(){
    let _type = ($.cookie('mode-view') === null || $.cookie('mode-view') === undefined) ? $('input[name="collection_data"]').attr('data-view-default') : $.cookie('mode-view');
    AT_Main.handleGridList_Changed(_type);

    jQuery(document).on("click", ".grid-list > span", e=>{
      AT_Main.handleGridList_Changed($(e.currentTarget).attr('class').replace('active','').trim().toLowerCase());
    })
  }

  ,handleGridList_Changed : function(type){
    $.cookie('mode-view',type, {expires: 1, path: '/'});
    let el = $(".templateCollection .mode-view-item"), nClass = $('input[name="collection_data"]').data(type);
    $(".grid-list > *").removeClass('active');
    $(".grid-list ."+type).addClass("active");

    el.attr('class','mode-view-item ' +nClass);
    type == 'list' ? el.find('.product-card').addClass('card-list') : el.find('.product-card').removeClass('card-list');

    el.find('.card-body .card-body-grid,.card-body .card-body-list').addClass('hide');
    el.find('.card-body .card-body-'+type).removeClass('hide');
  }

  ,handleOrderFormQty : function(){
    jQuery("body").on("click",".global-product-info-qty-plus",function(){
      q = $(this).prev();
      var value = parseInt(q.val(), 10);
      value = isNaN(value) ? 0 : value;

      value++;
      q.val(value);
    });

    jQuery("body").on("click",".global-product-info-qty-minus",function(){
      let q = $(this).next()
       ,min = +q.attr('min') || 0
       ,value = +q.val();

      value = isNaN(value) ? 1 : value;
      if(value > min){
        value--;
        q.val(value);
      }
    });

    jQuery(document).on('click','.show-variants',function(e){
      e.preventDefault();
      var parent = jQuery(this).parents('.product-parent-item');
      var id = parent.data('id');
      parent.parents('.cata-product').find('.product-child-item[data-id='+id+']').slideToggle();
    });
  }

  ,effectNavigation : function(){
    $(document)
    .on('click','.searchbox>a',function(e){
      $(this).parents().find('.searchbox').toggleClass('open');
      $('#page-body').trigger('click');
    })
    .on('click','.menu-list a[href^="#"]:not([href="#"])',e=>{
      e.preventDefault();
      let _id = $(e.currentTarget).attr('href');
      if ($(_id).length) {
        ($('body,html').animate({scrollTop: $(_id).offset().top}, 1200, 'swing'));
      }
    });
  }

  ,fixNoScroll : function(spec = null) { /* body-scroll-lock fix touch event in mobile*/
    AT_Main.checkScrollbar() > 0 && jQuery('body').css('padding-right', AT_Main.checkScrollbar()+'px');
    spec == null && jQuery('body').addClass('popup-is-showing');
  }

  ,fixReturnScroll : function() {
    jQuery('#page-body, .header-content,#page-body .mobile-version,.h-desk-sticky .header-desktop').attr('style', '');
    let body = jQuery('body');
    body.removeClass('popup-is-showing menu-opened').css('padding-right',0).attr('style', body.attr('style').replace('padding-right: 0px;', ''));
    body.attr('style').length == 0 && body.removeAttr('style');
  }

  ,handleReviews: function() {
    if (typeof SPR != 'undefined')
      SPR.registerCallbacks(), SPR.initRatingHandler(), SPR.initDomEls(), SPR.loadProducts(), SPR.loadBadges();
  }

  ,handleMenuMultiLine : function() {
    var outItem = "";
    var down = false;

    var top = 0;

    jQuery(".navbar-collapse .main-nav > li").on("mousemove", function(e){
      var target = jQuery(e.currentTarget);

      if( down && outItem != "") {
        outItem.addClass("hold");
        setTimeout(function(){
          if(outItem != "")
            outItem.removeClass("hold");
          down = false;
          outItem = "";
        },500);

        if( (outItem[0] == target[0]) || (outItem.offset().top == target.offset().top) )
        {
          outItem.removeClass("hold");
          down = false;
          outItem = "";
        }
      }
      else {
        outItem = "";
      }

    });

    jQuery(".navbar-collapse .main-nav >li").on("mouseout", function(e){

      var target = jQuery(e.currentTarget);

      if( e.pageY >= target.offset().top + 50 ) { /*move down*/
        down = true;
      }

      if( target.hasClass("dropdown") ) { /*target has child*/

        if(outItem == "")
          outItem = target;
      }

    });
  }

  ,toTopButton : function(){
    var to_top_btn = $("#scroll-to-top");
    if( 1 > to_top_btn.length ){
      return;
    }
    $(window).on( 'scroll' , function() {
      var b = jQuery(this).scrollTop();
      var c = jQuery(this).height();
      if (b > 100) {
        var d = b + c / 2;
      }
      else {
        var d = 1 ;
      }

      if ((d < 1000 && d < c) || ($(window).scrollTop() + $(window).height() > $(document).height() - 100)) {
        jQuery("#scroll-to-top").removeClass('on off').addClass('off');
      } else {
        jQuery("#scroll-to-top").removeClass('on off').addClass('on');
      }
    });

    to_top_btn.on( 'click',function (e) {
      e.preventDefault();
      jQuery('body,html').animate({scrollTop:0},800,'swing');
    });
  }

  ,toggleFilterSidebar : function(){
    jQuery(document)
    .on('click','.filter-icon.toggle',function (e) {
      $(this).toggleClass('icon-flipped');
      jQuery('.filter-component').slideToggle("slow");
    })
    .on('click','.filter-icon.drawer',function (e) {
      e.stopPropagation();
      AT_Main.fixNoScroll('filter');
      jQuery('body').toggleClass('sidebar-opened');

    })
    .on('click','body',function(e) {
      if (jQuery('html,body').hasClass('sidebar-opened') || jQuery('html,body').hasClass('order-sidebar-opened')) {
        (!$(e.target).parents('.filter-component').length && !$(e.target).hasClass('filter-component')) && jQuery('html,body').removeClass('sidebar-opened');
        AT_Main.fixReturnScroll();
      }
    });

    jQuery('.f-close').on('click',function () {
      jQuery('#sidebar').removeClass('opened');
      jQuery('html,body').removeClass('sidebar-opened');
      AT_Main.fixReturnScroll();
    });
  }

  ,filterCatalogReplace : function(collectionUrl, filter_id){

    var value = collectionUrl.substring(collectionUrl.lastIndexOf('/') + 1);
    var val = value.substring(value.lastIndexOf('?'));

    collectionUrl = collectionUrl.replace(value, '');

    value = value.replace(val, '');
    value = value.replace('#', '');

    var value_arr = value.split('+');

    var current_arr = [];
    jQuery('#'+filter_id+' li.active-filter').each( function() {
      current_arr.push(jQuery(this).attr('data-handle'));
    });

    jQuery('#'+filter_id+' li.active-filter').find('a').attr('title', '');
    jQuery('#'+filter_id+' li').removeClass('active-filter');

    for(jQueryi = 0; jQueryi<current_arr.length; jQueryi++) {
      value_arr = jQuery.grep(value_arr, function( n, i ) { return ( n !== current_arr[jQueryi]  ); });
    }

    var new_data = value_arr.join('+')

    var new_url = collectionUrl+new_data+val;

    if( typeof AT_Filter != 'undefined' && AT_Filter ){
      AT_Filter.updateURL = true;
      AT_Filter.requestPage(new_url);
    }else{
      window.location = new_url;
    }
  }

  ,filterCatalog_AccordionHandle : function(){
    let filters = jQuery('.advanced-filter');
    if(filters.parents('.accordion').length > 0){
      $('.advanced-filters').each(function () {
        let parent = $(this);

        let active = false;
        parent.children('.advanced-filter').each(function(){
          if ($(this).hasClass('active-filter')) {
            active = true;
          }
        })

        if (active) {
          parent.parent().addClass('active del-before');
        }else{
          parent.parent().removeClass('active del-before');
        }
      })
    }
  }

  ,filterCatalog : function(){
    var currentTags = ''
    ,filters  = jQuery('.advanced-filter');

    filters.each(function() {
      var el = jQuery(this)
      ,group = el.data('group');

      if ( el.hasClass('active-filter') ) { /*Remove class hidden*/
        el.parents('.sb-filter').find('a.clear-filter').removeClass('hidden');
        jQuery('#clear-all-filter').removeClass('hidden');

        el.parents('.sbw-filter.select').addClass('has-active').find('.advanced-filters').addClass('has-active');
      }
    });
    $('.advanced-tag-filter').each(function() {
      var el = jQuery(this)
      ,group = el.data('group');

      if ( el.hasClass('active-filter') ) { /*Remove class hidden*/
        el.parents('.sb-filter').find('a.clear-filter').removeClass('hidden');
        jQuery('#clear-all-filter').removeClass('hidden');
      }
    });

    $('.advanced-filters').each(function(){
      $(this).children().length == 0 ? $(this).parents('.grid-uniform').addClass('hide') : $(this).parents('.grid-uniform').removeClass('hide');
    })
    AT_Main.filterCatalog_AccordionHandle();

    filters.on('click', function(e) {
      var el = $(this)
      ,group = el.data('group')
      ,url = el.find('a').attr('href')

        /*Continue as normal if we're clicking on the active link*/
        if ( el.hasClass('active-filter') ) {
          return;
        }
        jQuery(this).parents('.sbw-filter').first().addClass('waiting');
        AT_Main.filterCatalog_AccordionHandle();

        var _logic = jQuery(".page-cata").data('logic');
        if( _logic ){
            /*Get active group link (unidentified if there isn't one)*/
            activeTag = $('.active-filter[data-group="'+ group +'"]');
            /*If a tag from this group is already selected, remove it from the new tag's URL and continue*/
            if ( activeTag && activeTag.data('group') === group ) {
              e.preventDefault();
              activeHandle = activeTag.data('handle') + '+';

              /*Create new URL without the currently active handle*/
              url = url.replace(activeHandle, '');

              /*window.location = url;*/
              AT_Filter.updateURL = true;
              AT_Filter.requestPage(url);
            }
          }
        });

    jQuery('.sb-filter').on('click', '.clear-filter', function(n){ /* Handle button clear*/
      n.preventDefault();
      var filter_id = jQuery(this).attr('id');
      filter_id = filter_id.replace('clear-', '');
      jQuery(this).parents('.sbw-filter').first().addClass('waiting');
      jQuery(this).parents('.sbw-filter.select').removeClass('has-active').find('.advanced-filters').removeClass('has-active');
      var collectionUrl = window.location.href;
      if(collectionUrl.match(/\?/)){
        var string = collectionUrl.substring(collectionUrl.lastIndexOf('?') - 1);

        if(string.match(/\//)){
          var str_replace = string.replace(/\//, '');
          collectionUrl = collectionUrl.replace(string, '');
          collectionUrl = collectionUrl+str_replace;
          AT_Main.filterCatalogReplace(collectionUrl, filter_id);
        }
        else{
          AT_Main.filterCatalogReplace(collectionUrl, filter_id);
        }
      }
      else{
        var value = collectionUrl.substring(collectionUrl.lastIndexOf('/') + 1);
        collectionUrl = collectionUrl.substring(0,collectionUrl.lastIndexOf('/') + 1);
        value = value.replace('#', '');

        var value_arr = value.split('+');
        var current_arr = [];
        jQuery('#'+filter_id+' li.active-filter').each( function() {
          current_arr.push(jQuery(this).attr('data-handle'));
        });

        jQuery('#'+filter_id+' li.active-filter').find('a').attr('title', '');
        jQuery('#'+filter_id+' li').removeClass('active-filter');

        for(jQueryi = 0; jQueryi<current_arr.length; jQueryi++) {
          value_arr = jQuery.grep(value_arr, function( n, i ) { return ( n !== current_arr[jQueryi]  ); });
        }

        var new_data = value_arr.join('+')
        if ($(this).parents('.sb-filter').hasClass('tag')) {
          window.location.href = collectionUrl;
        }else{
          var new_url = collectionUrl+new_data;
          if( typeof AT_Filter != 'undefined' && AT_Filter ){
            AT_Filter.updateURL = true;
            AT_Filter.requestPage(new_url);
          }else{
            window.location = new_url;
          }
        }

      }

    });
    jQuery('.filter-component').on('click', '#clear-all-filter', function(n){
      var new_url = location.protocol + '//' + location.host + (location.pathname).substring(0,location.pathname.lastIndexOf('/')+1);
      AT_Filter.updateURL = true;
      AT_Filter.requestPage(new_url);
    });
  }
  /*fix title a in filter & swatch size in detail product page*/
  ,fixTitle : function(){
    jQuery(".rt a").attr("data-title", function() { return jQuery(this).attr("title"); });
    jQuery(".rt a, .tags-prd").removeAttr("title");

    $('.sb-widget, .sbw-filter').length && $('.sb-widget ,.sbw-filter').each((i,v)=>{
      let _this         = $(v)
      ,_parentHeight    = _this.height()
      ,_target          = _this.find('.sb-menu , .sb-product ,.sbw-filter')
      ,_children        = _this.find('ul, .sb-product-list').first()
      ,_childrenHeight  = _children.prop('scrollHeight');

      _children.innerHeight() < _childrenHeight && _target.addClass('overflow-element');
    })
  }
  /*Handle menu sidebar*/
  ,sidebar_menu_handle : function(){
    $(document).on('click','.categories-menu .dropdown .expand, .sidebar-column .sb-filter, .sb-widget:not(.sb-filter, .has-border) .sb-title',function(e){
      let $this = $(this);
      if (!$this.hasClass('del-before')) {
        if ($this.parents('ul.categories-menu').length) {
          $this = $this.parents('li').first();
        }
        if ($this.hasClass('active')){
          $this.removeClass('active');
          $this.parent().removeClass('active');
        }else{
          $this.parent().children().each(function(){
            if (!$this.hasClass('del-before')) {
              $this.removeClass('active');
            }
          })
          $this.addClass('active');
          $this.parent().addClass('active');
        }
      }

      if($this.closest('.categories-menu').length){
        if ($this.closest('.categories-menu').innerHeight() < $this.closest('.categories-menu').prop('scrollHeight')){
          $this.closest('.sb-menu').addClass('overflow-element');
        }
        else{
          $this.closest('.sb-menu').removeClass('overflow-element');
        }
      }
    })

    $('.grid-uniform').length && $('.grid-uniform').each(function(){
      $(this).find('.advanced-filters').children().length == 0 && $(this).parents('.sb-widget').remove();
    });

    $(document)
    .on('click','.sb-accordion',function(e){
      $(this).toggleClass('active').parent().find('.sb-content-accordion').toggleClass('hide');
    })
    .on('mouseover','.sbw-filter.select',function(e){
      $(this).addClass('active').find('.advanced-filters').addClass('active');
    })
    .on('mouseleave','.sbw-filter.select',function(e){
      $(this).removeClass('active').find('.advanced-filters').removeClass('active');
    });
  }

  ,swatch : function(){
    $(document).on('change','.swatch :radio', function(){
      var optionIndex = jQuery(this).closest('.swatch').attr('data-option-index');
      var optionValue = jQuery(this).val();
      jQuery(this)
      .closest('form')
      .find('.single-option-selector')
      .eq(optionIndex)
      .val(optionValue)
      .trigger('change');
    });
  }

  ,swatchValue_decode : (str)=>{
    let rs;
    rs = str.replace(/\"/g ,"&quot;")
    return rs
  }

  ,switchImgProduct: function() {

    $(document)
    .on('click','.product-card .swatch-element',function(e){
      let _this = $(this)
      ,options_ar = []
      ,_card = _this.closest('.product-card')
      ,selectTarget = _card.find('select[name="id"]');

      _this.closest('.swatch').find('.swatch-element.active').removeClass('active');
      _this.addClass('active');

      _card.find('.swatch-wrapper').first().find('.swatch-element.active').each((i, v)=>{options_ar.push($(v).find('input').val());});

      let select_value = options_ar.join(' / ')
      ,productJSON = JSON.parse(_card.find('.product_variantJSON').val() || '[]');

      select_value = AT_Main.swatchValue_decode(select_value);

      let variant = productJSON.filter(i=>{return JSON.parse(i.status) && i.value == select_value});

      if (!variant.length) {return}
      variant = variant[0];

      _card.find('.product-variants-price').addClass('hide');
      _card.find(`.product-variants-price[data-id="${variant.id}"]`).removeClass('hide');
      selectTarget.length && selectTarget.val(variant.id).trigger('change');

      JSON.parse(variant.status) ? _card.find('.btn-add-cart').removeAttr('disabled') : _card.find('.btn-add-cart').attr('disabled', 'disabled');

      let variant_image = _card.find(`img.img-swt-temp[data-variant-id="${variant.id}"]`);
      if (!variant_image.length) {return}
      variant_image.removeClass('hide');
      AT_Main.debounceTime(()=>{
        let src = variant_image.attr('srcset') || '';
        src != '' && _card.find('img.featured-image').attr('srcset', src);
      }, 300)()
    })

    .on('click','.product-card .prev-image, .product-card .next-image',function(){
      let _card = $(this);
      _card.parents('.card-image').find('img.back-img').toggleClass('active');
    });
  }

  ,triggerVideo_event : function(selector){
    let _this = selector;
    if(_this.find('video').length) {
      let _video = _this.find('video');
      _video.toggleClass('is-playing');
      _video.hasClass('is-playing') ? _video[0].play() : _video[0].pause();
    }
  }

  ,slickProductPage: function(){
    let _rtl = $.parseJSON(_bc_config.enable_rtl)
      ,__thumbnail = +$('#slide--thumbs').data('show') || 5
      ,__thumbToShow = ~~($('#slide--thumbs').children().length / __thumbnail);
      __thumbToShow = 1;
      // __thumbToShow < 1 && ();

    AT_Main.getWidthBrowser() < 768 && (__thumbnail = +$('#slide--thumbs').data('show-mobile') || 4)

    jQuery('.slider-for-03').length && !jQuery('.slider-for-03').hasClass('slick-initialized') && jQuery('.slider-for-03').slick({
      slidesToShow: 1
      ,slidesToScroll: 1
      ,rtl: _rtl
      ,swipe: false
      ,arrows: false
      ,fade: _rtl ? false : true
      ,asNavFor: '.slider-thumbs-03'
      ,useTransform: true

    }).on('beforeChange', function(event, slick, currentSlide, nextSlide){
      let _currentSlide = $('.slider-for-03 .slick-slide[data-slick-index="'+currentSlide+'"]')
         ,_nextSlide = $('.slider-for-03 .slick-slide[data-slick-index="'+nextSlide+'"]');
      AT_Main.triggerVideo_event(_currentSlide);
      AT_Main.triggerVideo_event(_nextSlide);
    });

    jQuery('.slider-thumbs-03').length && !jQuery('.slider-thumbs-03').hasClass('slick-initialized') &&jQuery('.slider-thumbs-03').slick({
     infinite: false
     ,slidesToShow: __thumbnail
     ,slidesToScroll: __thumbToShow
     ,rtl: _rtl
     ,focusOnSelect: true
     ,arrows: true
     ,asNavFor: '.slider-for-03'
     ,prevArrow: $('.slick-thumb-btn-03 .btn-prev')
     ,nextArrow: $('.slick-thumb-btn-03 .btn-next')

   });

    jQuery('.slider-for-06').length && jQuery('.slider-for-06').slick({
      infinite: false
      ,slidesToShow: 1
      ,slidesToScroll: 1
      ,rtl:_rtl
      ,vertical: true
      ,verticalSwiping: true
      ,arrows: false
      ,asNavFor: '.slider-thumbs-06'
    })
    .on('beforeChange', function(event, slick, currentSlide, nextSlide){
      let _currentSlide = $('.slider-for-06 .slick-slide[data-slick-index="'+currentSlide+'"]')
         ,_nextSlide = $('.slider-for-06 .slick-slide[data-slick-index="'+nextSlide+'"]');
      AT_Main.triggerVideo_event(_currentSlide);
      AT_Main.triggerVideo_event(_nextSlide);
    });

    jQuery('.slider-thumbs-06').length && jQuery('.slider-thumbs-06').fadeIn() && jQuery('.slider-thumbs-06').slick({
      infinite : false
      ,slidesToShow : __thumbnail
      ,slidesToScroll : __thumbToShow
      ,rtl:_rtl
      ,asNavFor : '.slider-for-06'
      ,vertical : true
      ,verticalSwiping : true
      ,dots : false
      ,arrows : false
      ,focusOnSelect : true
    });
  }

  ,slickThumb_fix : (thumb)=>{
    if (!thumb.length) {return false;}

    let w_thumb, w_track, _thumb_show = +thumb.data('show') || 5;

    AT_Main.getWidthBrowser() < 768 && (_thumb_show = +thumb.data('show-mobile') || 4)

    if (thumb.hasClass('slider-thumbs-06') || thumb.hasClass('slick-vertical')) {
      w_thumb = thumb.outerHeight();
      w_track = thumb.find('.slick-track').outerHeight();
    }else{
      w_thumb = thumb.outerWidth();
      w_track = thumb.find('.slick-track').outerWidth();
    }

    if ((w_track <= w_thumb || AT_Main.getWidthBrowser() < 768) && thumb.find('.slick-slide').length <= _thumb_show) {
      thumb.find('.slick-track').addClass('no-translate3d');
      thumb.hasClass('slick-vertical') && thumb.find('.slick-list').addClass('h-100');
    }else{
      thumb.find('.slick-track').removeClass('no-translate3d');
      thumb.hasClass('slick-vertical') && thumb.find('.slick-list').removeClass('h-100');
    }
  }

  ,productPage_handle : function(obj = null){
    let main = $('#slide--main')
      ,thumb = $('#slide--thumbs')
      ,__current_view = AT_Main.getWidthBrowser() > 767 ? 'desktop' : 'mobile';

    if ((!main.length && !thumb.length) || (obj === 'check_viewport' && __current_view == main.attr('data-current-viewport'))) {return;}

    if ($('#product-detail--data').length ) {
      let _product_type = $('#product-detail--data').attr('data-slider-type');

      $('.slider-filter').hasClass('slick-initialized') && $('.slider-filter').slick('slickUnfilter');
      main.hasClass('slick-initialized') && main.slick('unslick');
      thumb.hasClass('slick-initialized') && thumb.slick('unslick');

      main.removeClass('slider-for-03 slider-for-06');
      thumb.removeClass('slider-thumbs-03 slider-thumbs-06');

      if (AT_Main.getWidthBrowser() > 767) {
        main.addClass('slider-for-'+_product_type).attr('data-current-viewport', 'desktop');
        thumb.addClass('slider-thumbs-'+_product_type);
      }
      else {
        main.addClass('slider-for-03').attr('data-current-viewport', 'mobile');
        thumb.addClass('slider-thumbs-03');
      }
      AT_Main.slickProductPage();
      AT_Main.init_productZoom();
      let a = jQuery('#slide--main').attr('data-filter');
      if (a) {
        AT_Main.productPage_variantFilter(a);
        thumb.find('.slick-slide').first().trigger('click');
      }
    }
    AT_Main.slickThumb_fix(thumb);
  }

  ,productPage_variantFilter : function(groupImage){
    jQuery('#slide--thumbs').hasClass('slider-thumbs-06') && jQuery('#slide--thumbs .slick-list').addClass('full-height');

    jQuery('#slide--main').attr('data-filter',groupImage);
    if (jQuery('.slider-filter').hasClass('slick-initialized')) {
      jQuery('.slider-filter .slick-slide').each(function() {
        let _group_class = jQuery(this).find('.slick-item').attr('data-match');
        jQuery(this).addClass(_group_class);
      });

      if (groupImage == 'none-group') {
        jQuery('.slider-filter').slick('slickUnfilter');
      }else{
        jQuery('.slider-filter').slick('slickUnfilter');
        jQuery('.slider-filter').slick('slickFilter','.'+groupImage+',.group-all');
        jQuery('.slider-filter').attr('data-filter','.'+groupImage);
      }
    }
  }

  ,scareName : function(){
    var _name_height = 0;
    jQuery('.product-card').find('h5.product-name').each(function( index,value ){
      _name_height = jQuery(value).outerHeight() > _name_height ? jQuery(value).outerHeight() : _name_height;
    });
    jQuery('.product-card').find('h5.product-name').css('height',_name_height);
  }

  ,scareScreen : function(){
    if( typeof _bc_config == "undefined" ){
      return;
    }
    var _current = this;

    if( _bc_config.enable_title_blance == "true" ){
      this.scareName();
    }


    $( document ).ajaxComplete(function( event, xhr, settings ) {
      if( _bc_config.enable_title_blance == "true" ){
        _current.scareName();
      }
    });
  }

  ,parallaxScroll : function(elem,param){
    if (typeof elem != 'undefined' || typeof param != 'undefined') {
      jQuery(window).on('scroll', function(){
        var pos = jQuery(window).scrollTop()
        ,top = elem.offset().top
        ,elemH = elem.height()
        ,windowH = jQuery(window).height();

        if ( pos < top || top > pos + windowH) {
          param.each(function(){param.css('transform', 'translateY(0px)');})
          return;
        }
        param.each(function(){param.css('transform', 'translateY(' + Math.round((pos-top) * 0.35) + 'px)');})
      });
    }
  }

  ,megamenuWithTabs : function(){
    $(document)
    .on('mouseenter', ".mega-navigation-with-tab .mega-tab--li-item", function(e){
      $('#header-style .mega-navigation-with-tab .title-item').removeClass('active');
      $('#header-style .mega-navigation-with-tab .tab-content-inner').removeClass('active');

      let id = $(this).attr('data-mega-id');
      let _this = jQuery(this);

      _this.addClass('active').closest('.mega-navigation-with-tab').find(`.mega-tab--content[data-mega-id="${id}"]`).addClass('active');
    })
    .on('mouseleave', '.mega-menu' ,function(){
      let _id = $(this).attr('data-last-active') || 1;
      $('#header-style .title-item').removeClass('active');$('.title-item-'+_id).addClass('active');
      $('#header-style .tab-content-inner').removeClass('active');$('.mm-tabs-'+_id).addClass('active');
    });
  }

  ,resizeCollection : function(){
    if ($('body').hasClass('templateCollection')) {
      let sb = $('.sidebar-column'),filter_height = $('.mobile-layout-bar')[0].clientHeight;
      if (AT_Main.getWidthBrowser() < 992 ){
        $('#footer-content').css('margin-bottom', filter_height);
        $('.filter-component').attr('style','').removeClass('accordion toggle full select hide').addClass('drawer');
        if (sb.length > 0) {
          $('.sb-widget .sbw-filter').each(function(){
            $('.filter-component.drawer').append($(this));
          })
        }
      }else{
        $('#footer-content').css('margin-bottom', 0);
        $('.filter-component').removeClass('drawer').addClass($('.cata-toolbar').data('filter'));
        if (sb.length > 0) {
          $('.sb-widget').each(function(index,val){
            if ($(this).data('prefix')) {
              $(this).append($('.filter-component').find('.sb-filter.'+$(this).data('prefix')).parents('.sbw-filter'));
            }
          })
          jQuery("#page-body").trigger('click');
        }
      }
    }
  }

  ,updateLayerCart : function(obj){
    $('.cart-img, .cart-info > p').empty();

    if (typeof obj == 'object') {
      if ( obj.image == '' ){
        $('.cart-img').css('display', 'none');
      }
      else{
        let img = `<img class="lazyload" data-src="${Shopify.resizeImage(obj.image, "280x")}">`;
        $('.cart-img').html(img);
      }

      obj.variant_title ? $('.layer-addcart-modal .prod-subtitle').empty().html(obj.variant_title).show() : $('.layer-addcart-modal .prod-subtitle').hide();
      $('.layer-addcart-modal').wrap('<div class="layer-addcart-wrapper"></div>')
      $('.layer-addcart-modal .prod-title').empty().html(`<a href="${obj.url}" target="blank" rel="noopener">${obj.product_title}</a>`);
      $('.layer-addcart-modal .prod-price').empty().html(Shopify.formatMoney(obj.price, _bc_config.money_format));

      Shopify.getCart(function(cart) {
        $('.cart-count').html('('+cart.item_count + (cart.item_count > 1 ? ' items)' : ' item)'));
        $('#layer-cart-total').empty().html(Shopify.formatMoney(cart.total_price, _bc_config.money_format));
        AT_Main.currenciesFormat('.layer-addcart-modals .cart-table span.money');
      });

      if (AT_Main.getWidthBrowser() >= 768) {
        $('.layer-related-wrapper').show();
        AT_Main.add_cart_related_product(obj.product_id);
      }else{
        $('.layer-related-wrapper').hide();
      }

      AT_Main.debounceTime(()=>{
        let e, top;
        if (AT_Main.getWidthBrowser() >= 768) {
          e   = $('#header-style .header-desktop');
          top = !e.data('sticky') ? 0 : $(window).scrollTop() > 0 ? e.outerHeight() : e.outerHeight()+ $('#topbar').outerHeight();
          $('.layer-addcart-modal').css('top', top+'px');
        }
        AT_Main.fixNoScroll();
        $('.layer-addcart-modal').addClass('show');
        $('.add-to-cart-sticky').hasClass('show') && $('.add-to-cart-sticky').addClass('hide');
      }, 500)();
    }

    else {
      $('.layer-addcart-modal').after(`<div class="modal fade" id="bundled_cart">
                                          <div class="modal-dialog modal-lg modal-dialog-centered">
                                                  <div class="modal-content">
                                                          <div class="modal-header"><button type="button" class="close btn btn-1" data-dismiss="modal"><i class="demo-icon icon-delete"></i></button></div>
                                                          <div class="modal-body">
                                                                  <p><span class="h5">All Bundled has been add to your cart</span></p>
                                                                  <p><a href="/cart" class="btn btn-1">View cart</a></p>
                                                          </div></div></div></div>`);
      $("#bundled_cart").modal('show');
      $("#bundled_cart").on('hidden.bs.modal',()=>$('#bundled_cart').remove());
    }
  }

  ,add_cart_related_product : function(id){
    let layer_related = '#layer-addcart-related'
    ,related_data = $('#layer-addcart-related--data').html().trim()
    ,url_recommend = '/recommendations/products.json?product_id=' + id + '&limit=10';

    $(layer_related).length && $(layer_related).remove();
    $('#layer-cart--related').hide().append(`<div id="layer-addcart-related" ${related_data}></div>`);

    $.ajax({
      type: 'GET',
      url: url_recommend,
      success: function ( json_reponse ) {
        let products = json_reponse.products;

        products.length && $.each(products, function(i) {
          let product = products[i];
          if (product.available) {
            let temp = `<div class="product-wrapper">
                          <div class="product-head">
                            <div class="product-image">
                              <div class="featured-img">
                                <a href="${product.url}">
                                  <span class="image--style">
                                    <img class="img-lazy" src="${Shopify.resizeImage(product.featured_image, "390x")}"/>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div class="product-content text-left">
                            <div class="pc-inner">
                              <div class="prod-name">
                                <h5 class="product-name"><a href="${product.url}" title="${product.title}">${product.title}</a></h5>
                              </div>
                              <div class="product-price notranslate">
                                <span class="price-single">${Shopify.formatMoney(product.price, _bc_config.money_format)}</span>
                              </div>
                            </div>
                          </div>
                        </div>`;
            $(layer_related).append(temp);
          }
        })
        if ($(layer_related).children().length) {
          $(layer_related).parent().fadeIn();
          AT_Main.init_carousel($(layer_related));
          AT_Main.currenciesFormat('#layer-addcart-related span.money');
        }
      }
    });
  }

  ,toggleCartSidebar : function(){
    jQuery('.cart-toggle').on('click',function (e) {
      if (!jQuery('body').hasClass('templateCart')) {
        e.stopPropagation();
        AT_Main.fixNoScroll();
        jQuery('.cart-sb').toggleClass('opened');
        jQuery('body').toggleClass('cart-opened');
      }
    });

    jQuery('#page-body, .c-close').on('click',function () {
      if (jQuery('.cart-sb').hasClass('opened')||jQuery('html,body').hasClass('cart-opened')||jQuery(".dropdown").hasClass('menu-mobile-open')) {
        jQuery('.cart-sb').removeClass('opened');
        jQuery('html,body').removeClass('cart-opened');
        jQuery(".dropdown").removeClass("menu-mobile-open");
        AT_Main.fixReturnScroll();
      }
    });

    jQuery('.layer-addcart-modal').on('click' ,'.am-close' ,function (e) {
      let target = $('.layer-addcart-modal');
      target.removeClass('show').delay(450).promise().done(()=>{
        AT_Main.fixReturnScroll();
        $('.add-to-cart-sticky').hasClass('show') && $('.add-to-cart-sticky').removeClass('hide');
        target.parent().is('.layer-addcart-wrapper') && target.unwrap();
      });
    });
  }

  ,cart_event_handle : function(){
    AT_Main.cartMobile();

    if (jQuery('body').hasClass('templateCart') && AT_Main.getWidthBrowser() < 768 && jQuery('.mobile-fixed').length) {
      let e = jQuery('.mobile-fixed'),h = e[0].clientHeight;
      if (h == 0) {
        e = jQuery('.mobile-fixed.sticky');
        h = e[0].clientHeight;
      }
      e.length && e[0].clientHeight > 0 && e.parent().css('min-height', e[0].clientHeight+'px');
    }

    /*jQuery(document).on('click','.layer-addcart-wrapper',function(e){*/
    /*  let c = e.target.className;*/
    /*  if (c == 'layer-addcart-modal show' || c == 'layer-addcart-wrapper'){*/
    /*    jQuery('.am-close').trigger('click');*/
    /*  }*/
    /*});*/
  }

  ,cartMobile : function(){
    if (jQuery('body').hasClass('templateCart') && AT_Main.getWidthBrowser() < 768 && jQuery('.mobile-fixed').length) {
      let e = jQuery('.mobile-fixed'), top = e.offset().top;
      if (typeof e != 'undefined') {
        jQuery(window).on('scroll' , function() {jQuery(window).scrollTop() < top ? e.removeClass('sticky') : e.addClass('sticky')})
      }
    }
  }

  ,fixedHeader : function(){
    var elem
    ,parent_elem = $('#header-style')
    ,_topbar     = $('#topbar')
    ,scroll      =  parent_elem.offset().top + parent_elem[0].clientHeight;

    if (AT_Main.getWidthBrowser() > 991) {
      elem = $('.header-desktop');
      if (elem.data('sticky')){$(window).scrollTop() < scroll ? parent_elem.removeClass('h-desk-sticky') : parent_elem.addClass('h-desk-sticky');}
    }
    else {
      elem = $('.header-mobile');
      if (elem.data('sticky')) {$(window).scrollTop() < scroll ? parent_elem.removeClass('h-mobi-sticky') : parent_elem.addClass('h-mobi-sticky');}
    }
  }

  ,header_fixed_handle : function(){
    if (jQuery('#header-fixed').length) {
      let header = $('header')[0].clientHeight + 250
      ,fixed = $('#header-fixed')
      ,lastScrollTop = 0;

      jQuery(window).on('scroll',()=>{
        let pos = jQuery(window).scrollTop()
        ,cartSticky = $('.cart-sticky-top.show');

        if (fixed.data('type') == 'smart') {
          if (pos > lastScrollTop){
            /*Scroll Down*/
            if(AT_Main.getWidthBrowser() >= 768 && fixed.hasClass('show') && fixed.data('sticky')){    fixed.removeClass('show');}
            if(AT_Main.getWidthBrowser() < 768  && fixed.hasClass('show') && fixed.data('sticky-mob')){fixed.removeClass('show');}

          }
          else if(pos != lastScrollTop){
            /*Scroll Up*/
            if(AT_Main.getWidthBrowser() >= 768 && fixed.data('sticky') ){ pos > header ? fixed.addClass('show') : fixed.removeClass('show');}

            if(AT_Main.getWidthBrowser() < 768  && fixed.data('sticky-mob')){
              if (pos > header && cartSticky.length) {
                !fixed.hasClass('show') && fixed.addClass('show');
              }else{
               fixed.hasClass('show') && fixed.removeClass('show');
              }
            }
          }
          lastScrollTop = pos;

        }
        else{
          if(AT_Main.getWidthBrowser() >= 768 && fixed.data('sticky')    ){ pos > header && !cartSticky.length ? fixed.addClass('show') : fixed.removeClass('show');}
          if(AT_Main.getWidthBrowser() < 768  && fixed.data('sticky-mob')){ pos > header && !cartSticky.length ? fixed.addClass('show') : fixed.removeClass('show');}
        }
        fixed.hasClass('show') ? $('header').addClass('is-fixed') : $('header').removeClass('is-fixed');

      })
    }
  }

  ,deadLine_time : function(){
    var _deadline_time = parseInt($('.shipping-time').attr('data-deadline'));
    var _currentDate = new Date();

    var _dueDate = new Date( _currentDate.getFullYear(), _currentDate.getMonth(), _currentDate.getDate());
    _dueDate.setHours(_deadline_time);

    switch(_currentDate.getDay()) {
        case 0: /* Sunday*/
        _dueDate.setDate(_dueDate.getDate() + 1);
        break;

        case 5: /* Friday*/
        if(_currentDate >= _dueDate){
          _dueDate.setDate(_dueDate.getDate() + 3);
        }
        break;

        case 6: /* Saturday*/
        _dueDate.setDate(_dueDate.getDate() + 2);
        break;

        default:
        if(_currentDate >= _dueDate){
          _dueDate.setDate(_dueDate.getDate() + 1);
        }
      }
      var newDate = new Date(_dueDate).getTime() / 1000;
      var nowSecond = new Date().getTime() / 1000
      ,secondTime = newDate > nowSecond ? newDate - nowSecond : 0;

      secondTime > 0 && AT_Main.init_EasyTimer($('.countdown_deadline'),secondTime);
  }
  ,delivery_time : function(){
    var today = new Date();
    var business_days = parseInt($('.shipping-time').attr('data-deliverytime'));
        var deliveryDate = today; /*will be incremented by the for loop*/
        var total_days = business_days; /*will be used by the for loop*/

        for(var days=1; days <= total_days; days++) {
          deliveryDate = new Date(today.getTime() + (days *24*60*60*1000));
          if(deliveryDate.getDay() == 0 || deliveryDate.getDay() == 6) {
            /*it's a weekend day so we increase the total_days of 1*/
            total_days++
          }
        }

        var weekday = new Array(7);
        weekday[0] =  "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";
        var _day = weekday[deliveryDate.getDay()];

        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March ";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var _month = month[deliveryDate.getMonth()];

        $('.delivery-time').html('Want it delivered by' + '&nbsp;' + '<strong>' + _day + ',' + '&nbsp;' + deliveryDate.getDate() + '&nbsp;' + _month + '?' + '</strong>');
        $('.shipping-time').removeClass('hide');
      }

  ,addEvent : function(obj, evt, fn){ /*Exit intent*/
    if (obj.addEventListener) {
      obj.addEventListener(evt, fn, false);
    }
    else if (obj.attachEvent) {
      obj.attachEvent("on" + evt, fn);
    }
  }

  ,exitIntent : function(){  /*Exit intent trigger*/
    AT_Main.addEvent(document, 'mouseout', function(evt) {

      if (evt.toElement == null && evt.relatedTarget == null ) {
        AT_Main.newsletterPopupAction();
      };

    });
  }

  ,newsletterPopupAction : function(){ /*Action newsletter popup*/
    let expire = +jQuery("#newsletter-popup").data('expires');

    if (jQuery.cookie('newsletters_popup_cookie')) {
      expire == 0 && $('#newsletter_popup').modal('show');
    }
    else {
      $('#newsletter_popup').modal('show');
    }
    jQuery.cookie('newsletters_popup_cookie', 'true', { expires: expire });
  }

  ,newsletterPopupDelayAction : function(){ /*Action newsletter popup with delay time*/
    let delay  = +jQuery("#newsletter-popup").data('delay');
    let expire = +jQuery("#newsletter-popup").data('expires');
    if (jQuery.cookie('newsletters_popup_cookie')) {
      /*it hasn't been one days yet*/
      expire == 0 && $('#newsletter_popup').modal('show');
    }
    else {
      setTimeout(function(){$('#newsletter_popup').modal('show');}, delay);
    }
    jQuery.cookie('newsletters_popup_cookie', 'true', { expires: expire });
  }

  ,newsletterPopup : function(){ /*Show newsletter popup*/

    let style = jQuery("#newsletter-popup").data('style');

    if ($('.newsletter-popup-content').length > 0){
      if (style == 'delay'){
        AT_Main.newsletterPopupDelayAction();
      }

      else if (style == 'exit-intent'){
        AT_Main.exitIntent();
      }

      else{
        jQuery(window).scroll(function() {
          let scroll_position = jQuery("#newsletter-popup").data('scroll');
          let newsletter_st = jQuery(this).scrollTop();

          if (newsletter_st > scroll_position ) {
            AT_Main.newsletterPopupAction();
          }
        });
      }

      jQuery('.np-close').on('click',function (e) {
        $('#newsletter_popup').modal('hide');
      })
    }
    else {return ;}
  }

  ,newsletterCoupon: function(){ /*Show coupon code when subscribe newsletter*/
    let _formTarget = $('#newsletter_popup .newsletter-block--form-type');



    if (_formTarget.data('form-type') == 'klaviyo'){
      if (JSON.parse(_formTarget.attr('disabled-ajax'))) {
        jQuery('#newsletter_popup form button').on('click', function (event) {
          AT_Main.debounceTime(()=>{
            jQuery('.text-box-image').hide();
            jQuery('.subscribe-result').show();
            jQuery('.newsletter-popup-content').removeClass('block-image-true').addClass('block-image-false');
          }, 1000)();
        })
      }
      else{
        KlaviyoSubscribe.attachToForms('#newsletter_popup form', {
          success: function ($form) {
            jQuery('.text-box-image').hide();
            jQuery('.subscribe-result').show();
            jQuery('.newsletter-popup-content').removeClass('block-image-true').addClass('block-image-false');
          }
        });
      }
    }
    else{

      jQuery('#newsletter_popup form button').on('click', function (event) {
        if (JSON.parse(_formTarget.attr('disabled-ajax'))) {
          AT_Main.debounceTime(()=>{
            jQuery('.text-box-image').hide();
            jQuery('.subscribe-result').show();
            jQuery('.newsletter-popup-content').removeClass('block-image-true').addClass('block-image-false');
          }, 1000)();
          return;
        }
        if (event) event.preventDefault()
        let $form = $('#newsletter_popup form');

        jQuery.ajax({
          type: 'POST',
          url: $form.attr('action'),
          data: $form.serialize(),
          cache: false,
          dataType: 'json',
          contentType: 'application/json;charset=utf-8;',
          error: function (err) { console.log(err);alert('Could not connect to the registration server. Please try again later.') },
          success: function (data){
            jQuery('.text-box-image').hide();
            jQuery('.subscribe-result').show();
            jQuery('.newsletter-popup-content').removeClass('block-image-true').addClass('block-image-false');
          }
        })
      })
    }


    jQuery('.btn-copy').on('click',function (e) {
      var _temp = $('<input>');
      $("body").append(_temp);
      _temp.val($('#mycode').text()).select();
      document.execCommand("copy");
      _temp.remove();
    })
  }

  ,productSliderV2 : function(){
    let e = $('.home-product-slider-v2');
    e.length && e.each(function(index, el) {
      let _id = $(this).data('section-id');
      let _main = '.section-show-'+_id+' .main-slider', _thumb = '.section-show-'+_id+' .thumb-slider';

      $(_main).length && !$(_main).hasClass('slick-initialized') && $(_main).slick({
        slidesToShow: 1
        ,slidesToScroll: 1
        ,arrows: false
        ,fade: true
        ,asNavFor: _thumb
      });

      $(_thumb).length && !$(_thumb).hasClass('slick-initialized') && $(_thumb).slick({
        infinite: false
        ,vertical: true
        ,verticalSwiping: true
        ,slidesToShow: 3
        ,slidesToScroll: 1
        ,asNavFor: _main
        ,focusOnSelect: true
        ,arrows: false
      });
    });
  }

  ,productBundled : function(){
    if (!('#bundledAddToCart_meta').length) {return;}

    var updateTotalPrice = function(){
      let _total = 0;
      $('.bundled-item-checkbox:checked').each(function(){
        let _parent = $(this).closest('.bundled-item')
        ,_price = +_parent.find('input[name="price"]').val();
        _total += _price;
      })
      $('#bundledAddToCart_meta .bundled-total-price .price').html(Shopify.formatMoney(_total, _bc_config.money_format));
    }

    updateTotalPrice();

    $(document)
    .on('click', '#product-bundled .pb-title a, #product-bundled .bundled-item-checkbox' ,e=>{
      e.preventDefault();
      let _this = $(e.currentTarget)
      ,parent = _this.closest('.bundled-item')
      ,inputCheckbox = parent.find('input.bundled-item-checkbox')
      ,inputIsChecked = parent.find('input.bundled-item-checkbox[checked]')

      if(_this.closest('.bundled-product-0').length){return;}
      parent = $(`.bundled-product-${parent.attr('class').replace(/\D/g,'')}`);

      let imageTarget = parent.find('img');

      if (inputIsChecked.length) {
        inputCheckbox.removeAttr('checked');
        imageTarget.length && imageTarget.closest('li').hide();
      }
      else{
        inputCheckbox.attr('checked', 'checked');
        imageTarget.length && imageTarget.closest('li').show();
      }

      updateTotalPrice();
    })

    .on('change' ,'.b-prod-select select' ,function(){
      let parent = $(this).closest('.bundled-item')
      ,price = parent.find('select option:selected').data('price');

      parent.find('.pb-price .price').html(Shopify.formatMoney(price, _bc_config.money_format));
      parent.find('input[name="price"]').val(price);
      updateTotalPrice();
    })

    .on('click', '.add-bundle-to-cart' ,e=>{
      e.preventDefault();
      let data = [];
      $('.bundled-item-checkbox[checked]').each(function(){
        let _this = $(this).closest('.bundled-item');
        if(_this.find('select[name="id"]').length){
          data.push({ id : +_this.find('select[name="id"]').val(), quantity: 1})
        }
      });

      AT_Main._requestAjax({items: data},'POST','/cart/add.js')
      .done(response=>{
        Shopify.getCart(function(cart){Shopify.updateCartInfo(cart, '.cart-info .cart-content');});
        let _cartStyles = 'sidebar';
        switch (_cartStyles) {
          case 'dropdown':
          AT_Main.updateLayerCart();
          break;

          case 'sidebar':
          !$('.cart-sb.opened').length && jQuery('.cart-sb').addClass('opened');
          !$('body.cart-opened').length && jQuery('body').addClass('cart-opened');
          break;

          case 'page':
          setTimeout(function(){window.location.href = "/cart";}, 1000);
          break;

          case 'checkout':
          setTimeout(function(){window.location.href = "/checkout";}, 1000);
          break;
          default:
          break;
        }
      })
      .fail(e=>{notifyAddCartFail(e)})
    });
  }
  ,currenciesFormat : target=>{
    if (!JSON.parse(_bc_config.show_multiple_currencies || 'false') || typeof Currency == 'undefined') {return false;}

    currenciesCallbackSpecial(target);
  }
  ,currenciesChange : value=>{
    ($(`input[name="storeMulti_Currency"]`).val() == '1') && $(`.shopify-currency-form`).length && $(`.shopify-currency-form option[data-value="${value}"]`).prop('selected',true).trigger('change');
    $('.currency-element').length && $(`.currency-element option[data-value="${value}"]`).prop('selected',true);

    let symbol = $(`.currencies-list a[data-value="${value}"]`).attr('data-symbol');
    symbol != '' && (symbol = '/ ' + symbol);

    $('.currencies-list li').removeClass('active');
    $(`.currencies-list a[data-value="${value}"]`).closest('li').addClass('active');

    let t = `<span class="currency-code">${value} ${symbol}</span>`;
    $('.currencies_btn.currency-flag-btn').html(t);

    typeof Currency != 'undefined' && Currency.convertAll(Currency.currentCurrency, value);
  }

  ,init_currencies : ()=>{
    if (!JSON.parse(_bc_config.show_multiple_currencies || 'false')) {return false;}

    $(document).on('click', '.currencies-list a', e=>{
      let _value = $(e.currentTarget).attr('data-value');
      AT_Main.currenciesChange(_value);
    })

    $('.currency-element').on('change', e=>{
      let _this = $(e.currentTarget)
      ,_value = _this.val();
      AT_Main.currenciesChange(_value);

    })
    $('.shopify-currency-form select').on('change', function(){
      $(this).closest('form').submit();
    })
  }

  ,init_map : function(){
    if ($('.map-element-ui').length && !$('script[id="api_map_key"]').length) {
      if ("AIzaSyD3IQEms0glYW-EDAi2WBjrjl0-DffazEc".length) {
        let s   = document.createElement("script");
        s.type  = "text/javascript";
        s.id    ="api_map_key"
        s.async = true;
        s.defer = true;
        s.src   = "//maps.googleapis.com/maps/api/js?key=AIzaSyD3IQEms0glYW-EDAi2WBjrjl0-DffazEc&callback=AT_Main.init_map";
        $('body').append(s);
      }else{
        console.log(`Cannot find Google Map script. Please insert Map API Key !`);
      }
      return false;
    }
    $('.map-element-ui').length && $('.map-element-ui').each(function(){
      if (!$(this).hasClass('map-loaded') && typeof google != 'undefined') {
        let _this       = $(this)
        ,_element       = _this.children('.map-element')
        ,_latlong       = _this.attr('data-latlong').split(',')
        ,_lat           = +_latlong[0].trim()
        ,_long          = +_latlong[1].trim()
        ,_zoom_lv       = +_this.attr('data-zoom')
        ,_scroll        = $.parseJSON(_this.attr('data-scroll'))
        ,_icon_layout   = _this.attr('data-icon')
        ,_content       = _this.attr('data-content')
        ,marker
        ,i
        ,locations = [['<div class="map-info-box"><p>'+_content+'</p></div>', _lat, _long, 9]];

        let map = new google.maps.Map(_element[0], {
          zoom: _zoom_lv,
          scrollwheel: _scroll,
          center: new google.maps.LatLng(_lat, _long),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        let infowindow = new google.maps.InfoWindow();

        for (i = 0; i < locations.length; i++) {
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            animation: google.maps.Animation.DROP,
            icon: _icon_layout,
          });

          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infowindow.setContent(locations[i][0]);
              infowindow.open(map, marker);
            }
          })(marker, i));
        }
        _element.addClass('map-loaded');
      }
    })
  }

  ,init_productZoom : function(){
    $('.pswp').length && $('.pswp').remove();
    $('.fancybox').length && $('.fancybox').jqPhotoSwipe({
      galleryOpen: function (gallery) {$('.pswp').length && $('.pswp').attr('disabled-variant-switch', true);}
    });

    $('.image-zoom').parent().trigger('zoom.destroy');
    if (!JSON.parse($('.slider-main-image').data('zoom') || false)){return;}

    if (AT_Main.getWidthBrowser() > 767 ) {
      $('.image-zoom').each(function(index, el) {
        let largeImg = $(this).parents('.image-zoom-parent').data('zoom-size');
        if(typeof largeImg != 'undefined'){
          $(this).parents('.image-zoom-parent').zoom({
            url: largeImg,
            on:'mouseover',
            touch:false
          });
        }
      });
    }
  }

  ,init_CountDown : function(){
    let c_down = $('.block-countdown');
    c_down.length && $('.block-countdown').each(function(){
      let c = $(this);
      if (c.data('date') != '' && !c.hasClass('countdown-loaded') && c.children().length ) {
        var $this   = c
        ,id         = $this.find('.wrapper-countdown').data('id')
        ,newTime    = $this.find('.wrapper-countdown').data('date').toString().split('/')
        ,newSecond  = new Date(newTime[2], Number(newTime[0])-1, newTime[1]).getTime() / 1000
        ,nowSecond  = new Date().getTime() / 1000
        ,secondTime = newSecond > nowSecond ? newSecond - nowSecond : 0;
        if (secondTime > 0) {
         $this.addClass('countdown-loaded');
         AT_Main.init_EasyTimer($('.countdown_'+id),secondTime);
       }else{
          c.remove();
       }
      }
    });
  }

  ,init_EasyTimer : function(selector,time_second){
    var timer = new easytimer.Timer();
    timer.start({countdown: true, startValues: {seconds: time_second}});
    timer.addEventListener('secondsUpdated', function (e) {
      let d = timer.getTimeValues().days
         ,h = timer.getTimeValues().hours
         ,m = timer.getTimeValues().minutes
         ,s = timer.getTimeValues().seconds;
      let d_t = d > 1 ? "Days" : "Day"
         ,h_t = h > 1 ? "Hrs" : "Hour"
         ,m_t = m > 1 ? "Mins" : "Min"
         ,s_t = s > 1 ? "Secs" : "Sec";
      selector.find('.count-day .date-number').html(d);
      selector.find('.count-hours .date-number').html(h);
      selector.find('.count-minutes .date-number').html(m);
      selector.find('.count-seconds .date-number').html(s);

      selector.find('.count-day .text-date').length && selector.find('.count-day .text-date').html(d_t);
      selector.find('.count-hours .text-date').length && selector.find('.count-hours .text-date').html(h_t);
      selector.find('.count-minutes .text-date').length && selector.find('.count-minutes .text-date').html(m_t);
      selector.find('.count-seconds .text-date').length && selector.find('.count-seconds .text-date').html(s_t);
    });
    timer.addEventListener('targetAchieved', function (e) {selector.remove();});
  }

  ,initSlider_image : function(){
    let e = $('.home-slider-ver-image');
    if (e.length) {
      for (var i = 0; i < e.length; i++) {
        let _this = $(e[i])
            ,_main = _this.find('.main-slider')
            ,_nav =  _this.find('.nav.nav-tabs');

        !_main.hasClass('slick-initialized') && _main.slick({
          slidesToShow: 1
          ,slidesToScroll: 1
          ,arrows: false
          ,useTransform: false
          ,asNavFor: _nav
        });

        !_nav.hasClass('slick-initialized') && _nav.slick({
          infinite: false
          ,vertical : true
          ,verticalSwiping : true
          ,slidesToShow: 4
          ,slidesToScroll: 1
          ,focusOnSelect: true
          ,arrows: false
          ,asNavFor: _main
        });

        AT_Main.slickThumb_fix(_nav);

        $(window).resize(()=>{
          AT_Main.slickThumb_fix(_nav);
        })
      }
    }
  }

  ,init_customContent : function(){
    let el = jQuery('.custom-content-wrapper .content-nested-carousel');
    el.length && AT_Main.init_carousel(el);

    jQuery('.canvas-wrap').length && jQuery('.canvas-wrap').each(function(index, el) {
      let _item = jQuery(el).children('canvas');
      let _id = jQuery(el).data('id');

      var can     = document.getElementById('canvas-'+_id),
      c           = can.getContext('2d');

      var posX    = can.width / 2,
      posY        = can.height / 2,
      fps         = 1000 / 200,
      procent     = 0,
      oneProcent  = 360 / 100,
      result      = oneProcent * Number(jQuery(el).data('per'));

      c.lineCap   = 'round';
      arcMove();

      function arcMove(){
        var deegres = 0;
        var acrInterval = setInterval (function() {
          deegres += 1;
          c.clearRect( 0, 0, can.width, can.height );
          procent = deegres / oneProcent;
          jQuery('#procent-'+_id).html(procent.toFixed() + '%');

          c.beginPath();
          c.arc( posX, posY, 50, (Math.PI/180) * 270, (Math.PI/180) * (270 + 360) );
          c.strokeStyle = '#e1e0e0';
          c.lineWidth = '5';
          c.stroke();

          c.beginPath();
          c.strokeStyle = '#c62828';
          c.lineWidth = '5';
          c.arc( posX, posY, 50, (Math.PI/180) * 270, (Math.PI/180) * (270 + deegres) );
          c.stroke();
          if( deegres >= result ) clearInterval(acrInterval);
        }, fps);
      }
    });
  }
  ,init_instafeed : function(){
    let ins = jQuery('.home-instagram').length;
    if (ins) {
      for (var i = 0; i < ins; i++) {
        var ins_elem  = jQuery('.home-instagram').eq(i)
        ,id           = ins_elem.attr('data-section-id')
        ,insta_target = jQuery(`#home_instagram_list_${id}`);
        if( insta_target.length && !insta_target.hasClass('ins-loaded')){
          if( 'undefined' === typeof Instafeed ){
            console.log(" Instafeed has not defined yet! ");
            return;
          }
          var instagram_list
              ,$insta    = insta_target
              ,filter    = insta_target.attr('data-filter')
              ,image_tag = '';
          if ($insta.data('token-key') != '') {
            if (JSON.parse(insta_target.attr('data-lazyload') || 'false')) {
              image_tag = `<span style="padding-bottom: 100%;position:relative;display:block;"><img class="img-lazy lazyload" data-src="{{image}}"/></span>`;
            }
            else{
              image_tag = `<img src="{{image}}"/>`;
            }
            let item_row   = $insta.data('row') ? $insta.data('row') : '';
            let min_height = [insta_target[0].clientHeight ,'px'].join('');
            insta_target.css('min-height',min_height).empty();
            let ins_id_elem = id;
            instagram_list = new Instafeed({
              get: "user"
              ,target     : `home_instagram_list_${id}`
              ,accessToken: $insta.data('token-key')
              ,userId     : $insta.data('uid')
              ,limit      : $insta.data('limit')
              ,resolution : "standard_resolution"
              ,template   : `<div class="ins-item ${item_row}">
                              <a href="{{link}}" target="_blank" rel="noopener">${image_tag}</a>
                              <div class="instagram-hover">
                                 <div class="insta-comment">
                                    <span><i class="demo-icon icon-uniE908"></i>{{likes}}</span>
                                    <span><i class="demo-icon icon-uniE938"></i>{{comments}}</span>
                                 </div>
                              </div>
                            </div>`

              ,after : function(e) {
                let ins_owl = jQuery(`#home_instagram_list_${ins_id_elem}.insta-carousel`);
                ins_owl.length && AT_Main.init_carousel(ins_owl);
                jQuery(`#home_instagram_list_${ins_id_elem}`).addClass('ins-loaded').removeAttr('style');
              }
            });
            instagram_list.run();
          }
          else if(insta_target.find('.ins-te-item').length){
            let _ins_carousel = $(`#home_instagram_list_${id}.insta-carousel`);
            _ins_carousel.length && AT_Main.init_carousel(_ins_carousel);
          }
        }
      }
    }
  }
  ,init_carousel : function(el){
    el.length && el.each(function(index, value) {
      var e = $(this);
      if (!e.hasClass('owl-loaded')) {
        var _rtl      = _bc_config.enable_rtl == 'true' ? true    : false
        ,_owl_xs      = e.data('owl-xs') ? e.data('owl-xs')  : 1
        ,_owl_xxs     = e.data('owl-xxs')? e.data('owl-xxs') : _owl_xs
        ,_owl_sm      = e.data('owl-sm') ? e.data('owl-sm')  : _owl_xs
        ,_owl_md      = e.data('owl-md') ? e.data('owl-md')  : _owl_sm
        ,_owl_lg      = e.data('owl-lg') ? e.data('owl-lg')  : _owl_md
        ,_owl_xl      = e.data('owl-xl') ? e.data('owl-xl')  : _owl_lg
        ,_loop        = e.data('loop')        ? e.data('loop')        : false
        ,_nav         = e.data('nav')         ? e.data('nav')         : false
        ,_dot         = e.data('dot')         ? e.data('dot')         : false
        ,_autoplay    = e.data('autoplay')    ? e.data('autoplay')    : false
        ,_thumbs      = e.data('thumbs')      ? e.data('thumbs')      : false
        ,_padding_lg  = e.data('padding-lg')  ? e.data('padding-lg')  : '0'
        ,_padding_xs  = e.data('padding-xs')  || _padding_lg
        ,_padding_md  = e.data('padding-md')  || _padding_lg
        ,_center      = e.data('center')      ? e.data('center')      : false
        ,_duration    = e.data('duration')    ? e.data('duration')    : 3000
        ,_autoHeight  = e.data('auto-height') ? e.data('auto-height') : false
        ,_effectIn    = e.data('effect-in')   ? e.data('effect-in')   : false
        ,_effectOut   = e.data('effect-out')  ? e.data('effect-out')  : false;

        _padding_lg = +(_padding_lg.toString().replace(/\D/g,''));
        _padding_xs = +(_padding_xs.toString().replace(/\D/g,''));
        _padding_md = +(_padding_md.toString().replace(/\D/g,''));

        !e.hasClass('owl-carousel') && e.addClass('owl-carousel');
        !e.hasClass('owl-loaded') && e.owlCarousel({
          rtl                : _rtl
          ,autoplay           : _autoplay
          ,autoplayTimeout    : _duration
          ,center             : _center
          ,nav                : _nav
          ,dots               : _dot
          ,thumbs             : _thumbs
          ,thumbsPrerendered  : _thumbs
          ,animateIn          : _effectIn
          ,animateOut         : _effectOut
          ,autoHeight         : _autoHeight
          ,responsive : {
            0:{
              items : _owl_xs
              ,margin : _padding_xs
              ,loop: !Number.isInteger(_owl_xs) && e.children().length >= _owl_xs ? true : _loop
            }
            ,375:{
              items : _owl_xxs
              ,margin : _padding_xs
              ,loop: !Number.isInteger(_owl_xxs) && e.children().length >= _owl_xxs ? true : _loop
            }
            ,576:{
              items : _owl_sm
              ,margin : _padding_xs
              ,loop: !Number.isInteger(_owl_sm) && e.children().length >= _owl_sm ? true : _loop
            }
            ,768:{
              items : _owl_md
              ,margin : _padding_md
              ,loop: !Number.isInteger(_owl_md) && e.children().length >= _owl_md ? true : _loop
            }
            ,992:{
              items : _owl_lg
              ,margin : _padding_lg
              ,loop: !Number.isInteger(_owl_lg) && e.children().length >= _owl_lg ? true : _loop
            }
            ,1200:{
              items : _owl_xl
              ,margin : _padding_lg
              ,loop: !Number.isInteger(_owl_xl) && e.children().length >= _owl_xl ? true : _loop
            }
          }
          ,navText  : ['<span class="button-prev"></span>', '<span class="button-next"></span>']
        });
      }
    })
    AT_Main.init_CountDown();
  }
  ,init_masonry : function(selector = jQuery('.home-banner-items')){
    let elem = selector;
    elem.length && elem.each(function(){
      if ($(this).find('.home-banner-carousel').length) {
        AT_Main.init_carousel(jQuery('.home-banner-carousel'));
      }

      if ($(this).find('.home-banner-masonry').length) {
        let i_masonry = function(e,grid){
          e = new Muuri(grid, {
            items: '.banner-item'
            ,layout: {rounding: false}
            ,layoutOnResize: true
            ,layoutDuration: 800
            ,layoutEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
          });
        }

        let _class = '.' + jQuery(this).find('.home-banner-masonry').attr('class').replace(' ','.') + ' .bc-masonry';
        jQuery(this).find('.bc-masonry').each(function(){
          let $module = jQuery(this);
          this.addEventListener('load', i_masonry($module,_class), true);
          i_masonry($module,'.bc-masonry');
          jQuery(window).resize(function() {i_masonry($module,'.bc-masonry')});
        });

      }
    });
    AT_Main.init_CountDown();
  }
  ,resize_handle : function(){
    if(old_width == AT_Main.getWidthBrowser()){return;}

    old_width = AT_Main.getWidthBrowser();
    AT_Main.fixReturnScroll();/*Reset Page when fixNoScroll had called before*/
    AT_Main.resizeCollection();
    AT_Main.header_fixed_handle();
    AT_Main.productPage_handle('check_viewport');
    AT_Main.fixedHeader();
    AT_Main.cartMobile();
    if(AT_Main.checkLayout() != 1 && jQuery('.menu-mobile').hasClass('opened') && !$('body').hasClass('search-is-typing')){
      jQuery("#page-body").trigger('click');
    }
    $('#header-fixed.show').length && $('#header-fixed.show').removeClass('show');
  }
  ,header_handle : function(){
    AT_Main.init_map();
    AT_Main.init_CountDown();
    AT_Main.header_fixed_handle();
    AT_Main.init_carousel(jQuery(".mega-menu-slider-element"));

    $('.carousel[data-ride="carousel"]').length && $('.carousel[data-ride="carousel"]').carousel();
    $('.dropdown-menu-tabs').length && $('.dropdown-menu-tabs').closest('.mega-menu').attr('data-last-active',1);

    $('.mega-menu-attribute--hover')
    .on('shopify:block:select', function(){
      let _this = $(this), _header;

      if (_this.closest('.vertical-menu').length && !$('body').hasClass('templateIndex')) {
        let _dd = _this.closest('.vertical-menu').find('#dd_verticalmenu');
        _dd.length && !JSON.parse(_dd.attr('aria-expanded')) && _dd.trigger('click');
      }
      _header = $('#header-style').attr('data-style') == '4' ? '#header-fixed' : '.header-desktop';
      $(_header +' .mega-menu-attribute--hover[data-mega-id="'+_this.attr('data-mega-id')+'"]').addClass('menu-showing--active admin-editor')
      $('#header-style').attr('data-style') == '4'&& $(_header).addClass('show');
    })
    .on('shopify:block:deselect', function(){
      let _this = $(this), _header;

      if (_this.closest('.vertical-menu').length && !$('body').hasClass('templateIndex')) {
        let _dd = _this.closest('.vertical-menu').find('#dd_verticalmenu');
        _dd.length && JSON.parse(_dd.attr('aria-expanded')) && _dd.trigger('click');
      }
      _header = $('#header-style').attr('data-style') == '4' ? '#header-fixed' : '.header-desktop';

      $(_header+' .mega-menu-attribute--hover[data-mega-id="'+_this.attr('data-mega-id')+'"]').removeClass('menu-showing--active admin-editor')
      $('#header-style').attr('data-style') == '4'&& $(_header).removeClass('show');
    })


    $('input[name="megaMenuStyle"]')
    .on('shopify:block:select', function(){
      let _value = $(this).val().split('++');
      for(let i of _value){
        let _megaItem = $('.header-desktop .mega_columns[data-mega-title="'+i+'"]');
        if (_megaItem.length) {
          _megaItem.closest('.mega-menu-attribute--hover').addClass('menu-showing--active');
          return
        }
      }
    })
    .on('shopify:block:deselect', function(){
      let _value = $(this).val().split('++');
      for(let i of _value){
        let _megaItem = $('.header-desktop .mega_columns[data-mega-title="'+i+'"]');
        if (_megaItem.length) {
          _megaItem.closest('.mega-menu-attribute--hover').removeClass('menu-showing--active');
          return
        }
      }
    })


    $('.mega-tab--li-item')
    .on('shopify:block:select', function(){
      let id = $(this).attr('data-mega-id')
      ,li_id = $(this).attr('data-index');

      $('.mega-tab--li-item[data-mega-id="'+id+'"]').closest('.mega-menu').attr('data-last-active', li_id);

      $('.mega-tab--li-item, .mega-tab--content').removeClass('active');
      $('.mega-tab--li-item[data-mega-id="'+id+'"], .mega-tab--content[data-mega-id="'+id+'"]').addClass('active');
    })
    .on('shopify:block:deselect', function(){
      $('.mega-tab--li-item, .mega-tab--content').removeClass('active');
      $('.mega-navigation-with-tab .mega-tab--li-item:first-child, .mega-navigation-with-tab .mega-tab--content:first-child').addClass('active');
    });


    $('.mega-block-items')
    .on('shopify:block:select', function(){
      let _this = $(this);
      if(!_this.closest('.mega-navigation-with-tab').length){return}
      let id = _this.closest('.tab-content-inner').attr('data-mega-id');
      $('.mega-tab--li-item, .mega-tab--content').removeClass('active');
      $('.mega-tab--li-item[data-mega-id="'+id+'"], .mega-tab--content[data-mega-id="'+id+'"]').addClass('active')
      let li_id = _this.closest('.mega-tab--content').attr('data-index') || 1;
      $('.mega-tab--li-item[data-mega-id="'+id+'"]').closest('.mega-menu').attr('data-last-active', li_id);
    })
    .on('shopify:block:deselect', function(){
      let _this = $(this)
      if(!_this.closest('.mega-navigation-with-tab').length){return}
      $('.mega-tab--li-item, .mega-tab--content').removeClass('active');
      $('.mega-navigation-with-tab .mega-tab--li-item:first-child, .mega-navigation-with-tab .mega-tab--content:first-child').addClass('active');
      $('.mega-menu[data-last-active]').attr('data-last-active', 1);
    });

    $('#shopify-section-header').on('shopify:section:select', function(){AT_Main.fixReturnScroll();})
  }
  ,init_mobile_bar : function(){
    if(!$('#mobile-bar').length){return;}

    $(window).on('scroll', e=>{
      if($(window).scrollTop() + AT_Main.getHeightBrowser() > $(document).height() - 100
        || $('.cart-sticky-bottom.show').length
        || $('div[aria-label="cookieconsent"]').is(':visible')){

        $('#mobile-bar').addClass('mobile-bar--hidden');
      }
      else{
        $('#mobile-bar').removeClass('mobile-bar--hidden');
      }
    })

    let mobileBar_height = element=>{
      if (!element.length) {return;}
      let h = $('#mobile-bar').innerHeight() + 'px';
      element.css('height', `calc(100% - ${h})`);
    }

    $(document)
    .on('click', '.mobile-block_menu > a' ,e=>{
      let _parent = $(e.currentTarget).closest('.mobile-block_menu');

      _parent.toggleClass('active');
      $('.mobile-block_menu.active').not(_parent).removeClass('active');
      if(_parent.hasClass('active')){
        mobileBar_height(_parent.find('.mobile-bar--block-menu-content'));
        $('body').addClass('popup-active');
      }
      else{
        $('body').removeClass('popup-active');
      }
    })

    $('#mobile-bar').closest('.shopify-section')
    .on('shopify:section:select' ,function(){
      $('#mobile-bar').addClass('mobile-bar--active');
      let _target = $(parent.document).find('button[data-viewport-role="mobile"]');
      _target.length && _target.trigger('click');

    })
    .on('shopify:section:deselect', function(){
      $('#mobile-bar .mobile-block_menu').removeClass('active');
      $('#mobile-bar').removeClass('mobile-bar--active');

      let _target = $(parent.document).find('button[data-viewport-role="desktop"]');
      _target.length && _target.trigger('click');
    });

    $('#mobile-bar .mobile-block_menu')
    .on('shopify:block:select', function(){
      let _this = $(this);
      _this.addClass('active');
      $('body').addClass('popup-active');
    })
    .on('shopify:block:deselect', function(){
      let _this = $(this);
      _this.removeClass('active');
      $('body').removeClass('popup-active');
    });
  }

  ,init_onload : function(){
    old_width = $( window ).width();
    AT_Main.scareScreen();
  }

  ,init_handle : function(){

    jQuery('.rating-links a').click(function() {
      jQuery('.product-simple-tab ul li a').removeClass('active');
      jQuery('#tab_review_tabbed a').addClass('active');
      jQuery('.product-simple-tab .tab-content .tab-pane').removeClass('show active');
      jQuery('#tab-review').addClass('show active');
      jQuery('#tab_review_tabbed').scrollToMe();
      return false;
    });

    $('.modal-ui-element').on('show.bs.modal', function(){
      $('#page-body').trigger('click');
    })

    jQuery('#searchModal').on('shown.bs.modal', function(){
      jQuery('#searchModal input[type="text"][name="q"]').focus();

    }).on('click', 'button.close', function(e){
      if (AT_Main.getWidthBrowser() > 991 ) {
        $('#searchModal').modal('hide');
      }
      else{
        if ($('#searchModal').find('input[type="text"][name="q"]').val().length > 0) {
          $('#searchModal').find('input[type="text"][name="q"]').val('');
        }else{
          $('#searchModal').modal('hide');
        }
      }
    })

    $('.modal-video').on('hide.bs.modal',(e)=>{
      let $this = $(e.target), _iframe = $this.find('iframe');
      if (_iframe.length) {
        let _iframe_src = _iframe.attr('src').split('?autoplay=')[0] + '?autoplay=';
        _iframe_src += '0';
        _iframe.attr('src',_iframe_src);
      }
    }).on('show.bs.modal',(e)=>{
      let $this = $(e.target), _iframe = $this.find('iframe');
      if (_iframe.length) {
        let _iframe_src = _iframe.attr('src').split('?autoplay=')[0] + '?autoplay=';
        _iframe_src += '1';
        _iframe.attr('src',_iframe_src);
      }
    });

    $('.main-content > #looxReviews').length && $('.main-content > #looxReviews').remove();
    $('.main-content > #looxSchemaJson').length && $('.main-content > #looxSchemaJson').remove();

    jQuery('.mm-block-icons .wishlist-target, .mm-block-icons .compare-target, .m-close').on('click',function () {
      jQuery(".menu-mobile").removeClass("opened");
      AT_Main.fixReturnScroll();
    });

    $(document)
    .on('click','.m-customer-account span',function(){
      jQuery(this).parent().find('.popup-icons').toggleClass('open op-click');
    })

    .on('click','.f-select > a',function(e){
      e.preventDefault();
      jQuery(this).toggleClass('active').parents('.f-select').children('ul').toggleClass('open');
    })

    .on('click','.header-mobile .m-customer-account:not(.no-popup)',()=>{
      let e = jQuery('.popup-icons-mobile');
      e.removeClass('hide').wrap('<div class="popup-wrapper"></div>');
      AT_Main.fixNoScroll();
    })

    .on('click','.top-cart-holder.hover-dropdown .cart-target',function(){
      let e = $(this);
      e.hasClass("opened") ? e.removeClass("opened") : e.addClass("opened");
    })

    .on("click" ,'#quick-shop-popup .qty-inner > span', e=>{
      let _this = $(e.currentTarget)
      ,oldValue = +$("#qs-quantity").val();

      if (_this.hasClass('qty-up')) {
        oldValue++;
      }
      else if (_this.hasClass('qty-down')) {
        oldValue > 1 && oldValue--;
      }
      $("#qs-quantity").val(oldValue);
    })

    .on('click', '[name="checkout"], [name="goto_pp"], [name="goto_gc"]', function() {
      if (jQuery(this).data('term')) {
        if (jQuery('.agree').is(':checked')){jQuery(this).submit();}
        else {
          alert("You must AGREE with Terms and Conditions.");
          return false;
        }
      }
    })

    .on('click','.agree', function(){
      $(this).is(':checked') ? jQuery('.agree').prop('checked', true) : jQuery('.agree').prop('checked', false);
    })

    .on('click','.custom-content-wrapper .has-video.no-popup > *', function(e){
      let $this = $(this).parents('.has-video.no-popup').toggleClass('show-video').children('.layer-image');
      let _v = $this.next('.layer-video');

      if(_v.length) {
        _v.toggle();
        let _iframe = _v.find('iframe');
        if (_iframe.length && _iframe.attr('src').includes('youtube')) {
          let _iframe_src = _iframe.attr('src').split('?autoplay=')[0] + '?autoplay=';
          _iframe_src += (_v.is(":visible") && _v.closest('.has-video.show-video').length) ? '1' : '0';
          _iframe.attr('src',_iframe_src);
        }
      }
    })

    .on('click','.home-product-slider-v2 .thumb-slider a', function(e){
      e.preventDefault();return false;
    })
    .on('click','.home-slider-ver-image div.nav-tabs a.nav-link', function(e){
      let $this = $(this)
      ,_id = $this.attr('data-section-id')
      ,_i  = $this.attr('data-index');

      $this.parents('.nav-tabs').find('a.nav-link').removeClass('active');
      $this.addClass('active');
      $('.tab-pane-'+_id).removeClass('show active');
      $('#sc-'+_id+'-'+_i).addClass('show active');
    })
    .on('click','.search-icon[data-toggle="modal"]' , function(e) {
      $('#header-style').length && jQuery('#searchModal').css('padding-top',$('#header-style').offset().top+'px');
      jQuery('#searchModal .searchbox .content-wrapper').css('height',jQuery('#header-style')[0].clientHeight+'px');
    })
    .on('click','.modal-backdrop',function(){
      $('.modal-backdrop.show').remove();
    })
    .on('focus', 'input[type="text"][name="q"]', function(){
      $(this).attr('id', 'bc-product-search');
    })
    .on('focus', '#input-search--mobile', function(){
      $('#searchModal').modal('show');
    })
    .on('focusout', 'input[type="text"][name="q"]', function(){
      $(this).removeAttr('id');
    })
    .on('mouseenter', '#slide--main', function(){
      if ($.parseJSON($('.slider-main-image').data('zoom')) && AT_Main.getWidthBrowser() > 767 ) {
        $('#slide--main .slick-active img.image-zoom').css('opacity', 0);
      }
    })
    .on('mouseleave', '#slide--main', function(){
      if ($.parseJSON($('.slider-main-image').data('zoom')) && AT_Main.getWidthBrowser() > 767 ) {
        $('#slide--main .slick-active img.image-zoom').css('opacity', 1);
      }
    })
    .on('click', '.nav-ver-2 a.nav-link' ,function(event){
      event.preventDefault();
      let _this = $(this), e = _this.parents('li.nav-item');
      $('.nav-ver-2 li.nav-item').not(e).removeClass('active').find('.tab-pane').slideUp().removeClass('show active');
      if (e.hasClass('active')) {
        e.removeClass('active').find('.tab-pane').slideUp().removeClass('show active');
      }else{
        e.addClass('active').find('.tab-pane').slideDown().addClass('show active');
      }
      $('.nav-ver-2 li.nav-item').find('a.nav-link.active').removeClass('active');
      e.hasClass('active') ? _this.addClass('active') : _this.removeClass('active');
    })
    .on('click','.navbar-vertical-collapse > div',function(){
      $(this).parents('.header-desktop').toggleClass('show-menu').find('.vertical-menu').toggleClass('show');
    })
    /** BODY CLICK  */
    .on('click', function(e){
      let _this = $(e.target);

      if ($('.menu-mobile').hasClass('opened') && !_this.closest('.menu-mobile').length){
        if (!_this.closest('.responsive-menu-mobile').length && !_this.closest('.menu-mobile').length) {
          $('.menu-mobile').removeClass('opened');
          AT_Main.fixReturnScroll();
        }
      }
      else{
        if (_this.closest('.responsive-menu-mobile').length) {
          $('.menu-mobile').hasClass('opened') ? AT_Main.fixReturnScroll() : AT_Main.fixNoScroll();
          $('.menu-mobile').toggleClass('opened');
          $('body').addClass('menu-opened');
        }
      }
      $('.layer-addcart-modal').length && !_this.closest('.layer-addcart-modals').length && $('.layer-addcart-wrapper .am-close').trigger('click');
      if (_this.closest('.pswp').length) {
        AT_Main.debounceTime(e=> $('.pswp').attr('disabled-variant-switch', false), 500)();
      }

      if($('.cart-sb .cart-item--content.qty-active').length){
        if ($(e.target).closest('.qty-wrapper').length) {return}
          $('.cart-sb .cart-item--content.qty-active').removeClass('qty-active');
      }
      /*
      if (_this.closest('*[data-toggle="modal"]').length) {
        $('#header-fixed.show').length && $('#header-fixed.show').addClass('pr-17');
      }else{
        $('#header-fixed.pr-17').length && $('#header-fixed.pr-17').removeClass('pr-17');
      }*/
    })
    .on('click','.bc-toggle',function(){
      let e = jQuery(this);
      e.hasClass("opened") ? e.removeClass("opened") : e.addClass("opened");
    })

    .on('click','#product-detail_content .action-button',e=>{
      let _this = $(e.currentTarget);
      if(_this.find('button[disabled].first_disabled').length){
        alert("Please select some product options before adding this product to your cart.");
      }
    })
    .on('click','.collapse-ui *[data-target^="#"]',e=>{
      e.stopPropagation();
      e.preventDefault();
      let _this = $(e.currentTarget)
      ,_target = _this.attr('data-target')
      ,_parent = _this.closest('.collapse-ui');
      if (!_parent.find(_target).length) {return;}
      _this.toggleClass('collapsed');
      _parent.find(_target).collapse('toggle');
    })

    /**
     * MEGA MENU MOBILE HANDLE
     */
    .on('click','.mobile-version li .expand',function(event){
      let _this = $(this);

      if (_this.closest('.back-prev-menu').length) {
        _this.closest('.is-opening').length && _this.closest('.is-opening').removeClass('is-opening');
        _this.closest('.sub-is-opening').length && _this.closest('.sub-is-opening').removeClass('sub-is-opening').children().removeClass('is-active').removeAttr('style');
      }else{
        let _title_element = _this.parent().children('a')
        ,_title = _title_element.has('span').length ? _title_element.children('span').html() : _title_element.html();

        !_title.length && (_title = `Back`);

        _this.parent().find('.dropdown-menu').first().addClass('is-opening');
        _this.parent().find('.back-prev-menu').first().children('span').html(_title);
        if (_this.closest('.mega-block-items').length) {
          _this.closest('.mega-block-items').addClass('is-active').parent().addClass('sub-is-opening').children('*:not(.is-active)').fadeOut();
        }
        if (_this.parent('li[navlink-mobile-index]').length) {
         _this.parent('li[navlink-mobile-index]').addClass('is-active').parent().addClass('sub-is-opening').children('*:not(.is-active)').fadeOut();
        }
      }
    })

    .on('mouseenter', '.mega-menu-attribute--hover', e=>{
      /*if ($('#header-style').data('style') != '2' && $('#header-style').data('style') != '3') {return;}*/
      let _this = $(e.currentTarget);
      _this.addClass('is-waiting').find('.mega-menu-attribute--hover[data-mega-id="'+_this.attr('data-mega-id')+'"]').addClass('menu-showing--active');
    })
    .on('mouseleave', '.mega-menu-attribute--hover', e=>{
      /*if ($('#header-style').data('style') != '2' && $('#header-style').data('style') != '3') {return;}*/
      $('.mega-menu-attribute--hover.is-waiting').addClass('menu-showing--active');
      AT_Main.debounceTime(()=>{
        $('.mega-menu-attribute--hover.is-waiting').removeClass('is-waiting');
        $('.mega-menu-attribute--hover:not(.is-waiting):not(.admin-editor)').removeClass('menu-showing--active');
      }, 300)();
    })

    /*Cart Sidebar qty handle*/
    .on('click' , '.cart-sb .input-cart-qty[readonly]' ,e=>{
      let _this = $(e.currentTarget);
      $('.cart-sb .cart-item--content.qty-active').removeClass('qty-active');
      _this.closest('.cart-item--content').addClass('qty-active');
    })
  }
  ,init : function(){
    if( typeof _bc_config == 'undefined' ){
      console.log( " _bc_config is undefined " );
      return ;
    }

    this.effectNavigation();
    this.cart_event_handle();
    this.filterCatalog();
    this.fixTitle();
    /*this.handleMenuMultiLine();*/
    this.init_CountDown();
    this.init_currencies();
    this.init_handle();
    this.init_instafeed();
    this.megamenuWithTabs();
    this.resizeCollection();
    this.sidebar_menu_handle();
    this.swatch();
    this.switchImgProduct();
    this.toTopButton();
    this.toggleCartSidebar();
    this.toggleFilterSidebar();
    this.productBundled();

    var i_sections = new theme.Sections();
    i_sections.register('header'            ,AT_Main.header_handle);
    i_sections.register('slideshow'         ,function(){if ( bcMsieVersion.MsieVersion() == 0 ){AT_Main.homeSlideshow();}else{AT_Main.homeIE();} AT_Main.parallaxSlideshow();});
    i_sections.register('logo_list'         ,function(){AT_Main.init_carousel(jQuery('.widget-logo-list-carousel'))});
    i_sections.register('product-grid'      ,function(){AT_Main.init_carousel(jQuery('.ps-carousel'));AT_Main.init_carousel(jQuery('.spc-carousel'))});
    i_sections.register('product-slider'    ,function(){AT_Main.init_carousel(jQuery('.p-slider-carousel'));});
    i_sections.register('product-listing'   ,function(){AT_Main.init_carousel(jQuery('.listing-block-carousel'))});
    i_sections.register('product-tabs'      ,function(){AT_Main.init_carousel(jQuery('.tabs-list-carousel'))});
    i_sections.register('article-page'      ,function(){AT_Main.init_carousel(jQuery('.related-carousel'))});
    i_sections.register('collection-list'   ,function(){AT_Main.init_carousel(jQuery('.collection-cs-list'))});
    i_sections.register('customer'          ,function(){AT_Main.init_carousel(jQuery('.customer-carousel'))});
    i_sections.register('categories'        ,function(){AT_Main.init_carousel(jQuery('.categories-carousel'));AT_Main.init_masonry($('.categories-content'))});
    i_sections.register('pricing-plan'      ,function(){AT_Main.init_carousel(jQuery('.plan-carousel'))});
    i_sections.register('banner-tabs'       ,function(){AT_Main.init_carousel(jQuery('.tabs-list-carousel'))});
    i_sections.register('text-slider'       ,function(){$('.carousel[data-ride="carousel"]').length && $('.carousel[data-ride="carousel"]').carousel();});
    i_sections.register('image-gallery'     ,function(){AT_Main.init_masonry()});
    i_sections.register('slider-image'      ,AT_Main.initSlider_image);
    i_sections.register('custom-content'    ,AT_Main.init_customContent);
    i_sections.register('product-slider-v2' ,AT_Main.productSliderV2);
    i_sections.register('contact-page'      ,AT_Main.init_map);
    i_sections.register('mobile-bar'        ,AT_Main.init_mobile_bar);
    i_sections.register('cart-section'      ,function(){typeof _relatedCart == 'function' && _relatedCart();});
    i_sections.register('blog-section'      ,function(){
      AT_Main.init_carousel(jQuery('.blog-carousel'))
      if (JSON.parse(_bc_config.enable_disqus || false) && typeof DISQUSWIDGETS != 'undefined') {
        DISQUSWIDGETS.getCount({reset: true});
      }
    });

    i_sections.register('section-sidebar',function(){
      AT_Main.init_carousel(jQuery('.customer-carousel'));
      AT_Main.init_carousel(jQuery('.sb-product-carousel'));
      AT_Main.init_carousel(jQuery('.grid-sb-carousel'));
    });
    i_sections.register('collectionPage', function(){
      AT_Main.init_carousel(jQuery(".sb-product-carousel"));
      AT_Main.init_carousel(jQuery(".sb-banner-list"));
      AT_Main.init_carousel(jQuery('.slider-content-inner'));
      AT_Main.handleGridList();
    });

    i_sections.register('columns-section', function(){
      let homeColumn = $('.home-columns-section[data-section-id]');
      homeColumn.each((i,v)=>{
        if (AT_Main.getWidthBrowser() >= 768 && $.parseJSON($(v).attr('data-balance-title'))) {
          let headingHeight = 0;
          $(v).find('.section-heading').each(function(){
            headingHeight = $(this).innerHeight() > headingHeight ? $(this).innerHeight() : headingHeight;
          });
          $(v).find('.section-heading').css('min-height', headingHeight+'px');
        }
      });
    });
    i_sections.register('newsletter-popup',function(){
      AT_Main.newsletterPopup();
      AT_Main.newsletterCoupon();
      AT_Main.init_CountDown();

      $('#newsletter_popup').closest('.shopify-section')
      .on('shopify:section:select'   ,function(){$('#newsletter_popup').show().css('opacity', '1').css('background-color', '#000c');})
      .on('shopify:section:deselect' ,function(){$('#newsletter_popup').hide().removeAttr('style');$('body').removeClass('modal-open');});

      $("#newsletter_popup .block-coupon").on('shopify:block:deselect', function(){
        jQuery('#newsletter_popup .text-box-image').show();
        jQuery('#newsletter_popup .subscribe-result').hide();
        let _image = jQuery('#newsletter_popup .newsletter-popup-content').data('image');
        jQuery('#newsletter_popup .newsletter-popup-content').addClass('block-image-'+_image).removeClass('block-image-false');
      })
      .on('shopify:block:select', function(){
        jQuery('#newsletter_popup .text-box-image').hide();
        jQuery('#newsletter_popup .subscribe-result').show();
        jQuery('#newsletter_popup .newsletter-popup-content').removeClass('block-image-true').addClass('block-image-false');
      });
    });
  }
}

jQuery(document).ready(function($) {AT_Main.init();});

jQuery(window)
.on('resize', AT_Main.resize_handle)
.on('load', AT_Main.init_onload);