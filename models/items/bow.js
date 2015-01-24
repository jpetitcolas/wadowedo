module.exports = {
    name: 'bow',
    getRequiredResources: function() {
        return {
            'wood': 20
        };
    },
    getBuildingTime: function(player) {
        return 600 - 5 * player.skills.craftmanship;
    }
};
