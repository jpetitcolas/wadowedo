var config = require('config');

module.exports = function() {
    var eventEngine = {
        events: require('../models/events')
    };

    eventEngine.start = function(hub) {
        setInterval(function() {
            if (1 - Math.random() > config.events.probability) {
                return eventEngine.triggerRandomEvent(hub);
            }
        }, config.events.delay);
    };

    eventEngine.triggerRandomEvent = function(hub) {
        var numberEvents = Object.keys(eventEngine.events).length;
        var event = eventEngine.events[Object.keys(eventEngine.events)[Math.round(Math.random() * numberEvents) % numberEvents]];

        for (var login in hub.players) {
            if (!hub.players.hasOwnProperty(login)) {
                continue;
            }

            var player = hub.players[login];
            player.socket.emit('event', event);
        }
    };

    return eventEngine;
};