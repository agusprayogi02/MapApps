import SQLite from "react-native-sqlite-2";

let db = SQLite.openDatabase("MapApps.db", "1.0", "", 1)
export default class Sqlite {
    init() {
        db.transaction(function (txn) {
            txn.executeSql("DROP TABLE IF EXISTS kondisi", []);
            txn.executeSql("DROP TABLE IF EXISTS Markers", []);
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS kondisi(id INTEGER PRIMARY KEY NOT NULL, name NUMERIC)",
                []
            );
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS Markers(id INTEGER PRIMARY KEY NOT NULL, name NUMERIC)",
                []
            );
        });
    }
    conn() {
        return db
    }
}
