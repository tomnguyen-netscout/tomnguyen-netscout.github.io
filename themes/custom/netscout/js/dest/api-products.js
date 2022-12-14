(function ($) {
  "use strict";
  $("input.facets-checkbox").prop("checked", false);
  $("#edit-search--2").val("");
  $.ajax({
    type: "GET",
    url: "https://web-3894-netscout.pantheonsite.io/api-products",
    dataType: "json",
    success: function (results, status, xhr) {
      var productsSearch = [];
      var productsChecked = [];
      function firstWord(text) {
        const categoryArray = text.split(",");
        return categoryArray[0];
      }
      // show unique products between checkboxes and search
      function displayUniqueProducts(products1, products2) {
        var combiledProducts = products1.merge(products2);
        var uniq = [...new Set(combiledProducts)];
        return defaultDisplay(uniq);
      }
      // display template products
      function productTemplate(result) {
        return `
        <div class="views-row ns-col--m-s-12 ns-col--t-s-6 ns-col--d-s-4 ns-flex__col">
          <article class="ns-position--relative ns-flex__row ns-flex__row--column ns-flex__row--justify-between bkg--lightestgrey ns-container--full">
            <div>
              <div class="color--grey ns-container--tb-margin-sml ns-flex__row--align-center ns-flex__row--basic ns-container--lr-margin-sml">
                <div class="ns-container--l-margin-sml ns-font--size-sml ns-font--transform-upper ns-font--weight-bold">
                ${firstWord(result.field_tag_page_category)}
                </div>
                </div>
                <div class="ns-container--lr-margin-sml">
                <h3 class="ns-container--b-padding-sml ns-h6 ns-font--weight-bold">
                  <span class="field field--name-title field--type-string field--label-hidden">${
                    result.title
                  }</span>
                </h3>
                <div class="field ns-font--size-sml-md ns-container--b-padding-md">
                  <div class="field__item">
                    ${result.body_1}
                    </div>
                    </div>
                    </div>
                    </div>
                    <div class="ns-container--b-padding-md ns-container--lr-margin-sml">
                    <a href="${
                      result.view_node
                    }" class="ns-font--size-sml ns-button--text ns-button--text--dark ns-link--block" target="_blank">Learn more</a>
                  </div>
                </article>
        </div>
        `;
      }
      // show 10 products
      function defaultDisplay(products) {
        var productsLimit_10 = products
          .slice(0, 10)
          .map(productTemplate)
          .join("");
        return $("#products").html(productsLimit_10);
      }
      defaultDisplay(results);
      // category change event
      var categoryIDSelected = [];
      var productsDisplay = [];

      $("input.facets-checkbox").change(function () {
        var checked = $(this).val();
        if ($(this).is(":checked")) {
          categoryIDSelected.push(checked);
        } else {
          categoryIDSelected.splice($.inArray(checked, categoryIDSelected), 1);
          productsDisplay = [];
          if (
            categoryIDSelected.length == 0 &&
            $("#edit-search--2").val() == ""
          ) {
            return defaultDisplay(results);
          }
        }

        $.each(results, function (key, val) {
          var categoryIDArray = val.field_tag_page_category_id.split(", ");
          const found = categoryIDArray.some(
            (r) => categoryIDSelected.indexOf(r) >= 0
          );
          if (found) {
            productsDisplay.push(val);
            productsDisplay = [...new Set(productsDisplay)];
          }
          return defaultDisplay(productsDisplay);
        });
        if (productsSearch.length > 0) {
          productsChecked = productsDisplay;
          return displayUniqueProducts(productsChecked, productsSearch);
        }
      });
      //search function
      $("#edit-submit-products-solutions--2").click(function (event) {
        event.preventDefault();
        var searchField = $("#edit-search--2").val();
        var regex = new RegExp(searchField, "i");

        var products = [];
        $.each(results, function (key, val) {
          if (val.body.search(regex) != -1 || val.title.search(regex) != -1) {
            products.push(val);
          }
        });
        if (productsChecked.length > 0) {
          productsSearch = products;
          return displayUniqueProducts(productsChecked, productsSearch);
        }
        return defaultDisplay(products);
      });
    },
    error: function (xhr, status, error) {
      console.log(
        "Result: " +
          status +
          " " +
          error +
          " " +
          xhr.status +
          " " +
          xhr.statusText
      );
    },
  });
})(jQuery);
