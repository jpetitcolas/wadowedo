module.exports = {
    name: 'axe',
    resource: 'axe',
    label: 'Hache',
    requiresValidation: false,
    update: function(player) {

    },
    getHarvestedValue: function() {
        return 1;
    },
    getRequiredResources: function() {
        return {
            'wood': 25,
            'stone': 5
        };
    },
    clicks: 20
};
