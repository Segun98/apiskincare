exports.up = async function (knex) {
    await knex.raw(`alter table products drop column category`)
    await knex.raw(`alter table products add column category text ARRAY[4]`)

};

exports.down = async function (knex) {
    await knex.raw(`alter table products drop column category`)
    await knex.raw(`alter table products add column category type text`)
};