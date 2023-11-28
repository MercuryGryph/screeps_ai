const Contents = require('contents');
const CreepCommon = require('creep.common');

const creepHaverster = {

/** @param {Creep} creep **/
run: function (creep) {

    if (creep.store.getUsedCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = true;
    } else if (creep.store.getFreeCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = false;
    }

    if (creep.memory[Contents.CreepMemory.ShouldGetEnergy]) {

        if (!creep.memory[Contents.CreepMemory.WorkTarget] ||
            CreepCommon.isTargetEmpty(creep, RESOURCE_ENERGY)) {
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

        CreepCommon.getEnergyFromTarget(creep);

    } else {
        if (CreepCommon.transEnergyToSpawn(creep)) {
        } else if (CreepCommon.transEnergyToContainer(creep)) {
        } else if (CreepCommon.toBuildConstruction(creep)){
        } else CreepCommon.toUpgradeController(creep)
    }

}
}

module.exports = creepHaverster
