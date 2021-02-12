const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Config = require('./src/Helper/Config');
const DrinkMaker = require('./src/DrinkMaker');
const JsonGateway = require('./src/DataStorage/JsonGateway');
const AdminRoutes = require('./src/Api/AdminRoutes');
const config = new Config();

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => console.log('user disconnected'));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));

const jsonGateway = new JsonGateway('dataStorage.json');
const drinkMaker = new DrinkMaker(jsonGateway);
drinkMaker.load().then(() => {
    new AdminRoutes(app, drinkMaker);

});

http.listen(config.PORT, () => {
    console.log('listening on *:' + config.PORT);
});