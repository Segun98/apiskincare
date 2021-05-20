//@ts-check
const {
    verifyJwt
} = require("../../helpers/auth/middlewares")
const knex = require("../../knex/db");


module.exports = {
    async getCustomerOrders(_, {limit}, {
        req
    }) {
        verifyJwt(req)
        if (req.payload.role_id !== 'customer') {
            throw new Error("Unauthorised")
        }
        try {
            const result = await knex.raw(`SELECT * from orders o INNER JOIN order_status os ON os.order_id = o.order_id WHERE o.customer_id = ? and os.paid = ? ORDER BY o.created_at DESC LIMIT ${limit}`, [req.payload.user_id, 'true'])
            return result.rows
        } catch (err) {
            throw new Error(err.message)
        }
    },

    async getVendorOrders(_, {
        limit
    }, {
        req
    }) {
        verifyJwt(req)
        if (req.payload.role_id !== 'vendor') {
            throw new Error("Unauthorised")
        }
        try {
            const orders = await knex.raw(`SELECT * from orders o INNER JOIN order_status os ON os.order_id = o.order_id WHERE o.prod_creator_id = ? and os.paid = ? ORDER BY o.created_at DESC LIMIT ${limit}`, [req.payload.user_id, 'true'])
            return orders.rows
        } catch (err) {
            throw new Error(err.message)
        }
    },

    //pay page for customer
    async getOrder(_, {
        order_id
    }, {
        req
    }) {
        verifyJwt(req)
        try {
            const order = await knex.raw(`select * from orders where order_id = ?`, [order_id])
            return order.rows

        } catch (err) {
            throw new Error(err.message)
        }

    }

}