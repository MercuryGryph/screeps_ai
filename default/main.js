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
 * 更新 ***spawn*** 所在 *room* 的 *flag* 的 *memory*
 * @param {StructureSpawn} spawn
 * @param {boolean} showInfo 是否在地图上打印信息
 */
function updateFlagMemory(spawn, showInfo = false) {

    // 如果不存在 flag, 创建
    if (!Game.flags[spawn.room.name + Contents.FlagRole.Counter]) {
        spawn.room.createFlag(
            spawn.pos.x + 1,
            spawn.pos.y + 1,
            spawn.room.name + Contents.FlagRole.Counter
        );
    }

    const flag = Game.flags[spawn.room.name + Contents.FlagRole.Counter];

    // 与 Source 相关信息
    for (const source of spawn.room.find(FIND_SOURCES)) {

        // 要从 source 采集能量的 creep 的 数量
        flag.memory[source.id] =
            spawn.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {return (
                    creep.memory[Contents.CreepMemory.WorkTarget] === source.id)}}
            ).length;

        // 在地图上显示
        if (showInfo) {
            source.room.visual.text(
                flag.memory[source.id] + ' | ' + source.energy,
                source.pos.x,
                source.pos.y - 0.5
            )
        }
    }
}

/**
 * 清除无效的 *creep* (和 *spawn*?)
 */
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
 * 当拥有对应 ***role*** 的 *creep* 现有数量小于 ***number*** 时，让 ***spawn*** 生成新的 *creep*
 * @param {StructureSpawn} spawn spawn
 * @param {BodyPartConstant[]} body 身体部件
 * @param {Role} role creep 的身份
 * @param {number} number 数量
 */
function keepCreepNumber(spawn, body, role, number) {

    // 统计 creep 数量
    const creepsNum =
        spawn.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {return (
                creep.memory[Contents.CreepMemory.Role] === role)}}
        ).length +
        // 加上正在生成的
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
            body,
            role + '-' + spawn.name + '-' + Game.time,
            Memory)
        spawn.memory[Contents.SpawnMemory.SpawningRole] = role;
    }
}

/**
 * 在地图上打印信息:
 * - *spawn* 正在生成的 *creep* 的 *role*
 */
function showInfo() {
    for (const spawn of _.filter(Game.spawns)) {
        // spawn 正在生成的 creep 的 身份
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

/**
 * 为 ***spawn*** 所在 *room* 的所有 *creep* 安排与身份符合的工作
 * @param {StructureSpawn} spawn
 */
function arrangeWork(spawn) {
    for (const creep of spawn.room.find(FIND_MY_CREEPS)) {

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
