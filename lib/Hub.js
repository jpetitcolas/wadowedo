module.exports = function() {
    var hub = {
        players: [],
        debug: true
    };

    hub.register = function(player) {
        console.log('New connection: ' + player.id);
        this.players.push(player);
    };

    hub.unregister = function(player) {
        console.log('Closing connection : ' + player.id);
        this.players.splice(this.players.indexOf(player), 1);
    };

    hub.broadcast = function(message) {
        this.players.forEach(function(player) {
            player.emit('message', { message: message });
        });
    };

    return hub;
};