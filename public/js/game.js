var socket = io();

$('a[href="harvest-wood"]').click(function(e) {
    e.preventDefault();
    console.info('tu bois');
    socket.emit('harvest', 'wood');

    socket.on('gathering', function(data){
        console.info('ta bien bu', data);
    })
});


