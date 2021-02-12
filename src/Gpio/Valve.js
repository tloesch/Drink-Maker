const GpioBase = require('./Base');

class GpioValve extends GpioBase {

    constructor(gpioPin) {
        super(gpioPin);
        this._isOpened = false;
        this._valveIsConsecutivelyOpened = false;
    }

    createGpioInterface(pin) {
		let gpioInterface = new this.GpioInterface(pin, 'out');
		gpioInterface.writeSync(1);
        return gpioInterface;
    }

    reset() {
        this.close();
        this.timeout && clearTimeout(this.timeout);
    }

    open() {
        this.logMessage('valve opened', 'action');
        this.gpio.writeSync(0);
        this._isOpened = true;
        this.emit('opened');
    }

    close() {
        this.logMessage('valve closed', 'action');
        this.gpio && this.gpio.writeSync(1);
        this._isOpened = false;
        this.emit('closed');
    }

    isOpened() {
        return this._isOpened || this._valveIsConsecutivelyOpened;
    }

    openForSeveralTime(timeInMs = 1000) {
        this.reset();
        this.open();
        this.timeout = setTimeout(this.close.bind(this), timeInMs);
    }

    openConsecutively(numberOfConsecutiveOpenings, intervalBetweenConsecutiveOpeningsInMs = 1500, openingDurationTimeInMs = 1000) {
        this.logMessage('Opening valve for consecutively', 'action');
        this._pumpIsConsecutivelyActivated = true;
        for(let i = 0; i < numberOfConsecutiveOpenings; i++) {
            setTimeout(() => this.activateForSeveralTime(openingDurationTimeInMs), intervalBetweenConsecutiveOpeningsInMs * (i + 1));
        }
        setTimeout(() => {
            this._valveIsConsecutivelyOpened = false;
        }, (intervalBetweenConsecutiveOpeningsInMs * numberOfConsecutiveOpenings));
    }

}


module.exports = GpioValve;
