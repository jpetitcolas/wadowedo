var modal = $("#modal");

var currentEvent = null;

modal.on("click", "button", function(e) {
    e.preventDefault();
    socket.emit("event:vote", $(this).data("action"));
    currentEvent = null;
    modal.modal("hide");
});

socket.on('event', function(event) {
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

socket.on('event:finished', function(message) {
    $("#modal-body", modal).html(message);
    $("#modal-actions", modal).html('<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>');
    modal.modal('show');
});