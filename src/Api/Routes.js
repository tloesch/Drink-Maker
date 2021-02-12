class Routes {

    constructor(app, drinkMaker) {
        this.app = app;
        this.drinkMaker = drinkMaker;
        this.routePrefix = '/drinkmaker';
        this.initRoutes();
    }

    initRoutes() {
        const { drinkMaker } = this;
        this.registerGet('recipes', (req, res) => {
            return res.send(drinkMaker.getRecipes());
        });

        this.registerPost('recipe/brew', (req, res) => {
            drinkMaker.brewRecipeByName(req.body.name);
            return res.send(true);
        });
    }

    registerPost(route, fn) {
        this.app.post(`${this.routePrefix}/${route}`, fn);
    }

    registerGet(route, fn) {
        this.app.get(`${this.routePrefix}/${route}`, fn);
    }

}


module.exports = Routes;
