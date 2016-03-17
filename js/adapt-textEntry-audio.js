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

            $(event.currentTarget).html(this.model.get("_buttons")._showFeedback.buttonText);
            $(event.currentTarget).attr('aria-label', this.model.get("_buttons")._showFeedback.ariaLabel);

            if (Adapt.config.get('_audio') && Adapt.config.get('_audio')._isReducedTextEnabled && this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled && Adapt.audio.textSize == 1) {
                var popupObject = {
                    title: this.model.get("_feedback").titleReduced,
                    body:  this.model.get("_feedback").bodyReduced
                };
            } else {
                var popupObject = {
                    title: this.model.get("_feedback").title,
                    body: this.model.get("_feedback").body
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
                    this.$('.textEntry-feedback-body-inner').html(this.model.get('_feedback').body).a11y_text();
                } else {
                    this.$('.component-title-inner').html(this.model.get('displayTitleReduced')).a11y_text();
                    this.$('.component-body-inner').html(this.model.get('bodyReduced')).a11y_text();
                    this.$('.textEntry-feedback-body-inner').html(this.model.get('_feedback').bodyReduced).a11y_text();
                }
            }
        }
        
    });
    
    Adapt.register("textEntry-audio", TextEntryAudio);
    
});