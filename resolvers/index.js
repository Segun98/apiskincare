const mutations = require("./mutations")
const queries = require("./queries")
const {
    creator,
    related
} = require("./nested-queries/productsRes")
const {
    usersProducts,
    customerOrders,
    homeProducts
} = require("./nested-queries/usersRes")
// const DataLoader = require('dataloader')
// const knex = require('../knex/db')


module.exports = {
    Mutation: {
        ...mutations
    },
    Query: {
        ...queries
    },

    //nested queries

    //userRes is the name of a type in /typedefs/users.js
    usersRes: {
        //returns products by a user
        usersProducts,
        customerOrders,
        homeProducts
    },

    //productsRes is the name of a type in /typedefs/products.js
    productsRes: {
        //gets you product creator
        creator,
        //get related products
        related

    },

    cart: {
        async productCreator(parent, {}, {
            loaderOne
        }) {
            // let loader = new DataLoader(async ids => {
            //     const rows = await knex.select("*").from("users").whereIn("id", ids)
            //     const lookup= rows.reduce((acc, row) => {
            //         acc[row["id"]] = row;
            //         return acc;
            //     }, {})
            //     return ids.map(id => lookup[id] || [])
            // })
    
            // return loader.load(parent.prod_creator_id)
            return loaderOne.load("users", "id", parent.prod_creator_id)
        },
        async product(parent, {}, {
            loaderOne
        }) {
            // let loader = new DataLoader(async ids => {
            //     const rows = await knex.select("*").from("products").whereIn("id", ids)
            //     const lookup= rows.reduce((acc, row) => {
            //         acc[row["id"]] = row;
            //         return acc;
            //     }, {})
            //     return ids.map(id => lookup[id] || [])
            // })
    
            // return loader.load(parent.product_id)
    
            return loaderOne.load("products", "id", parent.product_id)
        }
    },
    orders: {
        async orderStatus(parent, {}, {
            loaderOne,
        }) {
            // let loader = new DataLoader(async ids => {
            //     const rows = await knex.select("*").from("order_status").whereIn("order_id", ids)
            //     const lookup= rows.reduce((acc, row) => {
            //         acc[row["order_id"]] = row;
            //         return acc;
            //     }, {})
            //     return ids.map(id => lookup[id] || [])
            // })
    
            // return loader.load(parent.order_id)
            return loaderOne.load("order_status", "order_id", parent.order_id)
        }
    }

}