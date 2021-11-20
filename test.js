/* eslint-disable new-cap */
const qdb = require("quick.db");
const dbFunctions = require("./src/database/dbFunctions");

const configDb = "botConfig";
const singlePosition = "SinglePosition";
const positionListTable = "positionList";
const responseDb = "responses";
const stats = "processStats";
const ta = new qdb.table(positionListTable);
const tb = new qdb.table(singlePosition);
const fll = new qdb.table(responseDb);
const obja = {
    name: "fazlul",
    age: 24,
    np: ["adsf"],
};
const objb = {
    name: "fazlul1",
    age: 241,
    np: ["adsf1"],
};
const ar = ["a1", "a3", "a4", "a5", "a6", "a7", "a8", "a9"];
// dbFunctions.setDb(positionListTable, "17024", obja);
// dbFunctions.setDb(positionListTable, "17030", objb);
// dbFunctions.setDb(positionListTable, "17024.age", 30);
// dbFunctions.deleteDb(positionListTable, "17030");

// const { questions } = dbFunctions.getDb(singlePosition, "_9l35cs9p9");
const id = "_i5gdxf109";
// const pd = dbFunctions.allDb(responseDb, `${id}.521330948382654487`, ar);
// dbFunctions.setDb(responseDb, `${id}.748215090901287092`, ar);
// const pd = dbFunctions.getDb(responseDb, `${id}`);

const r = {};
// r.channel = channel;
// dbFunctions.setDb(positionListTable, id, r);

// const od = {
//     "873471821251481611": 2,
//     853228455393755146: 0,
// };
// od[872025560400941078] = 5;
// dbFunctions.setDb(stats, id, od);
// console.log(ta.get(`${id}.channel`));
// fll.all().forEach((dt) => {
//     console.log(dt.data);
// });
// console.log(pd["521330948382654487"]);
// console.log(dbFunctions.getDb(configDb, "prefix"));
