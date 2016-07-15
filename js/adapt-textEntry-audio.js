define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var TextEntryAudio = ComponentView.extend({

        events: {
            'click .textEntry-audio-button':'onBtnClicked'
        },

        preRender: function() {},

        postRender: function() {
            this.setReadyStatus();
        },

        remove: function() {
            this.$(this.model.get('cssSelector')).off('inview');
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        onBtnClicked: function(event) {
            if (event) event.preventDefault();

            // Store user answer
            this.userAnswer = this.$('.textEntry-audio-item-textbox').val();

            $(event.currentTarget).html(this.model.get("_buttons")._showFeedback.buttonText);
            $(event.currentTarget).attr('aria-label', this.model.get("_buttons")._showFeedback.ariaLabel);

            if(this.model.get("_showUserAnswer")) {
                var popupObject = {
                    title: this.model.get("_feedback").title,
                    body: "<div class='notify-container'><div class='textEntry-audio-user-title'>" + this.model.get("_feedback").userTitle + "</div><div class='textEntry-audio-user-answer'>" + this.userAnswer + "</div><div class='textEntry-audio-feedback-title'>" + this.model.get("_feedback").answerTitle + "</div><div class='textEntry-audio-feedback-body'>" + this.model.get("_feedback").body + "</div></div>"
                };
            } else {
                var popupObject = {
                    title: this.model.get("_feedback").answerTitle,
                    body: "<div class='notify-container'><div class='textEntry-audio-feedback-body'>" + this.model.get("_feedback").body + "</div></div>"
                };
            }

            Adapt.trigger("notify:popup", popupObject);

            ///// Audio /////
            if (this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
                // Trigger audio
                Adapt.trigger('audio:playAudio', this.model.get("_feedback")._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
            }
            ///// End of Audio /////

            this.setCompletionStatus();
        }

    });

    Adapt.register("textEntry-audio", TextEntryAudio);

});
