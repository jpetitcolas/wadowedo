var config = require('config');

module.exports = {
    name: 'Or',
    resource: 'gold',
    updateSkills: function(player) {
        if (!player.totalHarvestedResources.hasOwnProperty(this.name)) {
            console.warn('Unable to compute skill update for mining.');
            return;
        }

        var totalHarvestedGold = player.totalHarvestedResources[this.name];
        player.skills.mining += totalHarvestedGold ? Math.log(totalHarvestedGold) * config.skill.growth_factor : 0;
    },

    getHarvestedValue: function(player, tribe) {
        return 1000;

        var harvestedPerSecond = 1 + player.skills.mining * config.skill.harvest_influence;
        if (tribe.technologies.pickaxe > 0) {
            harvestedPerSecond *= 1.5;
        }

        return harvestedPerSecond;
    },
    getRequiredResources: function() {
        return {};
    },
    clicks: 10
};
