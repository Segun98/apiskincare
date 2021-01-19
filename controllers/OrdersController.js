const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_KEY);

async function OrderToVendor(req, res) {
    const {
        to,
        body
    } = req.body

    const content = {
        to,
        from: "shegunolanitori@gmail.com",
        subject: "New Order on Tadlace",
        html: `
        Dear vendor,
        You have a new order! A dispatch rider will contact you soon! Please always ensure your product is in good condition and is always readily available.
        
        Check your public stores page to your physical products in stock corresponds with the number online
        `
    }

    try {
        await sgMail.send(content)
        return res.status(200).send('Message sent successfully.')
    } catch (error) {
        // console.log('ERROR', error.message)
        return res.status(400).send('Message not sent.')
    }
}

async function OrderToCustomer(req, res) {
    const {
        to,
        body,
        name
    } = req.body

    const content = {
        to,
        from: "shegunolanitori@gmail.com",
        subject: "Your Order has been successfuly placed!",
        html: `
        Hello ${name},
        <p>Your Order has been successfuly placed!</p>
        <p>Expect to recieve your product(s) within 2-4 days from order date</p>
        <p>Thank you</p>
        `
    }

    try {
        await sgMail.send(content)
        return res.status(200).send('Message sent successfully.')
    } catch (error) {
        // console.log('ERROR', error.message)
        return res.status(400).send('Message not sent.')
    }
}

module.exports = {
    OrderToVendor,
    OrderToCustomer
}