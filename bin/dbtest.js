const knex = require("../knex/db")

//dont call the function here. import to index
async function test() {
    const products = await knex("products").limit(5)
    console.log(products);

}

module.exports = test