const { verifyJwt, verifyStore } = require("../../helpers/auth/middlewares");

/*
 first arg expects parent, second expects inputs, third - context
*/
module.exports = {
  //public store
  async user(_, { business_name_slug }, { req, knex }) {
    verifyStore(req);
    let id = req.payload && req.payload.user_id;
    try {
      const user = await knex("users").where({
        business_name_slug,
      });

      if (user.length === 0) {
        throw new Error("404");
      }
      
      if (user[0].id !== id) {
          await knex.raw(`update users set views = views + 1 where id = ?`, [
              user[0].id,
            ]);
        }

      return {
        ...user[0],
        jwt_user_id: id,
      };
    } catch (err) {
        console.log(err);
      throw new Error(err.message);
    }
  },

  //gets user by id
  async getUser(_, {}, { knex, req }) {
    verifyJwt(req);
    try {
      const user = await knex("users").where({
        id: req.payload.user_id,
      });
      return user[0];
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async editUserPage(_, { id }, { knex, req }) {
    verifyJwt(req);

    if (req.payload.role_id !== "vendor") {
      throw new Error("Unauthorised, you are not a vendor");
    }
    try {
      const users = await knex.raw(`select * from users where id = ?`, [id]);
      return users.rows[0];
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //customer profile.
  async customerProfile(_, {}, { knex, req }) {
    verifyJwt(req);
    try {
      const user= await knex("users").where({
          id:req.payload.user_id
      })

      return user[0];
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //gets all stores.
  async getStores(_, { query, limit, offset }, { knex }) {
    try {
      //conditional. add search query only if there's a query value coming in
      let cond = query ? `and business_name ilike '%${query}%'` : "";
      const stores = await knex.raw(
        `select * from users where role = ? and pending = ? ${cond} order by completed_qty desc limit ${limit} offset ${offset}`,
        ["vendor", "false"]
      );
      return stores.rows;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  //works specifically with homeProducts in usersRes file in nested queries. fetch the stores to be displayed in the home page
  async homeStores(_, {}, { knex }) {
    try {
      const stores = await knex.raw(
        `select * from users where role = ? and pending = ? and online = ? order by completed_qty desc limit 8`,
        ["vendor", "false", "true"]
      );
      return stores.rows;
    } catch (err) {
      throw new Error(err.message);
    }
  },
};
