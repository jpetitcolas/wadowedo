module.exports = {
    name: 'hut',
    label: 'Hutte',
    requiresValidation: true,
    getRequiredResources: function() {
        return {
            'wood': 100
        };
    },
    getBuildingTime: function(player) {
        return 1500 - 5 * player.skills.craftmanship;
    }
};
