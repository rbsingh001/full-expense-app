
const User = require('../model/user');
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
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
}

module.exports = signUp;