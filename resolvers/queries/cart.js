module.exports = {
    async getCartItems(_, {
        customer_id,
        user_id
    }, {
        pool
    }) {

        try {

            const cart = await pool.query(`select * from cart where customer_id = $1 or user_id=$2 order by created_at desc`, [customer_id, user_id])


            // const cart = knex('cart').where({
            //     customer_id
            // })
            // .orWhere({
            //     user_id: user_id ? user_id : null
            // }).orderBy('created_at', 'desc')
            return cart.rows

        } catch (err) {
            throw new Error(err.message)
        }
    },

}