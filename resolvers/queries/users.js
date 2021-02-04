const {
    verifyJwt,
    verifyStore
} = require("../../helpers/auth/middlewares");

/*
 first arg expects parent, second expects inputs, third - context
*/
module.exports = {
    //public store  
    async user(_, {
        business_name_slug
    }, {
        pool,
        req
    }) {
        verifyStore(req)
        let id = req.payload && req.payload.user_id
        try {
            const users = await pool.query(`select * from users where business_name_slug = $1`, [business_name_slug])
            if (users.rows.length === 0) {
                throw new Error("404")
            }

            if (users.rows[0].id !== id) {
                await pool.query(`update users set views = views + 1 where id = $1`, [users.rows[0].id])
            }

            return {
                ...users.rows[0],
                jwt_user_id: id
            }
        } catch (err) {
            throw new Error(err.message)
        }
    },

    //gets user by id
    async getUser(_, {}, {
        pool,
        req
    }) {
        verifyJwt(req)
        try {
            const user = await pool.query(`select * from users where id = $1`, [req.payload.user_id])
            return user.rows[0]

        } catch (err) {
            throw new Error(err.message)
        }
    },
    async editUserPage(_, {
        id
    }, {
        pool,
        req
    }) {
        verifyJwt(req)

        if (req.payload.role_id !== "vendor") {
            throw new Error("Unauthorised, you are not a vendor")
        }
        try {
            const users = await pool.query(`select * from users where id = $1`, [id])
            return users.rows[0]
        } catch (err) {
            throw new Error(err.message)
        }
    },


    //customer profile. 
    async customerProfile(_, {}, {
        pool,
        req
    }) {
        verifyJwt(req)
        try {
            const users = await pool.query(`select * from users where id = $1`, [req.payload.user_id])
            return users.rows[0]
        } catch (err) {
            throw new Error(err.message)
        }
    },


    //gets all stores. 
    async getStores(_, {
        query,
        limit,
        offset
    }, {
        pool
    }) {
        try {
            //conditional. add search query only if there's a query value coming in
            let cond = query ? `and business_name ilike '%${query}%'` : ""
            const stores = await pool.query(`select * from users where role = $1 and pending = $2 ${cond} order by completed_qty desc limit ${limit} offset ${offset}`, ["vendor", "false"])
            return stores.rows
        } catch (err) {
            throw new Error(err.message)
        }
    },

    //works specifically with homeProducts in usersRes file in nested queries. fetch the stores to be displayed in the home page
    async homeStores(_, {}, {
        pool
    }) {
        try {
            const stores = await pool.query(`select * from users where role = $1 and pending = $2 and online = $3 order by completed_qty desc limit 8`, ["vendor", "false", "true"])
            return stores.rows
        } catch (err) {
            throw new Error(err.message)
        }
    },

}