const Contents = require('contents');
const RoleCommon = require('role.common')

const roleUpgrader = {

/** @param {Creep} creep */
run: function (creep) {
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = true;
    }
    if (creep.store.getFreeCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = false;
    }

    if (creep.memory[Contents.CreepMemory.ShouldGetEnergy]) {

        if (!creep.memory[Contents.CreepMemory.WorkTarget] ||
            Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget])
                .energy === 0
            // ||
            // Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget])
            //     .store.getUsedCapacity(RESOURCE_ENERGY) === 0
            ) {
            if (RoleCommon.setTargetAtContainer(creep)) {
            } else if (RoleCommon.setTargetAtSource(creep)) {
            }
        }

        RoleCommon.getEnergyFromTarget(creep);

    } else {
        RoleCommon.toUpgradeController(creep);
    }
}
}

module.exports = roleUpgrader;
