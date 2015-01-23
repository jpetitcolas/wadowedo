var Player = function(socket) {
    this.name = "Anonymous";
    this.socket = socket;

    this.health = 50;

    this.resources = {
        food: 50,
        wood: 0,
        stone: 0,
        gold: 0,
        soil: 0
    };

    this.skills = {
        picking: 5
    };

    this.inventory = {
        axe: 0,
        pickaxe: 0,
        longbow: 0,
        knife:0
    };

    var self = this;

    socket.on('harvest', function(resourceName){
        self.gather(require('./resources/' + resourceName));
    });
};

Player.prototype.gather = function(resource) {
    var me = this,
        time = resource.getHarvestingTime(me);

    me.socket.emit('gatheringTime', time);

    setTimeout(function() {
        me.resources[resource.name] += resource.getHarvestedValue(me);

        me.socket.emit('gathering', {name: resource.name, value: me.resources[resource.name]});
    }, time);
};

module.exports = Player;
