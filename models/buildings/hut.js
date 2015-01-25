module.exports = {
    name: 'hut',
    resource: 'hut',
    label: 'Hutte',
    requiresValidation: true,
    getHarvestedValue: function() {
        return 1;
    },
    update: function(player) {
        // @TODO
    },
    getRequiredResources: function() {
        return {
            'wood': 1000
        };
    },
    clicks: 5000
};
