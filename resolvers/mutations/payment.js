const {
    verifyJwt
} = require("../../helpers/auth/middlewares")
const __knex__ = require("../../knex/db")
const bcrypt = require('bcryptjs')

module.exports = {
    async withdraw(
        _, {
            user_id,
            amount,
            password
            // transaction_id
        }, {
            knex,
            req
        }
    ) {
        verifyJwt(req)
        if (req.payload.user_id !== user_id) {
            throw new Error("Unauthorised, wrong user")
        }

        //TODO:  prevent duplication. search withdrawal table for transaction id first, transaction id should come from paystack

        try {

            const pass = await __knex__('users').where({
                id: user_id
            }).select('password')

            const validPass = await bcrypt.compare(password, pass[0].password)

            if (!validPass) {
                throw new Error("Wrong password")
            }

            await knex('withdrawals').insert({
                user_id,
                amount
            })

            return {
                message: `Successfuly withdrawn ${amount}`
            }
        } catch (error) {
            throw new Error(error.message)

        }


    }
}