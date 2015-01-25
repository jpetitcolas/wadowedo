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
        label,
        enabled;

    $('[data-enabled]').each(function(index, button) {
        $button = $(button);
        label = !!$button.data('label');

        // If we have a label, the button was already clicked, do not disable it
        if (label) {
            return $button.attr('disabled', null);
        }

        enabled = haveCapabilities($button.data('enabled'));

        $button.attr('disabled', enabled ? null: 'disabled');
    });

    updateTechnologiesButtonStatus();
}

function updateTechnologiesButtonStatus() {
    $(".crafting .btn").each(function() {
        var $button = $(this),
            name = $button.attr('href'),
            hasCapability = haveCapabilities($button.data('enabled'));

        if (player.technologies.hasOwnProperty(name) && player.technologies[name]) {
            $button.attr('disabled', true).addClass('learned');
        } else if (hasCapability) {
            $button.attr('disabled', false);
        } else {
            $button.attr('disabled', true).addClass('learned');
        }
    });
}

updateButtonsStatus();
updateTechnologiesButtonStatus();