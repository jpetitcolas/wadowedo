var player = {
    health: 100,
    skills: {},
    buildings: {},
    technologies: {},
    resources: {},
    tribeName: null,
    isChief: false,
    isSubChief: false
};

function updateCounter(counter, value) {
    od = new Odometer({
        el: counter[0],
        value: +counter[0].innerHTML
    });
    od.update(value);

    updateButtonsStatus();
}

function updateClickCount(name, value) {
    if (!value) {
        return;
    }

    var button = $('a[href="' + name + '"]');
    if (!button.data('label')) {
        button.data('label', button.html());
    }

    button.html( button.data('label') + ' (' + value + ')');
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

socket.on('building:resources', function(data) {
    var button = $('a[href="' + data.name + '"]');
    button.html(button.data('label'));

    player.resources[data.name] = +data.value;

    updateCounter($('#resource-' + data.name), +data.value);
    updateButtonsStatus();
});

socket.on('gathering', function(data) {
    var button = $('a[href="' + data.name + '"]');
    button.html(button.data('label'));

    player.resources[data.name] = +data.value;

    updateCounter($('#resource-' + data.name), +data.value);
    updateButtonsStatus();
});

socket.on('clickCount', function(clickData) {
    updateClickCount(clickData.resourceName, clickData.count);
});

socket.on('allClickCount', function(allClickData) {
    for(var name in allClickData) {
        updateClickCount(name, allClickData[name]);
    }
});

socket.on('updateEnergy', function(energy){
    player.health['energy'] = energy;

});

socket.on('updateNewItem', function(techno){
    var button = $('a[href="' + techno + '"]');
    button.html(button.data('label'));

    player.technologies[techno] = 1;
    updateTechnologiesButtonStatus();
});

socket.on('updateResources', function(resources) {
    player.resources = resources;

    updatePlayerCounts(player.resources, 'resource');
});

socket.on('updateSkills', function(skills){
    player.skills = skills;

    updatePlayerCounts(player.skills, 'skill');
});

socket.on('updateBuildings', function(buildings) {
    $('#tools span').each(function(index, itemCount) {
        if (!buildings.hasOwnProperty(itemCount.id)) {
            return;
        }

        $(this).text(buildings[itemCount.id]);
    });

    updateButtonsStatus();
});

socket.on('updateHealth', function(health) {
    $("#no-more-energy")[health <= 0 ? "show" : "hide"]();
    $(".progress-bar-energy").css("width", health + "%");
});
