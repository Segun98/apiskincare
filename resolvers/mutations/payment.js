const {
    verifyJwt
} = require("../../helpers/auth/middlewares")

module.exports = {
    async withdraw(
        _, {
            user_id,
            amount,
            recipient,
            transfer_id
        }, {
            knex,
            req
        }
    ) {
        verifyJwt(req)
        if (req.payload.user_id !== user_id) {
            throw new Error("Unauthorised, wrong user")
        }

        try {

            await knex('withdrawals').insert({
                user_id,
                amount,
                recipient,
                transfer_id
            })

            return {
                message: `Successfuly withdrawn ${amount} Naira`
            }
        } catch (error) {
            throw new Error(error.message)

        }


    }
}