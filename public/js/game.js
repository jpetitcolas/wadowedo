var socket = io();

$('#harvest-wood').click(function(e) {
    e.preventDefault();
    console.log('tu bois');
    socket.emit('harvest-wood', 'tu bois');
});


