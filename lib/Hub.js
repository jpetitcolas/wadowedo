var Tribe = require('../models/Tribe.js');

module.exports = function() {

    var defaultTribe = new Tribe('Styx');
    defaultTribe.isDefaultTribe = true;

    var hub = {
        players: {},
        tribes: { 'Styx': defaultTribe },
        messages: []
    };

    hub.register = function(player) {
        hub.players[player.name] = player;
        defaultTribe.addPlayer(player);
    };

    hub.sendInitialData = function(player) {
        var tribeName = player.tribe ? player.tribe.name : null;

        player.socket.emit('updateResources', player.resources);
        player.socket.emit('updateSkills', player.skills);
        player.socket.emit('updateInventory', player.inventory);
        player.socket.emit('updateTribe', {tribeName: tribeName, isChief: player.isChief, isSubChief: player.isSubChief});
        player.socket.emit('tribeList', hub.getTribesWithPlayerNames());

        if (hub.messages.length) {
            player.socket.emit('chat:message', hub.messages.slice(-5))
        }
    };

    hub.addEventListeners = function(player) {
        // Handle prime materials
        player.socket.on('harvest', function(resourceName){
            player.gather(require('../models/resources/' + resourceName));
        });

        player.socket.on('crafting', function(objectName) {
            player.craft(require('../models/items/' + objectName));
        });

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

        player.socket.on('promoteMember', function(data) {
            hub.promoteMember(player, data.tribeName, data.playerName);
        });

        player.socket.on('depriveMember', function(data) {
            hub.depriveMember(player, data.tribeName, data.playerName);
        });
    };

    hub.getPlayerByLogin = function(login) {
        if (!hub.players.hasOwnProperty(login)) {
            return null;
        }

        return hub.players[login];
    };

    hub.createTribe = function(tribeName, player) {
        if (tribeName in hub.tribes) {
            return player.socket.emit('createTribeResult', {message: 'Cette tribu existe déjà', status:'error'});
        }

        hub.removePlayerFromTribe(player);

        hub.tribes[tribeName] = new Tribe(tribeName);
        hub.tribes[tribeName].addPlayer(player);

        player.socket.emit('becomeChief');
        player.socket.emit('createTribeResult', {message: 'Vous êtes maintenant dans la tribu: ' + tribeName, status:'success'});
        hub.broadcast('tribeList', hub.getTribesWithPlayerNames());
    };

    hub.joinTribe = function(tribeName, player) {
        hub.removePlayerFromTribe(player);

        hub.tribes[tribeName].addPlayer(player);
        hub.tribes[tribeName].emitToAll('tribeList', hub.getTribesWithPlayerNames());

        player.socket.emit('joinTribeResult', tribeName);
        hub.broadcast('tribeList', hub.getTribesWithPlayerNames());
    };

    hub.promoteMember = function(player, tribeName, playerName) {
        if(!player.isChief && !player.isSubChief) {
            return;
        }

        hub.tribes[tribeName].promote(hub.players[playerName]);
        hub.broadcast('tribeList', hub.getTribesWithPlayerNames());
    };

    hub.depriveMember = function(player, tribeName, playerName) {
        if(!player.isChief && !player.isSubChief) {
            return;
        }

        hub.tribes[tribeName].deprive(hub.players[playerName]);
        hub.broadcast('tribeList', hub.getTribesWithPlayerNames());
    };

    hub.removePlayerFromTribe = function(currentPlayer) {
        var shouldDelete;

        // Find the player in all tribes
        for (var tribeName in hub.tribes) {
            shouldDelete = hub.tribes[tribeName].removePlayer(currentPlayer);

            if (shouldDelete && !hub.tribes[tribeName].isDefaultTribe) {
                delete hub.tribes[tribeName];
                hub.broadcast('tribeList', hub.getTribesWithPlayerNames());
            }
        }
    };

    hub.unregister = function(player) {
        hub.removePlayerFromTribe(player);

        delete hub.players[player.name];
    };

    hub.message = function(player, message) {
        var payload = {
            time: new Date().toISOString(),
            name: player.name,
            message: message
        };

        hub.messages.push(payload);
        hub.broadcast('chat:message', [payload]);
    };

    hub.broadcast = function(eventName, data) {
        for(var playerName in hub.players) {
            hub.players[playerName].socket.emit(eventName, data);
        }
    };

    hub.getTribesWithPlayerNames = function() {
        var player,
            result = {};

        for (var tribeName in hub.tribes) {
            result[tribeName] = [];
            for (var i in hub.tribes[tribeName].players) {
                player = hub.tribes[tribeName].players[i];

                result[tribeName].push({
                    name: player.name,
                    isChief: player.isChief,
                    isSubChief: player.isSubChief
                });
            }
        }

        return result;
    };

    return hub;
};
