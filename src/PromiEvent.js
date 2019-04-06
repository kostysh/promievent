/**
 * @file PromiEvent.js
 * @author Kostiantyn Smyrnov <kostysh@gmail.com>
 * @date 2019
 */
import EventEmitter from 'eventemitter3';

/**
 * PromiEvent class that acts seamlessly as native Promise but with events
 * @class PromiEvent 
 */
export default class PromiEvent {
    /**
     * @constructor
     */
    constructor(executor) {
        this.eventEmitter = new EventEmitter();
        this.promise = new Promise((resolve, reject) => {
            this.resolve = (...args) => {
                this.eventEmitter.removeAllListeners();
                resolve.apply(this, args);
            };
            this.reject = (...args) => {
                this.eventEmitter.removeAllListeners();
                reject.apply(this, args);
            };
        });

        const proxy = new Proxy(this, {
            get: (target, name) => {

                if (this.eventEmitter[name] && 
                    typeof this.eventEmitter[name] === 'function') {

                    return function (...args) {
                        this.eventEmitter[name].apply(this.eventEmitter, args);
                        return proxy;
                    }.bind(proxy);
                }

                if (this.promise[name] && 
                    typeof this.promise[name] === 'function') {

                    return function (...args) {
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