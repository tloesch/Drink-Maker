const AbstractGateway = require("./AbstractGateway");
const FileSystem = require('fs');
class JsonGateway extends AbstractGateway {

    constructor(filePath) {
        super();
        this.filePath = filePath;
    }

    async load() {
        let content = '{}';
        if(await FileSystem.existsSync(this.filePath)) {
            content = await FileSystem.readFileSync(this.filePath);
        }
        return JSON.parse(content);
    }

    async save(dataToSave) {
        return FileSystem.writeFileSync(this.filePath, JSON.stringify(dataToSave));
    }

}


module.exports = JsonGateway;
