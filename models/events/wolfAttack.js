module.exports = function() {
    return {
        name: 'Attaque de loups',
            description: "<p>Une meute de loups s'est rassemblée aux alentours de votre position. Pour l'instant, seule une dizaine " +
    " de loups sont présents, mais d'autres se rallient peu à peu au groupe.</p> " +
    "<p>Que faire ?</p>",

        choices: [
        { label: "Se cacher", action: "hide", votes: 0 },
        { label: "Attaquer", action: "attack", votes: 0 }
    ],

        hide: function(tribe) {
        tribe.resources.food -= 50;

        return "<p>Vous choisissez quelques volontaires pour jeter de la viande aux loups, afin de détourner leur attention " +
            "pendant que vos concitoyens se cachent. Vous perdez <strong>50 unités de nourritures</strong>.</p>";
    },

        attack: function(tribe) {
            if (Math.random() < 0.5) {
                var hitPoints = Math.random() * 50 % 50;
                tribe.health -= hitPoints;
                return "<p>La bataille tourne en votre défaveur. Les pertes sont supérieures à vos victimes. Vous subissez " +
                    "<strong>" + hitPoints + " points de dégâts</strong>.";
            }

            var earnedFood = Math.random() * 100 % 100;
            tribe.resources.food += earnedFood;
            return "Vos valeureux chasseurs ont triomphés de vos féroces adversaires. Vous récoltez <strong>" + earnedFood
                + " unités de nourriture</strong>.";
        }
    }
};