module.exports = {
    name: 'meat',
    updateSkills: function(player) {
        // @TODO
    },
    getHarvestedValue: function(player, tribe) {
        return player.skills.hunting * 5 + tribe.inventory.bow * 15;
    },
    getRequiredResources: function() {
        return {};
    },
    clicks: 50 + Math.round(50 * Math.random())
};
