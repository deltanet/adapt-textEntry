define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var TextEntryAudio = ComponentView.extend({

        events: {
            'click .textEntry-button':'onBtnClicked'
        },

        preRender: function() {
            // Listen for text change on audio extension
            this.listenTo(Adapt, "audio:changeText", this.replaceText);
        },

        postRender: function() {
            this.setReadyStatus();

            if (Adapt.config.get('_audio') && Adapt.config.get('_audio')._isReducedTextEnabled && this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled) {
                this.replaceText(Adapt.audio.textSize);
            }
        },

        remove: function() {
            this.$(this.model.get('cssSelector')).off('inview');
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        onBtnClicked: function(event) {
            if (event) event.preventDefault();

            // Store user answer
            this.userAnswer = this.$('.textEntry-item-textbox').val();

            $(event.currentTarget).html(this.model.get("_buttons")._showFeedback.buttonText);
            $(event.currentTarget).attr('aria-label', this.model.get("_buttons")._showFeedback.ariaLabel);

            if(this.model.get("_showUserAnswer")) {
                var popupObject = {
                    title: this.model.get("_feedback").title,
                    body: "<div class='notify-container'><div class='textEntry-user-title'>" + this.model.get("_feedback").userTitle + "</div><div class='textEntry-user-answer'>" + this.userAnswer + "</div><div class='textEntry-feedback-title'>" + this.model.get("_feedback").answerTitle + "</div><div class='textEntry-feedback-body'>" + this.model.get("_feedback").body + "</div></div>"
                };
            } else {
                var popupObject = {
                    title: this.model.get("_feedback").answerTitle,
                    body: "<div class='notify-container'><div class='textEntry-feedback-body'>" + this.model.get("_feedback").body + "</div></div>"
                };
            }

            Adapt.trigger("notify:popup", popupObject);

            ///// Audio /////
            if (Adapt.config.get('_audio') && Adapt.config.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
                // Trigger audio
                Adapt.trigger('audio:playAudio', this.model.get("_feedback")._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
            }
            ///// End of Audio /////

            this.setCompletionStatus();
        },

        // Reduced text
        replaceText: function(value) {
            // If enabled
            if (Adapt.config.get('_audio') && Adapt.config.get('_audio')._isReducedTextEnabled && this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled) {
                // Change component title, body and feedback
                if(value == 0) {
                    this.$('.component-title-inner').html(this.model.get('displayTitle')).a11y_text();
                    this.$('.component-body-inner').html(this.model.get('body')).a11y_text();
                } else {
                    this.$('.component-title-inner').html(this.model.get('displayTitleReduced')).a11y_text();
                    this.$('.component-body-inner').html(this.model.get('bodyReduced')).a11y_text();
                }
            }
        }

    });

    Adapt.register("textEntry-audio", TextEntryAudio);

});
