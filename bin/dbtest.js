const knex = require("../knex/db")

//dont call the function here. import to index
async function test() {
    const products = await knex("products").select("name").limit(5)
    console.log(products);
    // const vendor = await knex("users").select("business_name").where({
    //     email: "ace@mail.com"
    // })
    // console.log(vendor[0]);
}

module.exports = test