var Player = function(name, socket) {
    this.name = name;
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
        axe: 1,
        pickaxe: 0,
        bow: 0,
        knife:0
    };

    var self = this;

    socket.on('harvest', function(resourceName){
        self.gather(require('./resources/' + resourceName));
    });

    socket.on('crafting', function(objectName) {
        self.craft(require('./items/' + objectName));
    });
};

Player.prototype.gather = function(resource) {
    var me = this,
        time = resource.getHarvestingTime(me);

    me.socket.emit('gatheringTime', time);

    setTimeout(function() {
        resource.updateSkills(me);

        me.resources[resource.name] += resource.getHarvestedValue(me);

        me.socket.emit('gathering', {name: resource.name, value: me.resources[resource.name]});
        me.socket.emit('skills', me.skills);
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
    }

    setTimeout(function() {
        me.inventory.bow++;
    }, item.getBuildingTime(me));
};

module.exports = Player;
