const bodyParser = require('body-parser');
const express = require('express');

const sequelize = require('./utils/database');
const User = require('./model/user');
const Exp = require('./model/exp');
const bcrypt = require('bcrypt');

Exp.belongsTo(User);

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
        if (existingUser) {
            return res.status(409).send({ message: 'User with this email already exists' });
        }
        bcrypt.hash(password, 10, async (err, hash) => {
            console.log(err);
            const user = await User.create({
                name: name,
                email: email,
                password: hash
            })
            res.send(user);
        })


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
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        else {
            bcrypt.compare(password, existingUser.password, (err, result) => {
                if (err) {
                    res.status(401).json({ message: 'Error Occured' });
                }
                if (result === true) {
                    res.status(200).json({ message: 'Login successful', user: existingUser });

                }
                else {
                    res.status(200).json({ message: 'password not matched' });
                }
            })
        }

    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/exp/:userId', async (req, res) => {
    try {
        // console.log(req.body , id);

        const userId = req.params.userId
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        const exp = await Exp.create({
            amount: amount,
            description: description,
            category: category,
            userId: userId
        })
        res.send(exp);
    }
    catch (err) {
        console.log(err);
    }
})

app.get('/exp/:userId', async (req, res) => {
    try {

        const id = req.params.userId;
        const exps = await Exp.findAll({
            where: {
                userId: id
            }
        })
        // console.log(exps);
        res.send(exps);
    }
    catch (err) {
        confirm.log(err);
    }
})

app.delete('/exp/:exp_id', async (req, res) => {
    try {
        const exp_id = req.params.exp_id;
        const del_exp = await Exp.destroy({
            where: { id: exp_id }
        })
        console.log(del_exp)
        res.status(204).json({id: exp_id});
    }
    catch (err) {
        console.log(err);
    }
})


sequelize
    // .sync({force: true})
    .sync()

    .then((result) => {

        app.listen(5000);
        console.log("app started")
    })
    .catch(err => console.log(err));
