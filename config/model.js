const db = require("../database/dbConfig");

module.exports = function(table) {
    function findBy(filter) {
        return db(table).where(filter);
    }
    function add(user) {
        const [id] = db(table).insert(user);
        return findById(id);
    }
    function findById(id) {
        return db(table)
            .select("id", "username")
            .where({id})
            .first()
    }
    return {
        findBy,
        add,
        findById
    }
}
