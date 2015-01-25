var player = {
    health:{},
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

socket.on('updateSkills', function(skills){
    var skillName,
        skillCounter;

    player.skills = skills;
    updateButtonsStatus();

    for(skillName in skills) {
        skillCounter = $('#skill-' + skillName)[0];

        od = new Odometer({
            el: skillCounter,
            value: +skillCounter.innerHTML,
            format: '(,ddd)'
        });

        od.update(skills[skillName]);
    }

    updateButtonsStatus();
});


socket.on('updateEnergy', function(energy){
    player.health['energy'] = energy;

});

socket.on('updateNewItem', function(techno){
    var button = $('a[href="' + techno + '"]');
    button.html(button.data('label'));

    player.technologies[techno] =  1;
    updateTechnologiesButtonStatus();
});

socket.on('updateResources', function(resources) {
    var resourceCounter;

    player.resources = resources;
    updateButtonsStatus();

    for(resourceName in resources) {
        resourceCounter = $('#resource-' + resourceName)[0];
        od = new Odometer({
            el: resourceCounter,
            value: +resourceCounter.innerHTML
        });

        od.update(resources[resourceName]);
    }

    updateButtonsStatus();
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
    $('.progress-bar-energy').css('width', health + '%');
});
