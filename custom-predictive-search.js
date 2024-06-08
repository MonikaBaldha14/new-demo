class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('#predictive-search');

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));
  }

  onChange() {
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }
        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    this.predictiveSearchResults.style.display = 'block';
  }

  close() {
    this.predictiveSearchResults.style.display = 'none';
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
}

customElements.define('predictive-search', PredictiveSearch);


$(document).ready(function () {

  var searchInput = $('#search-input');
  var searchResults = $('#search-results');


  searchInput.keypress(function (e) {
    var key = e.which;
    if (key == 13) {

      window.location.replace("/search?q=" + searchInput.val());
      // $('input[name = butAssignProd]').click();
      return false;
    }
  });


  searchInput.on('input', function () {
    var query = searchInput.val();

    if (query.length >= 1) {
      $.ajax({
        url: '/search/suggest.json?q=' + query,
        dataType: 'json',
        success: function (data) {
          updateSearchResults(data.resources.results);
        },
        error: function (xhr, status, error) {
          console.error('Error fetching suggestions:', error);
        }
      });
    } else {
      updateSearchResults([]);
    }
  });

  function updateSearchResults(results) {
    searchResults.empty();

    if (results.products) {
      $(".search-records").addClass('data');
      if (results.products.length != 0) {

        results.products.forEach(function (result) {
          let ItemImage = result.image;
          let ItemTitle = result.title;
          let ItemPrice = result.price;
          let ItemVendor = result.vendor;

          let str = `<li class="product_listing">
                                <div class="product-inner">

                                  <div class="product_image">
                                    <a href="${result.url}">
                                      <img src="${ItemImage}" alt="Item Image">
                                    </a>
                                  </div>
                                
                                  <div class="product-details">
                                    <div class="inner-title">
                                      <div class="product_title">
                                        <a href="${result.url}">${ItemTitle}</a>
                                      </div>
                                    </div>
                                    <div class="product_vendor">
                                      <p>${ItemVendor}</p>
                                    </div>
                                    <div class="product_price">
                                      <p>RS. ${ItemPrice}</p>
                                    </div>
                                  </div>
                                </div>
                              </li>`;

          searchResults.append(str);
        });
        
      } else {
        var str = $('<li>').text(results.title || 'No results found');
        searchResults.append(str);
      }
    } else {
      var noResultsItem = $('<li>').text('No results found');
      searchResults.append(noResultsItem);

    }
  }

  $(".search-close-switch").click(function () {
    $("#search-results").empty();
    $(".search-records").removeClass('data');
  });
});

$(".search-logo").click(function () {
  $(".search-main-block").addClass('active');
  $(".gradient").addClass('active');
  $(".layout-block").addClass('active');
});

$(".close-button").click(function () {
  $(".search-main-block").removeClass('active');
  $(".search-records").removeClass('data');
  $("#search-results").empty();
  $("#search-input").val("");
  $(".gradient").removeClass('active');
  $(".layout-block").removeClass('active');
});
