const Contents = require('contents')
const roleHarvester = require('role.haverster')
const roleUpgrader = require('role.upgrader')

const BasicCreepBody = [WORK, CARRY, MOVE];
const Creep3W1C2M = [WORK, WORK, WORK, CARRY, MOVE];

let HarvesterBody = BasicCreepBody;

const MainSpawn = Game.spawns['spawner_1'];
let RoomMainSpawnList = [MainSpawn]

/**
 * @param {StructureSpawn} spawn
 */
function updateFlagMemory(spawn) {
    if (!Game.flags[spawn.room.name + Contents.FlagRole.Counter]) {
        spawn.room.createFlag(
            spawn.pos.x + 1,
            spawn.pos.y + 1,
            spawn.room.name + Contents.FlagRole.Counter
        );
    }
    const flag = Game.flags[spawn.room.name + Contents.FlagRole.Counter];

    for (const source of spawn.room.find(FIND_SOURCES)) {
        flag.memory[source.id] = 0;
    }

    for (const creep of spawn.room.find(FIND_MY_CREEPS)) {
        const id = creep.memory[Contents.CreepMemory.WorkTarget];
        flag.memory[id] += 1;
    }

    for (const source of spawn.room.find(FIND_SOURCES)) {
        source.room.visual.text(
            flag.memory[source.id],
            source.pos.x + 0.6,
            source.pos.y
        )
    }
}

function cleanMemory() {

    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name]
        }
    }
    // for (const name in Memory.spawns) {
    //     if (!Game.spawns[name]) {
    //         delete Memory.spawns[name]
    //     }
    // }
}

/**
 * @param {StructureSpawn} spawn
 * @param {BodyPartConstant[]} type
 * @param {Role} role
 * @param {number} number
 */
function keepCreepNumber(spawn, type, role, number) {

    const creepsNum = spawn.room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.memory[Contents.CreepMemory.Role] === role
        }}).length;

    if (creepsNum < number) {
        console.log(Game.time + ' | number of ' + role + ' is ' + creepsNum);
        const Memory = {memory: {}};
        Memory.memory[Contents.CreepMemory.Role] = role;
        spawn.spawnCreep(
            type,
            role + '-' + spawn.name + '-' + Game.time,
            Memory)
    }
}

function showInfo() {
    for (const spawn of _.filter(Game.spawns)) {
        if (spawn.spawning) {
            const spawningTarget = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '+ ' + spawningTarget.memory[Contents.CreepMemory.Role],
                spawn.pos.x+1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}

function arrangeWork() {
    for (const spawn of _.filter(Game.spawns)) {
        for (const creep of spawn.room.find(FIND_MY_CREEPS)) {
            switch (creep.memory[Contents.CreepMemory.Role]) {
                case Contents.CreepRole.Harvester:
                    roleHarvester.run(creep);
                    break;
                case Contents.CreepRole.Upgrader:
                    roleUpgrader.run(creep);
                    break;
                default:
                    console.log(
                        Game.time + ' | ' +
                        creep.name + ' has role \" ' + creep.memory[Contents.CreepMemory.Role] +
                        ' \", which did not know what to do.')
            }
        }
    }
}

module.exports.loop = function () {

    cleanMemory();

    showInfo();

    arrangeWork();

    for (const spawn of RoomMainSpawnList) {
        keepCreepNumber(
            spawn, BasicCreepBody, Contents.CreepRole.Upgrader, Contents.Number.UpgraderNeeded);
        keepCreepNumber(spawn, HarvesterBody, Contents.CreepRole.Harvester, Contents.Number.HaversterNeeded);
        updateFlagMemory(spawn);
    }
}
