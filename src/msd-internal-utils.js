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
  },


  /**
   * Implentation taken from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
   *
   * @param  {String} str
   * @return {Number}
   * @private
   */
  getHashCode: function(str) {
    var chr;
    var hash = 0;

    str = String(str);

    if (str.length === 0) {
      return hash;
    }

    for (var i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = (((hash << 5) - hash) + chr);
      hash |= 0; // Convert to 32bit integer
    }

    return hash;
  }
};


Object.freeze(MSDInternalUtils);
