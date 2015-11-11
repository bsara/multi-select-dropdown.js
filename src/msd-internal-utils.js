/* exported MSDInternalUtils */


/** @private */
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


Object.freeze(MSDInternalUtils);
