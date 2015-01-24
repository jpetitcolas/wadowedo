module.exports = {
    name: 'meat',
    getHarvestedValue: function(player, tribe) {
        return player.skills.hunting * 5 + player.inventory.bow * 15;
    },
    getHarvestingTime: function(player) {
        return 1000 - (player.skills.hunting * 5 + player.inventory.bow * 15);
    }
};
