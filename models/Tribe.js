var Tribe = function(name) {
    this.name = name;

    this.players = [];

    this.chief = null;
    this.subchiefs = [];

    this.resources = {
        food: 50,
        wood: 0,
        stone: 0,
        gold: 0,
        soil: 0
    };

    this.emitToAll = function(eventName, object) {
        for (var i in this.players) {
            this.players[i].socket.emit(eventName, object);
        }
    };

    this.addPlayer = function(currentPlayer) {
        // Transfer all player resources to the Tribe
        for(var i in currentPlayer.resources) {
            if (this.resources.hasOwnProperty(i)) {
                this.resources[i] += currentPlayer.resources[i];
            }
        }

        // Update player resource with tribe resource
        this.transferResourcesToPlayer(currentPlayer);

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
        for (var i in this.subchiefs) {
            player = this.subchiefs[i];

            if (player.name === currentPlayer.name) {
                this.subchiefs.splice(i, 1);
            }
        }

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

        // Player leaves, but other player are in the tribe: remove all resource for this player
        if (removed && !shouldDelete) {
            currentPlayer.clearResources();

            currentPlayer.socket.emit('updateResources', currentPlayer.resources);
        }

        return shouldDelete;
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

    this.transferResourcesToPlayer = function(currentPlayer) {
        for(var i in this.resources) {
            if (currentPlayer.resources.hasOwnProperty(i)) {
                currentPlayer.resources[i] = this.resources[i];
            }
        }
    }
};

module.exports = Tribe;
