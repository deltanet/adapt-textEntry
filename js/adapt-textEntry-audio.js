import Adapt from 'core/js/adapt';
import TextEntryAudioModel from './textEntryAudioModel';
import TextEntryAudioView from './textEntryAudioView';

export default Adapt.register('textEntry-audio', {
  model: TextEntryAudioModel,
  view: TextEntryAudioView
});
