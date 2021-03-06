var AT_AjaxSearch = {

  predictive_search : function(input_element, result_wrapper, result_element){
    let keyword    = input_element.val()
      ,limit        = Number('5')
      ,search_type  = 'products' == 'products' ? ["product"] : ["product","article","page"];

    result_element.empty().removeClass('no-result');
    jQuery('.result-ajax-search.d-block').removeClass('d-block');
    AT_AjaxSearch.ajaxSearchCall(0, keyword, limit, search_type, result_element);
  }

  ,ajaxSearchCall : (index, keyword, limit, search_type ,result_element)=>{

    $.getJSON("/search/suggest.json", {
      "q": keyword,
      "resources": {
        "types": [search_type[index]],
        "limit" : limit,
        "options":{"unavailable_products": "hide","fields":"author,product_type,tag,title,variants.title,vendor"}
      }

    }).done(function(response) {


      let rs = Object.values(response.resources.results)[0];

      search_type.length > 1 && result_element.append(`<li class="result-title fw-700" style="">${search_type[index]}</li>`);

      if(rs.length){
        let rsTemplate = '';
        $.each(rs, function(i) {rsTemplate += AT_AjaxSearch.resultType(rs[i], keyword);})
        result_element.append(rsTemplate);
      }
      else{
        result_element.append('<li class="result-item no-result"><p>No result found for your search.</p></li>');
      }

      index++;
      index < search_type.length && AT_AjaxSearch.ajaxSearchCall(index, keyword, limit, search_type, result_element);

      $('.result-ajax-search').show();
      $('.searchbox').removeClass('s-loading');

    })
  }

  ,resultType : function(item, keyword ){
      let title          = item.title
          ,markedString  = title.replace(new RegExp('(' + keyword + ')', 'gi'), '<span class="marked">$1</span>')
          ,handle        = item.handle
          ,url           = item.url.split('?')[0]
          ,image         = item.image  || "//cdn.shopify.com/s/files/1/0047/8209/6456/t/19/assets/default-image.jpg?v=4320067585731992570"
          ,author        = item.author || ''
          ,price_class   = item.available ? '' : "hide"
          ,img_template  = AT_Main.getWidthBrowser() >= 992 ? `<a class="search-item-img" href="${url}"><img src="${image}" /></a>` : ''

          ,price         = item.available ? item.price_min == item.price_max ? item.price : item.price_min : item.out_stock_nofication
          ,price_label   = item.price_min == item.price_max ? '' : "from "
          ,price_value   = JSON.parse(_bc_config.show_multiple_currencies) ? '' : `<span class="price ${price_class}">${price_label}${Shopify.formatMoney(+price, _bc_config.money_format)}</span>`
          ,template      = `<li class="result-item" data-type="1">${img_template}
                              <a class="search-item-title" href="${url}">${markedString}</a>
                              ${price_value}<span class="author">${author}</span>
                            </li>`;
      return template;
  }

  ,ajaxSearch : function( bc_search_config  ){

    var ajax_search     = this
        ,search_input_id = bc_search_config.search_input.length   > 0 ? bc_search_config.search_input   : '#bc-product-search'
        ,wrapper_id      = bc_search_config.result_wrapper.length > 0 ? bc_search_config.result_wrapper : '.result-ajax-search'
        ,result_id       = bc_search_config.result_element.length > 0 ? bc_search_config.result_element : '.search-results' ;


    $(document)
    .on('keyup',search_input_id, AT_Main.debounceTime(function(e){
      var $this = $(this)
      ,_keyword       = $this.val()
      ,search_element = $this
      ,frmParent      = $(search_input_id).parents('form').first()
      ,result_wrapper = frmParent.nextAll(wrapper_id)
      ,result_element = result_wrapper.children( result_id );

      jQuery('.searchbox').removeClass("s-loading");

      if( _keyword.length < 1 ){
        result_element.empty();
        result_wrapper.hide();
      }
      else if( _keyword.length >= 2 ){
        $this.removeClass('error warning valid').addClass('valid');
        $('.searchbox').addClass('s-loading');
        !jQuery(search_input_id).hasClass('snize-input-style') && ajax_search.predictive_search( search_element ,result_wrapper, result_element );
      }else{
        $this.removeClass('error warning valid').addClass('error');
        result_element.html('<li class="result-item"><p>You must enter at least 2 characters.</p></li>').addClass('no-result');
        result_wrapper.show();
      }
    },500))

    .on('blur', '.navbar-form.search', AT_Main.debounceTime(function(e){
      var _search_block = jQuery(this);
      // _search_block.find('input[type="text"][name="q"]').val('');
      $('.result-ajax-search').hide();
      // $('.search-results').empty();
      $('body').removeClass('search-is-typing');
    },500))

    .on('focus','.header-desktop #bc-product-search',function(){
      jQuery(this).parents('.searchbox').addClass('is-focus');
    })

    .on('blur','.header-desktop #bc-product-search',function(){
      jQuery(this).parents('.searchbox').removeClass('is-focus');
    })

    .on('click','.result-ajax-search li',e=>{
      $(e.currentTarget).closest('.result-ajax-search').addClass('d-block');
    });
  }

  ,init : function( bc_search_config ){this.ajaxSearch( bc_search_config );}
}

jQuery(document).ready(function($) {
  AT_AjaxSearch.init({
    "search_input"      :   "#bc-product-search"
    ,"result_wrapper"   :   ".result-ajax-search"
    ,"result_element"   :   ".search-results"
    ,"strictly_mode"    :   0
  });
})