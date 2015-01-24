module.exports = {
    name: 'pickaxe',
    requiresValidation: true,
    getRequiredResources: function() {
        return {
            'wood': 25,
            'stone': 125
        };
    },

    getBuildingTime: function(player) {
        return 1200 - 5 * player.skills.craftmanship;
    }
};
