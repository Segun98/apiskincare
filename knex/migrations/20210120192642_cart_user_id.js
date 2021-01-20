exports.up = async function (knex) {
    await knex.schema.table('cart', table => {
        table.uuid('user_id')
    })

};

exports.down = async function (knex) {
    await knex.schema.table('cart', table => {
        table.dropColumn('user_id')
    })
};