const knex = require("../../knex/db");

/*
 first arg expects parent, second expects inputs, third - context
*/
module.exports = {

    async product(_, {
        name_slug
    }, {
    }) {
        try {
            const product = await knex.raw(`select * from products where name_slug = ?`, [name_slug])
            if (product.rows.length === 0) {
                throw new Error(404)
            }
            return product.rows[0]
        } catch (err) {
            throw new Error(err.message)
        }
    },

    async featuredProducts(_, {
        limit
    }, {
    }) {
        try {
            // const start = Date.now()
            // console.time('Query time');
            const users = await knex.raw(`SELECT p.id, p.name, p.name_slug, p.price, p.images from products p INNER JOIN users u on p.creator_id= u.id where p.featured = ? and u.online = ? and p.available_qty > 0 and p.in_stock = ? ORDER BY p.created_at desc limit ${limit}`, Array(3).fill('true'))
            // console.timeEnd('Query time');
            // console.log(Date.now() - start);
            return users.rows

        } catch (err) {
            console.log(err.message);
            throw new Error(err.message)
        }
    },


    async byCategory(_, {
        category,
        limit,
        offset,
        sort
    }, {
    }) {

        /* is this how it's done in large apps? lol.
        dynamically add sort to the sql query */

        let sortQuery = ""
        if (sort === "low") {
            sortQuery = `p.price asc,`
        } else if (sort === "high") {
            sortQuery = `p.price desc,`
        }

        try {
            const products = await knex.raw(`select p.id, p.name, p.name_slug, p.price, p.images from products p inner join users u on p.creator_id = u.id where ? = ANY(p.category) and u.online = ? and p.available_qty > 0 and p.in_stock = ? order by ${sortQuery} u.completed_qty desc limit ${limit} offset ${offset}`, [category, "true", "true"])
            return products.rows
        } catch (err) {
            throw new Error(err.message)
        }
    },

    async mainCategory(_, {
        main_category,
        limit,
        offset,
        sort
    }, {
    }) {
        /* is this how it's done in large apps? lol.
        dynamically add sort to the sql query */

        let sortQuery = ""
        if (sort === "low") {
            sortQuery = `p.price asc,`
        } else if (sort === "high") {
            sortQuery = `p.price desc,`
        }

        try {
            const products = await knex.raw(`select p.id, p.name, p.name_slug, p.price, p.images, p.main_category from products p inner join users u on p.creator_id = u.id where p.main_category = ? and u.online = ? and p.available_qty > 0 and p.in_stock = ? order by ${sortQuery} u.completed_qty desc limit ${limit} offset ${offset}`, [main_category, "true", "true"])
            return products.rows
        } catch (err) {
            throw new Error(err.message)
        }
    },

    async editProductPage(_, {
        id
    }, {
    }) {
        try {
            const product = await knex.raw(`select * from products where id = ?`, [id])
            return product.rows[0]
        } catch (err) {
            throw new Error(err.message)
        }
    },

    async search(_, {
        query,
        limit,
        offset,
        sort
    }, {
    }) {

        /* is this how it's done in large apps? lol.
         dynamically add sort to the sql query */

        let sortQuery = ""
        if (sort === "low") {
            sortQuery = `p.price asc,`
        } else if (sort === "high") {
            sortQuery = `p.price desc,`
        }

        try {
            const products = await knex.raw(`SELECT p.id, p.name, p.name_slug, p.price, p.images FROM products p INNER JOIN users u on p.creator_id = u.id WHERE p.name ILIKE '%${query}%' or p.description ILIKE '%${query}%' and u.online = ? and p.available_qty > 0 and p.in_stock = ? ORDER BY ${sortQuery} u.completed_qty DESC LIMIT ${limit} OFFSET ${offset}`, Array(2).fill('true'))
            return products.rows
        } catch (err) {
            throw new Error(err.message)
        }
    }

}