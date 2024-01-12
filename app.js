const bodyParser = require('body-parser');
const express = require('express');

const sequelize = require('./utils/database');
const User = require('./model/user');

var cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.post('/user/signup', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });
        if(existingUser){
            return res.status(409).send({ message: 'User with this email already exists' });
        }

        const user = await User.create({
            name: name,
            email: email,
            password: password
        })
        res.send(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Error occured');
    }
});

app.post('/user/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });
        if(!existingUser){
            return res.status(404).json({ message: 'User not found with this email' });
        }
       
        if(existingUser.password === password){
            return res.status(200).json({ message: 'Login successful' });
        }
        else{
            return res.status(401).json({ message: 'Incorrect password' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


sequelize
    // .sync({force: true})
    .sync()

    .then((result) => {

        app.listen(5000);
        console.log("app started")
    })
    .catch(err => console.log(err));
