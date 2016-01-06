/* globals MultiSelectDropdownElement, MSDInternalUtils */
/* exported MultiSelectDropdownManager */


/**
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


    this.init   = init;
    this.reload = reload;
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



  // region Private Functions

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

  // endregion
}
