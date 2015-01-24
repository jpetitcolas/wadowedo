var socket = io('', { query: window.location.search.substring(1) }),
    player = {
        skills: {},
        inventory: {}
    };
var disableButtons = function() {
    $('.actions a').attr('disabled',true);
};
var enableButtons = function() {
    $('.actions a').attr('disabled',false);
};
var inprogress;
function addButtonEvents () {
    $('.actions a').click(function(e) {
        e.preventDefault();
        inprogress = Ladda.create(this);
        inprogress.start();
        disableButtons();
        socket.emit('harvest', $(this).attr('href'));
    });


    $('.crafting a').click(function(e) {
        e.preventDefault();
        inprogress = Ladda.create(this);
        inprogress.start();
        disableButtons();
        socket.emit('crafting', $(this).attr('href'));
    });
}



displayFileIn('screens/main.html', $('#main-screen'), function() {
    addButtonEvents();
});
displayFileIn('navigation.html', $('#navigation'), function() {
    handleTribeName();
});
