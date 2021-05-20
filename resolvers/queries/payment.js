const {
    verifyJwt
} = require("../../helpers/auth/middlewares")
const knex = require("../../knex/db");

module.exports = {
    async withdrawals(_, {
        user_id
    }, {
        req
    }) {
        verifyJwt(req)
        if (req.payload.user_id !== user_id) {
            throw new Error("Unauthorised, wrong user")
        }

        try {

            const withdrawals = await knex('withdrawals').where({
                user_id
            })

            const amount = withdrawals.reduce((a, b) => a + parseInt(b.amount), 0)
            return {
                message: amount
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }
}