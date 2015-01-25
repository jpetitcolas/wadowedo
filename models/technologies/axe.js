module.exports = {
    name: 'axe',
    resource: 'axe',
    label: 'Hache',
    requiresValidation: false,
    getHarvestedValue: function() {
        return 1;
    },
    updateSkills: function(player) {
        // @TODO
    },
    getRequiredResources: function() {
        return {
            'wood': 25,
            'stone': 5
        };
    },
    clicks: 200
};
