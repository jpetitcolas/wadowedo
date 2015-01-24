var socket = io();

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
    switch(this.id) {
    	case 'harvest-wood':
			socket.emit('harvest', 'wood');
    	    break;

    	case 'harvest-stone':
			socket.emit('harvest', 'stone');
    	    break;

    	case 'hunt':
			socket.emit('hunt', 'biche');
    	    break;

        case 'build-bow':
            socket.emit('build', 'bow');
            break;
    }

    socket.emit('harvest', 'wood');
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
