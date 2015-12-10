define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var TextEntry = ComponentView.extend({

        events: {
            'click .textEntry-button':'onBtnClicked'
        },

        preRender: function() {
            // Listen for text change on audio extension
            this.listenTo(Adapt, "audio:changeText", this.replaceText);
        },
        
        postRender: function() {
            this.setReadyStatus();

            if (this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled) {
                this.replaceText(Adapt.audio.textSize);
            }
        },

        remove: function() {
            this.$(this.model.get('cssSelector')).off('inview');
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        onBtnClicked: function(event) {
            event.preventDefault();
            this.$('.textEntry-button').addClass('hidden');
            this.$('.textEntry-feedback').removeClass('hidden');
            this.$('.textEntry-feedback-body-inner').a11y_on(true);
            this.$('.textEntry-feedback-body-inner').a11y_focus();

            this.setCompletionStatus();
        },

        // Reduced text
        replaceText: function(value) {
            // If enabled
            if (this.model.get('_reducedText') && this.model.get('_reducedText')._isEnabled) {
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
    
    Adapt.register("textEntry", TextEntry);
    
});