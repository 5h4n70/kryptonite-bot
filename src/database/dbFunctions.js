/* eslint-disable new-cap */
/**
 * structure of "positionList" Table{
 * column names
 *          id      -> an Unique id
 *          name    -> position Name
 *        created by-> Discord id of the user who create this Recruitment process
 *          limit -> max  limit of unsuccessful attempts
 *          status -> active / off -> 1 / 0
 * }
 */
/**
 * structure of "SinglePosition" Table{
 *          id    ->an Unique ID
 *          questions ->list of questions
 *          sucessful_attempts -> number of successful attempts []
 *          unsuccessful_attempts -> number of unsuccessful attempts []
 *          blocked -> number of blocked users for this position []
 *          limit -> number of limit of unsuccessful attempts
 * }
 */
/**
 *  structure of "personalStats" Table{
 *          userId -> Discord User id
 *          sucessful_attempts-> number
 *          unsuccessful_attempts-> number
 *          blocked -> list of the position names this user blocked
 * }
 */
/**
 * structure of "applied" Table{
 *   id -> an Unique id for a position
 *  userId-> list of user who sucessful_attempts in a position{
 *                                                             answers:[]
 *                                                             startTime:
 *                                                             endTime:
 *                                                             }
 *
 * }
 */
const db = require("quick.db");

const finalResult = [];
// finalResult.push(new db.table("iqTable"));
// finalResult.push(new db.table("userTable"));
finalResult.push(new db.table("positionList"));
finalResult.push(new db.table("SinglePosition"));
finalResult.push(new db.table("responses"));
finalResult.push(new db.table("processStats"));
finalResult.push(new db.table("globalRecruitmentSettings"));
// finalResult.push(new db.table("statsTable"));
finalResult.push(new db.table("botConfig"));
/**
 *
 * @returns list of tables in the db
 */
function TableList() {
    return finalResult;
}
/**
 *
 * @param {tableName  : string} value
 * @returns valid_Sqlite_Table or undefined
 */
function isTable(value) {
    const pp = finalResult;
    const findResult = pp.findIndex((dt) => dt.tableName === value);
    if (findResult < 0) {
        return undefined;
    }
    return finalResult[findResult];
}
/// native functions
/**
 *
 * @param {string} tableName
 * @param {string} key
 * @param {object} value
 * @returns new Result or undefined
 */
function addDb(tableName, key, value) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.add(key, value);
}
/**
 *
 * @param {string} tableName
 * @param {string} key
 * @param {string} value
 * @returns new object or empty object if table does not exist
 */
function pushDb(tableName, key, value) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.push(key, value);
}
/**
 *
 * @param {string} tableName
 * @param {string} key
 * @param {string} value
 * @returns whole object or create new object
 */
function setDb(tableName, key, value) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.set(key, value);
}
/**
 *
 * @param {string} tableName
 * @param {string} key
 * @returns returns data from db or undefined
 */
function getDb(tableName, key) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.get(key);
}
/**
 *
 * @param {string} tableName
 * @returns false or a table's all data
 */
function allDb(tableName) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.all();
}
/**
 *
 * @param {string} tableName
 * @param {string} key
 * @returns boolean
 */
function deleteDb(tableName, key) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.delete(key);
}
/**
 *
 * @param {string} tableName
 * @param {check} key
 * @returns boolean
 */
function hasDb(tableName, key) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.has(key);
}
function subtractDb(tableName, key, value) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.subtract(key, value);
}
function fetchDb(tableName, key, value) {
    const targetTable = isTable(tableName);
    if (!targetTable) {
        return false;
    }
    return targetTable.fetch(key, value);
}

module.exports = {
    TableList,
    isTable,
    getDb,
    setDb,
    allDb,
    deleteDb,
    hasDb,
    pushDb,
    addDb,
    subtractDb,
    fetchDb,
};
