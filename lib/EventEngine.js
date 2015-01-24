var config = require('config');

module.exports = function() {
    var eventEngine = {
        events: require('../models/events'),
        currentEvent: null
    };

    eventEngine.start = function(hub) {
        setInterval(function() {
            return eventEngine.triggerRandomEvent(hub);
        }, config.events.delay);
    };


    eventEngine.triggerRandomEvent = function(hub) {
        var numberEvents = Object.keys(eventEngine.events).length;
        eventEngine.currentEvent = new eventEngine.events[Object.keys(eventEngine.events)[Math.round(Math.random() * numberEvents) % numberEvents]]();

        for (var login in hub.players) {
            if (!hub.players.hasOwnProperty(login)) {
                continue;
            }

            hub.players[login].socket.emit('event', eventEngine.currentEvent);
        }

        setTimeout(function() {
            var action = eventEngine.getMostVotedAction();
            if (action) {
                for (var tribe in hub.tribes) {
                    var message = eventEngine.currentEvent[action.action](hub.tribes[tribe]);
                    for (var i = 0, c = hub.tribes[tribe].players.length ; i < c ; i++) {
                        var player = hub.tribes[tribe].players[i];
                        if (!hub.players.hasOwnProperty(player.name)) {
                            return;
                        }

                        hub.players[player.name].socket.emit('event:finished', message);
                    }
                }
            }

            eventEngine.currentEvent = null;
        }, config.events.voting_duration);
    };

    eventEngine.vote = function(action) {
        if (!eventEngine.currentEvent || !eventEngine.currentEvent.hasOwnProperty(action)) {
            return;
        }

        for (var i = 0, c = eventEngine.currentEvent.choices.length ; i < c ; i++) {
            if (eventEngine.currentEvent.choices[i].action !== action) {
                continue;
            }

            eventEngine.currentEvent.choices[i].votes++;
        }
    };

    eventEngine.getMostVotedAction = function() {
        if (!eventEngine.currentEvent) {
            return;
        }

        var maximumVotes = 0;
        var chosenChoice = null;
        for (var i = 0, c = eventEngine.currentEvent.choices.length ; i < c ; i++) {
            var choice = eventEngine.currentEvent.choices[i];
            if (choice.votes > 0) {
                maximumVotes = choice.votes;
                chosenChoice = choice;
            }
        }

        if (!chosenChoice) {
            var length = eventEngine.currentEvent.choices.length;
            return eventEngine.currentEvent.choices[Math.round(Math.random() * length) % length];
        }
        return chosenChoice;

    };

    return eventEngine;
};