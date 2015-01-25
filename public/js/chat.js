var chats,
    currentTab = 'all',
    messageCounters;

function initChat() {
    chats = {
        all: $('#chat-all .chat-messages'),
        tribe: $('#chat-tribe .chat-messages'),
        validation: $('#chat-validation .chat-messages'),
        votes: $('#chat-votes .chat-messages')
    };

    messageCounters = {
        all: 0,
        tribe: 0,
        validation: 0
    };

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        currentTab = $(e.target).attr('href').split('-')[1];
        messageCounters[currentTab] = 0;

        updateMessageCount();
    });

    $('#chat-tabs a:first').tab('show');
    updateMessageCount();
}

function updateMessageCount() {
    var count;

    ['all', 'tribe', 'validation'].forEach(function(type) {
        count = messageCounters[type];

        if (messageCounters[type] === 0) {
            $('#count-'+type).hide();
        } else {
            $('#count-'+type).show().html(count);
        }
    });
}

$document.on('keydown', '#message', function() {
    if (event.keyCode == 13) {
        $(this.form).submit();
        return false;
    }
});

$document.on('submit', '#message-form', function(e) {
    e.preventDefault();
    var to = $('#chat-tabs li.active a').attr('href').split('-')[1];
    if (to === 'validation') {
        to = 'all';
    }

    socket.emit('chat:message', {to: to, text: $('#message').val()});
    $(this).get(0).reset();
});

socket.on('chat:message', function(messages) {
    for (var i = 0, c = messages.length; i < c; i++) {
        var message = messages[i];

        addMessageToChat(message.content.to, '<p class="message"><strong>' + message.name + '</strong>: ' + message.content.text, message.time);
    }
});

function addMessageToChat(chat, message, time) {
    if (chat !== currentTab && (new Date()) - new Date(time) <= 10000) {
        messageCounters[chat]++;
    }

    chats[chat].prepend(message);

    updateMessageCount();
}
