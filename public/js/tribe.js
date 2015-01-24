var tribesWithPlayers = {};

$document.on('click', '#choose-tribe', function() {
    socket.emit('retrieveTribes');

    displayFileIn('screens/tribe.html', $('#main-screen'), function() {
        updateTribeList();
        handleTribeName();
    });
});

$document.on('submit', '#create-tribe', function(event) {
    event.preventDefault();

    createTribe($('#tribe-name').val());
});

$document.on('submit', '#participation', function(event) {
    event.preventDefault();

    updateTribeParticipation();
});

$document.on('click', '#tribe-list .join-tribe', function (event) {
    event.preventDefault();

    joinTribe($(event.target).data('name'));
});

$document.on('click', '#leave-tribe', function (event) {
    event.preventDefault();

    leaveTribe(player.tribeName);
});

function createTribe(name) {
    socket.emit('createTribe', name);
}

function joinTribe(name) {
    socket.emit('joinTribe', name);
}

function leaveTribe(name) {
    socket.emit('leaveTribe', name);
}

function updateTribeParticipation() {
    player.tribeParticipation = {
        wood: $('#participation-wood').val()
    }
}

function displayTribeMembers() {
    var list = $('#member-list'),
        members = tribesWithPlayers[player.tribeName];

    // Remove old
    $('li', list).each(function(index, li) {
        $(li).remove();
    });

    for (var i in members) {
        list.append('<li>' + members[i] + '</li>');
    }
}

function handleTribeName() {
    if (player.tribeName) {
        $('.current-tribe-name').html(player.tribeName);
        $('#display-tribe-info, #your-tribe').show();
        $('#choose-tribe').hide();
    } else {
        $('#display-tribe-info, #your-tribe').hide();
        $('#choose-tribe').show();
    }
}

function updateTribeList() {
    var list = $('#tribe-list'),
        item,
        tribeNames = Object.keys(tribesWithPlayers),
        name;

    // Remove old
    $('li', list).each(function(index, li) {
        $(li).remove();
    });

    if (!tribeNames.length) {
        list.append('<li>Aucune tribue disponible</li>');
    }

    for (var i in tribeNames) {
        name = tribeNames[i];
        item = name + ' (' + tribesWithPlayers[name].length + ')';

        if (name !== player.tribeName) {
            item += ' - <a class="join-tribe" data-name="' + name + '">Rejoindre</a>';
        }

        list.append('<li class="tribe">' + item + '</li>');
    }
}

socket.on('tribeList', function(allTribes) {
    tribesWithPlayers = allTribes;
    updateTribeList();
});

socket.on('createTribeResult', function(result) {
    var tribeNameInput = $('#tribe-name');
    $('#tribe-creation-message').addClass(result.status).html(result.message);

    if (result.status === 'success') {
        player.tribeName = tribeNameInput.val();
        handleTribeName();

        socket.emit('retrieveTribes');
        updateParticipationForm();
    }

    tribeNameInput.val('');
});

socket.on('joinTribeResult', function(tribeName) {
    player.tribeName = tribeName;
    handleTribeName();
    updateParticipationForm();

    socket.emit('retrieveTribes');
});

socket.on('leaveTribeResult', function() {
    player.tribeName = null;
    player.tribeParticipation = {};
    handleTribeName();
    updateParticipationForm();

    socket.emit('retrieveTribes');
});
