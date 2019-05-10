const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const homes = []

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Home {
            _id: ID!
            name: String!
            location: String!
            homeType: String!
            size: String!
            price: Float!
            datePosted: String!
        }
        
        input HomeInput {
            name: String!
            location: String!
            homeType: String!
            size: String!
            price: Float!
            datePosted: String!
        }

        type RootQuery {
            homes: [Home!]!
        }
        type RootMutation {
            addHome(homeInput: HomeInput): Home
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),

    //resolver
    rootValue: {
        homes: () => {
            return homes
        },
        addHome: (args) => {
            const home = {
            _id: Math.random().toString(),
            name: args.homeInput.name,
            location: args.homeInput.location,
            homeType: args.homeInput.homeType,
            size: args.homeInput.size,
            price: +args.homeInput.price,
            datePosted: args.homeInput.datePosted
            }
            homes.push(home);
            return home;
        }
    },
    graphiql: true
}));
app.listen(3000);
