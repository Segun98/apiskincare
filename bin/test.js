// const SibApiV3Sdk = require('sib-api-v3-sdk');
// let defaultClient = SibApiV3Sdk.ApiClient.instance;

// let apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = process.env.SEND_IN_BLUE;

// let apiInstance = new SibApiV3Sdk.ContactsApi();

// // let createContact = new SibApiV3Sdk.CreateContact();

// // createContact.email = 'soskiid@gmail.com';
// // createContact.listIds = [2]

// let opts = {
//     email: "shegunolanitori@gmail.com",
//     lisIds: [2],
//     attributes: {
//         "first name": "Segun",
//         "last name": "OS",
//         "phone number": 1257487
//     },
// };
// apiInstance.createContact(opts).then(function (data) {
//     console.log('API called successfully. Returned data: ' + JSON.stringify(data));
// }, function (error) {
//     console.error(error.message);
// });


// // const fetch = require('node-fetch');

// // let url = 'https://api.sendinblue.com/v3/contacts';

// // let options = {
// //   method: 'POST',
// //   headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
// //   body: JSON.stringify({
// //     email: "shegunolanitori@gmail.com",
// //     lisIds: [2],
// //     attributes: {
// //         "first name": "Segun",
// //         "last name": "OS",
// //         "phone number": 1257487
// //     },
// // })
// // };

// // fetch(url, options)
// //   .then(res => res.json())
// //   .then(json => console.log(json))
// //   .catch(err => console.error('error:' + err));


// const fetch = require('node-fetch');

// function test() {

//     let url = 'https://api.sendgrid.com/v3/marketing/contacts';

//     let options = {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${process.env.SEND_GRID_KEY}`
//         },
//         body: JSON.stringify({
//             contacts: [{
//                 email: "4topsports@gmail.com",
//                 first_name: "4top",
//                 last_name: "Sports",
//             }]
//         })
//     };

//     fetch(url, options)
//         .then(res => console.log(res))
//         .then(data => console.log(data))
//         .catch(err => console.error('error:' + err));

// }

const axios = require("axios");

async function test() {
    let data = {
        contacts: [{
            email: "4topsports@gmail.com",
            first_name: "4top",
            last_name: "Sports",
        }]
    }
    try {
        const res = await axios.post(`https://api.sendgrid.com/v3/marketing/contacts`, {
            headers: {
                Authorization: `Bearer ${process.env.SEND_GRID_KEY}`,
            },
            data
        });
        console.log(res);
    } catch (error) {
        console.log(error.message);
    }


}

module.exports = test