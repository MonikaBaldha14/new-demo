function openCartDrawer() {
  document.querySelector(".cart-drawer").classList.add("cart-drawer--active");
  document.querySelector(".layout-block").classList.add("active");
  document.querySelector(".gradient").classList.add("active");
  document.querySelector("body").classList.add("cart-drawer-pushtoleft");
}

function closeCartDrawer() {
  document.querySelector(".cart-drawer").classList.remove("cart-drawer--active");
  document.querySelector(".layout-block").classList.remove("active");
  document.querySelector(".gradient").classList.remove("active");
  document.querySelector("body").classList.remove("cart-drawer-pushtoleft");
}

function updateCartItemCounts(count) {
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
  });
}

async function updateCartDrawer() {
  const res = await fetch("/?section_id=custom-cart-drawer");
  const text = await res.text();
  const html = document.createElement("div");
  html.innerHTML = text;
  const newBox = html.querySelector("div.cart-drawer").innerHTML;
  document.querySelector("div.cart-drawer").innerHTML = newBox;
  let cartItem = document.querySelector(".product-item-count").textContent;
  document.querySelector(".product-count").innerHTML = cartItem;
  addCartDrawerListeners();
}

function addCartDrawerListeners() {
  document.querySelectorAll(".cart-drawer-quantity-selector button")
    .forEach((button) => {
      button.addEventListener("click", async (e) => {
        let type = e.currentTarget;
        const rootItem = button.parentElement.parentElement.parentElement.parentElement;
        let key = rootItem.getAttribute("data-line-item-key");
        let parent = type.closest(".drawer-cart-main-block");
        parent.querySelector(".loader").classList.add("loader--active");
        parent.querySelector(".layout__block").classList.add("active");
        const currentQuantity = Number(button.parentElement.querySelector("input").value)
        const isUp = button.classList.contains(
          "cart-drawer-quantity-selector-plus"
        );
        const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;
        const totalQty = $('#drawer_quantity_val').attr('value');

        if (newQuantity <= totalQty) {
          const res = await fetch('/cart/update.js', {
            method: 'POST',
            url: '/cart/update.js',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updates: { [key]: newQuantity } })
          })
          const json = await res.json();
          updateCartDrawer();
        } else {
          parent.querySelector(".quantity_msg").classList.add('error');
          parent.querySelector(".loader").classList.remove("loader--active");
          parent.querySelector(".layout__block").classList.remove("active");
        }
      });
    });

  document.querySelectorAll('.remove_items').forEach((remove) => {
    remove.addEventListener("click", (e) => {
      e.preventDefault();
      const removeItem = remove.closest(".drawer-cart-main-block");
      let dataKey = removeItem.getAttribute("data-line-item-key");
      removeItem.querySelector(".loader").classList.add("loader--active");
      removeItem.querySelector(".layout__block").classList.add("active");
      axios.post("/cart/change.js", {
        id: dataKey,  
        quantity: 0,
      })
        .then((res) => {
          removeItem.remove();
          updateCartDrawer();
          removeItem.querySelector(".loader").classList.remove("loader--active");
          removeItem.querySelector(".layout__block").classList.remove("active");
        })
    })
  })

  document.querySelector(".cart-drawer-box").addEventListener("click", (e) => {
    e.stopPropagation();
  })

  document.querySelector(".close_btn, cart-drawer--active").addEventListener("click", () => {
    closeCartDrawer();
  });
}
addCartDrawerListeners();

// document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     document.querySelector(".loader_filter").classList.add("loader_filter_active");
//     document.querySelector(".layout_block_filter").classList.add("active");

//     await fetch("/cart/add", {
//       method: "post",
//       body: new FormData(form),
//     })
//     // .then(response => {
//     //     console.log(response);
//     //     return response.json();
//     //   })
//     //   .catch((error) => {
//     //     console.error('Error:', error);
//     //     $(".quantity_msg").html("<span><b>ERROR: </b>" + "You can't add more Product to the cart.");
//     //   });

//     const res = await fetch("/cart.js");
//     const cart = await res.json();
//     updateCartItemCounts(cart.item_count);
//     await updateCartDrawer();
//     document.querySelector(".loader_filter").classList.remove("loader_filter_active");
//     document.querySelector(".layout_block_filter").classList.remove("active");
//     openCartDrawer();
//   });
// })


$(document).on("click", "#add-to-cart", function (e) {
  e.preventDefault();
  $(".loader_filter").addClass("loader_filter_active");
  $(".layout_block_filter").addClass("active");
  var product_id = $('#product-id').attr('value');
  var qty = $('#quantity').val();
  var totalQty = $('#quantity_val').attr('value');

  function processCart() {  
    jQuery.post('/cart/add.js', {
      quantity: qty,
      id: product_id
    },
      null,
      "json"
    ).done(function () {
      $(".loader_filter").removeClass("loader_filter_active");
      $(".layout_block_filter").removeClass("active");
      openCartDrawer();
      updateCartDrawer();
    })
      .fail(function ($xhr) {
        var data = $xhr.responseJSON;
        $('.quantity_msg').addClass('error').html('<span><b>ERROR: </b>' + data.description);
        $(".loader_filter").removeClass("loader_filter_active");
        $(".layout_block_filter").removeClass("active");
      });
  }
  processCart();
  // jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
  //   $(product.variants).each(function (i, v) {
  //     if (v.title == selectedOptions) {
  //       var_id = v.id;
  //       processCart();
  //     }
  //   });
  // });
});
document.querySelectorAll('a[href="/cart"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    openCartDrawer();
  });
});
document.querySelector(".open_cart").addEventListener("click", (e) => {
  e.preventDefault();
  openCartDrawer();
});