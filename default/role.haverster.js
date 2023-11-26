const Contents = require('contents')

const roleHaverster = {

/** @param {Creep} creep **/
run: function (creep) {

    if (creep.store.getFreeCapacity() > 0) {

        if (!creep.memory[Contents.Memory.WorkTarget] ||
            Game.getObjectById(creep.memory[Contents.Memory.WorkTarget]).energy === 0) {
            const sources = creep.room.find(FIND_SOURCES);

            for (const source of sources) {
                const numHaverster = _.filter(
                    Game.creeps,
                    (creep) =>
                        creep.memory[Contents.Memory.Role] === Contents.Role.Harvester &&
                        creep.memory[Contents.Memory.WorkTarget] === source.id
                ).length;

                if (source.energy > 0 && numHaverster < 4) {
                    creep.memory[Contents.Memory.WorkTarget] = source.id;
                    break;
                }
            }
        }

        const source = Game.getObjectById(creep.memory[Contents.Memory.WorkTarget]);
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {
                visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        //
    }
}

}

module.exports = roleHaverster
