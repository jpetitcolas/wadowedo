var koa = require('koa');
var koaStatic = require('koa-static'),
    port = process.env.NODE_PORT || 3000;

var app = module.exports = koa(),
    Player = require('./models/Player.js');

app.use(koaStatic(__dirname + '/public'));

// error catching
app.use(function *(next) {
    try {
        yield next;
    } catch (err) {
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);

        if (!err.status) {
            console.error(err);
        }
    }
})

var eventEngine = require('./lib/EventEngine')();
var hub = require('./lib/Hub')(eventEngine);
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    var login = socket.handshake.query.login;

    var player = hub.getPlayerByLogin(login);
    if (player) {
        player.socket = socket;
    } else {
        player = new Player(login, socket);
        hub.register(player);
    }

    hub.sendInitialData(player);
    hub.addEventListeners(player);

    socket.on('chat:message', function(message) {
        hub.message(player, message);
    });
});

server.listen(port);

console.info('server listening on port ' + port);
console.info('Press CTRL+C to stop server');
