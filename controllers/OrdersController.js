const sgMail = require('@sendgrid/mail');
const host = require("../bin/environment")
sgMail.setApiKey(process.env.SEND_GRID_KEY);

async function OrderToVendor(req, res) {
    const {
        to,
        body,
        orderId
    } = req.body

    const content = {
        to: "shegunolanitori@gmail.com",
        from: "orders@tadlace.com",
        subject: `New Order on Tadlace. Order ID: ${orderId}`,
        html: `<body><p>Dear vendor,</p>
        <p>You have a new order! A dispatch rider will contact you soon! Please always ensure your product is in good condition and is always readily available.</p>
        <p>Remember to check your public store page to ensure your physical products in stock corresponds with the number online</p>
        </body>`
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
        name,
        orderId
    } = req.body

    const content = {
        to: "shegunolanitori@gmail.com",
        from: "orders@tadlace.com",
        subject: `Your Order has been successfuly placed! Order ID: ${orderId}`,
        html: `<body><p>Hello ${name}</p>,
        <p>Your Order has been successfuly placed!</p>
        <ul>
        <li>Track your Orders in your <a href="${host[0]}/customer/orders">orders page</a></li>
        <li>Orders are usually delivered within 2-4 days from order date</li>
        <li><a href="${host[0]}/customer#contact"> Contact us</a> if there is any issue</li>
        <li>Happy shopping!</li>
        </ul>
        <p></p>
        <p>Thank you</p>
        </body>`
    }

    try {
        await sgMail.send(content)
        return res.status(200).send('Message sent successfully.')
    } catch (error) {
        // console.log('ERROR', error.message)
        return res.status(400).send('Message not sent.')
    }
}

async function CanceledOrderCustomer(req, res) {
    const {
        to,
        name,
        orderId
    } = req.body

    const content = {
        to: "shegunolanitori@gmail.com",
        from: "orders@tadlace.com",
        subject: `Canceled Order Notice! Order ID: ${orderId}`,
        html: `<body><p>Dear ${name? name: "customer"},</p>
        <p>Your order with id: ${orderId} has been successfuly canceled</p>
        <p>Expect to be refunded within 3 days</p>
        <p>Thank you</p>
        </body>`
    }

    try {
        await sgMail.send(content)
        return res.status(200).send('Message sent successfully.')
    } catch (error) {
        // console.log('ERROR', error.message)
        return res.status(400).send('Message not sent.')
    }
}

async function CanceledOrderVendor(req, res) {
    const {
        to,
        orderId
    } = req.body

    const content = {
        to: "shegunolanitori@gmail.com",
        from: "orders@tadlace.com",
        subject: `Canceled Order Notice! Order ID: ${orderId}`,
        html: `<body><p>Dear Vendor,</p>
        <p>Order with id: ${orderId} has been canceled</p>
        <p>You will be contacted by our customare care for  further details if any</p></body>`
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
    OrderToCustomer,
    CanceledOrderVendor,
    CanceledOrderCustomer
}