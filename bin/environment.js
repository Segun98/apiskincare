//endpoints
let local = ['http://localhost:3000', 'http://localhost:5000']
let prod = ['https://tadlace.com', 'https://adminpartystore.vercel.app']


module.exports = process.env.NODE_ENV === "production" ? prod : local