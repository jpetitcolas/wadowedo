module.exports = function() {
    return {
        name: 'Offre du marchand',
        description:    "<p>Un marchand s'approche. Il vous propose de vous échanger 50 unités de nourriture contre 100 unités de bois." +
                        "<p>Que faire ?</p>",
        choices: [
            { label: "Accepter", action: "accept", votes: 0 },
            { label: "Refuser", action: "deny", votes: 0 }
        ],
        accept: function(tribe) {
            if (tribe.resources.wood < 50) {
                return cannotAcceptAction();
            }

            return acceptAction(tribe);
        },
        deny: function(tribe) {
            return denyAction(tribe);
        }
    }
};

var acceptAction = function(tribe) {
    tribe.resources.meat += 50;
    tribe.resources.wood -= 100;

    return "<p>Vous récupérez 50 unités de nourriture et perdez 100 unités de bois.</p>";
};

var cannotAcceptAction = function(tribe) {
    return "<p>N'essayez pas de feinter le marchand, vous ne possédez pas les resources nécessaires à l'échange.</p>";
};

var denyAction = function(tribe) {
    return "<p>Le marchand n'est pas content et promets que vous allez le regretter...</p>";
};

