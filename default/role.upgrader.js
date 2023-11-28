const Contents = require('contents');
const RoleCommon = require('role.common')

const roleUpgrader = {

/** @param {Creep} creep */
run: function (creep) {

    if (creep.store.getUsedCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = true;
    } else if (creep.store.getFreeCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = false;
    }

    if (creep.memory[Contents.CreepMemory.ShouldGetEnergy]) {
        creep.memory[Contents.CreepMemory.WorkTargetType] = undefined;

        if (!creep.memory[Contents.CreepMemory.WorkTarget] ||
            RoleCommon.isTargetEmpty(creep, RESOURCE_ENERGY)
        ) {
            if (RoleCommon.setTargetAtContainer(creep)) {
            } else if (RoleCommon.setTargetAtSource(creep)) {
            } // else if ...
        }

        RoleCommon.getEnergyFromTarget(creep);

    } else {
        RoleCommon.toUpgradeController(creep);
    }
}
}

module.exports = roleUpgrader;
