/*!
 * MultiSelectDropdown.js (0.0.1)
 *
 * Copyright (c) 2015 Brandon Sara (http://bsara.github.io)
 * Licensed under the CPOL-1.02 (https://github.com/bsara/multi-select-dropdown.js/blob/master/LICENSE.md)
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.MultiSelectDropdown = factory();
  }
}(this, function() {/** @private */
var MSDInternalUtils = {
  /**
   * @param  {HTMLElement} $el
   * @return {String}
   * @private
   */
  getElementSelector: function getElementSelector($el) {
    if ($el == null || !($el instanceof HTMLElement)) {
      throw new TypeError("$el cannot be `null` or `undefined` and must be an instance of `HTMLElement`!");
    }

    var ret = $el.tagName;

    if ($el.id != null) {
      ret += ('#' + $el.id);
    }
    if ($el.className != null) {
      ret += ('.' + $el.className);
    }

    return ret;
  }
};


Object.freeze(MSDInternalUtils);/**
 * TODO: Add description
 *
 * @param {Object} options -
 *   - {String}      [selector]            - TODO: Add description
 *   - {HTMLElement} [element]             - TODO: Add description
 *   - {Boolean}     [useSelectAll = true] - TODO: Add description
 *
 * @constructor
 */
function MultiSelectDropdownElement(options) {
  if (!(this instanceof MultiSelectDropdownElement)) {
    return new MultiSelectDropdownElement(options);
  }



  /** @private @type {!HTMLElement}   */ var _$select;
  /** @private @type {!HTMLElement}   */ var _$selectAllOption;
  /** @private @type {!HTMLElement}   */ var _$selectedPlaceholderOption;

  /** @private @type {!String}        */ var _placeholderText;
  /** @private @type {!String}        */ var _optionTypeLabelSingular;
  /** @private @type {!String}        */ var _optionTypeLabelPlural;

  /** @private @type {!HTMLElement[]} */ var _optionElements;

  /** @private @type {!Boolean}       */ var _useSelectAll   = false;
  /** @private @type {!Boolean}       */ var _wasAllSelected = false;



  /** @constructor */
  ;(function _constructor() {
    options = (options || {});

    _$select = (options.element || document.querySelector(options.selector));

    _optionTypeLabelSingular = (_$select.dataset.optionTypeLabelSingular || _$select.dataset.optionTypeLabel || "Option");
    _optionTypeLabelPlural   = (_$select.dataset.optionTypeLabelPlural || (_optionTypeLabelSingular + "s"));
    _placeholderText         = (_$select.dataset.placeholder || ("0 " + _optionTypeLabelPlural + " Selected"));

    _optionElements = _$select.querySelectorAll('option');


    if (options.useSelectAll === true) {
      _useSelectAll = true;

      _$selectAllOption = document.createElement('option');

      _$selectAllOption.innerText = "All";
      _$selectAllOption.classList.add('msd-select-all');
      _$selectAllOption.addEventListener('click', _onClickOption.bind(_$selectAllOption));

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

      $option.addEventListener('click', _onClickOption.bind($option));
      _$selectAllOption.addEventListener('click', _onClickSelectAllOption.bind($option));
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
  }.bind(this))();



  /**
   * TODO: Implement
   *
   * @public
   */
  function destroy() {
    // TODO: Implement
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
}/**
 * TODO: Add description
 *
 * @constructor
 */
function MultiSelectDropdownManager() {
  if (!(this instanceof MultiSelectDropdownManager)) {
    return new MultiSelectDropdownManager();
  }



  /** @private @type {!Object} */ var _elements;



  /** @constructor */
  ;(function _constructor() {
    _elements = {};


    // region Public Functions

    this.init   = init;
    this.reload = reload;

    // endregion
  }.bind(this))();



  /**
   * TODO : Add description
   *
   * @param {HTMLElement|HTMLElement[]|String} [$select] - TODO: Add description
   * @returns {MultiSelectDropdownElement|MultiSelectDropdownElement[]} TODO: Add description
   *
   * @public
   */
  function init($select) {
    if ($select instanceof HTMLElement) {
      return _addSelectElement($select);
    }

    var ret               = [];
    var msdSelectElements = (($select instanceof Array) ? $select.splice() : document.querySelectorAll(($select instanceof String) ? $select : 'select.msd'));

    for (var i = 0; i < msdSelectElements.length; i++) {
      ret.push(_addSelectElement(msdSelectElements[i]));
    }

    return ret;
  }


  /**
   * TODO : Add description
   *
   * @param {HTMLElement|HTMLElement[]|String} [$select] - TODO: Add description
   * @returns {MultiSelectDropdownElement|MultiSelectDropdownElement[]} TODO: Add description
   *
   * @public
   */
  function reload($el) {
    // TODO: Implement
  }


  /**
   * @param {HTMLElement} $select
   * @returns {HTMLElement}
   * @private
   */
  function _addSelectElement($select) {
    var selector = MSDInternalUtils.getElementSelector($select);

    if (!Object.hasOwnProperty(_elements, selector)) {
      _elements[selector] = [];
    }

    var msdElement = new MultiSelectDropdownElement({ element: $select });
    _elements[selector].push(msdElement);

    return msdElement;
  }
}

return {
  MultiSelectDropdownManager: MultiSelectDropdownManager,
  MultiSelectDropdownElement: MultiSelectDropdownElement,
};

}));
