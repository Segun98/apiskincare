exports.up = async function (knex) {
    await knex.schema.table('withdrawals', table => {
        table.string('transfer_id')
    })

};

exports.down = async function (knex) {
    await knex.schema.table('withdrawals', table => {
        table.dropColumn('transfer_id')
    })
};