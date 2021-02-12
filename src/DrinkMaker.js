const EventEmitter = require('events').EventEmitter;
const ValveManager = require('./ValveManager');
const Recipe = require('./Recipe');
const GpioValve = require("./Gpio/Valve");

class DrinkMaker extends EventEmitter {

    constructor(gateway) {
        super();
        this.gateway = gateway;
        this.clear();
    }

    clear() {
        this.slotPinAssociation = new Map();
        this.drinkNameSlotAssociation = new Map();
        this.recipes = new Map();
        this.initValveManager();
    }

    initValveManager() {
        this.valveManager = new ValveManager();
        this.valveManager.on('opened', (...args) => { this.emit('opened', ...args) });
        this.valveManager.on('closed', (...args) => { this.emit('closed', ...args) });
    }

    brewRecipeByName(recipeName) {
        const recipe = this.recipes.get(recipeName);
        this.brewRecipe(recipe);
    }

    brewRecipe(recipe) {
        for (const ingredient of recipe.Ingredients) {
            const valveSlot = this.drinkNameSlotAssociation.get(ingredient.name);
            this.valveManager.openForSeveralTime(ingredient.amount, valveSlot);
            console.log(`opening valve ${valveSlot} for ${ingredient.amount / 1000} seconds for ${ingredient.name}`);
        }
    }

    createAndAssociateValveToSlot(gpioPin, slot = null) {
        const registeredToSlot = this.valveManager.register(new GpioValve(gpioPin), slot);
        this.slotPinAssociation.set(registeredToSlot, gpioPin);
    }

    associateDrinkNameToSlot(name, slot) {
        this.drinkNameSlotAssociation.set(name, slot);
    }

    createRecipe(name, ingredients) {
        const recipe = new Recipe(name);
        for (const ingredient of ingredients) {
            recipe.addIngredient(ingredient.name, ingredient.amount);
        }
        this.recipes.set(recipe.Name, recipe);
    }

    getDrinkNameToSlotAssociations() {
        return this._getMapAsObject(this.drinkNameSlotAssociation);
    }

    getSlotToPinAssociations() {
        return this._getMapAsObject(this.slotPinAssociation);
    }

    getRecipes() {
        return [ ...this.recipes.values() ].map((recipe) => {
            return {
                name: recipe.Name,
                ingredients: recipe.Ingredients,
            }
        });
    }

    _getMapAsObject(map) {
        const associations = {};
        for (const [key, value] of map) {
            associations[key] = value;
        }
        return associations;
    }

    getExportableObject() {
        return {
            drinkNameToSlotAssociations: this.getDrinkNameToSlotAssociations(),
            slotToPinAssociations: this.getSlotToPinAssociations(),
            recipes: this.getRecipes(),
        }
    }

    import(exportableObject) {
        exportableObject.drinkNameToSlotAssociations && this.importDrinkNameToSlotAssociations(exportableObject.drinkNameToSlotAssociations);
        exportableObject.slotToPinAssociations && this.importSlotToPinAssociations(exportableObject.slotToPinAssociations);
        exportableObject.recipes && this.importRecipes(exportableObject.recipes);
    }

    importDrinkNameToSlotAssociations(drinkNameToSlotAssociations) {
        for(const drinkName in drinkNameToSlotAssociations) {
            const slot = drinkNameToSlotAssociations[drinkName];
            this.associateDrinkNameToSlot(drinkName, slot)
        }
    }

    importSlotToPinAssociations(slotToPinAssociations) {
        for(const slot in slotToPinAssociations) {
            const pin = slotToPinAssociations[slot];
            this.createAndAssociateValveToSlot(pin, slot);
        }
    }

    importRecipes(recipes) {
        for(const recipe of recipes) {
            this.createRecipe(recipe.name, recipe.ingredients);
        }
    }

    async load() {
        const data = await this.gateway.load();
        this.import(data);
    }

    save() {
        this.gateway.save(this.getExportableObject());
    }
}


module.exports = DrinkMaker;
