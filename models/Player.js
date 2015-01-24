var Player = function(name, socket) {
    this.name = name;
    this.socket = socket;

    this.health = 50;
    this.isChief = false;
    this.isSubChief = false;

    this.totalHarvestedResources = {
        wood: 0
    };

    this.resources = {
        food: 50,
        wood: 0,
        stone: 0,
        gold: 0,
        soil: 0
    };

    this.skills = {
        picking: 5,
        craftmanship: 0,
        hunting: 0,
        surviving: 0,
        forging: 0,
        lumberjacking: 0,
        architecting: 0,
        cooking: 0
    };

    this.inventory = {
        axe: 0,
        pickaxe: 0,
        bow: 0,
        knife:0
    };
};

Player.prototype.clearResources = function() {
    for(var i in this.resources) {
        this.resources[i] = 0;
    }
};

Player.prototype.gather = function(resource) {
    var me = this,
        time = resource.getHarvestingTime(me);

    me.socket.emit('gatheringTime', time);

    setTimeout(function() {
        resource.updateSkills(me);

        var harvestedValue = Math.round(resource.getHarvestedValue(me));
        me.resources[resource.name] += harvestedValue;
        if (me.totalHarvestedResources.hasOwnProperty(resource.name)) {
            me.totalHarvestedResources[resource.name] += harvestedValue;
        }

        me.socket.emit('gathering', {name: resource.name, value: me.resources[resource.name]});
        me.socket.emit('updateSkills', me.skills);
    }, time);
};

Player.prototype.craft = function(item) {
    var me = this;

    var requiredResources = item.getRequiredResources();
    for (var type in requiredResources) {
        if (!requiredResources.hasOwnProperty(type)) {
            continue;
        }

        me.resources[type] -= requiredResources[type];
        me.socket.emit('building:resources', { name: type, value: me.resources[type] });
        me.socket.emit('updateNewItem', item.name);
    }

    setTimeout(function() {
        me.inventory[item.name]++;
    }, item.getBuildingTime(me));
};

module.exports = Player;
