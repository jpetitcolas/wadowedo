module.exports = function() {
    var hub = {
        players: [],
        messages: []
    };

    hub.register = function(player) {
        this.players.push(player);
    };

    hub.unregister = function(player) {
        this.players.splice(this.players.indexOf(player), 1);
    };

    hub.message = function(message) {
        hub.messages.push(message);
        hub.broadcast(message);
    };

    hub.broadcast = function(message) {
        this.players.forEach(function(player) {
            player.emit('message', { message: message });
        });
    };

    return hub;
};