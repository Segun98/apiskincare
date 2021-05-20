const knex = require("../../knex/db");


module.exports = {
    async getCartItems(_, {
        customer_id,
        user_id,
        prod_creator_id
    }, {
    }) {

        try {

            const cart = await knex.raw(`select * from cart where customer_id = ? or user_id=? order by created_at desc`, [customer_id, user_id])

            //filter out only the products that belong to this vendor
            const res = cart.rows.filter(c => c.prod_creator_id === prod_creator_id)
            return res

        } catch (err) {
            throw new Error(err.message)
        }
    },

}