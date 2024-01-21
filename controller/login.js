
const User = require('../model/user');

require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const bcrypt = require('bcrypt');

function generateAccessToken(id){
    return jwt.sign( { userId: id}, secretKey )
}

const logIn = async (req, res) => {
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
                    const token = generateAccessToken(existingUser.id);
                    res.status(200).json({ message: 'Login successful', token: token });

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
}

module.exports = logIn;