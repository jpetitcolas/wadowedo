var player = {
    health:{},
    skills: {},
    inventory: {},
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

socket.on('building:resources', function(data) {
    player.inventory[data.name] = +data.value;

    updateCounter($('#resource-' + data.name), +data.value)
});

socket.on('gathering', function(data) {
    player.resources[data.name] = +data.value;

    updateCounter($('#resource-' + data.name), +data.value)
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


socket.on('updateNewItem', function(newItem){
    updateButtonsStatus();
    player.inventory[newItem] = (typeof(player.inventory[newItem]) != 'undefined')
                                ? player.inventory[newItem]++
                                : 1 ;

    var counter = $("#"+newItem)[0];
    od = new Odometer({
        el: counter,
        value: +counter.innerHTML
    });
    od.update(player.inventory[newItem]);
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
