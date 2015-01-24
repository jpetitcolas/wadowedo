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

    getHarvestedValue: function(player) {
        var harvestedPerSecond = 1 + player.skills.lumberjacking * config.skill.harvest_influence;
        return harvestedPerSecond * this.getHarvestingTime(player) / 1000;
    },

    getHarvestingTime: function(player) {
        return 2000;
    }
};
