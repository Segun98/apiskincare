const DataLoader = require('dataloader')
const knex = require('../../knex/db')

async function usersProducts(parent, {}, {
    // loaderTwo
}) {
    try {
        if (!parent.id) {
            throw new Error("404")
        }

        let loader = new DataLoader(async ids => {
            const rows = await knex.select("*").from("products").whereIn("creator_id", ids)

            const lookup = rows.reduce((acc, row) => {
                if (!(row["creator_id"] in acc)) {
                    acc[row["creator_id"]] = []
                }
                acc[row["creator_id"]].push(row)
                return acc;
            }, {})

            return ids.map(id => lookup[id] || null)
        })

        return loader.load(parent.id)

        // let products = await loaderTwo.load("products", "creator_id", parent.id)
        // return products

    } catch (err) {
        // console.log(err);
        throw new Error(err.message)
    }

}
async function customerOrders(parent, {}, {
    loaderTwo
}) {
    try {
        if (!parent.id) {
            throw new Error("404")
        }
        let orders = await loaderTwo.load("orders", "customer_id", parent.id)
        return orders

    } catch (err) {
        throw new Error(err.message)
    }

}


//works specifically with homeProducts query
async function homeProducts(parent, {}, {
    // pool
}) {
    try {
        // let products = await pool.query(`select * from products where creator_id= $1 order by created_at desc limit 8`, [parent.id])
        // return products.rows

        let loader = new DataLoader(async ids => {
            const rows = await knex.select("*").from("products").whereIn("creator_id", ids).limit(8)

            const lookup = rows.reduce((acc, row) => {
                if (!(row["creator_id"] in acc)) {
                    acc[row["creator_id"]] = []
                }
                acc[row["creator_id"]].push(row)
                return acc;
            }, {})

            return ids.map(id => lookup[id] || null)
        })

        return loader.load(parent.id)
    } catch (err) {
        throw new Error(err.message)
    }

}

module.exports = {
    usersProducts,
    customerOrders,
    homeProducts
}