var player = {
    skills: {},
    inventory: {},
    resources: {},
    tribeName: null,
    isChief: false,
    isSubChief: false
};

['gathering', 'building:resources'].forEach(function(event) {
    socket.on(event, function(data) {
        var counter = $('#resource-' + data.name)[0];
        player.inventory[data.name] = +data.value;

        od = new Odometer({
            el: counter,
            value: +counter.innerHTML
        });

        od.update(data.value);
        updateButtonsStatus();
    });
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