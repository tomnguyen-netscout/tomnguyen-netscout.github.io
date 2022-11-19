(function($) {
  'use strict';

  Drupal.behaviors.playVideoInLightbox = {
    attach: function(context, settings) {
      $('.ns-vidyard__lightbox', context).once('play-lightbox').each(function() {
        var videoLightbox = $(this);
        videoLightbox.on('click', function(evt) {

          // Prevent any redirects due to click.
          evt.preventDefault();

          // Get attribute to get player by UUID.
          var dataPlayerUuid = $(this).attr('data-ns-player-uuid');
          if (dataPlayerUuid) {
            var videoPlayers = VidyardV4.api.getPlayersByUUID(dataPlayerUuid);
            var singlePlayer = videoPlayers[0];
            singlePlayer.showLightbox();
          }
        });
      });

      $('.video--lightbox', context).once('play-lightbox-v2').each(function () {
        var videoLightbox = $(this);
        videoLightbox.on('click', function(e) {
          // Prevent any redirects due to click.
          e.preventDefault();
          // Get attribute to get player by UUID.
          var dataPlayerUuid = videoLightbox.attr('data-uuid');

          if (dataPlayerUuid && videoLightbox.hasClass('video--load')) {
            var playerWrapper = $(".video--lightbox--none.id"+dataPlayerUuid);
            if (playerWrapper.length && !playerWrapper.contents().length) {
              $(playerWrapper).html('<img class="vidyard-player-embed" data-uuid="' + dataPlayerUuid + '" data-v="4" data-type="lightbox" data-preload="none" src="https://play.vidyard.com/' + dataPlayerUuid + '.jpg" />');
            }
            if (playerWrapper.length && playerWrapper.contents().length) {
              vidyardEmbed.api.renderDOMPlayers();
              VidyardV4.api.getPlayersByUUID(dataPlayerUuid)[0].showLightbox();
            }
          }
          else if (dataPlayerUuid && !$(this).hasClass('video--load')) {
            VidyardV4.api.getPlayersByUUID(dataPlayerUuid)[0].showLightbox();
          }
        });
      });

    }
  };

})(jQuery);
