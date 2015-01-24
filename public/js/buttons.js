/**
 * enable/disable buttons with a data-skills & data-inventory
 */
var disableButtons = function() {
    $('.actions a').attr('disabled',true);
};

var enableButtons = function() {
    $('.actions a').attr('disabled',false);
};

function updateButtonsStatus() {

    enableButtons();
    if (typeof(inprogress) != 'undefined') {
        inprogress.stop();
    }

    function updateButtonStatus($button, type, data) {
        var requirements = data.split(','),
            requirementInfos,
            enabled = true,
            name,
            value;

        for(var i in requirements) {
            requirementInfos = requirements[i].split(':');
            name = requirementInfos[0];
            value = +requirementInfos[1];

            enabled = enabled && player[type][name] >= value;
        }

        $button.attr('disabled', enabled ? null: 'disabled');
    }

    ['skills', 'inventory'].forEach(function(type) {
        $('*[data-' + type + ']').each(function(index, button) {
            updateButtonStatus($(button), type, $(button).data(type));
        });
    });
}

updateButtonsStatus();
