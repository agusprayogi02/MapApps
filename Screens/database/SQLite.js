import SQLite from "react-native-sqlite-2";

export default class Sqlite {
    init() {
        let db = SQLite.openDatabase("MapApps.db", "1.0", "", 1)
        db.transaction(function (txn) {
            txn.executeSql("DROP TABLE IF EXISTS kondisi", []);
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS kondisi(id INTEGER PRIMARY KEY NOT NULL, name NUMERIC)",
                []
            );
            txn.executeSql("INSERT INTO kondisi (name) VALUES (:name)", [0]);
            txn.executeSql("UPDATE kondisi SET name=:name WHERE id=1", [0], function (tx) {
                // console.log("berhasil : ", tx);
            })
        });
        return db
    }
}
