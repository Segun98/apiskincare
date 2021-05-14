module.exports = {
    async addToCart(_, {
        customer_id,
        product_id,
        prod_creator_id,
        quantity,
        user_id
    }, {
        knex,
        pool
    }) {

        //checks if item exists.

        // const product = await knex
        //     .from('cart')
        //     .select('product_id').where({
        //         customer_id
        //     }).orWhere({
        //         user_id: user_id ? user_id : null
        //     })

        const product = await pool.query(`select product_id from cart where customer_id = $1 or user_id = $2`, [customer_id, user_id])


        if (product.rows.length > 0) {
            //don't change error message
            product.rows.forEach(p => {
                if (p.product_id === product_id) {
                    throw new Error("Item is already in Cart")
                }
            })
        }
        try {
            await knex('cart').insert({
                product_id,
                prod_creator_id,
                quantity,
                customer_id,
                user_id: user_id ? user_id : null
            })

            return {
                message: "Item has been added to cart"
            }

        } catch (err) {
            throw new Error(err.message)
        }

    },

    async deleteFromCart(_, {
        id
    }, {
        pool
    }) {

        try {

            await pool.query(`delete from cart where id = $1`, [id])

            return {
                message: "Item has been removed from cart"
            }

        } catch (err) {
            throw new Error(err.message)
        }

    },


    async updateCart(_, {
        id,
        quantity
    }, {
        pool
    }) {

        try {
            await pool.query(`update cart set quantity = $2 where id = $1`, [id, quantity])

            return {
                message: "Quantity successfully updated"
            }

        } catch (err) {
            throw new Error(err.message)
        }
    },

    //After successfull payment
    async deleteAllFromCart(_, {
        customer_id,
        user_id,
        prod_creator_id
    }, {
        pool
    }) {

        try {
            await pool.query(`delete from cart where customer_id = $1 and prod_creator_id =$2`, [customer_id, prod_creator_id])

            return {
                message: "Cart cleared!"
            }

        } catch (err) {
            throw new Error(err.message)
        }

    },

}