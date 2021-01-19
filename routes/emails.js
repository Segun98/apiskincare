//@ts-check

const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

const {
    OrderToCustomer,
    OrderToVendor
} = require("../controllers/OrdersController")


sgMail.setApiKey(process.env.SEND_GRID_KEY);

router.post("/order_vendor", OrderToVendor)
router.post("/order_customer", OrderToCustomer)

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