const GpioValve = require("./Gpio/Valve");
const EventEmitter = require('events').EventEmitter
class ValveManager extends EventEmitter {

    constructor() {
        super();
        this.valveMap = new Map();
    }

    register(valve, name = null) {
        const valveName = name || this.valveMap.size + 1;
        this.valveMap.set(valveName, valve);
        valve.on('opened', () => { this.emit('opened', valveName, valve)});
        valve.on('closed', () => { this.emit('closed', valveName, valve)});
        return valveName;
    }

    getAvailableValveNames() {
        return this.valveMap.keys();
    }

    _callValveFunctionOnCollection(functionReference, extraArgs, ...valveNames) {
        for(const name of valveNames) {
            if(this.valveMap.has(name)) {
                const valve = this.valveMap.get(name);
                functionReference.call(valve, ...extraArgs);
            }
        }
    }

    openValves(...valveNames) {
        this._callValveFunctionOnCollection(GpioValve.prototype.open, [], ...valveNames);
    }

    closeValves(...valveNames) {
        this._callValveFunctionOnCollection(GpioValve.prototype.close, [], ...valveNames);
    }

    openForSeveralTime(timeInMs, ...valveNames) {
        this._callValveFunctionOnCollection(GpioValve.prototype.openForSeveralTime, [ timeInMs ], ...valveNames);
    }

}


module.exports = ValveManager;
