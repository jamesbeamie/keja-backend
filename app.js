const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`

        type RootQuery {
            homes: [String!]!
        }
        type RootMutation {
            addHome(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),

    //resolver
    rootValue: {
        homes: () => {
            return ['grace', 'carenview']
        },
        addHome: (args) => {
            const homeName = args.name;
            return homeName;
        }
    },
    graphiql: true
}));
app.listen(3000);
