define([
    'core/js/adapt',
    './textEntryAudioView',
    'core/js/models/componentModel'
], function(Adapt, TextEntryAudioView, ComponentModel) {

    return Adapt.register('textEntry-audio', {
        view: TextEntryAudioView,
        model: ComponentModel.extend({})
    });

});
