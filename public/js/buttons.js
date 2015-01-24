/**
 * enable/disable buttons with a data-skills & data-inventory
 */

 
function updateButtonsStatus() {
    inprogress.stop();
    enableButtons();
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

    $('*[data-inventory]').each(function(index, button) {
        updateButtonStatus($(button), 'inventory', $(button).data('inventory'));
    });

    $('*[data-skills]').each(function(index, button) {
        updateButtonStatus($(button), 'skills', $(button).data('skills'));
    });
}

updateButtonsStatus();
