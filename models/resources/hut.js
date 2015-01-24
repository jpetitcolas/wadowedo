module.exports = {
    name: 'hut',
    label: 'Hutte',
    requiresValidation: true,
    updateSkills: function(player) {
        // @TODO
    },
    getRequiredResources: function() {
        return {
            'wood': 1000
        };
    },
    clicks: 5000
};
