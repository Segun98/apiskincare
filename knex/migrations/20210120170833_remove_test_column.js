exports.up = async function (knex) {
    await knex.schema.table("password_reset", table => {
        table.dropColumn('test')
    });

};

exports.down = async function (knex) {
    await knex.schema.createTable("password_reset", table => {
        table.uuid('id').primary()
        table.string('email')
        table.boolean('test')
        table.timestamp('created_at').defaultTo(knex.fn.now())
    });
};