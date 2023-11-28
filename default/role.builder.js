const Contents = require('contents');
const RoleCommon = require("./role.common");

const roleBuilder = {

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
        if (RoleCommon.toBuildConstruction(creep)) {
        } else if (RoleCommon.transEnergyToContainer(creep)) {
        } else if (RoleCommon.transEnergyToSpawn(creep)) {
        } else RoleCommon.toUpgradeController(creep)
    }
}
}

module.exports = roleBuilder
