module.exports = {
    name: 'bow',
    label: 'Arc',
    requiresValidation: true,
    getRequiredResources: function() {
        return {
            'wood': 20
        };
    },
    getBuildingTime: function(player) {
        return 600 - 5 * player.skills.craftmanship;
    }
};
