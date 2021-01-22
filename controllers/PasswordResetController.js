const knex = require("../knex/db")
const host = require("../bin/environment")
const sgMail = require('@sendgrid/mail');
const {
    v4: uuid
} = require("uuid")
const bcrypt = require("bcryptjs")

sgMail.setApiKey(process.env.SEND_GRID_KEY);

module.exports = {
    //step one , generate a unique id and send to their email
    async passwordReset(req, res) {
        const {
            email
        } = req.body
        try {
            //check if user exists
            const user = await knex("users").select("email").where({
                email
            })

            if (user.length > 0) {
                let id = uuid()

                await knex("password_reset").insert([{
                    id,
                    email: user[0].email
                }])

                const content = {
                    to: email,
                    from: "support@tadlace.com",
                    subject: "Password Recovery on Tadlace",
                    html: `<body><p>Click to set a new password : <a href="${host[0]}/password/reset/${id}">Reset password</a></p>
                    <p>Didn't initiate this process? Please delete this email ASAP for security</p>
                    </body>`
                }
                await sgMail.send(content)
                return res.send("Please check your email for the next step")
            }

            return res.send("email does not exist in our records")
        } catch (error) {
            res.send(error.message)
        }
    },

    //get email from the id and send to front end
    async getEmail(req, res) {
        const {
            id
        } = req.body
        try {
            const email = await knex("password_reset").select("email").where({
                id
            })
            res.send(email[0])

        } catch (error) {
            res.send(error.message)
        }

    },

    //change the password
    async changePassword(req, res) {
        const {
            email,
            id,
            newpassword
        } = req.body.data

        try {
            //check if user exists in password_reset table
            const user = await knex("password_reset").select("email").where({
                email
            })
            if (user.length === 0) {
                return res.status(404).send("an error occured")
            }

            //hash new password
            const salt = await bcrypt.genSalt(10)
            const hashedpassword = await bcrypt.hash(newpassword, salt)

            await knex('users')
                .where({
                    email
                })
                .update({
                    password: hashedpassword
                })

            await knex('password_reset')
                .where({
                    id
                })
                .del()

            return res.send("password successfully changed!")
        } catch (error) {
            res.send(error.message)
        }
    }
}