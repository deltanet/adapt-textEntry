define([
    'core/js/adapt',
    'core/js/views/componentView',
    './textEntryAudioPopupView'
], function(Adapt, ComponentView, TextEntryAudioPopupView) {

    var TextEntryAudioView = ComponentView.extend({

        events: {
            'click .textEntry-audio-button': 'onBtnClicked',
            'click .textEntry-popup-close': 'closePopup'
        },

        initialize: function() {
            ComponentView.prototype.initialize.call(this);
            this.setUpViewData();
        },

        setUpViewData: function() {
            this.popupView = null;
            this._isPopupOpen = false;
        },

        postRender: function() {
            this.setReadyStatus();
        },

        onBtnClicked: function(event) {
          if (event) event.preventDefault();

          // Store user answer
          this.userAnswer = this.$('.textEntry-audio-item-textbox').val();

          this.model.set("userAnswer", this.userAnswer);

          this.$('.textEntry-popup').find('.textEntry-popup-user-answer').html(this.userAnswer);

          $(event.currentTarget).html(this.model.get("_buttons")._showFeedback.buttonText);
          $(event.currentTarget).attr('aria-label', this.model.get("_buttons")._showFeedback.ariaLabel);

          this.openPopup();
      },

      openPopup: function() {
          if (this._isPopupOpen) return;

          this._isPopupOpen = true;

          Adapt.trigger('audio:stopAllChannels');

          this.popupView = new TextEntryAudioPopupView({
              model: this.model
          });

          Adapt.trigger('notify:popup', {
              _view: this.popupView,
              _isCancellable: true,
              _showCloseButton: false,
              _closeOnBackdrop: true,
              _classes: 'textEntry-audio-popup'
          })

          this.listenToOnce(Adapt, {
              'popup:closed': this.onPopupClosed
          });
        },

        onPopupClosed: function() {
            this._isPopupOpen = false;
            this.setCompletionStatus();
        }

    });

    return TextEntryAudioView;

});
