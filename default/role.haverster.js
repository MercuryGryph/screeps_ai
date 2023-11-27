const Contents = require('contents');
const RoleCommom = require('role.common');

const roleHaverster = {

/** @param {Creep} creep **/
run: function (creep) {

    if (creep.store.getFreeCapacity() > 0) {

        if (!creep.memory[Contents.CreepMemory.WorkTarget] ||
            Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]).energy === 0) {
            const sources = creep.room.find(FIND_SOURCES);

            for (const source of sources) {
                const flag = Game.flags[creep.room.name + Contents.FlagRole.Counter];
                const numHaverster = flag.memory[source.id];

                // const numHaverster = _.filter(
                //     Game.creeps,
                //     (creep) =>
                //         creep.memory[Contents.CreepMemory.Role] === Contents.CreepRole.Harvester &&
                //         creep.memory[Contents.CreepMemory.WorkTarget] === source.id
                // ).length;

                if (source.energy > 0 && numHaverster < Contents.Number.SourceHaversterMax) {
                    creep.memory[Contents.CreepMemory.WorkTarget] = source.id;
                    break;
                }
            }
        }

        const source = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {
                visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else {
        if (RoleCommom.transEnergyToSpawn(creep)) {
            // return
        }
        // 其他可行的工作
    }

}
}

module.exports = roleHaverster
