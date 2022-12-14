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

      // get first word from category array
      function firstWord(text) {
        const categoryArray = text.split(",");
        return categoryArray[0];
      }

      function duplicateArr(arr) {
        var newString = arr.join(", ");
        return newString.split(", ");
      }

      function duplicateCategory(results) {
        var categoryArr = [];
        var categoryIdArray = [];
        var categoryNameArray = [];
        results.forEach((obj) => {
          categoryNameArray.push(obj.field_tag_page_category);
          categoryIdArray.push(obj.field_tag_page_category_id);
        });
        var categoryId = duplicateArr(categoryIdArray);
        var categoryName = duplicateArr(categoryNameArray);
        categoryId.forEach((item, index) => {
          if (item != "")
            categoryArr[index] = {
              id: categoryId[index],
              name: categoryName[index],
            };
        });
        return categoryArr;
      }

      function filterCategoryCkb(products, categoryIDSelected) {
        var productsOutput = [];
        $.each(products, function (key, val) {
          var categoryIDArray = val.field_tag_page_category_id.split(", ");
          const found = categoryIDArray.some(
            (r) => categoryIDSelected.indexOf(r) >= 0
          );
          if (found) {
            productsOutput.push(val);
          }
        });
        return productsOutput;
      }

      // display checkboxs field tag page category
      function checkboxesTemplate(val) {
        return `
        <li class="facet-item ns-facets__list__item margin--top-bottom--xsml ns-facets__list__inline ns-font--size-sml ns-flex__row ns-flex__row--basic ns-flex__row--justify-start">
          <input
            type="checkbox"
            class="facets-checkbox"
            id="category-${val.id}"
            value="${val.id}"
          />
          <label for="category-${val.id}">
            <span class="facet-item__value">${
              val.name ==
              "Enterprise Application &amp; Network Performance Management"
                ? "Enterprise APM & NPM"
                : val.name
            }</span>
            <span class="facet-item__count">(${val.count})</span>
          </label>
        </li>
        `;
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

      // show checkboxes
      function displayCheckboxes(results) {
        var categoryArr = duplicateCategory(results);
        var uniqueCategories = Object.values(
          categoryArr.reduce((obj, { id, name }) => {
            if (obj[id] === undefined)
              obj[id] = { id: id, name: name, count: 1 };
            else obj[id].count++;
            return obj;
          }, {})
        );
        // sort by name
        uniqueCategories.sort(function (a, b) {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        });
        return $("#display-category").html(
          uniqueCategories.map(checkboxesTemplate).join("")
        );
      }
      displayCheckboxes(results);

      // show 10 products
      function defaultDisplay(products) {
        var productsLimit_10 = products
          .slice(0, 10)
          .map(productTemplate)
          .join("");
        return $("#products").html(productsLimit_10);
      }
      defaultDisplay(results);

      // category checkbox
      var categoryIDSelected = [];
      var productsDisplay = [];

      $(document).on("change", ".facets-checkbox", function () {
        var checked = $(this).val();
        // checkbox is checked
        if ($(this).is(":checked")) {
          categoryIDSelected.push(checked);
        } else {
          // checkbox is unchecked
          categoryIDSelected.splice($.inArray(checked, categoryIDSelected), 1);
          productsDisplay = [];
          // uncheck all checkboxes and search is empty
          if (
            categoryIDSelected.length == 0 &&
            $("#edit-search--2").val() == ""
          ) {
            displayCheckboxes(results);
            return defaultDisplay(results);
          }
          // uncheck all checkboxes and search is not empty
          else if (
            categoryIDSelected.length == 0 &&
            $("#edit-search--2").val() != ""
          ) {
            return defaultDisplay(productsSearch);
          }
        }
        if (productsSearch.length > 0) {
          var productsOutput = filterCategoryCkb(
            productsSearch,
            categoryIDSelected
          );
          return defaultDisplay(productsOutput);
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
      });
      //search function
      $("#edit-submit-products-solutions--2").click(function (event) {
        event.preventDefault();
        var searchField = $("#edit-search--2").val();
        productsSearch = [];
        $("input.facets-checkbox").prop("checked", false);
        if (searchField != "") {
          var regex = new RegExp(searchField, "i");
          $.each(results, function (key, val) {
            if (val.body.search(regex) != -1 || val.title.search(regex) != -1) {
              productsSearch.push(val);
            }
          });
          displayCheckboxes(productsSearch);
          return defaultDisplay(productsSearch);
        }
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
