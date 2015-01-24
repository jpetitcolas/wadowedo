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

var disableButtons = function() {
    $('.actions a').attr('disabled',true);
};
var enableButtons = function() {
    $('.actions a').attr('disabled',false);
};

$('.actions a').click(function(e) {
    e.preventDefault();
    disableButtons();
    $(this).attr('disabled',false);
    var inprogress = Ladda.create(this);
    inprogress.start();
    switch(this.id) {
    	case 'harvest-wood':
			socket.emit('harvest', 'wood');
		    socket.on('gathering', function(data){
		        console.info('ta bien bu', data);
                inprogress.stop();
                enableButtons();
		    });
    	break;
    	case 'harvest-stone':
			socket.emit('harvest', 'stone');

		    socket.on('gathering', function(data){
                inprogress.stop();
		        console.info('Je ne vous jete pas la pierre', data);
                enableButtons();
		    });
    	break;
    	case 'hunt':
			socket.emit('harvest', 'meat');

		    socket.on('hunting', function(data){
		        console.info('Un sanglier', data);
                inprogress.stop();
                enableButtons();
		    });
    	break;
    }
    
});
