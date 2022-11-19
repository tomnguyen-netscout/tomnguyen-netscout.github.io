/**
 * @file
 * Override the fullscreen progress indicator placement.
 */

(function ($, Drupal) {

  'use strict';

  if (typeof Drupal.Ajax == 'function') {
    Drupal.Ajax.prototype.setProgressIndicatorFullscreen = function () {
      this.progress.element = $('<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>');
      if ($(this.element).length) {

        var existing = $(".ajax-progress.ajax-progress-fullscreen");
        if (existing.length) {
          // Prevent showing 2 progress indicators simultaneously.
          existing.remove();
        }

        // Place progress indicator right UNDER the 'Load' button.
        $(this.element).after(this.progress.element);
      }
    };
  }
}(jQuery, Drupal));