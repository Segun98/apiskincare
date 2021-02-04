exports.up = async function (knex) {
    await knex.raw(`alter table users add column views int default 0`)

};

exports.down = async function (knex) {
    await knex.raw(`alter table users drop column views`)
};