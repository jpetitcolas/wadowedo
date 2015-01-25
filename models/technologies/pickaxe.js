module.exports = {
    name: 'pickaxe',
    resource: 'pickaxe',
    label: 'Pioche',
    requiresValidation: false,
    update: function(player) {

    },
    getHarvestedValue: function() {
        return 1;
    },
    updateSkills: function(player) {
        // @TODO
    },
    getRequiredResources: function() {
        return {
            'wood': 25,
            'stone': 125
        };
    },
    clicks: 150
};
