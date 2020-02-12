import SQLite from "react-native-sqlite-2";

let db = SQLite.openDatabase("MapApps.db", "1.0", "", 1);

export default class Sqlite {
    init() {
        db.transaction(function (txn) {
            txn.executeSql("DROP TABLE IF EXISTS Users", []);
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY NOT NULL, name TEXT)",
                []
            );
            txn.executeSql("INSERT INTO Users (name) VALUES (:name)", ["nora"]);
            txn.executeSql("INSERT INTO Users (name) VALUES (:name)", ["takuya"]);
            txn.executeSql("SELECT * FROM `users`", [], function (tx, res) {
                for (let i = 0; i < res.rows.length; ++i) {
                    console.log("item:", res.rows.item(i));
                }
            });
        });
    }
}
