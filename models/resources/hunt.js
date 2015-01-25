module.exports = {
    name: 'hunt',
    resource: 'meat',
    updateSkills: function(player) {
    },
    getHarvestedValue: function(player, tribe) {
        return player.skills.hunting * 5 + tribe.technologies.bow * 15;
    },
    getRequiredResources: function() {
        return {
        };
    },
    clicks: 10
};
