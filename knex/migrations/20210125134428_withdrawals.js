exports.up = async function (knex) {
    await knex.schema.createTable("withdrawals", table => {
        table.increments('id').primary()
        table.uuid('user_id').references('users.id')
        table.integer('amount')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    });
};

exports.down = async knex => await knex.schema.dropTableIfExists("withdrawals");