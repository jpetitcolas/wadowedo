var socket = io('', { query: window.location.search.substring(1) }),
    $document = $(document);

$document.on('click', '.actions a', function(e) {
    e.preventDefault();

    if (!player.isHealthy()) {
        $(this).shake();
        return false;
    }

    socket.emit('harvest', $(this).attr('href'));
});

$document.on('click', '.buildings a', function(e) {
    e.preventDefault();

    if (!player.isHealthy()) {
        $(this).shake();
        return false;
    }

    socket.emit('build', $(this).attr('href'));
});

$document.on('click', '#eat', function(e) {
    e.preventDefault();
    socket.emit('eat', $(this).attr('href'));
});

$document.on('click', '.crafting a', function(e) {
    e.preventDefault();

    if (!player.isHealthy()) {
        $(this).shake();
        return false;
    }

    socket.emit('crafting', $(this).attr('href'));
});

$(window).on('load', function() {
    player.name = window.location.search.substring(1).split('=')[1];

    displayFileIn('screens/main.html', $('#main-screen'), function() {
        updatePlayerCounts(player.resources, 'resource');
        updatePlayerCounts(player.skills, 'skill');
        updateButtonsStatus();
        handleTribeName();
        displayPlayerHealth();

        $('#player-name').html(player.name);
    });

    displayFileIn('chat.html', $('#chat-container'), function() {
        initChat();
    });

    displayFileIn('actions.html', $('#actions-container'), function() {
        updateAllClickCount();
        updateButtonsStatus();

        $('[data-toggle="tooltip"]').tooltip();
        updateTechnologiesButtonStatus();
    });
});
