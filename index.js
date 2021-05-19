// @ts - check
const express = require('express');
const app = express();
require('dotenv').config()
const {
    ApolloServer
} = require('apollo-server-express');
const typeDefs = require("./typedefs")
const resolvers = require("./resolvers")
const pool = require("./db")
const cors = require("cors")
// const {
//     single,
//     multiple
// } = require('./helpers/dataloader')
const compression = require('compression')
const helmet = require("helmet");
const host = require("./bin/environment")
const knex = require("./knex/db.js");
const rateLimit = require("express-rate-limit");
require("express-async-errors");

// const test = require("./bin/dbtest")
// const test = require("./bin/test")
// test()
// console.log(host)
// app.set('trust proxy', 1);


app.use(cors({
    origin: host,
    credentials: true
}));

//rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 100 requests per windowMs
});

// //  apply to all requests
app.use(limiter);

//REST ROUTES
const oAuth = require("./routes/oauth")
const auth = require("./routes/auth")
const email = require("./routes/emails")
const upload = require("./helpers/image-upload/upload")
const pay = require("./routes/payment")

//secure app by setting http headers
app.use(helmet())
// compress all responses
app.use(compression());
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))


//refresh-token and logout routes
app.use("/api", auth)
//image upload route
app.use("/api", upload)
//emails
app.use("/api", email)
//oauth authentication
app.use("/api", oAuth)
app.use("/api", pay)

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({
        req,
        res
    }) => ({
        req,
        res,
        knex,
        pool,
        // loaderOne: new single(),
        // loaderTwo: new multiple()
    }),
});


server.applyMiddleware({
    app,
    cors: false
});

const PORT = process.env.PORT || 4000

app.listen({
        port: PORT
    }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);