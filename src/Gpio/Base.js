const MixinLogger = require('../Mixin/Logger');
const EventEmitter = require('events').EventEmitter
class GpioBase extends EventEmitter {

    constructor(gpioPin) {
        super();
        if(['arm', 'arm64'].includes(process.arch)) {
            this.GpioInterface = require('onoff').Gpio;
        } else {
            this.GpioInterface = require('./DummyInterface.js');
            console.log('------------------------------------------------------------------------------------------');
            console.log('GpioBase.js: Unsupported platform for onoff (GPIO): wanted {"os":"any","arch":"arm,arm64"}');
            console.log('------------------------------------------------------------------------------------------');
        }

        this.setGpioPin(gpioPin)
    }

    setGpioPin(pin) {
        this.reset();
        this.gpio = this.createGpioInterface(pin);
    }

    createGpioInterface(pin) {
        return new this.GpioInterface(pin, 'out');
    }

    reset() {}
}

Object.assign(GpioBase.prototype, MixinLogger);

module.exports = GpioBase;