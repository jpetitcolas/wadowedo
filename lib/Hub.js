var Tribe = require('../models/Tribe.js');

module.exports = function() {
    var hub = {
        players: {},
        tribes: {},
        messages: []
    };

    hub.register = function(player) {
        this.players[player.name] = player;

        if (hub.messages.length) {
            player.socket.emit('chat:message', hub.messages.slice(-5))
        }

        // Handle tribe events
        player.socket.on('retrieveTribes', function() {
            player.socket.emit('tribeList', hub.getTribesWithPlayerNames());
        });

        player.socket.on('createTribe', function(name) {
            hub.createTribe(name, player);
        });

        player.socket.on('joinTribe', function(name) {
            hub.joinTribe(name, player);
        });

        player.socket.on('leaveTribe', function(name) {
            hub.leaveTribe(name, player);
        });
    };

    hub.createTribe = function(tribeName, player) {
        if (tribeName in hub.tribes) {
            return player.socket.emit('createTribeResult', {message: 'Cette tribue exists déjà', status:'error'});
        }

        this.removePlayerFromTribe(player);

        this.tribes[tribeName] = new Tribe();
        this.tribes[tribeName].players.push(player);
        this.tribes[tribeName].chief = player;

        player.socket.emit('createTribeResult', {message: 'Vous êtes maintenant dans la tribue: ' + tribeName, status:'success'});
    };

    hub.joinTribe = function(tribeName, player) {
        this.removePlayerFromTribe(player);

        this.tribes[tribeName].players.push(player);

        player.socket.emit('joinTribeResult', tribeName);
    };

    hub.leaveTribe = function(tribeName, player) {
        this.removePlayerFromTribe(player);

        player.socket.emit('leaveTribeResult', tribeName);
    };

    hub.removePlayerFromTribe = function(currentPlayer) {
        var player;

        // Find the player in all tribes
        for (var tribeName in this.tribes) {
            for (var i in this.tribes[tribeName].players) {
                player = this.tribes[tribeName].players[i];

                if (player.name === currentPlayer.name) {
                    this.tribes[tribeName].players.splice(i, 1);
                }
            }
        }
    };

    hub.unregister = function(player) {
        this.removePlayerFromTribe(player);

        delete this.players[player.name];
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

    hub.getTribesWithPlayerNames = function() {
        var player,
            result = {};

        for (var tribeName in this.tribes) {
            result[tribeName] = [];
            for (var i in this.tribes[tribeName].players) {
                player = this.tribes[tribeName].players[i];

                result[tribeName].push(player.name);
            }
        }

        return result;
    };

    return hub;
};
