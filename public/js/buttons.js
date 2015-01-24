/**
 * enable/disable buttons with a data-skills & data-inventory
 */
var disableButtons = function() {
    $('.actions a').attr('disabled',true);
};

var enableButtons = function() {
    $('.actions a').attr('disabled',false);
};

function haveCapabilities(capabilities) {
    var playerCapabilities = {
        resources: player.resources,
        skills: player.skills,
        inventory: player.inventory,
        technologies: player.technologies
    };

    capabilities = 'playerCapabilities.' + capabilities;
    capabilities = capabilities.replace(' ', '');
    capabilities = capabilities.replace('||', '||playerCapabilities.');
    capabilities = capabilities.replace('&&', '&&playerCapabilities.');

    // Eval is evil...
    return eval(capabilities);
}

function updateButtonsStatus() {
    enableButtons();
    if (typeof(inprogress) != 'undefined') {
        inprogress.stop();
    }

    function updateButtonStatus($button) {
        var enabled = haveCapabilities($button.data('enabled'));

        $button.attr('disabled', enabled ? null: 'disabled');
    }

    $('[data-enabled]').each(function(index, button) {
        updateButtonStatus($(button));
    });
}

function updateTechnologiesButtonStatus() {
    $(".crafting .btn").each(function() {
        var $button = $(this);
        if (player.technologies.hasOwnProperty($button.attr('href'))) {
            $button.attr('disabled', true).addClass('learned');
        }
        
    });
}
updateTechnologiesButtonStatus();
updateButtonsStatus();
