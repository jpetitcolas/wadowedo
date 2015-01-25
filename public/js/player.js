var player = {
    health: 100,
    skills: {},
    buildings: {},
    technologies: {},
    resources: {},
    clicks: {},
    tribeName: null,
    isChief: false,
    isSubChief: false
};

function updateClickCount(name, value) {
    if (!value) {
        return;
    }

    var button = $('a[href="' + name + '"]');
    if (!button.data('label')) {
        button.data('label', button.html());
    }

    button.html( button.data('label') + ' (' + value + ')');

    updateButtonsStatus();
}

function updateAllClickCount() {
    for(var name in player.clicks) {
        updateClickCount(name, player.clicks[name]);
    }
}

function displayPlayerHealth() {
    $("#no-more-energy")[player.health <= 0 ? "show" : "hide"]();
    $(".progress-bar-energy").css("width", player.health + "%");
}

player.isHealthy = function() {
    return player.health > 0;
};

function updatePlayerCounts(counts, type) {
    var counter,
        name;

    for(name in counts) {
        counter = $('#' + type + '-' + name)[0];
        if (!counter) {
            continue;
        }

        od = new Odometer({
            el: counter,
            value: +counter.innerHTML
        });

        od.update(counts[name]);
    }

    updateButtonsStatus();
}

socket.on('update:resources', function(resource) {
    player.resources[resource.name] = resource.value;

    updatePlayerCounts(player.resources, 'resource');
});

socket.on('update:allResources', function(resources) {
    player.resources = resources;

    updatePlayerCounts(player.resources, 'resource');
});

socket.on('update:allBuildings', function(buildings) {
    player.buildings = buildings;

    updatePlayerCounts(player.buildings, 'buildings');
});

socket.on('update:allSkills', function(skills) {
    player.skills = skills;

    updatePlayerCounts(player.skills, 'skills');
});
socket.on('update:allTechnologies', function(technologies) {
    player.technologies = technologies;

    updateButtonsStatus();
});

socket.on('done:resources', function(resource) {
    player.resources[resource.type] = resource.value;

    var button = $('a[href="' + resource.name + '"]');
    button.html(button.data('label'));

    updatePlayerCounts(player.resources, 'resource');
});

socket.on('done:skills', function(skill){
    player.skills[skill.name] = skill.value;

    var button = $('a[href="' + skills.name + '"]');
    button.html(button.data('label'));

    updatePlayerCounts(player.skills, 'skill');
});

socket.on('done:technologies', function(item){
    player.technologies[item.name] = item.value;

    var button = $('a[href="' + item.name + '"]');
    button.html(button.data('label'));

    updateButtonsStatus();
    updateTechnologiesButtonStatus();
});

socket.on('done:buildings', function(building){
    player.buildings[building.name] = building.value;

    var button = $('a[href="' + item.name + '"]');
    button.html(button.data('label'));

    updatePlayerCounts(player.buildings, 'buildings');
});

socket.on('update:clickCount', function(clickData) {
    updateClickCount(clickData.resourceName, clickData.count);

    updateButtonsStatus();
});

socket.on('update:allClickCount', function(allClickData) {
    player.clicks = allClickData;

    updateAllClickCount();
    updateButtonsStatus();
});

socket.on('updateEnergy', function(energy){
    player.health['energy'] = energy;
});

socket.on('update:health', function(health) {
    player.health = health;
    displayPlayerHealth();
});
