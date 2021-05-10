//endpoints
let local = ['http://localhost:3000', 'http://localhost:5000']
let prod = ['https://tadlace.vercel.app', 'https://adminpartystore.vercel.app', 'https://tadlace.com']


module.exports = process.env.NODE_ENV === "production" ? prod : local