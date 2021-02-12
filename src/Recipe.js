const EventEmitter = require('events').EventEmitter
class Recipe extends EventEmitter {

    constructor(name, ingredients = []) {
        super();
        this.Name = name;
        this.Ingredients = ingredients;
    }

    addIngredient(name, amount) {
        this.Ingredients.push({name, amount});
    }

}


module.exports = Recipe;
