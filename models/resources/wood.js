module.exports = {
    name: 'wood',
    getHarvestedValue: function(player) {
        return player.skills.picking * 10 + player.inventory.axe * 30;
    },
    getHarvestingTime: function(player) {
        return 1000 - (player.skills.picking * 10 + player.inventory.axe * 30);
    }
};
