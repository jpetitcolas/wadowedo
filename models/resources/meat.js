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
        return (1 + (player.skills.hunting * 0.1) + tribe.technologies.bow * 1.3);
    },
    getRequiredResources: function() {
        return {};
    },
    clicks: 50
};
