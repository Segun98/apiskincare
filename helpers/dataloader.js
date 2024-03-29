const DataLoader = require("dataloader")
const pool = require("../db")

//this class is a helper to reuse dataloader accross my nested queries. This loads a single object response. eg author of books
module.exports.single = class single {
    loaders = {}
    load(table, column, id) {
        const loader = this.findLoader(table, column);
        return loader.load(id)
    }
    findLoader(table, column) {

        if (!this.loaders[table]) {
            this.loaders[table] = new DataLoader(async (keys) => {
                // I hated doing this. it was a custom code I made to produce"$1,$2..." dynamically for the sql query
                let sol = []
                for (let i = 0; i < keys.length; i++) {
                    sol.push(`$${i+1}`)
                }
                let fin = sol.join(",")
                const res = await pool.query(`select * from ${table} where ${column} in (${fin})`, keys)
                //lookup object that find corressponding id
                // const lookup = []
                // res.rows.map(u => {
                //     lookup[u.id] = u
                // })
                const lookup = res.rows.reduce((acc, row) => {
                    acc[row[column]] = row;
                    return acc;
                }, {})

                return keys.map(id => lookup[id] || null)

            })
        }
        return this.loaders[table]
    }
}

//This loads an array of responses. eg books of author
//Ben Awad helped with the lookup function logic!

module.exports.multiple = class multiple {
    loaders = {}
    load(table, column, id) {
        const loader = this.findLoader(table, column);
        return loader.load(id)
    }
    findLoader(table, column) {
        if (!this.loaders[table]) {
            this.loaders[table] = new DataLoader(async (keys) => {
                // I hated doing this. it was a custom code I made to produce"$1,$2..." dynamically for the sql query
                let sol = []
                for (let i = 0; i < keys.length; i++) {
                    sol.push(`$${i+1}`)
                }
                let fin = sol.join(",")
                const res = await pool.query(`select * from ${table} where ${column} in (${fin}) order by created_at desc`, keys)

                const lookup = res.rows.reduce((acc, row) => {
                    if (!(row[column] in acc)) {
                        acc[row[column]] = []
                    }
                    acc[row[column]].push(row)
                    return acc;
                }, {})

                return keys.map(id => lookup[id] || [])

            })
        }
        return this.loaders[table]
    }
}