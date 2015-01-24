var socket = io('', { query: window.location.search.substring(1) }),
    player = {
        skills: {},
        inventory: {}
    };

function addButtonEvents () {
    $('.actions a').click(function(e) {
        e.preventDefault();

        socket.emit('harvest', $(this).attr('href'));
    });


    $('.crafting a').click(function(e) {
        e.preventDefault();
        socket.emit('crafting', $(this).attr('href'));
    });
}

var disableButtons = function() {
    $('.actions a').attr('disabled',true);
};
var enableButtons = function() {
    $('.actions a').attr('disabled',false);
};

displayFileIn('screens/main.html', $('#main-screen'), function() {
    addButtonEvents();
});
displayFileIn('navigation.html', $('#navigation'), function() {
    handleTribeName();
});
