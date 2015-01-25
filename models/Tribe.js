var Tribe = function(name) {
    this.name = name;
    this.isDefaultTribe = false;
    this.players = [];

    this.chief = null;
    this.subchiefs = [];

    this.health = 50;
    this.resources = {
        meat: 0,
        wood: 0,
        stone: 0,
        gold: 0,
        soil: 0
    };

    this.inventory = {
        axe: 0,
        pickaxe: 0,
        bow: 0,
        knife:0
    };

    this.currentCraftingClicks = {
        resources: {},
        items: {}
    };

    this.emitToAll = function(eventName, object) {
        for (var i in this.players) {
            this.players[i].socket.emit(eventName, object);
        }
    };

    this.sendSkills = function(resource) {
        var player,
            nbPlayerClicks,
            nbTotalClicks,
            harvestedValue;

        for (var i in this.players) {
            player = this.players[i];
            if(!player.clicks.hasOwnProperty(resource.name)) {
                continue;
            }

            nbPlayerClicks = player.clicks[resource.name];
            nbTotalClicks = this.currentCraftingClicks[resource.name];
            harvestedValue = Math.round(resource.getHarvestedValue(player, player.tribe));

            resource.updateSkills(player, nbPlayerClicks);
            if (player.totalHarvestedResources.hasOwnProperty(resource.name)) {
                player.totalHarvestedResources[resource.name] += harvestedValue * nbPlayerClicks / nbTotalClicks;
            }

            player.socket.emit('updateSkills', player.skills);
        }
    };

    this.addPlayer = function(currentPlayer) {
        currentPlayer.tribe = this;

        // Add player to the list
        this.players.push(currentPlayer);

        if (this.chief === null) {
            this.chief = currentPlayer;
            currentPlayer.isChief = true;
        }

        currentPlayer.socket.emit('updateResources', currentPlayer.resources);
    };

    this.removePlayer = function(currentPlayer) {
        var player,
            removed,
            shouldDelete;

        // Remove from subchiefs
        this.removeFromSubChiefs(currentPlayer);

        // Remove from player
        for (var i in this.players) {
            player = this.players[i];

            if (player.name === currentPlayer.name) {
                removed = true;
                this.players.splice(i, 1);

                if (this.chief.name === currentPlayer.name) {
                    this.nominateNextChef();
                }
            }
        }

        shouldDelete = this.players.length === 0;

        if (removed) {
            currentPlayer.tribe = null;
            currentPlayer.clicks = {};
        }

        return shouldDelete;
    };

    this.promote = function(player) {
        player.isSubChief = true;
        this.subchiefs.push(player);

        this.chief.socket.emit('becomeSubChief');
    };

    this.deprive = function(player) {
        player.isSubChief = false;
        this.removeFromSubChiefs(player);

        this.chief.socket.emit('leaveSubChiefPosition');
    };

    this.removeFromSubChiefs = function(currentPlayer) {
        var player;

        for (var i in this.subchiefs) {
            player = this.subchiefs[i];

            if (player.name === currentPlayer.name) {
                this.subchiefs.splice(i, 1);
            }
        }
    };

    this.nominateNextChef = function() {
        this.chief.socket.emit('leaveChiefPosition');
        this.chief.isChief = false;
        this.chief = null;

        if (this.subchiefs.length) {
            this.chief = this.subchiefs[0];
            this.chief.socket.emit('becomeChief');

            return;
        }

        if (this.players.length) {
            this.chief = this.players[0];
            this.chief.socket.emit('becomeChief');
        }

        if (this.chief) {
            this.chief.isChief = true;
        }
    };

    this.submitCreation = function(player, item, type) {
        var leaders = this.subchiefs.concat(this.chief);

        for (var i in leaders) {
            leaders[i].socket.emit('validateCrafting', {type: type, playerName: player.name, itemName: item.name, itemLabel: item.label});
        }
    };

    this.getAllCraftingClicks = function() {
        var result = {};

        for (var name in this.currentCraftingClicks.items) {
            result[name] = require('./items/' + name).clicks - this.currentCraftingClicks.items[name];
        }

        for (var name in this.currentCraftingClicks.resources) {
            result[name] = require('./resources/' + name).clicks - this.currentCraftingClicks.resources[name];
        }

        return result;
    };

    this.setHealth = function(health) {
        this.health = health;
        this.emitToAll('updateHealth', health);
    };
};

module.exports = Tribe;
