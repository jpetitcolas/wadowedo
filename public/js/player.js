var player = {
    health:{},
    skills: {},
    inventory: {},
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

    player.inventory[data.name] = +data.value;

    updateCounter($('#resource-' + data.name), +data.value)
});

socket.on('gathering', function(data) {
    var button = $('a[href="' + data.name + '"]');
    button.html(button.data('label'));

    player.resources[data.name] = +data.value;

    updateCounter($('#resource-' + data.name), +data.value)
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
});


socket.on('updateEnergy', function(energy){
    player.health['energy'] = energy;

});


socket.on('updateNewItem', function(techno){
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
});

socket.on('updateInventory', function(inventory) {
    $("#tools span").each(function(index, itemCount) {
        if (!inventory.hasOwnProperty(itemCount.id)) {
            return;
        }

        $(this).text(inventory[itemCount.id]);
    });
});
