exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('password_reset').del()
    .then(function () {
      // Inserts seed entries
      return knex('password_reset').insert([{
          id: "eea5c9c9-5088-46a8-947e-63b6e51e1b44",
          email: 'gdhd@mail.com',
          test: true
        },
        {
          id: "4dcb7c3b-6b80-4d06-a108-844ad288b4bd",
          email: 'test2@mail.com',
          test: false
        },
        {
          id: "0bf74cd2-41a9-4e72-842a-fb7ac6d85c6d",
          email: 'test3@mail.com',
          test: true
        }
      ]);
    });
};