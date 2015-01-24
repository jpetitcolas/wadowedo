module.exports = {
    name: 'stone',
    updateSkills: function(player) {
    },
    getHarvestedValue: function(player) {
        return player.skills.picking * 5 + player.inventory.pickaxe * 15;
    },
    getHarvestingTime: function(player) {
        return 1000 - (player.skills.picking * 5 + player.inventory.pickaxe * 15);
    }
};
