const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Home = require('./models/homes').default

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Home {
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
            const home = new Home ({
            name: args.homeInput.name,
            location: args.homeInput.location,
            homeType: args.homeInput.homeType,
            size: args.homeInput.size, 
            price: +args.homeInput.price,
            datePosted: new Date(args.homeInput.date)
            });
            return home
            .save()
            .then(result => {
                console.log(result);
                return {...result._doc};
            })
            .catch(err => {
                console.log(err)
                throw err; 
            });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
}@cluster0-fhwxu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`)
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});
