
$(document).ready(function () {
  quickView();
});

function resetData() {
  $(".qv-product-title").empty();
  $(".qv-product-type").empty();
  $(".qv-product-price").empty();
  $(".qv-product-original-price").empty();
  $(".qv-product-description").empty();
  $(".qv-product-options").empty();
  $("#quick_quantity").val("1");
  $(".qv-add-button").empty();
  $(".qv-product-images").empty();
  $(".qv-add-to-cart-response").empty();
  $(".view-product").empty();
  $('#quick-view').removeClass();
}

function quickView() {
  $(".quick_view").click(function () {
    if ($('#quick-view').length == 0) { $("body").append('<div id="quick-view"></div>'); }
    var product_handle = $(this).data('handle');
    $('.product_quick').addClass('active');
    $('.layout__block__quick').addClass('active');
    $('.gradient').addClass('gradient_block');
    $('#quick-view').addClass(product_handle);

    jQuery.getJSON('/products/' + product_handle + '.js', function (product) {

      var title = product.title;
      var type = product.type;
      var price = 0;
      var original_price = 0;
      var desc = product.description;
      var images = product.featured_image;
      var variants = product.variants;
      var options = product.options;
      var productId = product.id;
      $('.qv-add-to-cart').append('<input name="id"  id="product-variant-id" value="' + productId + '" type="hidden" />');

      var url = '/products/' + product_handle;
      $('.qv-product-title').text(title);
      $('.qv-product-type').text(type);
      $('.qv-product-description').html(desc);
      $('.view-product').attr('href', url);

      var image_embed = '<div><img src="' + images + '"></div>';
      image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
      $('.qv-product-images').append(image_embed);

      $(options).each(function (i, option) {
        var opt = option.name;
        var selectClass = '.option.' + opt.toLowerCase();
        $('.qv-product-options').append('<div class="option-selection-' + opt.toLowerCase() + '"><span class="option">' + opt + '</span><select class="option-' + i + ' option ' + opt.toLowerCase() + '"></select></div>');
        $(option.values).each(function (i, value) {
          $('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
        });
      });
      $(product.variants).each(function (i, v) {
        if (variants.inventory_quantity == 0) {
          $('.qv-add-button').prop('disabled', true).val('Out of Stock');
          $('.qv-add-to-cart').hide();
          $('.qv-product-price').text('Out of Stock').show();
          return true
        } else {
          price = parseFloat(v.price / 100).toFixed(2);
          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
          $('.qv-product-price').text('₹' + price);
          $('.qv-product-original-price').text('₹' + original_price);

          if (v.available == false) {
            $(".qv-add-button").css({
              opacity: "0.7",
              cursor: "not-allowed"
            }).val("Out of stock")
          } else {
            $(".qv-add-button").css({
              opacity: "1",
              cursor: "pointer"
            }).val("Add to Cart")
          }
          $('select.option-0').val(v.option1);
          $('select.option-1').val(v.option2);
          $('select.option-2').val(v.option3);
          return false
        }
      });
    });

    $(document).on("change", ".product_quick select", function () {
      var selectedOptions = '';
      $('.product_quick select').each(function (i) {
        if (selectedOptions == '') {
          selectedOptions = $(this).val();
        } else {
          selectedOptions = selectedOptions + ' / ' + $(this).val();
        }
      });
      jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
        $(product.variants).each(function (i, v) {
          if (v.title == selectedOptions) {
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            $('.qv-product-price').text('₹' + price);
            $('.qv-product-original-price').text('₹' + original_price);

            if (v.available == !1) {
              $(".qv-add-button").css({
                opacity: "0.7",
                cursor: "not-allowed"
              }).val("Out of stock")
            } else {
              $(".qv-add-button").css({
                opacity: "1",
                cursor: "pointer"
              }).val("Add to Cart")
            }
          }
        });
      });
    });
  });
  $(document).on("click", ".qv-add-button", function (e) {
    e.preventDefault();
    $(".loader_filter").addClass("loader_filter_active");
    $(".layout_view").addClass("active");
    var product_handle = $('#quick-view').attr('class');
    var qty = $('#quick_quantity').val();
    var selectedOptions = '';
    var var_id = '';
    $('.qv-product-options select').each(function (i) {
      if (selectedOptions == '') {
        selectedOptions = $(this).val();
      } else {
        selectedOptions = selectedOptions + ' / ' + $(this).val();
      }
    });
    function processCart() {
      jQuery.post("/cart/add.js", {
        quantity: qty,
        id: var_id
      }, null, "json").done(function () {
        resetData(),
        $('.product_quick').removeClass('active');
        $('.layout__block__quick').removeClass('active');
        $('.gradient').removeClass('gradient_block');
        updateCartDrawer(),
        openCartDrawer();
        $(".loader_filter").removeClass("loader_filter_active");
        $(".layout_view").removeClass("active");
      }).fail(function ($xhr) {
        var data = $xhr.responseJSON;
        $(".qv-add-to-cart-response").addClass("error").html("<span><b>ERROR: </b>" + data.description);
        $(".loader_filter").removeClass("loader_filter_active");
        $(".layout_view").removeClass("active");
      })
    }
    $('.qv-product-images').addClass('loaded');
    jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
      $(product.variants).each(function (i, v) {
        if (v.title == selectedOptions) {
          var_id = v.id;
          processCart();
        }
      });
    });
  });
}
$(document).on("click", ".quick_view_close", function () {
  $('.product_quick').removeClass('active');
  $('.layout__block__quick').removeClass('active');
  $('.gradient').removeClass('gradient_block');
  resetData();
})
