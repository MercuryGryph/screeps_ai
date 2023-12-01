const Contents = require('contents');
const CreepCommon = require('creep.common')

const creepUpgrader = {

/** @param {Creep} creep */
run: function (creep) {

    // 检查 creep 是否没有能量
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = true;
    } else if (creep.store.getFreeCapacity() === 0) {
        creep.memory[Contents.CreepMemory.ShouldGetEnergy] = false;
    }

    // 如果 creep 应该获取能量
    if (creep.memory[Contents.CreepMemory.ShouldGetEnergy]) {

        // 检查 creep 是否没有能量目标
        if (!creep.memory[Contents.CreepMemory.WorkTarget] ||
            CreepCommon.isTargetEmpty(creep, RESOURCE_ENERGY)
        ) {
            // 设置 creep 的能量目标
            if (CreepCommon.setTargetAtContainer(creep)) {
            } else if (CreepCommon.setTargetAtSource(creep)) {
            } // else if ...
        }

        // 从能量目标获取能量
        CreepCommon.getEnergyFromTarget(creep);

    } else {
        // 向控制器升级
        CreepCommon.toUpgradeController(creep);
    }
}
}

module.exports = creepUpgrader;