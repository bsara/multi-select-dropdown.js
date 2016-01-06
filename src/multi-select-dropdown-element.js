/* globals MSDObservableArray */
/* exported MultiSelectDropdownElement */


/**
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

  /** @private @type {!Object}      */ var _optionElementsOnClickHandlers;

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

    _optionElementsOnClickHandlers = {
      optionElements: [],
      eventHandlers:  []
    };

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

    _setupOption($newOption);
  }


  /**
   * TODO: Implement
   *
   * @param {String|Number|Date|HTMLElement} optionValue
   * @param {Boolean}                        [waitToUpdatePlaceholder = false]
   *
   * @returns {Boolean} `true` if the option was removed successfully or
   *                    if it was not found; otherwise, returns `false`.
   */
  function removeOption(optionValue, waitToUpdatePlaceholder) {
    var selectionQuery  = _getOptionSelectionQuery((optionValue instanceof HTMLElement) ? optionValue.value : optionValue);
    var $optionToRemove = _$select.querySelector(selectionQuery);

    if ($optionToRemove != null) {
      _cleanupOptionForRemoval($optionToRemove);

      $optionToRemove.parentNode.removeChild($optionToRemove);

      var wasSuccessful = (_$select.querySelector(selectionQuery) == null);

      if (wasSuccessful) {
        _optionElements.splice(_optionElements.indexOf($optionToRemove), 1);

        if (waitToUpdatePlaceholder !== true && $optionToRemove.getAttribute('checked') != null) {
          _updateSelectedPlaceholderOptionInnerText();
        }
      }

      return wasSuccessful;
    }

    return true;
  }


  /**
   * TODO: Add description
   */
  function clearOptions() {
    var _this = this;

    _optionElements.slice(0, _optionElements.length).forEach(function($option) {
      _this.removeOption($option, true);
    });

    _updateSelectedPlaceholderOptionInnerText();
  }


  /**
   * TODO: Add description
   */
  function destroy() {
    this.clearOptions();
    // TODO: Finish Implementing
  }



  // region Private Functions

  /** @private */
  function _setupOption($option) {
    var eventHandler = _onClickOption.bind($option);

    $option.addEventListener('click', eventHandler);

    _optionElementsOnClickHandlers.optionElements.push($option);
    _optionElementsOnClickHandlers.eventHandlers.push(eventHandler);
  }


  /** @private */
  function _cleanupOptionForRemoval($option) {
    var eventHandler = _optionElementsOnClickHandlers.eventHandlers[_optionElementsOnClickHandlers.optionElements.indexOf($option)];
    $option.removeEventListener('click', eventHandler);
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
