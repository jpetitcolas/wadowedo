var tribes = [];

function handleTribeName() {
    if (player.tribeName) {
        $('#tribe').html(player.tribeName);
        $('#display-tribe-info').show();
        $('#choose-tribe').hide();
    } else {
        $('#display-tribe-info').hide();
        $('#choose-tribe').show();
    }
}

function updateTribeList() {
    for (var i in tribes) {

    }
}

handleTribeName();

$('#choose-tribe').on('click', function() {
    socket.emit('retrieveTribes');

    displayFileIn('screens/tribe-list.html', $('#main-screen'));
});

socket.on('tribeList', function(allTribes) {
    tribes = allTribes;
    updateTribeList();
});
