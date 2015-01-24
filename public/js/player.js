var player = {
    skills: {},
    inventory: {}
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

socket.on('skills', function(skills){
    var skillName,
        skillCounter;

    player.skills = skills;
    updateButtonsStatus();

    for(skillName in skills) {
        skillCounter = $('#skill-' + skillName)[0];

        od = new Odometer({
            el: skillCounter,
            value: +skillCounter.innerHTML
        });

        od.update(skills[skillName]);
    }
});
