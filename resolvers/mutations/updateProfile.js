const {
    verifyJwt
} = require('../../helpers/auth/middlewares')

async function updateProfile(_, {
    first_name,
    last_name,
    phone,
    business_name,
    business_address,
    business_image,
    business_bio,
    customer_address,
    online
}, {
    req,
    knex
}) {
    verifyJwt(req)

    try {

        await knex('users')
            .where({
                id: req.payload.user_id
            })
            .update({
                first_name,
                last_name,
                phone,
                business_name,
                business_address,
                business_image,
                business_bio,
                customer_address,
                online
            })

        return {
            message: "User successfully updated"
        }
    } catch (err) {
        throw new Error(err.message)
    }
}



module.exports = {
    updateProfile
}