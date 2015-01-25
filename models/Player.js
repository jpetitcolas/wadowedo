var Player = function(name, socket) {
    this.name = name;
    this.socket = socket;
    this.tribe = null;
    this.isChief = false;
    this.isSubChief = false;

    this.totalHarvestedResources = {
        wood: 0,
        stone: 0
    };

    this.skills = {
        picking: 5,
        craftmanship: 0,
        hunting: 0,
        surviving: 0,
        forging: 0,
        lumberjacking: 0,
        architecting: 0,
        cooking: 0,
        stoneCutting: 0,
        mining: 0
    };

    this.clicks = {};
};

Player.prototype.create = function(item, type) {
    var me = this,
        requiredResources;

    // Init currently crafting resource
    if (!me.tribe.currentCraftingClicks[type].hasOwnProperty(item.name)) {
        // Ask for a leader if the item requires a validation
        if (this.tribe && item.requiresValidation && !this.isChief && !this.isSubChief) {
            this.tribe.submitCreation(this, item, 'actions');
            return this.sendNotification('La construction de l\'object "' + item.label + '" requiert la valition des chefs de la tribu, la demande est partie.');
        }

        // Decrement tribe resources for this item
        requiredResources = item.getRequiredResources();

        for (var requiredType in requiredResources) {
            me.tribe.resources[requiredType] -= requiredResources[requiredType];
            me.tribe.emitToAll('update:resources', { name: requiredType, value: me.tribe.resources[requiredType] });
        }

        me.tribe.currentCraftingClicks[type][item.name] = 0;
    }

    // Init click count
    if (!me.clicks.hasOwnProperty(item.name)) {
        me.clicks[item.name] = 0;
    }

    me.clicks[item.name]++;
    me.tribe.currentCraftingClicks[type][item.name]++;

    me.tribe.emitToAll('update:clickCount', {
        resourceName: item.name,
        count: item.clicks - me.tribe.currentCraftingClicks[type][item.name]
    });

    item.update(me);

    // Update all tribe player skills
    if (me.tribe.currentCraftingClicks[type][item.name] === item.clicks) {
        me.tribe[type][item.resource] += Math.round(item.getHarvestedValue(me, me.tribe));

        me.tribe.emitToAll('done:'+type, {name: item.name, type: item.resource, value: me.tribe[type][item.resource]});

        delete me.tribe.currentCraftingClicks[type][item.name];
    }
};

Player.prototype.gather = function(resource) {
    this.create(resource, 'resources');
};

Player.prototype.craft = function(technology) {
    this.create(technology, 'technologies');
};

Player.prototype.build = function(item) {
    this.create(item, 'buildings');
};

Player.prototype.sendNotification = function(message) {
    this.socket.emit('chat:message', [{
        time: new Date().toISOString(),
        name: 'Wadowedo',
        content: {to: 'all', text: message}
    }]);
};

module.exports = Player;
