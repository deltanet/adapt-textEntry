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

            this.listenTo(Adapt.config, 'change:_activeLanguage', this.resetUserAnswers);
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

          this.userAnswer = this.$('.textEntry-audio-item-textbox').val();
          this.model.set("userAnswer", this.userAnswer);

          this.initFeedback();

          this.model.set('_isSubmitted', true);

          this.$('.buttons-action').addClass('disabled').attr('disabled', true);
          this.$('.buttons-action-fullwidth').addClass('disabled').attr('disabled', true);

          this.$('.textEntry-audio-item-textbox').attr('disabled', true);

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

            this.$('.buttons-action').addClass('disabled').attr('disabled', true);
            this.$('.buttons-action-fullwidth').addClass('disabled').attr('disabled', true);

            this.$('.textEntry-audio-item-textbox').attr('disabled', true);

            if (this.model.get('_canShowFeedback')) {
              this.$('.buttons-feedback').attr('disabled', false);
            }

            this.updateCounter();
        },

        resetUserAnswers: function() {
            this.model.set('userAnswer', "");

            this.$('.textEntry-audio-item-textbox').val(this.model.get('userAnswer'));

            this.model.set('_isSubmitted', false);

            this.$('.buttons-action').removeClass('disabled').attr('disabled', false);
            this.$('.buttons-action-fullwidth').removeClass('disabled').attr('disabled', false);

            this.$('.textEntry-audio-item-textbox').attr('disabled', false);

            if (this.model.get('_canShowFeedback')) {
              this.$('.buttons-feedback').attr('disabled', true);
            }

            this.updateCounter();

            this.model.reset(true);

            Adapt.offlineStorage.set(this.model.get('_id'), this.model.get("userAnswer"));
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
