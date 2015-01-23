module.exports = {
    name: "Anonymous",
    health: 50,
    resources: {
        wood: 0
    },

    gather: function(resource) {
        var me = this;
        setInterval(function() {
            me.resources[resource.name] += resource.getHarvestedValue(player);
        }, resource.getGatheringTime());
    }
};