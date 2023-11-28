// const Contents = require('contents');

const Contents = require("./contents");
const creepCommon = {

/** @param {Creep} creep */
setTargetAtContainer: function (creep) {

    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER)}});

    if (targets.length === 0) {
        return false;
    }
    creep.memory[Contents.CreepMemory.WorkTarget] = targets[0].id;
    creep.memory[Contents.CreepMemory.WorkTargetType] = STRUCTURE_CONTAINER;
    return true;

},

/** @param {Creep} creep */
setTargetAtSource: function (creep) {

    const sources = creep.room.find(FIND_SOURCES, {
        filter: (source) => {
            return (source.energy > 0);}});
    const flag = Game.flags[creep.room.name + Contents.FlagRole.Counter];
    const numHaverster = flag.memory[sources[0].id];

    if (sources.length === 0 || numHaverster >= Contents.Number.SourceHaversterMax) {
        return false;
    }
    creep.memory[Contents.CreepMemory.WorkTarget] = sources[0].id;
    creep.memory[Contents.CreepMemory.WorkTargetType] = FIND_SOURCES;
    return true;
},

/** @param {Creep} creep
 * @param {any} type RESOURCE_*
 */
isTargetEmpty: function (creep, type) {

    const target = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);

    switch (creep.memory[Contents.CreepMemory.WorkTargetType]) {
        case FIND_SOURCES:
            if (type !== RESOURCE_ENERGY) return true;
            return (target.energy === 0);
        case STRUCTURE_CONTAINER:
            return (target.store[type] === 0);
        default:
            creep.memory[Contents.CreepMemory.WorkTarget] = undefined;
            creep.memory[Contents.CreepMemory.WorkTargetType] = undefined;
            return true
    }
},

/** @param {Creep} creep
 * @param {any} type RESOURCE_*
 */
getEnergyFromTarget: function (creep, type = RESOURCE_ENERGY) {

    const target = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);

    switch (creep.memory[Contents.CreepMemory.WorkTargetType]) {
        case STRUCTURE_CONTAINER:
            if (creep.withdraw(target, type) === ERR_NOT_IN_RANGE) {
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

/** @param {Creep} creep */
transEnergyToSpawn: function (creep) {

    const targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_SPAWN ||
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

/** @param {Creep} creep */
transEnergyToContainer: function (creep) {

    if (creep.memory[Contents.CreepMemory.WorkTargetType] === STRUCTURE_CONTAINER) {
        return false;
    }

    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER}});

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

/** @param {Creep} creep */
toUpgradeController: function (creep) {

    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
                visualizePathStyle: {stroke: '#66ff66'}})
    }
},

/** @param {Creep} creep */
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
    }
    if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
                visualizePathStyle: {stroke: '#2266ff'}});
    }
    return true;
}

}

module.exports = creepCommon
