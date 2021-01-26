exports.up = async function (knex) {
    await knex.schema.table('withdrawals', table => {
        table.string('recipient')
    })

};

exports.down = async function (knex) {
    await knex.schema.table('withdrawals', table => {
        table.dropColumn('recipient')
    })
};