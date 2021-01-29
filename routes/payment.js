const router = require("express").Router()
const fetch = require('node-fetch')

router.post('/pay', async (req, res) => {
    fetch('https://api.flutterwave.com/v3/transfers', {
            method: 'post',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.FL_SECRET_KEY_TEST}`
            },
        })
        .then(res => res.json())
        .then(data => res.status(200).json(data))
        .catch((err) => res.status(401).send(err.message))
})

module.exports = router