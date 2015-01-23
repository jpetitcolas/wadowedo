module.exports = function() {
    var hub = {
        players: [],
        messages: []
    };

    hub.register = function(player) {
        this.players.push(player);

        if (hub.messages.length) {
            player.socket.emit('chat:message', hub.messages.slice(-5))
        }
    };

    hub.unregister = function(player) {
        this.players.splice(this.players.indexOf(player), 1);
    };

    hub.message = function(player, message) {
        var payload = {
            time: new Date().toISOString(),
            name: player.name,
            message: message
        };

        hub.messages.push(payload);
        hub.broadcast(payload);
    };

    hub.broadcast = function(message) {
        this.players.forEach(function(player) {
            player.socket.emit('chat:message', [message]);
        });
    };

    return hub;
};