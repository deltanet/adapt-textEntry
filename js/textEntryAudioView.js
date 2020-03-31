define([
    'core/js/adapt',
    'core/js/views/componentView',
    './textEntryAudioPopupView'
], function(Adapt, ComponentView, TextEntryAudioPopupView) {

    var TextEntryAudioView = ComponentView.extend({

        events: {
            'click .buttons-action': 'onBtnClicked',
            'click .buttons-action-fullwidth': 'onBtnClicked',
            'click .buttons-feedback': 'openPopup',
            'keyup .textEntry-audio-item-textbox': 'onInputChanged'
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
            this.restoreUserAnswers();
            this.setReadyStatus();

            if (this.model.get('_setCompletionOn') === 'inview') {
                this.setupInviewCompletion();
            }

            this.updateCounter();
        },

        onBtnClicked: function(event) {
          if (event) event.preventDefault();

          if (this.$('.textEntry-audio-item-textbox').val() == "") return;

          if (this.model.get('_isSubmitted')) {

            $(event.currentTarget).html(this.model.get("_buttons")._submit.buttonText);
            $(event.currentTarget).attr('aria-label', this.model.get("_buttons")._submit.ariaLabel);

            this.resetUserAnswer();

          } else {

            this.userAnswer = this.$('.textEntry-audio-item-textbox').val();
            this.model.set("userAnswer", this.userAnswer);

            this.initFeedback();

            $(event.currentTarget).html(this.model.get("_buttons")._reset.buttonText);
            $(event.currentTarget).attr('aria-label', this.model.get("_buttons")._reset.ariaLabel);

            this.model.set('_isSubmitted', true);
          }

          Adapt.offlineStorage.set(this.model.get('_id'), this.model.get("userAnswer"));

          if (!this.model.get('_recordInteraction')) return;
          Adapt.trigger('questionView:recordInteraction', this);
      },

      initFeedback: function() {
        if (this.model.get('_canShowFeedback')) {
          this.$('.buttons-feedback').attr('disabled', false);
          this.openPopup();
        } else {
          this.setCompletionStatus();
        }
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
        },

        restoreUserAnswers: function() {
            var storedAnswer = Adapt.offlineStorage.get(this.model.get('_id'));

            if (!storedAnswer) return;

            this.model.set('userAnswer', storedAnswer);

            this.$('.textEntry-audio-item-textbox').val(this.model.get('userAnswer'));

            this.model.set('_isSubmitted', true);

            if (this.model.get('_canShowFeedback')) {
              this.$('.buttons-action').html(this.model.get("_buttons")._reset.buttonText);
              this.$('.buttons-action').attr('aria-label', this.model.get("_buttons")._reset.ariaLabel);

              this.$('.buttons-feedback').attr('disabled', false);
            } else {
              this.$('.buttons-action-fullwidth').html(this.model.get("_buttons")._reset.buttonText);
              this.$('.buttons-action-fullwidth').attr('aria-label', this.model.get("_buttons")._reset.ariaLabel);
            }

            this.updateCounter();
        },

        resetUserAnswer: function() {
          this.model.set('_isSubmitted', false);
          this.model.set('userAnswer', '');

          this.$('.textEntry-audio-item-textbox').val('');

          this.$('.buttons-feedback').attr('disabled', true);

          this.updateCounter();
        },

        onInputChanged: function(event) {
          if (event) event.preventDefault();

          this.updateCounter();
        },

        updateCounter: function() {
          if (!this.model.get('_characterLimit')) return;
          if (!this.model.get('_characterLimit')._isEnabled) return;

          var length = this.$('.textEntry-audio-item-textbox').val().length;

          var max = this.model.get('_characterLimit')._max;
          var text = this.model.get('_characterLimit').text;

          var output = text+" "+(max - length);

          this.$('.textEntry-audio-counter').html(output);
        },

        isCorrect: function() {
            return null;
        },

        // Time elapsed between the time the interaction was made available to the learner for response and the time of the first response
        getLatency:function() {
            return null;
        },

        /**
        * used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
        * returns the user's answers as a string in the format 'answer1[,]answer2[,]answer3'
        * the use of [,] as an answer delimiter is from the SCORM 2004 specification for the fill-in interaction type
        */
        getResponse: function() {
            return this.model.get('userAnswer');
        },

        /**
        * used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
        */
        getResponseType: function() {
            return 'fill-in';
        }
    });

    return TextEntryAudioView;

});
