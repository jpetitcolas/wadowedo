var modal = $("#modal");

var currentEvent = null;
var voteSuccess = $("#vote-success");

modal.on("click", "button[data-action]", function(e) {
    e.preventDefault();
    socket.emit("event:vote", $(this).data("action"));
    modal.modal("hide");

    var message = "<p><strong>" + currentEvent.name + " &dash; </strong> " + player.name + " a voté pour <em>" + $(this).text() + "</em></p>";
    addMessageToChat('votes', message, new Date());

    voteSuccess.show();
});

socket.on('event', function(event) {
    voteSuccess.hide();

    if (currentEvent) {
        // Trigger a single event
        return;
    }

    currentEvent = event;

    $("#modal-title", modal).text(event.name);
    $("#modal-body", modal).html(event.description);

    var actions = $("#modal-actions", modal).empty();
    for (var i = 0, c = event.choices.length ; i < c ; i++) {
        var choice = event.choices[i];
        actions.append('<button type="button" class="btn btn-default" data-action="' + choice.action + '">' + choice.label + '</button>');
    }
    modal.modal('show');
});

socket.on('event:finished', function(result) {
    voteSuccess.hide();

    var message = "<p><strong>" + currentEvent.name + " &dash; </strong> la tribu a fait son choix : <em>" + result.action.label + "</em>.</p>";
    addMessageToChat('votes', message, new Date());

    $("#modal-title", modal).html(result.action.label);
    $("#modal-body", modal).html(result.message);
    $("#modal-actions", modal).html('<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>');
    modal.modal('show');

    currentEvent = null;
});