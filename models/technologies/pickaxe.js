module.exports = {
    name: 'pickaxe',
    resource: 'pickaxe',
    label: 'Pioche',
    requiresValidation: false,
    update: function(player) {
        // @TODO
    },
    getHarvestedValue: function() {
        return 1;
    },
    getRequiredResources: function() {
        return {
            'wood': 25,
            'stone': 12
        };
    },
    clicks: 15
};
