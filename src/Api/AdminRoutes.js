const Routes = require("./Routes");

class AdminRoutes extends Routes {

    initRoutes() {
        super.initRoutes();
        const { drinkMaker } = this;
        this.registerPost('save', (req, res) => {
            drinkMaker.save();
            return res.send(true);
        });

        this.registerPost('valve/associate', (req, res) => {
            drinkMaker.createAndAssociateValveToSlot(res.body.pin, res.body.slot);
            return res.send(true);
        });

        this.registerPost('drink/associate', (req, res) => {
            drinkMaker.associateDrinkNameToSlot(res.body.drinkName, res.body.slot);
            return res.send(true);
        });

        this.registerPost('recipe/create', (req, res) => {
            drinkMaker.createRecipe(res.body.name, res.body.ingredients);
            return res.send(true);
        });

        this.registerGet('configuration', (req, res) => {
            return res.send(drinkMaker.getExportableObject());
        });

        this.registerPost('configuration', (req, res) => {
            drinkMaker.clear();
            drinkMaker.import(req.body);
            drinkMaker.save();
            return res.send(drinkMaker.getExportableObject());
        });
    }

}


module.exports = AdminRoutes;
