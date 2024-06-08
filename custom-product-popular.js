$(document).ready(function() {
    $('.popular-product-collection-main:first-child').addClass('active');
    $('.popular-product .popular-product-main-block a').on('click', function(e)  {
        var currentAttrValue = $(this).attr('href');
        $('.popular-product ' + currentAttrValue).fadeIn(400).siblings().hide();
        $(this).parent('li.popular-product-collection-main').addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });
});
    