exports.up = async function (knex) {
    await knex.schema.createTable("password_reset", table => {
        table.uuid('id').primary()
        table.string('email')
        table.boolean('test')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    });
};

exports.down = async knex => await knex.schema.dropTableIfExists("password_reset");