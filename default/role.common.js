// const Contents = require('contents');

const roleCommon = {

/**
 * @param {Creep} creep
 */
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
            return true
        } else {
            return false
        }
}
}

module.exports = roleCommon
