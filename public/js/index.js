function createRecipeRow(name) {
    const target = document.getElementById('recipes');
    const template = `<div class="row recipe-row">
                            <div onclick="brewRecipe('${name}')" class="col text-center">
                                <h3>${name}</h3>
                            </div>
                        </div>`;
    target.innerHTML += template;
}

function brewRecipe(name) {
    fetch('/drinkmaker/recipe/brew', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
            })
        });
}

fetch('/drinkmaker/recipes', { method: 'get' })
    .then(response => response.json())
    .then(recipes => {
        recipes.forEach((recipe) => createRecipeRow(recipe.name));
    });