module.exports = {
    name: 'axe',
    getRequiredResources: function() {
        return {
            'wood': 50,
            'stone': 20
        };
    },
    getBuildingTime: function(player) {
        return 600 - 5 * player.skills.craftmanship;
    }
};
