var config = require('config');

module.exports = {
    name: 'stone',
    updateSkills: function(player) {
        if (!player.totalHarvestedResources.hasOwnProperty(this.name)) {
            console.warn('Unable to compute skill update for lumberjacking.');
            return;
        }

        var totalHarvestedStone = player.totalHarvestedResources[this.name];
        player.skills.stoneCutting += totalHarvestedStone ? Math.log(totalHarvestedStone * 1.2) * config.skill.growth_factor : 0;
    },

    getHarvestedValue: function(player, tribe) {
        var harvestedPerSecond = 1 + player.skills.stoneCutting * config.skill.harvest_influence * 1.2;
        if (tribe.technologies.pickaxe > 0) {
            harvestedPerSecond *= 1.3;
        }

        return harvestedPerSecond;
    },
    getRequiredResources: function() {
        return {};
    },
    clicks: 150 + Math.round(50 * Math.random())
};
