module.exports = {
    async getCartItems(_, {
        customer_id,
        user_id,
        prod_creator_id
    }, {
        pool,
        // knex
    }) {

        try {

            const cart = await pool.query(`select * from cart where customer_id = $1 or user_id=$2 order by created_at desc`, [customer_id, user_id])

            //filter out only the products that belong to this vendor
            const res = cart.rows.filter(c => c.prod_creator_id === prod_creator_id)
            // const cart = await knex('cart').where({
            //         customer_id
            //     })
            //     .orWhere({
            //         user_id: user_id ? user_id : null
            //     }).orderBy('created_at', 'desc')
            return res

        } catch (err) {
            throw new Error(err.message)
        }
    },

}