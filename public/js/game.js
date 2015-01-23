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

socket.on('chat:message', function(message) {
    $(".chat").append('<p><strong>' + message.name + '</strong>: ' + message.message);
});

$('a[href="harvest-wood"]').click(function(e) {
    e.preventDefault();
    console.info('tu bois');
    socket.emit('harvest', 'wood');

    socket.on('gathering', function(data){
        console.info('ta bien bu', data);
    })
});