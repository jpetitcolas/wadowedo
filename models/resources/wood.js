module.exports = {
    name: 'wood',
    getHarvestedValue: function(player) {
        return player.skills.picking * 10 + player.inventory.axe * 30;
    },
    getHarvestingTime: function(player) {
        return 3000 - (player.skills.picking * 80 + player.inventory.axe * 30);
    }
};
