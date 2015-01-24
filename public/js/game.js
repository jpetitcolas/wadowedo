var socket = io('', { query: window.location.search.substring(1) }),
    player = {
        skills: {},
        inventory: {}
    };

$('.actions a').click(function(e) {
    e.preventDefault();

    socket.emit('harvest', $(this).attr('href'));
});

$('.crafting a').click(function(e) {
    e.preventDefault();

    socket.emit('crafting', $(this).attr('href'));
});
