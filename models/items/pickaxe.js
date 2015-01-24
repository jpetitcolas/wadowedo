module.exports = {
    name: 'pickaxe',
    label: 'Pioche',
    requiresValidation: false,
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