// const Contents = require('contents');

const Contents = require("./contents");
const roleCommon = {

/** @param {Creep} creep */
harvestTarget: function (creep) {

    const source = Game.getObjectById(creep.memory[Contents.CreepMemory.WorkTarget]);
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
            visualizePathStyle: {stroke: '#ffaa00'}});
    }
},

/** @param {Creep} creep */
transEnergyToSpawn: function (creep) {

    const targets = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_EXTENSION) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});

    if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {
                visualizePathStyle: {stroke: '#ffffff'}})
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
}

}

module.exports = roleCommon
