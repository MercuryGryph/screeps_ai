const Contents = require('contents');
const CreepCommon = require("creep.common");

const creepBuilder = {

/** @param {Creep} creep */
run: function (creep) {

    // 检查 creep 是否需要能量
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = true;
    } else if (creep.store.getFreeCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = false;
    }

    // 如果 creep 需要能量
    if (creep.memory[Contents.CreepMemory.ShouldGetEnergy]) {

        // 如果 creep 没有工作目标或者工作目标为空，则设置目标
        if (!creep.memory[Contents.CreepMemory.WorkTarget] ||
            CreepCommon.isTargetEmpty(creep, RESOURCE_ENERGY)
        ) {
            if (CreepCommon.setTargetAtContainer(creep)) {
            } else if (CreepCommon.setTargetAtSource(creep)) {
            } // else if ...
        }

        // 从目标获取能量
        CreepCommon.getEnergyFromTarget(creep);

    // 如果 creep 不需要能量
    } else {
        // 逐个工作尝试
        if (CreepCommon.toBuildConstruction(creep)) {
        } else if (CreepCommon.transEnergyToSpawn(creep)) {
        } else if (CreepCommon.transEnergyToContainer(creep)) {
        } else CreepCommon.toUpgradeController(creep)
    }
}
}

module.exports = creepBuilder