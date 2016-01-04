/* globals MSDInternalUtils */
/* exported MSDObservableArray */



/**
 * TODO: Add description
 *
 * @inherits {Array}
 * @constructor
 */
function MSDObservableArray() {
  var ctorArgs = arguments;

  if (!(this instanceof MSDObservableArray)) {
    return new MSDObservableArray.apply(this, ctorArgs);
  }



  /** @private @type {!Object} */ var _events;



  /** @constructs MSDObservableArray */
  ;(function() {
    Array.apply(this, ctorArgs);


    _events = {};


    this.attachEvent = attachEvent;
    this.detachEvent = detachEvent;

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
  function attachEvent(eventName, eventHandler, eventHandlerContext) {
    eventHandlerContext = (eventHandlerContext || this);


    var handlers = _events[eventName];

    if (handlers == null) {
      handlers = _events[eventName] = {};
    }


    var contexts = handlers[eventHandler];

    if (contexts == null) {
      contexts = handlers[eventHandler] = [];
    }


    var contextIndex = contexts.indexOf(eventHandlerContext);

    if (~contextIndex) {
      return;
    }

    contexts.push(eventHandlerContext);
  }


  /**
   * TODO: Add description
   *
   * @param {!String}   eventName             - Name of event from which given `eventHandler` will be detached.
   * @param {!Function} [eventHandler]        - The handler function attached to the event represented by the given 'eventName'.
   * @param {Object}    [eventHandlerContext] - The context used when calling `eventHandler` (defaults to this object).
   */
  function detachEvent(eventName, eventHandler, eventHandlerContext) {
    if (!(eventName in _events)) {
      return;
    }


    var handlers = _events[eventName];
    if (eventHandler == null) {
      delete _events[eventName];
      return;
    }


    var contexts = handlers[eventHandler];
    if (eventHandlerContext == null) {
      delete handlers[eventHandler];
      return;
    }


    var contextIndex = contexts.indexOf(eventHandlerContext);
    if (~contextIndex) {
      contexts.splice(contextIndex, 1);
    }


    if (contexts.length === 0) {
      delete handlers[eventHandler];
    }
    if (Object.keys(handlers).length === 0) {
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

    _triggerEvent('add', _getEventArgs(arguments));
    _triggerEvent('update', _getEventArgs(arguments));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#remove
   * @fires MSDObservableArray#update
   */
  function pop() {
    var ret = Array.prototype.pop.apply(this, arguments);

    _triggerEvent('remove', _getEventArgs(ret));
    _triggerEvent('update', _getEventArgs(ret));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#sort
   * @fires MSDObservableArray#update
   */
  function reverse() {
    var ret = Array.prototype.reverse.apply(this, arguments);

    _triggerEvent('sort', _getEventArgs());
    _triggerEvent('update', _getEventArgs());

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

    _triggerEvent('remove', _getEventArgs(removed));
    _triggerEvent('update', _getEventArgs(removed));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#sort
   * @fires MSDObservableArray#update
   */
  function sort() {
    var ret = Array.prototype.sort.apply(this, arguments);

    _triggerEvent('sort', _getEventArgs(ret));
    _triggerEvent('update', _getEventArgs(ret));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#remove
   * @fires MSDObservableArray#update
   */
  function splice() {
    var ret = Array.prototype.splice.apply(this, arguments);

    _triggerEvent('remove', _getEventArgs(ret));
    _triggerEvent('update', _getEventArgs(ret));

    return ret;
  }


  /**
   * @inheritDoc
   * @fires MSDObservableArray#add
   * @fires MSDObservableArray#update
   */
  function unshift() {
    var ret = Array.prototype.unshift.apply(this, arguments);

    _triggerEvent('remove', _getEventArgs(arguments));
    _triggerEvent('update', _getEventArgs(arguments));

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


      var handlers = _events[eventName];

      for (var handler in Object.keys(handlers)) {
        var contexts = handlers[handler];

        for (var i = 0; i < contexts.length; i++) {
          handler.apply(contexts[i], args);
        }
      }
    }, 0);
  }

  // endregion
}



MSDObservableArray.prototype             = Object.create(Array.prototype);
MSDObservableArray.prototype.constructor = MSDObservableArray;
