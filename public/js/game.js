var socket = io('', { query: window.location.search.substring(1) }),
    player = {
        skills: {},
        inventory: {}
    };

$('.actions a').click(function(e) {
    e.preventDefault();

    socket.emit('harvest', $(this).attr('href'));
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
    
$('.crafting a').click(function(e) {
    e.preventDefault();
    socket.emit('crafting', $(this).attr('href'));
});

displayFileIn('screens/main.html', $('#main-screen'));
displayFileIn('navigation.html', $('#navigation'), function() {
    handleTribeName();
});
