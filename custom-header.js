$(document).ready(function () {

  $(".fa-bars").click(function () {
    $(".header-last-block-toggle").addClass("active");
    $("i.fa.fa-times").addClass("active");
    $(".fa-bars").addClass("remove");
    $(".gradient").addClass("active");
  });

  $(".fa-times").click(function () {
    $(".header-last-block-toggle").removeClass("active");
    $("i.fa.fa-times").removeClass("active");
    $(".fa-bars").removeClass("remove");
    $(".gradient").removeClass("active");
  });

  const navmenu = document.querySelectorAll(".nav-item .down-icon-toggle");
  function toggleMegamenu() {
    const itemToggle = this.getAttribute('aria-expanded');

    for (i = 0; i < navmenu.length; i++) {
      navmenu[i].setAttribute('aria-expanded', 'false');
    }

    if (itemToggle == 'false') {
      this.setAttribute('aria-expanded', 'true');
    }
  }
  navmenu.forEach((item) => item.addEventListener('click', toggleMegamenu));
});




let navchildmenu = document.querySelectorAll(".plus-nav");
function toggleMegaChildmenu() {
  const itemToggle = this.getAttribute('aria-expanded');

  for (i = 0; i < navchildmenu.length; i++) {
    navchildmenu[i].setAttribute('aria-expanded', 'false');
  }

  if (itemToggle == 'false') {
    this.setAttribute('aria-expanded', 'true');
  }
}
navchildmenu.forEach((item) => item.addEventListener('click', toggleMegaChildmenu));


var header = $('.main-header-content');
$(window).scroll(function () {
  if ($(window).scrollTop() > 160) {
    header.addClass('show');
    header.slideDown();
  } else {
    header.removeClass('show');
  }
});
