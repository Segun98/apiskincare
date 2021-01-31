const sgMail = require('@sendgrid/mail');
const host = require("../bin/environment")
const knex = require("../knex/db")
sgMail.setApiKey(process.env.SEND_GRID_KEY);

async function OrderToVendor(req, res) {
    const {
        to,
        order,
        orderId
    } = req.body

    try {
        const vendor = await knex("users").select("business_name").where({
            email: to
        })

        // const orders = await knex("orders").select("name").where({
        //     order_id: orderId
        // })

        const content = {
            to: "shegunolanitori@gmail.com",
            from: "orders@tadlace.com",
            subject: `New Order on Tadlace. Order ID: ${orderId}`,
            html: `<body><p>Dear ${vendor[0].business_name || vendor},</p>
            <p>You have a new order! Track it in your <a href="${host[0]}/vendor/orders">orders page</a></p>
            
            <p>A dispatch rider will contact you soon! Please always ensure your product is in good condition and is always readily available.</p>

            <ul>
            <li>Product: ${order.name} - Quantity: ${order.quantity}</li>
            </ul>

            <p>Remember to check your public store page to ensure your available physical products in stock corresponds with the number online</p>
            </body>`
        }

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
        order,
        name,
        orderId
    } = req.body


    let products = ""
    for (let i = 0; i < order.length; i++) {
        products += `<li style="font-weight:bold" >${order[i].name} x ${order[i].quantity}</li> `
    }

    try {
        const content = {
            to: "shegunolanitori@gmail.com",
            from: "orders@tadlace.com",
            subject: `Successful Order! Order ID: ${orderId}`,
            html: `<body><p>Hello ${name},</p>
            <p>Your Order has been successfuly placed!</p>
            <ol>
            ${products}
            </ol>
            <p>Track your Orders in your <a href="${host[0]}/customer/orders">orders page</a></p>
            <p>Orders are usually delivered within 2-4 days from order date</p>
            <p><a href="${host[0]}/customer#contact"> Contact us</a> if there is any issue</p>
            <p>Happy shopping!</p>
            <p></p>
            <p>Thank you</p>
            </body>`
        }

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
        <p>You will be contacted by our customare care for further details if any</p></body>`
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