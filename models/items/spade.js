module.exports = {
    name: 'spade',
    label: 'Bêche',
    requiresValidation: false,
    update: function(player) {
        // @TODO
    },
    getRequiredResources: function() {
        return {
            'wood': 25,
            'iron': 5
        };
    },
    clicks: 400
};
