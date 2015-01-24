$('#message').keydown(function() {
    if (event.keyCode == 13) {
        $(this.form).submit();
        return false;
    }
});

$('#message-form').submit(function(e) {
    e.preventDefault();

    socket.emit('chat:message', $('#message').val());
    $(this).get(0).reset();

});

var chat = $('.chat');
socket.on('chat:message', function(messages) {
    for (var i = 0, c = messages.length ; i < c ; i++) {
        var message = messages[i];
        chat.prepend('<p class="message"><strong>' + message.name + '</strong>: ' + message.message);
    }
});
