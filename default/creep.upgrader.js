const Contents = require('contents');
const CreepCommon = require('creep.common')

const creepUpgrader = {

/** @param {Creep} creep */
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
            if (CreepCommon.setTargetAtContainer(creep)) {
            } else if (CreepCommon.setTargetAtSource(creep)) {
            } // else if ...
        }

        CreepCommon.getEnergyFromTarget(creep);

    } else {
        CreepCommon.toUpgradeController(creep);
    }
}
}

module.exports = creepUpgrader;
