/**
 * enable/disable buttons with a data-enabled
 */
var disableButtons = function() {
    $('.actions a').attr('disabled',true);
};

var enableButtons = function() {
    $('.actions a').attr('disabled',false);
};

function haveCapabilities(capabilities) {
    if (player.resources === null) {
        return false;
    }

    var playerCapabilities = {
        resources: player.resources,
        skills: player.skills,
        buildings: player.buildings,
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

    var $button,
        enabled;

    $('[data-enabled]').each(function(index, button) {
        $button = $(button);
        enabled = haveCapabilities($button.data('enabled'));

        $button.attr('disabled', enabled ? null: 'disabled');
    });
}

function updateTechnologiesButtonStatus() {
    $(".crafting .btn").each(function() {
        var $button = $(this),
            hasCapability = haveCapabilities($button.data('enabled'));

        if (hasCapability && player.technologies.hasOwnProperty($button.attr('href'))) {
            $button.attr('disabled', true).addClass('learned');
        } else {
            $button.attr('disabled', false);
        }
    });
}

updateButtonsStatus();
updateTechnologiesButtonStatus();