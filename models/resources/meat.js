module.exports = {
    name: 'meat',
    getHarvestedValue: function(player) {
        return player.skills.hunting * 5 + player.inventory.bow * 15;
    },
    getHarvestingTime: function(player) {
        return 1000 - (player.skills.hunting * 5 + player.inventory.bow * 15);
    }
};
