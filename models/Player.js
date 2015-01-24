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
        stoneCutting: 0
    };

    this.clicks = {

    };
};

Player.prototype.gather = function(resource) {
    var me = this;

    // Init currently crafting resource
    if (!me.tribe.currentCraftingClicks.resources.hasOwnProperty(resource.name)) {
        // Ask for a leader if the item requires a validation
        if (this.tribe && resource.requiresValidation && !this.isChief && !this.isSubChief) {
            this.tribe.submitCreation(this, resource, 'actions');
            return this.sendNotification('La construction de l\'object "' + resource.label + '" requiert la valition des chefs de la tribu, la demande est partie.');
        }

        me.tribe.currentCraftingClicks.resources[resource.name] = 0;
    }

    // Init click count
    if (!me.clicks.hasOwnProperty(resource.name)) {
        me.clicks[resource.name] = 0;
    }

    me.clicks[resource.name]++;
    me.tribe.currentCraftingClicks.resources[resource.name]++;

    me.tribe.emitToAll('clickCount', {
        resourceName: resource.name,
        count: resource.clicks - me.tribe.currentCraftingClicks.resources[resource.name]
    });

    // Update all tribe player skills
    if (me.tribe.currentCraftingClicks.resources[resource.name] === resource.clicks) {
        me.tribe.resources[resource.name] += Math.round(resource.getHarvestedValue(me, me.tribe));

        me.tribe.sendSkills(resource);
        me.tribe.emitToAll('gathering', {name: resource.name, value: me.tribe.resources[resource.name]});

        delete me.tribe.currentCraftingClicks.resources[resource.name];
    }
};

Player.prototype.craft = function(item) {
    var me = this,
        requiredResources;

    // Init currently crafting resource
    if (!me.tribe.currentCraftingClicks.items.hasOwnProperty(item.name)) {
        // Ask for a leader if the item requires a validation
        if (this.tribe && item.requiresValidation && !this.isChief && !this.isSubChief) {
            this.tribe.submitCreation(this, item, 'crafting');
            return this.sendNotification('La construction de l\'object "' + item.label + '" requiert la valition des chefs de la tribu, la demande est partie.');
        }

        me.tribe.currentCraftingClicks.items[item.name] = 0;

        // Decrement tribe resources for this item
        requiredResources = item.getRequiredResources();

        for (var type in requiredResources) {
            if (!requiredResources.hasOwnProperty(type)) {
                continue;
            }

            me.tribe.resources[type] -= requiredResources[type];

            me.tribe.emitToAll('building:resources', { name: type, value: me.tribe.resources[type] });
        }
    }

    // Init click count
    if (!me.clicks.hasOwnProperty(item.name)) {
        me.clicks[item.name] = 0;
    }

    me.clicks[item.name]++;
    me.tribe.currentCraftingClicks.items[item.name]++;

    me.tribe.emitToAll('clickCount', {
        resourceName: item.name,
        count: item.clicks - me.tribe.currentCraftingClicks.items[item.name]
    });

    if (me.tribe.currentCraftingClicks.items[item.name] === item.clicks) {
        me.tribe.inventory[item.name]++;
        me.tribe.emitToAll('updateNewItem', item.name);

        delete me.tribe.currentCraftingClicks.items[item.name];
    }
};

Player.prototype.sendNotification = function(message) {
    this.socket.emit('chat:message', [{
        time: new Date().toISOString(),
        name: 'Wadowedo',
        content: {to: 'all', text: message}
    }]);
};

module.exports = Player;
