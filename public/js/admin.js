



const addSlotToPinRowButton = document.getElementById('addSlotToPinRow');
const addDrinkNameToSlotRowButton = document.getElementById('addDrinkNameToSlotRow');
const addRecipeRowButton = document.getElementById('addRecipeRow');

const slotToPinAssociationsContainer = document.getElementById('slotToPinAssociations');
const drinkNameToSlotAssociationsContainer = document.getElementById('drinkNameToSlotAssociations');
const recipesContainer = document.getElementById('recipes');

addSlotToPinRowButton.addEventListener('click', () =>
    createRowIn(slotToPinAssociationsContainer, 'Slot', 'Pin'));

addDrinkNameToSlotRowButton.addEventListener('click', () =>
    createRowIn(drinkNameToSlotAssociationsContainer, 'Drinkname', 'Pin'));

addRecipeRowButton.addEventListener('click', () =>
    createRecipeRowIn(recipesContainer));

function createRowIn(target, placeholderA, placeholderB, valueA = '', valueB = '') {
    const template = `<div class="row">
                            <div class="col-5 text-center">
                                <input type="text" class="form-control" placeholder="${placeholderA}" value="${valueA}">
                            </div>
                            <div class="col-5 text-center">
                                <input type="text" class="form-control" placeholder="${placeholderB}" value="${valueB}">
                            </div>
                            <div class="col-2 text-center">
                                <button type="button" class="btn btn-danger" style="width: 100%;" onclick="removeRow(this)">-</button>
                            </div>
                        </div>`;
    const templateDom = document.createElement('div');
    templateDom.innerHTML = template;
    target.append(templateDom);
}

function removeRow(btn) {
    btn.closest('div[class="row"]').remove();
}

function createRecipeRowIn(target, name = "", ingredients = []) {
    const template = `<div class="row recipe-row" style="border: solid">
                        <div class="col text-center">
                            <input type="text" class="form-control" placeholder="Name" value="${name}">
                            <h3>
                                <button type="button"  class="btn btn-success" onclick="createIngredientsRowIn(this.closest(\`div[class='row recipe-row']\`).querySelector(\`div[class='ingredients']\`))" >+</button>
                                Ingredients
                            </h3>
                            <div class="ingredients">
                            </div>
                        </div>
                        <div class="col-2 text-center">
                            <button type="button" class="btn btn-danger" style="width: 100%;" onclick="this.closest(\`div[class='row recipe-row']\`).remove()">-</button>
                        </div>
                </div>`;
    const templateDom = document.createElement('div');
    templateDom.innerHTML = template;

    const ingredientsTarget = templateDom.querySelector(`div[class='ingredients']`);
    for (const ingredient of ingredients) {
        createIngredientsRowIn(ingredientsTarget, ingredient.name, ingredient.amount);
    }
    target.append(templateDom);
}

function createIngredientsRowIn(target, name = "", amount = "") {
    const template = `<div class="row">
                            <div class="col-5 text-center">
                                <input type="text" class="form-control" placeholder="Name" value="${name}">
                            </div>
                            <div class="col-5 text-center">
                                <input type="text" class="form-control" placeholder="Amount" value="${amount}">
                            </div>
                            <div class="col-2 text-center">
                                <button type="button" class="btn btn-danger" style="width: 100%;" onclick="removeRow(this)">-</button>
                            </div>
                        </div>`;
    const templateDom = document.createElement('div');
    templateDom.innerHTML = template;
    target.append(templateDom);
}

function getKeyValuePairFromTwoColumnedForm(form) {
    const inputs = form.getElementsByTagName('input');
    const keyValuePairs = {};
    for(let i = 0; i < inputs.length;) {
        const key = inputs[i].value;
        const value = inputs[i + 1].value;
        if(key === "" || value === "") {
            i += 2;
            continue;
        }
        keyValuePairs[key] = value;
        i += 2;

    }
    return keyValuePairs;
}

function getRecipes() {
    const recipeRows = recipesContainer.getElementsByClassName('recipe-row');
    const recipes = [];
    for(const row of recipeRows) {
        const name = row.getElementsByTagName('input')[0].value;
        const ingredientsTarget = row.querySelector(`div[class='ingredients']`);
        const ingredientsAsKeyValue = getKeyValuePairFromTwoColumnedForm(ingredientsTarget);
        const ingredients = Object.keys(ingredientsAsKeyValue).map((key) => {
            return {name: key, amount: ingredientsAsKeyValue[key]};
        });
        recipes.push({name, ingredients});

    }
    return recipes;
}

function save() {
    const config = {
        slotToPinAssociations: getKeyValuePairFromTwoColumnedForm(slotToPinAssociationsContainer),
        drinkNameToSlotAssociations: getKeyValuePairFromTwoColumnedForm(drinkNameToSlotAssociationsContainer),
        recipes: getRecipes()
    }
    fetch('/drinkmaker/configuration', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    }).then(response => window.location.reload());
}

fetch('/drinkmaker/configuration', { method: 'get' })
    .then(response => response.json())
    .then(data => {
        const { slotToPinAssociations, drinkNameToSlotAssociations, recipes} = data;
        for(const key in slotToPinAssociations) {
            createRowIn(slotToPinAssociationsContainer, 'Slot', 'Pin', key, slotToPinAssociations[key]);
        }
        for(const key in drinkNameToSlotAssociations) {
            createRowIn(drinkNameToSlotAssociationsContainer, 'Drinkname', 'Pin', key, drinkNameToSlotAssociations[key]);
        }
        for(const recipe of recipes) {
            createRecipeRowIn(recipesContainer, recipe.name, recipe.ingredients);
        }
    });
