/* globals MSDInternalUtils */
/* exported MSDObservableArray */



/**
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
MSDObservableArray.prototype.constructor = MSDObservableArray;
