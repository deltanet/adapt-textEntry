define([
    'core/js/adapt'
], function(Adapt) {
    'use strict';

    var TextEntryAudioPopupView = Backbone.View.extend({

        className: 'textEntry-audio-popup-content',

        events: {
            'click .textEntry-close-button': 'closePopup'
        },

        initialize: function() {
            this.listenToOnce(Adapt, 'notify:opened', this.onOpened);
            this.render();
        },

        onOpened: function() {
            this.playAudio();
        },

        render: function() {
            var data = this.model.toJSON();
            var template = Handlebars.templates['textEntryAudioPopup'];
            this.$el.html(template(data));
        },

        closePopup: function(event) {
            Adapt.trigger('notify:close');
        },

        playAudio: function() {
          if (Adapt.audio && this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
            Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
            Adapt.trigger('audio:playAudio', this.model.get("_feedback")._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
          }
        }

    });

    return TextEntryAudioPopupView;

});
