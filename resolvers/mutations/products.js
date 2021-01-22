//@ts-check
const {
    verifyJwt
} = require("../../helpers/auth/middlewares")


module.exports = {

    /** 
    * @param {any} _
    * @param {Object} obj -an object
    * @param {String} obj.name
    * @param {String} obj.name_slug
    * @param {String} obj.description
    * @param {String} obj.price
    * @param {String} obj.category
    * @param {String} obj.main_category
    * @param {String} obj.images
    * @param {number} obj.available_qty
    * @param {number} obj.stk
      @param{any} pool
    */
    async addProduct(_, {
        name,
        name_slug,
        description,
        price,
        category,
        main_category,
        images,
        available_qty
    }, {
        pool,
        req,
        knex
    }) {
        verifyJwt(req)
        // #checks for role, should only be vendor 
        if (req.payload.role_id !== 'vendor') {
            throw new Error("Unauthorised")
        }

        // prevent duplicate slugs
        const slugCheck = await pool.query(`select * from products where name_slug = $1`, [name_slug])

        let random = Math.floor(Math.random() * 4935)

        try {
            await knex('products').insert({
                name,
                name_slug: `${slugCheck.rows.length > 0? name_slug+random : name_slug}`,
                description,
                price,
                category,
                main_category,
                images,
                available_qty,
                creator_id: req.payload.user_id
            })

            return {
                message: "Product successfully added"
            }

        } catch (err) {
            throw new Error(err.message)
        }


    },


    async updateProduct(_, {
        id,
        name,
        description,
        price,
        category,
        main_category,
        images,
        in_stock,
        available_qty,
        creator_id
    }, {
        req,
        knex
    }) {
        verifyJwt(req)

        if (req.payload.user_id !== creator_id) {
            throw new Error("Unauthorised, wrong user")
        }

        try {
            await knex('products')
                .where({
                    id
                })
                .update({
                    name,
                    description,
                    price,
                    category,
                    main_category,
                    images,
                    in_stock,
                    available_qty
                })

            return {
                message: "Product successfully updated"
            }

        } catch (err) {
            throw new Error(err.message)
        }
    },

    //update available quantity in stock for ordered product
    async updateQuantity(_, {
        id,
        qty_ordered
    }, {
        pool
    }) {
        try {
            //available quantity in stock
            const old_qty = await pool.query(`select available_qty from products where id = $1`, [id])
            // available qty minus quantity ordered
            const updated_qty = old_qty.rows[0].available_qty - qty_ordered
            await pool.query(`update products set available_qty = $2 where id = $1`, [id, updated_qty])
            //set product as out of stock if quantity is zero
            if (updated_qty === 0) {
                await pool.query(`update products set in_stock = $2 where id = $1`, [id, 'false'])
            }
            return {
                message: "Quantity updated"
            }

        } catch (err) {
            throw new Error(err.message)
        }

    },


    async deleteProduct(_, {
        id,
        creator_id
    }, {
        pool,
        req
    }) {
        verifyJwt(req)
        if (req.payload.user_id !== creator_id) {
            throw new Error("Unauthorised, wrong user")
        }
        try {
            await pool.query(`delete from products where id = $1`, [id])

            return {
                message: "Product successfully deleted"
            }

        } catch (err) {
            throw new Error(err.message)
        }

    }

}