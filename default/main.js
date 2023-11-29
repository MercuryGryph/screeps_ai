const Contents = require('contents')
const creepHarvester = require('creep.haverster')
const creepUpgrader = require('creep.upgrader')
const creepBuilder = require('creep.builder')

const BasicCreepBody = [WORK, CARRY, MOVE, MOVE]; // cost: 300
const Creep3W2C3M = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]; // cost: 550

let CreepBody = Creep3W2C3M;
let HarvesterBody = BasicCreepBody;

const MainSpawn = Game.spawns['spawner_1'];
let RoomMainSpawnList = [MainSpawn]

/**
 * @param {StructureSpawn} spawn
 * @param {boolean} showInfo
 */
function updateFlagMemory(spawn, showInfo = false) {
    if (!Game.flags[spawn.room.name + Contents.FlagRole.Counter]) {
        spawn.room.createFlag(
            spawn.pos.x + 1,
            spawn.pos.y + 1,
            spawn.room.name + Contents.FlagRole.Counter
        );
    }
    const flag = Game.flags[spawn.room.name + Contents.FlagRole.Counter];

    for (const source of spawn.room.find(FIND_SOURCES)) {
        flag.memory[source.id] =
            spawn.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {return (
                    creep.memory[Contents.CreepMemory.WorkTarget] === source.id)}}
            ).length;

        if (showInfo) {
            source.room.visual.text(
                flag.memory[source.id] + ' | ' + source.energy,
                source.pos.x,
                source.pos.y - 0.5
            )
        }
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

    const creepsNum =
        spawn.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {return (
                creep.memory[Contents.CreepMemory.Role] === role)}}
        ).length +
        spawn.room.find(FIND_MY_SPAWNS, {
            filter: (s) => {return (
                s.spawning !== null &&
                spawn.memory[Contents.SpawnMemory.SpawningRole] === role)}}
        ).length;

    if (creepsNum < number) {
        console.log(
            Game.time + ' | ' + spawn.room.name +
            '\t | number of ' + role +
            ' is ' + creepsNum + ' / ' + number);
        console.log(
            Game.time + ' | ' + spawn.room.name +
            '\t | spawn ' + spawn.name +
            ' is spawning ' + role);

        const Memory = {memory: {}};
        Memory.memory[Contents.CreepMemory.Role] = role;
        spawn.spawnCreep(
            type,
            role + '-' + spawn.name + '-' + Game.time,
            Memory)
        spawn.memory[Contents.SpawnMemory.SpawningRole] = role;
    }
}

function showInfo() {
    for (const spawn of _.filter(Game.spawns)) {
        if (spawn.spawning) {
            const spawningTarget = Game
                .creeps[spawn.spawning.name]
                .memory[Contents.CreepMemory.Role];

            spawn.room.visual.text(
                '+ ' + spawningTarget,
                spawn.pos.x+1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}

/** @param {StructureSpawn} spawn */
function arrangeWork(spawn) {
    for (const creep of spawn.room.find(FIND_MY_CREEPS)) {
        // updateFlagMemory(spawn);
        switch (creep.memory[Contents.CreepMemory.Role]) {
            case Contents.CreepRole.Harvester:
                creepHarvester.run(creep);
                break;
            case Contents.CreepRole.Upgrader:
                creepUpgrader.run(creep);
                break;
            case Contents.CreepRole.Builder:
                creepBuilder.run(creep);
                break
            default:
                console.log(
                    Game.time + ' | ' +
                    creep.name + ' has role \" ' + creep.memory[Contents.CreepMemory.Role] +
                    ' \", which did not know what to do.')
        }
    }
}

module.exports.loop = function () {

    cleanMemory();

    showInfo();

    for (const spawn of _.filter(Game.spawns)) {

        keepCreepNumber(spawn,
            CreepBody,
            Contents.CreepRole.Upgrader,
            Contents.Number.UpgraderNeeded);

        keepCreepNumber(spawn,
            CreepBody,
            Contents.CreepRole.Harvester,
            Contents.Number.HaversterNeeded);

        keepCreepNumber(spawn,
            CreepBody,
            Contents.CreepRole.Builder,
            Contents.Number.BuilderNeeded)
    }

    for (const spawn of RoomMainSpawnList) {

        arrangeWork(spawn);

        updateFlagMemory(spawn, true);
    }
}
