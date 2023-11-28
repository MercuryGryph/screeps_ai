// const Contents = require('contents');

const Contents = require("./contents");
const roleCommon = {

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

    if (sources.length === 0) {
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

/** @param {Creep} creep */
getEnergyFromTarget: function (creep) {

    const source = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);
    if (creep.harvest(source) === ERR_INVALID_TARGET) {
        if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {
            visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return
    }
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: {stroke: '#ffaa00'}});
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
                visualizePathStyle: {stroke: '#ffffff'}})
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
    if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
                visualizePathStyle: {stroke: '#ffffff'}});
    }
    return true;
}

}

module.exports = roleCommon
