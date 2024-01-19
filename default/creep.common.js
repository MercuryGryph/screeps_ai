const Contents = require('contents');

const creepCommon = {

/**
 * 将 ***creep*** 的目标设置为存有 ***resource_type*** 资源的 *Container*
 * @param {Creep} creep
 * @param {any} resource_type RESOURCE_*
 *
 * @return {boolean} 是否正确工作
 */
setTargetAtContainer: function (creep, resource_type = RESOURCE_ENERGY) {

    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {return (
            structure.structureType === STRUCTURE_CONTAINER &&
            structure.store[resource_type] > 0)}});

    if (targets.length === 0) {
        return false;
    }
    creep.memory[Contents.CreepMemory.WorkTarget] = targets[0].id;
    creep.memory[Contents.CreepMemory.WorkTargetType] = STRUCTURE_CONTAINER;
    return true;

},

/**
 * 将 ***creep*** 的目标设置为非空且 *Creep* 数量未到上限的 *Source*
 * @param {Creep} creep
 *
 * @return {boolean} 是否正确工作
 */
setTargetAtSource: function (creep) {

    const sources = creep.room.find(FIND_SOURCES, {
        filter: (source) => {return (
            source.energy > 0)}});

    for (const source of sources) {
        const numHaverster = Game.flags[creep.room.name + Contents.FlagRole.Counter].memory[source.id];

        if (numHaverster < Contents.Number.SourceHaversterMax) {
            creep.memory[Contents.CreepMemory.WorkTarget] = source.id;
            creep.memory[Contents.CreepMemory.WorkTargetType] = FIND_SOURCES;
            // 更新 flag 记录的数量
            Game.flags[creep.room.name + Contents.FlagRole.Counter].memory[source.id] += 1;
            return true
        }
    }
    return false;
},

/**
 * 检查 ***creep*** 的目标是否还有 ***resource_type*** 资源剩余
 * @param {Creep} creep
 * @param {any} resource_type RESOURCE_*
 *
 * @return {boolean} 是否目标没有该种类资源
 */
isTargetEmpty: function (creep, resource_type = RESOURCE_ENERGY) {

    const target = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);

    switch (creep.memory[Contents.CreepMemory.WorkTargetType]) {
        case FIND_SOURCES:
            if (resource_type !== RESOURCE_ENERGY) return true;
            return (target.energy === 0);
        case STRUCTURE_CONTAINER:
            return (target.store[resource_type] === 0);
        default:
            creep.memory[Contents.CreepMemory.WorkTarget] = undefined;
            creep.memory[Contents.CreepMemory.WorkTargetType] = undefined;
            return true
    }
},

/**
 * 让 ***creep*** 从目标获取 ***resource_type*** 资源
 * @param {Creep} creep
 * @param {any} resource_type RESOURCE_*
 *
 * @return {boolean} 是否正确工作
 */
getEnergyFromTarget: function (creep, resource_type = RESOURCE_ENERGY) {

    const target = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);
    switch (creep.memory[Contents.CreepMemory.WorkTargetType]) {
        case STRUCTURE_CONTAINER:
            if (creep.withdraw(target, resource_type) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    visualizePathStyle: {stroke: '#ffaa00'}});
            }
            break;
        case FIND_SOURCES:
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    visualizePathStyle: {stroke: '#ffaa00'}});
            }
            break
        default:
            creep.memory[Contents.CreepMemory.WorkTarget] = undefined;
            creep.memory[Contents.CreepMemory.WorkTargetType] = undefined;
    }
},

// works can do

/**
 * *Creep* 的工作
 *
 * 让 ***creep*** 将能量运输到 *Spawn* 和 *Extension*
 * @param {Creep} creep
 *
 * @return {boolean} 是否正确工作
 */
transEnergyToSpawn: function (creep) {

    const targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {return (
            structure.structureType === STRUCTURE_SPAWN ||
                structure.structureType === STRUCTURE_EXTENSION) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});

    if (targets.length === 0) {
        return false;
    }
    if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], {
            visualizePathStyle: {stroke: '#ffffff'}});
    }
    return true;
},

/**
 * *Creep* 的工作
 *
 * 让 ***creep*** 将能量运输到 *Container*
 * @param {Creep} creep
 *
 * @return {boolean} 是否正确工作
 */
transEnergyToContainer: function (creep) {

    if (creep.memory[Contents.CreepMemory.WorkTargetType] === STRUCTURE_CONTAINER) {
        return false;
    }

    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {return (
            structure.structureType === STRUCTURE_CONTAINER &&
            structure.store.getFreeCapacity() > 0)}});

    if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
                visualizePathStyle: {stroke: '#ffffff'}});
        }
        return true;
    } else {
        return false;
    }
},

/**
 * *Creep* 的工作
 *
 * 让 ***creep*** 去升级 *Controller*
 * @param {Creep} creep
 */
toUpgradeController: function (creep) {

    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
                visualizePathStyle: {stroke: '#66ff66'}})
    }
},

/**
 * *Creep* 的工作
 *
 * 让 ***creep*** 去建造建筑
 * @param {Creep} creep
 *
 * @return {boolean} 是否正确工作
 */
toBuildConstruction: function (creep) {

    if (creep.memory[Contents.CreepMemory.WorkTargetType] !== FIND_MY_CONSTRUCTION_SITES) {

        const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if (targets.length === 0) {
            return false
        }
        creep.memory[Contents.CreepMemory.WorkTarget] = targets[0].id;
        creep.memory[Contents.CreepMemory.WorkTargetType] = FIND_MY_CONSTRUCTION_SITES;
    }
    const target = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);
    if (target == null) {   // 过程中目标已被完成
        creep.memory[Contents.CreepMemory.WorkTarget] = undefined;
        creep.memory[Contents.CreepMemory.WorkTargetType] = undefined;
    } else if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
            visualizePathStyle: {stroke: '#2266ff'}})
    }
    return true;
}

}

module.exports = creepCommon
