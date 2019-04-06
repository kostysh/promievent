"use strict";

require("core-js/modules/es.promise");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventemitter = _interopRequireDefault(require("eventemitter3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @file PromiEvent.js
 * @author Kostiantyn Smyrnov <kostysh@gmail.com>
 * @date 2019
 */

/**
 * PromiEvent class that acts seamlessly as native Promise but with events
 * @class PromiEvent 
 */
class PromiEvent {
  /**
   * @constructor
   */
  constructor(executor) {
    var _this = this;

    this.eventEmitter = new _eventemitter.default();
    this.promise = new Promise((resolve, reject) => {
      this.resolve = function () {
        _this.eventEmitter.removeAllListeners();

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        resolve.apply(_this, args);
      };

      this.reject = function () {
        _this.eventEmitter.removeAllListeners();

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        reject.apply(_this, args);
      };
    });
    const proxy = new Proxy(this, {
      get: (target, name) => {
        if (this.eventEmitter[name] && typeof this.eventEmitter[name] === 'function') {
          return function () {
            for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }

            this.eventEmitter[name].apply(this.eventEmitter, args);
            return proxy;
          }.bind(proxy);
        }

        if (this.promise[name] && typeof this.promise[name] === 'function') {
          return function () {
            for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
              args[_key4] = arguments[_key4];
            }

            this.promise[name].apply(this.promise, args);
            return proxy;
          }.bind(proxy);
        }

        return target[name];
      }
    });
    setTimeout(() => {
      try {
        executor(proxy.resolve, proxy.reject, proxy.eventEmitter);
      } catch (err) {
        proxy.reject(err);
      }
    });
    return proxy;
  }

}

exports.default = PromiEvent;