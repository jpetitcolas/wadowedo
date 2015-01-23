var socket = io();

$("#message").keydown(function() {
    if (event.keyCode == 13) {
        $(this.form).submit();
        return false;
    }
});

$("#message-form").submit(function(e) {
    e.preventDefault();

    socket.emit('chat:message', $("#message").val());
    $(this).get(0).reset();
});

socket.on('chat:message', function(message) {
    $(".chat").append('<p><strong>' + message.name + '</strong>: ' + message.message);
});

$('.actions a').click(function(e) {
    e.preventDefault();
    switch(this.id) {
    	case 'harvest-wood':
			socket.emit('harvest', 'wood');

		    socket.on('gathering', function(data){
		        console.info('ta bien bu', data);
		    });
    	break;
    	case 'harvest-stone':
			socket.emit('harvest', 'stone');

		    socket.on('gathering', function(data){
		        console.info('Je ne vous jete pas la pierre', data);
		    });
    	break;
    	case 'hunt':
			socket.emit('hunt', 'biche');

		    socket.on('gathering', function(data){
		        console.info('Un sanglier', data);
		    });
    	break;
    }
    
});
