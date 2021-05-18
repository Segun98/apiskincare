const DataLoader = require('dataloader')
const knex = require('../../knex/db')

async function creator(parent, {}, {
    loaderOne
}) {
    try {
        let loader = new DataLoader(async ids => {
            const rows = await knex.select("*").from("users").whereIn("id", ids)
            const lookup= rows.reduce((acc, row) => {
                acc[row["id"]] = row;
                return acc;
            }, {})
            return ids.map(id => lookup[id] || [])
        })

        return loader.load(parent.creator_id)
        // return loaderOne.load("users", "id", parent.creator_id)
    } catch (err) {
        throw new Error(err.message)
    }

}

//get related products
async function related(parent, {}, {
    pool
}) {
    try {
        const result = await pool.query(`select p.id, p.name, p.name_slug, p.price, p.images from products p inner join users u on p.creator_id = u.id where $1 = ANY(p.category) and p.available_qty > 0 and p.in_stock = $2 and u.online = $2 order by u.completed_qty desc limit 8`, [parent.category[0], "true"])
        return result.rows

    } catch (err) {
        throw new Error(err.message)
    }

}

module.exports = {
    creator,
    related
}