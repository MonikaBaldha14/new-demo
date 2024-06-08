function formatMoney(cents, format) {
    if (typeof cents == 'string') { cents = cents.replace('.', ''); }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || this.money_format);

    function defaultOption(opt, def) {
        return (typeof opt == 'undefined' ? def : opt);
    }

    function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal = defaultOption(decimal, '.');

        if (isNaN(number) || number == null) { return 0; }

        number = (number / 100.0).toFixed(precision);

        var parts = number.split('.'),
            dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
            cents = parts[1] ? (decimal + parts[1]) : '';

        return dollars + cents;
    }

    switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
            value = formatWithDelimiters(cents, 2);
            break;
        case 'amount_no_decimals':
            value = formatWithDelimiters(cents, 0);
            break;
        case 'amount_with_comma_separator':
            value = formatWithDelimiters(cents, 2, '.', ',');
            break;
        case 'amount_no_decimals_with_comma_separator':
            value = formatWithDelimiters(cents, 0, '.', ',');
            break;
    }

    return formatString.replace(placeholderRegex, value);
};

async function removeItems() {
    const res = await fetch("/?section_id=custom-cart-page");
    const text = await res.text();

    const html = document.createElement("div");
    html.innerHTML = text;
    const cartItem = html.querySelector("#main_cart").innerHTML;
    document.querySelector("#main_cart").innerHTML = cartItem;

    let countItem = document.querySelector(".total-product").textContent;
    document.querySelector(".product-count").innerHTML = countItem;
    customCart();
}

function closeLoader() {
    document.querySelector(".loader").classList.remove("loader--active");
    document.querySelector(".layout__block").classList.remove("active");
}

function customCart() {
    document.querySelectorAll(".cart-quantity-selector button")
        .forEach((button) => {
            button.addEventListener("click", async (event) => {
                const rootItem = button.parentElement.parentElement.parentElement;
                let key = rootItem.getAttribute("data-line-item-key");
                let type = event.currentTarget;
                let parent = type.closest(".cart-main-block-inner-tr");
                parent.querySelector(".loader").classList.add("loader--active");
                parent.querySelector(".layout__block").classList.add("active");

                const currentQuantity = Number(button.parentElement.querySelector("input").value)
                const isUp = button.classList.contains("cart-quantity-selector-plus");
                const newQuantity = isUp ? currentQuantity + 1 : currentQuantity - 1;

                const res = await fetch('/cart/update.js', {
                    method: 'POST',
                    url: '/cart/update.js',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ updates: { [key]: newQuantity } })
                });
                const json = await res.json();
                removeItems();
            });
            closeLoader();
        });

    document.querySelectorAll('.remove_items')
        .forEach((remove) => {
            remove.addEventListener("click", (e) => {
                e.preventDefault();
                const removeItem = remove.closest(".cart-main-block-inner-tr");
                let key = removeItem.getAttribute("data-line-item-key");
                removeItem.querySelector(".loader").classList.add("loader--active");
                removeItem.querySelector(".layout__block").classList.add("active");

                fetch('/cart/change.js',
                    {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: key, quantity: 0 })
                    }).then(res => {
                        removeItem.remove();
                        removeItems();
                    });

                axios
                    .post("/cart/change.js", {
                        id: key,
                        quantity: 0,
                    })
                    .then((res) => {
                        removeItems();
                    })
            })
        })
}
customCart();
function changeItemQuantity(key, quantity) {
    axios
        .post("/cart/change.js", {
            id: key,
            quantity,
        })
        .then((res) => {
            const format = document.querySelector('[data-money-format]').getAttribute('data-money-format');
            const totalDiscount = formatMoney(res.data.total_discount, format);
            const totalPrice = formatMoney(res.data.total_price, format);
            const item = res.data.items.find((item) => item.key === key)
            const itemPrice = formatMoney(item.final_line_price, format);

            document.querySelector("#discount_price").textContent = totalDiscount;
            document.querySelector("#total_price").textContent = totalPrice;
            document.querySelector(`[data-key = "${key}"] .line_item_price`).textContent = itemPrice;
        });
}
