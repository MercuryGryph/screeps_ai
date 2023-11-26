const Contents = require('contents')
const roleHarvester = require('role.haverster')

const BasicCreepBody = [WORK, CARRY, MOVE];

const HarvesterNumber = 5;
const HarvesterBody = BasicCreepBody;

const MainSpawn = Game.spawns['spawner_1'];

function cleanMemory() {

    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
        }
    }
    for (const name in Memory.spawns) {
        if (!Game.spawns[name]) {
            delete Memory.spawns[name]
        }
    }
}

/**
 * @param {StructureSpawn} spawn
 * @param {BodyPartConstant[]} type
 * @param {Role} role
 * @param {number} number
 */
function keepCreepNumber(spawn, type, role, number) {
    const creeps = _.filter(
        Game.creeps,
        (creep) =>
            creep.memory[Contents.Memory.Role] === role &&
            creep.room === spawn.room
    );
    if (creeps.length < number) {
        spawn.spawnCreep(
            type,
            role + spawn.name + Game.time,
            {memory: {
                role: role}});
    }
}

function showInfo() {
    for (const name in Game.spawns) {
        spawn = Game.spawns[name];
        if (spawn.spawning) {
            const spawningTarget = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                'x ' + spawningTarget.memory[Contents.Memory.Role],
                spawn.pos.x+1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}

function arrangeWork() {
    for (const name in Game.creeps) {
        creep = Game.creeps[name];
        switch (creep.memory[Contents.Memory.Role]) {
            case Contents.Role.Harvester:
                roleHarvester.run(creep);
                break;
            default:
                console.error(creep.name + ' has role \" ' + creep.memory[Contents.Memory.Role] + ' \", which did not know what to do.')
        }
    }
}

module.exports.loop = function () {

    cleanMemory();

    keepCreepNumber(MainSpawn, HarvesterBody, Contents.Role.Harvester, HarvesterNumber);

    showInfo();

    arrangeWork();
}
