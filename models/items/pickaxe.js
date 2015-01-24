module.exports = {
    name: 'pickaxe',
    label: 'Pioche',
    requiresValidation: false,
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
