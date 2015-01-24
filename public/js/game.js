var socket = io('', { query: window.location.search.substring(1) }),
    $document = $(document),
    inprogress;

$(window).on('load', function() {
    player.name = window.location.search.substring(1).split('=')[1];
});

$document.on('click', '#player-name', function(e) {
    e.preventDefault();

    displayFileIn('screens/main.html', $('#main-screen'), function() {
        updateButtonsStatus();
    });
});

$document.on('click', '.actions a', function(e) {
    e.preventDefault();
    inprogress = Ladda.create(this);
    inprogress.start();
    disableButtons();

    socket.emit('harvest', $(this).attr('href'));
});

$document.on('click', '#eat', function(e) {
    e.preventDefault();
    inprogress = Ladda.create(this);
    inprogress.start();
    disableButtons();
    socket.emit('eat', $(this).attr('href'));
});

$document.on('click', '.crafting a', function(e) {
    e.preventDefault();
    inprogress = Ladda.create(this);
    inprogress.start();
    disableButtons();

    socket.emit('crafting', $(this).attr('href'));
});

displayFileIn('screens/main.html', $('#main-screen'), function() {
    updateButtonsStatus();
    handleTribeName();
    $('#player-name').html(player.name);
});

displayFileIn('chat.html', $('#chat-container'), function() {
    initChat();
});
