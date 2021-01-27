const jwt = require("jsonwebtoken")
const router = require("express").Router()
const cookieParser = require('cookie-parser')
const pool = require("../db")
const {
    createRefreshToken,
    createToken
} = require("../helpers/auth/create-tokens")
const bcrypt = require('bcryptjs')
const knex = require('../knex/db.js')

//refresh token before access token expires
router.post("/refreshtoken", cookieParser(), async (req, res) => {

    const {
        rToken
    } = req.body
    //token from body, should be from cookies .
    const token = rToken

    if (!token) {
        return res.status(401).send({
            accessToken: ""
        })
    }

    let payload = null
    try {
        payload = jwt.verify(token, process.env.REFRESH_SECRET) //returns token . //refresh token
    } catch (err) {
        return res.status(401).send({
            accessToken: "",
            err
        })
    }
    //last check for user
    const user = await pool.query("select * from users where id = $1", [payload.user_id]);
    if (user.rows.length === 0) {
        return res.status(401).send({
            accessToken: ""
        })
    }

    /* 
            COOKIE NOT SETTING(VERCEL AND HEROKU PROBLEMS) SO I'D DO IT CLIENT SIDE :-(
            */
    // let date = new Date()
    // date.setDate(date.getDate() + 7); //7 days

    // //sent back cookies
    // res.cookie('ecom', createRefreshToken(user), {
    //     // httpOnly: true,
    //     expires: date,
    //     // secure: true
    // })

    // res.cookie('role', user.rows[0].role, {
    //     expires: date,
    // });

    //sends a new access token
    return res.status(200).send({
        refreshtoken: createRefreshToken(user),
        accesstoken: createToken(user),
        role: user.rows[0].role
    })

})


//confirms user password . used in wallet withdrawal page
router.post("/password_check", async (req, res) => {
    try {
        const pass = await knex('users').where({
            id: req.body.user_id
        }).select('password')

        const validPass = await bcrypt.compare(req.body.password, pass[0].password)
        if (!validPass) {
            return res.status(404).send("wrong password")
        }

        res.send("password correct!")
    } catch (error) {
        res.status(404).send(error.message)
    }
})

router.post("/logout", (req, res, next) => {
    try {
        res.clearCookie("ecom");
        res.clearCookie("role");
        res.send("Logged Out")
        next()
    } catch (err) {
        throw new Error(err.message)
    }
})



module.exports = router