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
            CreepCommon.isTargetEmpty(creep, RESOURCE_ENERGY)
        ) {
            CreepCommon.setTargetAtSource(creep);
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
