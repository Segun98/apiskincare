const sgMail = require('@sendgrid/mail');
const host = require("../../bin/environment")

sgMail.setApiKey(process.env.SEND_GRID_KEY);

async function welcomeVendor(name, email) {
  const content = {
    to: email,
    from: "welcome@tadlace.com",
    subject: "Welcome To Tadlace!",
    html: `<body><h3>Hello ${name},</h3>
    <h3>You Have Successfully Signed Up On <strong style="color:#333">Tadlace!</strong></h3>
    <h3>We love our vendors and are looking forward to you making sales with us!</h3>
    <br>
    <h3>Please Read Our Terms and Privacy Policy <a href=${host[0]}/term>Click Here</a></h3>
    <br>
    <p>Regards,</p>
    <h3>Segun</h3></body>`
  }

  try {
    await sgMail.send(content)
  } catch (error) {
    // console.log(error.message)
  }

}

async function welcomeCustomer(name, email) {
  const content = {
    to: email,
    from: "welcome@tadlace.com",
    subject: "Welcome To Tadlace!",
    html: `<body><p>Hello ${name},</p>
    <p>Welcome to Tadlace! We are thrilled to have you</p>
    <p>Our goal is to provide you a seamless and modern shopping experience.</p>
    <p>Start shopping for quality face. body and hair products</p>
    <br>
    <p>Regards,</p>
    <h3>Segun</h3></body>`
  }

  try {
    await sgMail.send(content)
  } catch (error) {
    // console.log(error.message)
  }

}

async function inTransit(order_id, email) {
  const content = {
    to: "shegunolanitori@gmail.com",
    from: "orders@tadlace.com",
    subject: "Tadlace - Your Order is in Transit",
    html: `<body><p>Your Order with order id: ${order_id} is in transit</p>
    <p>It will be delivered today!</p>
    <br>
    <p>Our goal is to provide you a seamless and modern shopping experience.</p>
    <br>
    <p>Regards,</p>
    <h3>Segun</h3></body>`
  }

  try {
    await sgMail.send(content)
  } catch (error) {
    // console.log(error.message)
  }
}

module.exports = {
  welcomeCustomer,
  welcomeVendor,
  inTransit
}