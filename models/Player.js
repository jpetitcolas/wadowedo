module.exports = {
    name: "Anonymous",
    health: 50,
    resources: {
        food: 50,
        wood: 0,
        stone: 0,
        gold: 0,
        soil: 0
    },
    skills: {
        picking: 0
    },
    inventory: {
        axe: 0,
        pickaxe: 0,
        longbow: 0,
        knife: 0
    },

    gather: function(resource) {
        var me = this;

        setInterval(function() {
            me.resources[resource.name] += resource.getHarvestedValue(player);
        }, resource.getHarvestingTime(player));
    }
};
