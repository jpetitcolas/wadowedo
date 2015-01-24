var socket = io(),
    player = {
        skills: {},
        inventory: {}
    };

$("#message").keydown(function() {
    if (event.keyCode == 13) {
        $(this.form).submit();
        return false;
    }
});

$("#message-form").submit(function(e) {
    e.preventDefault();

    socket.emit('chat:message', $("#message").val());
    $(this).get(0).reset();
});

var chat = $(".chat");
socket.on('chat:message', function(messages) {
    for (var i = 0, c = messages.length ; i < c ; i++) {
        var message = messages[i];
        chat.append('<p class="message"><strong>' + message.name + '</strong>: ' + message.message);
    }
});

$('.actions a').click(function(e) {
    e.preventDefault();

    socket.emit('harvest', $(this).attr('href'));
});


$('.crafting a').click(function(e) {
    e.preventDefault();

    socket.emit('crafting', $(this).attr('href'));
});

['gathering', 'building:resources'].forEach(function(event) {
    socket.on(event, function(data) {
        var counter = $('#resource-' + data.name)[0];
        od = new Odometer({
            el: counter,
            value: +counter.innerHTML
        });

        od.update(data.value);
    });
});

socket.on('skills', function(skills){
    var skillName,
        skillCounter;

    player.skills = skills;

    for(skillName in skills) {
        skillCounter = $('#skill-' + skillName)[0];

        od = new Odometer({
            el: skillCounter,
            value: +skillCounter.innerHTML
        });

        od.update(skills[skillName]);
    }
});

function updateButtonsStatus() {
    function updateButtonStatus($button, type, data) {
        var requirements = data.split(','),;

        for(var i in requirements) {

        }
    };

    $('*[data-inventory]').each(function(button) {
        updateButtonStatus($(button), 'inventory', $(button).attr('data-inventory'));
    });

    $('*[data-skills]').each(function(button) {
        updateButtonStatus($(button), 'skills', $(button).attr('data-skills'));
    });
};

