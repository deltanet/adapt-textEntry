define(function(require) {

    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var TextEntryAudio = ComponentView.extend({

        events: {
          'click .textEntry-audio-button': 'onBtnClicked',
          'click .textEntry-popup-close': 'closePopup'
        },

        preRender: function() {
          this.disableAnimation = Adapt.config.has('_disableAnimation') ? Adapt.config.get('_disableAnimation') : false;

          _.bindAll(this, 'onKeyUp');

          this.listenTo(Adapt, 'device:resize', this.resetPopup);
        },

        postRender: function() {
          this.setReadyStatus();
          this.isPopupOpen = false;
        },

        onBtnClicked: function(event) {
          if (event) event.preventDefault();

          // Store user answer
          this.userAnswer = this.$('.textEntry-audio-item-textbox').val();

          this.model.set("userAnswer", this.userAnswer);

          this.$('.textEntry-popup').find('.textEntry-popup-user-answer').html(this.userAnswer);

          $(event.currentTarget).html(this.model.get("_buttons")._showFeedback.buttonText);
          $(event.currentTarget).attr('aria-label', this.model.get("_buttons")._showFeedback.ariaLabel);

          this.isPopupOpen = true;

          if (this.disableAnimation) {
            $('#shadow').removeClass("display-none");
          } else {
            $('#shadow').velocity({opacity:1},{duration:400, begin: _.bind(function() {
                $("#shadow").removeClass("display-none");
            }, this)});
          }
          $('#shadow').css("z-index","549");

          $('body').scrollDisable();

          if (this.disableAnimation) {
            this.$('.textEntry-popup').css("display", "block");
              complete.call(this);
            } else {
              this.$('.textEntry-popup').velocity({ opacity: 0 }, {duration:0}).velocity({ opacity: 1 }, { duration:400, begin: _.bind(function() {
              this.$('.textEntry-popup').css("display", "block");
              complete.call(this);
          }, this) });

          function complete() {
            /*ALLOWS POPUP MANAGER TO CONTROL FOCUS*/
            Adapt.trigger('popup:opened', this.$('.textEntry-popup'));

            this.resetPopup();

            //set focus to first accessible element
            this.$('.textEntry-popup').a11y_focus();

            ///// Audio /////
            if (this.model.has('_audio') && this.model.get('_audio')._isEnabled && Adapt.audio.audioClip[this.model.get('_audio')._channel].status==1) {
              // Reset onscreen id
              Adapt.audio.audioClip[this.model.get('_audio')._channel].onscreenID = "";
              // Trigger audio
              Adapt.trigger('audio:playAudio', this.model.get("_feedback")._audio.src, this.model.get('_id'), this.model.get('_audio')._channel);
            }
            ///// End of Audio /////
          }

          $('#shadow').on('click', _.bind(this.closePopup, this));

          this.setupEscapeKey();
        }
      },

      closePopup: function(event) {
        if (event) event.preventDefault();

        if (this.disableAnimation) {
          $('#shadow').addClass("display-none");
        } else {
          $('#shadow').velocity({opacity:0}, {duration:400, complete:function() {
              $('#shadow').addClass("display-none");
          }});
        }
        $('#shadow').css("z-index","500");

        if (this.disableAnimation) {
          this.$('.textEntry-popup').css("display", "none");
        } else {
          this.$('.textEntry-popup').velocity({ opacity: 0 }, {duration:400, complete: _.bind(function() {
            this.$('.textEntry-popup').css("display", "none");
          }, this)});
        }

        Adapt.trigger('popup:closed',  this.$('.textEntry-popup'));

        $('body').scrollEnable();

        ///// Audio /////
        if (Adapt.course.get('_audio') && Adapt.course.get('_audio')._isEnabled && this.model.has('_audio') && this.model.get('_audio')._isEnabled) {
          Adapt.trigger('audio:pauseAudio', this.model.get('_audio')._channel);
        }
        ///// End of Audio /////

        this.setCompletionStatus();

        $('#shadow').off('click');

        this.isPopupOpen = false;
      },

      resizePopup: function() {
        var windowHeight = $(window).height();
        var popupHeight = this.$('.textEntry-popup').outerHeight();

        if (popupHeight > windowHeight) {
          this.$('.textEntry-popup').addClass('small');
          this.$('.textEntry-popup').css({
            'margin-top': 0
          });
        } else {
          this.$('.textEntry-popup').addClass('large');
          this.$('.textEntry-popup').css({
            'margin-top': -(popupHeight/2)
          });
        }
      },

      resetPopup: function() {
        if (this.isPopupOpen) {
          this.$('.textEntry-popup').removeClass('large');
          this.$('.textEntry-popup').removeClass('small');
          this.resizePopup();
        }
      },

      setupEscapeKey: function() {
        var hasAccessibility = Adapt.config.has('_accessibility') && Adapt.config.get('_accessibility')._isActive;

        if (!hasAccessibility && this.isPopupOpen) {
          $(window).on("keyup", this.onKeyUp);
        } else {
          $(window).off("keyup", this.onKeyUp);
        }
      },

      onAccessibilityToggle: function() {
        this.setupEscapeKey();
      },

      onKeyUp: function(event) {
        if (event.which != 27) return;
        event.preventDefault();

        this.closePopup();
      },

      remove: function() {
        this.$(this.model.get('cssSelector')).off('inview');
        Backbone.View.prototype.remove.apply(this, arguments);
      }

    });

    Adapt.register("textEntry-audio", TextEntryAudio);

});
