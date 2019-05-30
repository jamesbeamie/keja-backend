const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Home = require('./models/homes');
const adminUser = require('./models/adminUser');

const app = express();

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
        
        type adminUser {
            _id: ID!
            userName: String!
            email: String!
            password: String
        }

        input HomeInput {
            name: String!
            location: String!
            homeType: String!
            size: String!
            price: Float!
            datePosted: String!
        }

        input adminInput {
            userName: String!
            email: String!
            password: String!
        }

        type RootQuery {
            homes: [Home!]!
        }
        type RootMutation {
            addHome(homeInput: HomeInput): Home
            createAdmin(adminInput: adminInput): adminUser
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),

    //resolver
    rootValue: {
        homes: () => {
           return Home.find()
           .then(homes => {
                return homes.map(home => {
                    return {...home._doc, _id: home.id };
                });
           })
           .catch(err => {
               throw err;
           });
        },
        addHome: (args) => {
            const home = new Home ({
            name: args.homeInput.name,
            location: args.homeInput.location,
            homeType: args.homeInput.homeType,
            size: args.homeInput.size, 
            price: +args.homeInput.price,
            datePosted: moment().format(),
            creator: '5cefadad1c79d41f78dc28a9'
            });
            let createdHome;
            return home
            .save()
            .then(result => {
                createdHome = {...result._doc, _id: result.id};
                return adminUser.findById('5cefadad1c79d41f78dc28a9')
                return {...result._doc, _id: result.id};
            })
            .then(user => {
                if(!user) {
                    throw new Error('user not found.');
                }
                user.createdHomes.push(home);
                return user.save();
            })
            .then(result => {
                return createdHome;
            })
            .catch(err => {
                console.log(err)
                throw err; 
            });
        }, 
        createAdmin: args => {
            return adminUser.findOne({email: args.adminInput.email}).then(user => {
                if(user) {
                    throw new Error('user exist already.');
                }
                return bcrypt.hash(args.adminInput.password, 12)
            })
            .then(hashedPwd => {
                const admin = new adminUser({
                    userName: args.adminInput.userName,
                    email: args.adminInput.email,
                    password: hashedPwd
                });
                return admin.save();
            })
            .then(result => {
                return {...result._doc, password: null, _id: result.id};
            })
            .catch(err => {
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
