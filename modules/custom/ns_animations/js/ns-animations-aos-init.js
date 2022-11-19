(function($) {
  'use strict';

  Drupal.behaviors.aosjsInit = {
    attach: function(context, setting) {
      $('.ns-animate-init', context).once('wow-init').each(function() {
        var screenWindow = $(window);
        var animateInit = $(this);
        var initializedClass = 'ns-animate-init-initialized';
        screenWindow.on('scroll', function() {
          AOS.init({
            easing: 'ease-in-out',
            duration: '1000',
          });
        });
      });
    }
  };
}(jQuery));
