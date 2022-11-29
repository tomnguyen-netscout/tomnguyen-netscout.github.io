(function($) {
  'use strict';

  Drupal.behaviors.inlineFilter = {
    attach: function(context, settings) {
      $('.ns-facets__title--inline', context).once('hide-show').each(function() {
        var titleInline = $(this);
        titleInline.on('click keyup', function (e) {
          if (window.innerWidth < 992 && (e.type === "click" || (e.type === "keyup" && e.keyCode === 13))) {
            // Get the checkbox wrapper and the toggle icon svg to add active class.
            titleInline.find('svg').toggleClass('active');
            var itemListCheckbox = $('.ns-facets__content-type');
            itemListCheckbox.toggleClass('active');
          }
        });
      });
    }
  };

})(jQuery);
