define([
    'core/js/adapt',
    './textEntryAudioView'
], function(Adapt, TextEntryAudioView) {

    return Adapt.register('textEntry-audio', {
        view: TextEntryAudioView
    });

});
