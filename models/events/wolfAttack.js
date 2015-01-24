module.exports = {
    name: 'Attaque de loups',
    description: "<p>Une meute de loups s'est rassemblée aux alentours de votre position. Pour l'instant, seule une dizaine " +
        " de loups sont présents, mais d'autres se rallient peu à peu au groupe. Que faire ?",

    choices: {
        "Attendre": this.wait,
        "Attaquer": this.attack
    },

    wait: function() {
        if (Math.random() < 0.2) {
            this.goAway();
        }

        this.attack();
    },

    attack: function() {
        return ["D'autres loups se sont approchés, et ils se dirigent vers vous. Le combat est inévitable.", function(player, tribe) {
            player.health -= 10;
        }];
    },

    goAway: function() {
        return ["La meute de loup ne semble pas prête à se battre. Une fois tous rassemblés, ils décident de poursuivre leur " +
            "route en vous évitant.", function() {}];
    }
};