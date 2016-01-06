/*!
 * MultiSelectDropdown.js (0.0.1)
 *
 * Copyright (c) 2016 Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/multi-select-dropdown.js/blob/master/LICENSE.md)
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MultiSelectDropdownElement = factory();
  }
}(this, function() {/**
 * TODO: Add description
 *
 * @inherits {Array}
 * @constructor
 */
function MSDObservableArray() {
  var items = arguments;

  if (!(this instanceof MSDObservableArray)) {
    return new MSDObservableArray.apply(this, items);
  }



  /** @private @type {!Object} */ var _events;



  /** @constructs MSDObservableArray */
  ;(function() {
    Array.call(this);


    if (items != null) {
      if (items.length === 1) {
        var arrayLikeItem = Array.from(items[0]);
        this.push.apply(this, (arrayLikeItem.length > 0) ? arrayLikeItem : items[0]);
      } else {
        this.push.apply(this, Array.from(items));
      }
    }


    _events = {};


    this.addEventListener    = addEventListener;
    this.removeEventListener = removeEventListener;

    this.push    = push;
    this.pop     = pop;
    this.reverse = reverse;
    this.shift   = shift;
    this.sort    = sort;
    this.splice  = splice;
    this.unshift = unshift;
  }).bind(this)();




  /**
   * TODO: Add description
   *
   * @param {!String}   eventName             - Name of event to which given `eventHandler` will be attached.
   * @param {!Function} eventHandler          - The function to be called when the event represented by `eventName` occurs.
   * @param {Object}    [eventHandlerContext] - The context to be used when calling `eventHandler` (defaults to this object).
   */
  function addEventListener(eventName, eventHandler, eventHandlerContext) {
    eventHandlerContext = (eventHandlerContext || this);


    var handlerInfos = _events[eventName];

    if (handlerInfos == null) {
      handlerInfos = _events[eventName] = {};
    }


    var handlerHashCode = MSDInternalUtils.getHashCode(eventHandler);
    var handlerInfo     = handlerInfos[handlerHashCode];

    if (handlerInfo == null) {
      handlerInfo = handlerInfos[handlerHashCode] = {
        handler:  eventHandler,
        contexts: []
      };
    }


    if (~handlerInfo.contexts.indexOf(eventHandlerContext)) {
      return;
    }

    handlerInfo.contexts.push(eventHandlerContext);
  }


  /**
   * TODO: Add description
   *
   * @param {!String}   eventName             - Name of event from which given `eventHandler` will be detached.
   * @param {!Function} [eventHandler]        - The handler function attached to the event represented by the given 'eventName'.
   * @param {Object}    [eventHandlerContext] - The context used when calling `eventHandler` (defaults to this object).
   */
  function removeEventListener(eventName, eventHandler, eventHandlerContext) {
    if (!(eventName in _events)) {
      return;
    }


    var handlerInfos = _events[eventName];
    if (eventHandler == null) {
      delete _events[eventName];
      return;
    }


    var handlerHashCode = MSDInternalUtils.getHashCode(eventHandler);
    var handlerInfo     = handlerInfos[eventHandler];
    if (eventHandlerContext == null) {
      delete handlerInfos[handlerHashCode];
      return;
    }


    var contextIndex = handlerInfo.contexts.indexOf(eventHandlerContext);
    if (~contextIndex) {
      handlerInfo.contexts.splice(contextIndex, 1);
    }


    if (handlerInfo.contexts.length === 0) {
      delete handlerInfos[handlerHashCode];
    }
    if (Object.keys(handlerInfos).length === 0) {
      delete _events[eventName];
    }
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#add
   * @fires MSDObservableArray#update
   */
  function push() {
    var ret = Array.prototype.push.apply(this, arguments);

    _triggerEvent('add', _getEventArgs.call(this, arguments));
    _triggerEvent('update', _getEventArgs.call(this, arguments));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#remove
   * @fires MSDObservableArray#update
   */
  function pop() {
    var ret = Array.prototype.pop.apply(this, arguments);

    _triggerEvent('remove', _getEventArgs.call(this, ret));
    _triggerEvent('update', _getEventArgs.call(this, ret));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#sort
   * @fires MSDObservableArray#update
   */
  function reverse() {
    var ret = Array.prototype.reverse.apply(this, arguments);

    _triggerEvent('sort', _getEventArgs.call(this));
    _triggerEvent('update', _getEventArgs.call(this));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#remove
   * @fires MSDObservableArray#update
   */
  function shift() {
    var removed = this[0];

    var ret = Array.prototype.shift.apply(this, arguments);

    _triggerEvent('remove', _getEventArgs.call(this, removed));
    _triggerEvent('update', _getEventArgs.call(this, removed));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#sort
   * @fires MSDObservableArray#update
   */
  function sort() {
    var ret = Array.prototype.sort.apply(this, arguments);

    _triggerEvent('sort', _getEventArgs.call(this, ret));
    _triggerEvent('update', _getEventArgs.call(this, ret));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#remove
   * @fires MSDObservableArray#update
   */
  function splice() {
    var ret = Array.prototype.splice.apply(this, arguments);

    _triggerEvent('remove', _getEventArgs.call(this, ret));
    _triggerEvent('update', _getEventArgs.call(this, ret));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#add
   * @fires MSDObservableArray#update
   */
  function unshift() {
    var ret = Array.prototype.unshift.apply(this, arguments);

    _triggerEvent('remove', _getEventArgs.call(this, arguments));
    _triggerEvent('update', _getEventArgs.call(this, arguments));

    return ret;
  }



  // region Private Functions

  /** @private */
  function _getEventArgs(args) {
    var ret = [ this ];
    return ((args == null) ? ret : ret.concat(Array.from(args)));
  }


  /** @private */
  function _triggerEvent(eventName, args) {
    setTimeout(function() {
      if (!_events.hasOwnProperty(eventName)) {
        return;
      }

      var handlerInfos     = _events[eventName];
      var handlerHashCodes = Object.keys(handlerInfos);

      for (var i = 0; i < handlerHashCodes.length; i++) {
        var handlerInfo = handlerInfos[handlerHashCodes[i]];

        for (var j = 0; j < handlerInfo.contexts.length; j++) {
          handlerInfo.handler.apply(handlerInfo.contexts[j], args);
        }
      }
    }, 0);
  }

  // endregion
}



MSDObservableArray.prototype             = Object.create(Array.prototype);
MSDObservableArray.prototype.constructor = MSDObservableArray;/**
 * @typedef {Object} MultiSelectDropdownElementOptions
 * @property {String}      [selector]            - TODO: Add description
 * @property {HTMLElement} [element]             - TODO: Add description
 * @property {Boolean}     [useSelectAll = true] - TODO: Add description
 */



/**
 * TODO: Add description
 *
 * @param {String|HTMLElement|MultiSelectDropdownElementOptions} options *
 * @constructor
 */
function MultiSelectDropdownElement(options) {
  if (!(this instanceof MultiSelectDropdownElement)) {
    return new MultiSelectDropdownElement(options);
  }



  /** @private @type {!HTMLElement} */ var _$select;
  /** @private @type {!HTMLElement} */ var _$selectAllOption;
  /** @private @type {!HTMLElement} */ var _$selectedPlaceholderOption;

  /** @private @type {!String}      */ var _placeholderText;
  /** @private @type {!String}      */ var _optionTypeLabelSingular;
  /** @private @type {!String}      */ var _optionTypeLabelPlural;

  /** @private @type {!Boolean}     */ var _useSelectAll   = false;
  /** @private @type {!Boolean}     */ var _wasAllSelected = false;

  /** @private @type {!MSDObservableArray<!HTMLElement>} */ var _optionElements;



  /** @constructs MultiSelectDropdownElement */
  ;(function _constructor() {
    options = (options || {});

    if (typeof options === 'string') {
      _$select = document.querySelector(options);
    } else if (options instanceof HTMLElement) {
      _$select = options;
    } else {
      _$select = (options.element || document.querySelector(options.selector));
    }

    _optionTypeLabelSingular = (_$select.dataset.optionTypeLabelSingular || _$select.dataset.optionTypeLabel || "Option");
    _optionTypeLabelPlural   = (_$select.dataset.optionTypeLabelPlural || (_optionTypeLabelSingular + "s"));
    _placeholderText         = (_$select.dataset.placeholder || ("0 " + _optionTypeLabelPlural + " Selected"));

    _optionElements = new MSDObservableArray(_$select.querySelectorAll('option'));


    if (options.useSelectAll === true) {
      _useSelectAll = true;

      _$selectAllOption = document.createElement('option');

      _$selectAllOption.innerText = "All";
      _$selectAllOption.classList.add('msd-select-all');
      _$selectAllOption.addEventListener('click', _onClickSelectAllOption.bind(_$selectAllOption));

      _updateSelectAllOption();

      _$select.insertBefore(_$selectAllOption, _$select.firstChild);
    }


    _$selectedPlaceholderOption = document.createElement('option');

    _$selectedPlaceholderOption.selected = true;
    _$selectedPlaceholderOption.classList.add('msd-placeholder');

    _updateSelectedPlaceholderOptionInnerText();

    _$select.insertBefore(_$selectedPlaceholderOption, _$select.firstChild);


    for (var i = 0; i < _optionElements.length; i++) {
      var $option = _optionElements[i];
      _setupOption($option);
    }


    _$selectedPlaceholderOption.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();

      _$select.blur();
    });



    _$select.addEventListener('change', function(e) {
      e.preventDefault();
      e.stopPropagation();

      for (var i = 0; i < _$select.selectedOptions.length; i++) {
        _$select.selectedOptions[i].selected = false;
      }

      _$select.value = undefined;
    });


    _$select.addEventListener('focus', function(e) {
      e.preventDefault();
      e.stopPropagation();

      _$select.setAttribute('multiple', 'multiple');
      _$selectedPlaceholderOption.selected = false;
    });



    _$select.addEventListener('blur', function(e) {
      _$selectedPlaceholderOption.selected = true;
      _$select.removeAttribute('multiple');
    });


    _optionElements.addEventListener('update', _onUpdateOptionElements);



    this.addOption    = addOption;
    this.removeOption = removeOption;
    this.clearOptions = clearOptions;
    this.destroy      = destroy;
  }.bind(this))();



  /**
   * TODO: Implement
   *
   * @param {*} optionText
   * @param {*} [optionValue]
   */
  function addOption(optionText, optionValue) {
    var $newOption = document.createElement('option');

    if (optionValue != null && optionValue !== "") {
      $newOption.value = String(optionValue);
    }

    $newOption.text = String(optionText);

    _$select.appendChild($newOption);

    _optionElements.push($newOption);
  }


  /**
   * TODO: Implement
   *
   * @param {*} optionValue
   * @returns {Boolean} `true` if the option was removed successfully
   *                    or if it was not found; otherwise, returns
   *                    `false`.
   */
  function removeOption(optionValue) {
    var selectionQuery  = _getOptionSelectionQuery(optionValue);
    var $optionToRemove = _$select.querySelector(selectionQuery);

    if ($optionToRemove != null) {
      $optionToRemove.parentNode.removeChild($optionToRemove);
      return (_$select.querySelector(selectionQuery) == null);
    }

    return true;
  }


  /**
   * TODO: Implement
   */
  function clearOptions() {
    _optionElements.splice(0, _optionElements.length);
  }


  /**
   * TODO: Implement
   *
   * @public
   */
  function destroy() {
    // TODO: Implement
  }



  // region Private Functions

  /** @private */
  function _setupOption($option) {
    $option.addEventListener('click', _onClickOption.bind($option));
  }


  /** @private */
  function _getOptionSelectionQuery(optionValue) {
    return ((optionValue == null) ? 'option:not([value])' : ('option[value="' + String(optionValue) + '"]'));
  }



  /** @private */
  function _getAllCheckedOptionElementsLength() {
    return _$select.querySelectorAll('option:not(.msd-select-all)[checked]').length;
  }


  /** @private */
  function _updateSelectAllOption() {
    if (_useSelectAll) {
      if (_getAllCheckedOptionElementsLength() === _optionElements.length) {
        _$selectAllOption.setAttribute('checked', 'checked');
      }
    }
  }


  /** @private */
  function _updateSelectedPlaceholderOptionInnerText() {
    if (_useSelectAll && _$selectAllOption.getAttribute('checked') != null) {
      _$selectedPlaceholderOption.innerText = "All " + _optionTypeLabelPlural + " Selected";
      return;
    }

    var checkedOptionElementsLength = (_wasAllSelected ? 0 : _getAllCheckedOptionElementsLength());

    if (checkedOptionElementsLength === 0) {
      _$selectedPlaceholderOption.innerText = _placeholderText;
      return;
    }
    _$selectedPlaceholderOption.innerText = (checkedOptionElementsLength + " " + (checkedOptionElementsLength === 1 ? _optionTypeLabelSingular : _optionTypeLabelPlural) + " Selected");
  }


  // region Event Handlers

  /** @private */
  function _onUpdateOptionElements(optionElements) {
    optionElements.forEach(function($option) {
      var $parent = $option.parentNode;

      $parent.removeChild($option);
      $parent.appendChild($option);
    });
  }


  /** @private */
  function _onClickOption(e) {
    e.preventDefault();
    e.stopPropagation();

    var isChecked = (this.getAttribute('checked') == null);

    if (e.target === _$selectAllOption) {
      _wasAllSelected = !isChecked;
    }

    if (this.getAttribute('checked') == null) {
      this.setAttribute('checked', 'checked');
    } else {
      this.removeAttribute('checked');
    }

    if (e.target !== _$selectAllOption) {
      _updateSelectAllOption();
    }
    _updateSelectedPlaceholderOptionInnerText();
  }


  /** @private */
  function _onClickSelectAllOption() {
    if (_$selectAllOption.getAttribute('checked') == null) {
      this.removeAttribute('checked');
      return;
    }
    this.setAttribute('checked', 'checked');
  }

  // endregion

  // endregion
}

return MultiSelectDropdownElement;

}));
