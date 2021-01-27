//@ts-check
const router = require("express").Router()
const pool = require("../db")
const {
    createRefreshToken,
    createToken
} = require("../helpers/auth/create-tokens")
const {
    welcomeCustomer
} = require("../helpers/emails/email_functions");
const bcrypt = require("bcryptjs")
const knex = require("../knex/db")

router.post("/oauth/login", async (req, res) => {

    const {
        first_name,
        last_name,
        password,
        email
    } = req.body


    try {
        const users = await pool.query("select * from users where email = $1", [email]);

        //user exists, login
        if (users.rows.length > 0) {
            //imports to create tokens
            const token = createToken(users) //returns access token

            res.send({
                refreshtoken: createRefreshToken(users),
                accesstoken: token,
                role: users.rows[0].role
            })
        } else {
            //else sign them up

            // hash password , in this case, user id from google

            const salt = await bcrypt.genSalt(10)
            const hashedpassword = await bcrypt.hash(password, salt)
            //Password is google user id to track people signing up with google
            await knex('users').insert({
                first_name,
                last_name,
                email,
                password: hashedpassword,
                phone: null,
                role: 'customer',
                pending: 'false',
                business_name: null,
                business_name_slug: null,
                business_address: null,
                business_image: null,
                business_bio: 'Google',
                customer_address: null
            })

            //welcome email
            welcomeCustomer(first_name, email)

            //get the new user from DB

            const user = await pool.query("select id, role from users where email = $1", [email]);

            const token = createToken(user) //returns access token

            res.send({
                refreshtoken: createRefreshToken(user),
                accesstoken: token,
                role: user.rows[0].role
            })
        }


    } catch (err) {
        res.send(err.message)
    }
})

router.post("/oauth/signup", async (req, res) => {

    const {
        first_name,
        last_name,
        password,
        email
    } = req.body

    try {
        const emailExists = await pool.query(`select email from users where email = $1`, [email])

        if (emailExists.rows.length > 0) {
            return res.status(404).send('User exists, Login')
        }
        // hash password , in this case, user id from google

        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)

        //Password is google user id to track people signing up with google
        await knex('users').insert({
            first_name,
            last_name,
            email,
            password: hashedpassword,
            phone: null,
            role: 'customer',
            pending: 'false',
            business_name: null,
            business_name_slug: null,
            business_address: null,
            business_image: null,
            business_bio: 'Google',
            customer_address: null
        })

        welcomeCustomer(first_name, email)
        res.send("signup successful")
    } catch (err) {
        res.send(err.message)
    }

})


module.exports = router


// router.get('/auth/google',
//     passport.authenticate('google', {
//         scope: ['email', 'profile']
//     }));

// router.get("/auth/failed", (req, res) => {
//     res.send("Error Authenticating With Google")
// })


// router.get('/auth/google/callback',
//     passport.authenticate('google', {
//         failureRedirect: '/auth/failed',
//         session: false
//     }),
//     async function (req, res) {
//         data in req.
//     });