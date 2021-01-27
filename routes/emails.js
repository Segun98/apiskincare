//@ts-check

const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

const {
    OrderToCustomer,
    OrderToVendor,
    CanceledOrderCustomer,
    CanceledOrderVendor
} = require("../controllers/OrdersController")

const {
    passwordReset,
    changePassword,
    getEmail
} = require("../controllers/PasswordResetController")

sgMail.setApiKey(process.env.SEND_GRID_KEY);

router.post("/order_vendor", OrderToVendor)
router.post("/order_customer", OrderToCustomer)

router.post("/cancel_customer", CanceledOrderCustomer)
router.post("/cancel_vendor", CanceledOrderVendor)

//password reset flow
router.post("/password_reset", passwordReset)
//get email from id in params from front end. should be get request but whatevs
router.post("/get_email", getEmail)
router.post("/change_password", changePassword)


//contact emails
router.post("/contact", async (req, res) => {

    const {
        email,
        body,
        subject
    } = req.body

    const content = {
        to: "shegunolanitori@gmail.com",
        from: email,
        subject,
        text: body
    }

    try {
        await sgMail.send(content)
        res.status(200).send('Message sent successfully.')
    } catch (error) {
        // console.log('ERROR', error.message)
        res.status(400).send('Message not sent.')
    }
});

module.exports = router