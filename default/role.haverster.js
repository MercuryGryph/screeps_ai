const Contents = require('contents');
const RoleCommon = require('role.common');

const roleHaverster = {

/** @param {Creep} creep **/
run: function (creep) {

    if (creep.store.getFreeCapacity() > 0) {

        if (!creep.memory[Contents.CreepMemory.WorkTarget] ||
            RoleCommon.isTargetEmpty(creep, RESOURCE_ENERGY)) {
            const sources = creep.room.find(FIND_SOURCES);

            for (const source of sources) {
                const flag = Game.flags[creep.room.name + Contents.FlagRole.Counter];
                const numHaverster = flag.memory[source.id];

                if (source.energy > 0 && numHaverster < Contents.Number.SourceHaversterMax) {
                    creep.memory[Contents.CreepMemory.WorkTarget] = source.id;
                    creep.memory[Contents.CreepMemory.WorkTargetType] = FIND_SOURCES;
                    break;
                }
            }
        }

        RoleCommon.getEnergyFromTarget(creep);

    } else {
        if (RoleCommon.transEnergyToSpawn(creep)) {
        } else if (RoleCommon.transEnergyToContainer(creep)) {
        } else RoleCommon.toUpgradeController(creep)
    }

}
}

module.exports = roleHaverster
