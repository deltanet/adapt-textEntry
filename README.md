# adapt-textEntry-audio

**Text Entry** is a *presentation component* for the [Adapt framework](https://github.com/adaptlearning/adapt_framework).   

This component displays a simple text entry box with no tracking or data saving.

## Settings Overview

The attributes listed below are used in *components.json* to configure **Text Entry**, and are properly formatted as JSON in [*example.json*](https://github.com/deltanet/adapt-textEntry-audio/blob/master/example.json).

### Attributes

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**_component** (string): This value must be: `textEntry-audio`.

**_classes** (string): CSS class name to be applied to **Text Entry**’s containing `div`. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are `full`, `left` or `right`.  

**instruction** (string): This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.  

**placeholder** (string): This text appears in the text entry box before the user interacts with it.  

**_buttons** (object):  This `_buttons` attributes group stores the properties for the buttons. It contains values for **_submit**, and **_showFeedback**.  

>**_submit** (object):  This `_submit` attributes group stores the properties for the Submit button. It contains values for **buttonText**, and **ariaLabel**.  

>>**buttonText** (string): Sets the text to be displayed in the Submit button.    

>>**ariaLabel** (string): This text becomes the button’s `Aria label` attribute.  

>**_showFeedback** (object):  This `_showFeedback` attributes group stores the properties for the Feedback button. It contains values for **buttonText**, and **ariaLabel**.  

>>**buttonText** (string): Sets the text to be displayed in the Feedback button.    

>>**ariaLabel** (string): This text becomes the button’s `Aria label` attribute.

## Accessibility
Several elements of **Text Entry** have been assigned a label using the [aria-label](https://github.com/adaptlearning/adapt_framework/wiki/Aria-Labels) attribute: **Text Entry**. These labels are not visible elements. They are utilized by assistive technology such as screen readers.   

## Limitations

No known limitations.  

----------------------------
**Version number:**  3.0.8     
**Framework versions supported:**  2.0.3     
**Author / maintainer:** DeltaNet with [contributors](https://github.com/deltanet/adapt-textEntry-audio/graphs/contributors)     
**Accessibility support:** yes  
**RTL support:** yes     
**Authoring tool support:** Yes
