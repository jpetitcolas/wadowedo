var Tribe = function(name) {
    this.name = name;

    this.players = [];

    this.chief = null;

    this.subchiefs = [];

    this.resources = {
        food: 50,
        wood: 0,
        stone: 0,
        gold: 0,
        soil: 0
    };
};

module.exports = Tribe;
