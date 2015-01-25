module.exports = {
    name: 'meat',
    resource: 'meat',
    update: function(player) {
        if (player.tribe.health <= 99.9) {
            player.tribe.health += 0.1;
        } else {
            player.tribe.health = 100;
        }

        player.tribe.setHealth(player.tribe.health);
    },
    getHarvestedValue: function(player, tribe) {
        return 5;
    },
    getRequiredResources: function() {
        return {};
    },
    clicks: 50
};
