module.exports = {
    name: 'wood',
    updateSkills: function(player) {
        player.skills.lumberjacking += player.inventory.axe ? 1 : 0;
    },
    getHarvestedValue: function(player) {
        return player.skills.picking * 5
            + player.skills.lumberjacking * 10
            + player.inventory.axe * 30 ;
    },
    getHarvestingTime: function(player) {
        return 2000 - (
                player.skills.picking * 80
                + player.skills.lumberjacking * 10
                + player.inventory.axe * 30
            );
    }
};
