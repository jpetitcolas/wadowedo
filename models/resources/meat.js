module.exports = {
    name: 'meat',
    updateSkills: function(player) {
        if (player.tribe.health <= 95) {
            player.tribe.health += 5;
        } else {
            player.tribe.health = 100;
        }

        player.tribe.setHealth(player.tribe.health);
    },
    getHarvestedValue: function(player, tribe) {
        return player.skills.hunting * 5 + tribe.inventory.bow * 15;
    },
    getRequiredResources: function() {
        return {
            meat: 5
        };
    },
    clicks: 1
};
