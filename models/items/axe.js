module.exports = {
    name: 'axe',
    label: 'Hache',
    requiresValidation: false,
    getRequiredResources: function() {
        return {
            'wood': 25,
            'stone': 5
        };
    },
    getBuildingTime: function(player) {
        return 600 - 5 * player.skills.craftmanship;
    }
};
