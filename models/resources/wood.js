var config = require('config');

module.exports = {
    name: 'wood',
    updateSkills: function(player) {
        if (!player.totalHarvestedResources.hasOwnProperty(this.name)) {
            console.warn('Unable to compute skill update for lumberjacking.');
            return;
        }

        var totalHarvestedWood = player.totalHarvestedResources[this.name];
        player.skills.lumberjacking += totalHarvestedWood ? Math.log(totalHarvestedWood) * config.skill.growth_factor : 0;
    },

    getHarvestedValue: function(player, tribe) {
        return 1000;

        var harvestedPerSecond = 1 + player.skills.lumberjacking * config.skill.harvest_influence;
        if (tribe.inventory.axe > 0) {
            harvestedPerSecond *= 1.5;
        }

        return harvestedPerSecond;
    },
    getRequiredResources: function() {
        return {};
    },
    clicks: 5 + Math.round(30 * Math.random())
};
