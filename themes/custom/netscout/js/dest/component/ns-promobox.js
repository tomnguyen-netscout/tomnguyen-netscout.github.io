var maxScrollHeight =
  document.documentElement.scrollHeight - document.documentElement.clientHeight;

var scrollTo50 = Math.ceil(maxScrollHeight / 2);

window.addEventListener("scroll", function (e) {
  if (this.scrollY >= scrollTo50) {
    var waitForJQuery = setInterval(function () {
      if (typeof jQuery != "undefined") {
        var promoBox = jQuery("#engage22");

        if (window.innerWidth >= 768) {
          if (
            !promoBox.hasClass("visible") &&
            !sessionStorage.getItem("engagePromoClosed")
          ) {
            promoBox.animate({ right: "1rem" }, 800).addClass("visible");
          }
        } else if (
          !promoBox.hasClass("visible") &&
          !sessionStorage.getItem("engagePromoClosed")
        ) {
          promoBox.animate({ top: "50%" }, 800).addClass("visible");
        }

        promoBox.find(".close").on("click", function (e) {
          if (promoBox.hasClass("visible")) {
            promoBox.fadeOut(400, function () {
              jQuery(this).remove();

              sessionStorage.setItem("engagePromoClosed", "true");
            });
          }
        });

        clearInterval(waitForJQuery);
      }
    }, 100);
  }
});
