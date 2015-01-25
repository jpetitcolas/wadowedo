module.exports = function() {
    return {
        name: 'Attaque de loups',
        description:    "<p>Une meute de loups s'est rassemblée aux alentours de votre position. Pour l'instant, seule une dizaine " +
                        " de loups sont présents, mais d'autres se rallient peu à peu au groupe.</p> " +
                        "<p>Que faire ?</p>",
        choices: [
            { label: "Se cacher", action: "hide", votes: 0 },
            { label: "Attaquer", action: "attack", votes: 0 }
        ],
        hide: function(tribe) {
            if (tribe.resources.meat === 0) {
                return cannotHideAction(tribe);
            }

            return hideAction(tribe);
        },
        attack: function(tribe) {
            return attackAction(tribe);
        }
    }
};

var hideAction = function(tribe) {
    tribe.resources.meat -= (tribe.resources.meat * 15 / 100);
    return "<p>Vous choisissez quelques volontaires pour jeter de la viande aux loups, afin de détourner leur attention " +
        "pendant que vos concitoyens se cachent. Vous perdez <strong>50 unités de nourritures</strong>.</p>";
};

var cannotHideAction = function(tribe) {
    return "<p>Impossible de se cacher, vous n'avez pas de nourriture pour détourner leur attention, vous attaquez.</p>" + attackAction(tribe);
};

var attackAction = function(tribe) {
    if (Math.random() < 0.5) {
        return defeatAttackAction(tribe);
    }
    return successAttackAction(tribe);
};

var successAttackAction = function(tribe) {
    var hitPoints = Math.round(Math.random() * 50 % 50);
    tribe.setHealth(tribe.health - hitPoints);
    return "<p>La bataille tourne en votre défaveur. Les pertes sont supérieures à vos victimes. Vous subissez " +
        "<strong>" + hitPoints + " points de dégâts</strong>.";
};

var defeatAttackAction = function(tribe) {
    var earnedFood = Math.round(Math.random() * 100 % 100);
    tribe.resources.meat += earnedFood;
    return "Vos valeureux chasseurs ont triomphés de vos féroces adversaires. Vous récoltez <strong>" + earnedFood
        + " unités de nourriture</strong>.";
};
