var tribesWithPlayers = {};

$document.on('click', '.tribe-status', function() {
    socket.emit('retrieveTribes');

    displayFileIn('screens/tribe.html', $('#main-screen'), function() {
        updateTribeList();
        handleTribeName();
        displayTribeMembers();
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

$document.on('click', '.promote-member', function (event) {
    event.preventDefault();

    promoteMember($(event.target).data('name'));
});

$document.on('click', '.deprive-member', function (event) {
    event.preventDefault();

    depriveMember($(event.target).data('name'));
});

function createTribe(name) {
    socket.emit('createTribe', name);
}

function joinTribe(name) {
    socket.emit('joinTribe', name);
}

function promoteMember(playerName) {
    socket.emit('promoteMember', {tribeName: player.tribeName, playerName: playerName});
}

function depriveMember(playerName) {
    socket.emit('depriveMember', {tribeName: player.tribeName, playerName: playerName});
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

function displayTribeMembers() {
    var list = $('#member-list'),
        members = tribesWithPlayers[player.tribeName],
        classNames,
        member,
        name;

    // Remove old
    $('li', list).each(function(index, li) {
        $(li).remove();
    });

    for (var i in members) {
        member = members[i];
        name = member.name;
        classNames = '';

        if(member.isChief) {
            classNames = 'chief';
        }else if(member.isSubChief) {
            classNames = 'subchief';
        }

        if (player.name !== member.name && (player.isChief || player.isSubChief)) {
            if (!member.isChief || !member.isSubChief) {
                name += ' - <a class="promote-member" data-name="' + member.name + '">Promouvoir</a>'
            }

            if (member.isSubChief) {
                name += ' - <a class="deprive-member" data-name="' + member.name + '">Déchoir</a>'
            }
        }

        list.append('<li class="'+classNames+'">' + name + '</li>');
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
        list.append('<li>Aucune tribu disponible</li>');
    }

    for (var i in tribeNames) {
        name = tribeNames[i];
        item = name + ' (' + tribesWithPlayers[name].length + ')';

        if (name !== player.tribeName) {
            item += '<a class="btn btn-default join-tribe" data-name="' + name + '">Rejoindre</a>';
        }

        list.append('<li class="tribe">' + item + '</li>');
    }
}

socket.on('tribeList', function(allTribes) {
    tribesWithPlayers = allTribes;

    updateTribeList();
    displayTribeMembers();
});

socket.on('createTribeResult', function(result) {
    var tribeNameInput = $('#tribe-name');
    $('#tribe-creation-message').addClass(result.status).html(result.message);

    if (result.status === 'success') {
        player.tribeName = tribeNameInput.val();
        handleTribeName();

        socket.emit('retrieveTribes');
    }

    tribeNameInput.val('');
});

socket.on('joinTribeResult', function(tribeName) {
    player.tribeName = tribeName;
    handleTribeName();

    socket.emit('retrieveTribes');
});

socket.on('becomeChief', function() {
    player.isChief = true;
});

socket.on('becomeSubChief', function() {
    player.isSubChief = true;
});

socket.on('leaveChiefPosition', function() {
    player.isChief = false;
});

socket.on('leaveSubChiefPosition', function() {
    player.isSubChief = false;
});

socket.on('updateTribe', function(tributeData) {
    player.tribeName = tributeData.tribeName;
    player.isChief = tributeData.isChief;
    player.isSubChief = tributeData.isSubChief;

    handleTribeName();
});

socket.on('validateCrafting', function(craftData) {
    var message = '<p>Le joueur <strong>' + craftData.playerName + '</strong> souhaite construire l\'objet <strong>' + craftData.itemLabel + '</strong>';
    message += '<br /> <span class="crafting"><a href="' + craftData.itemName + '">Valider</a></span></p>';

    addMessageToChat('validation', message, new Date());
});
