module.exports = {
    name: 'bow',
    resource: 'bow',
    label: 'Arc',
    requiresValidation: false,
    update: function(player) {

    },
    getHarvestedValue: function() {
        return 1;
    },
    getRequiredResources: function() {
        return {
            'wood': 20
        };
    },
    clicks: 20
};
