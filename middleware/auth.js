const jwt = require('jsonwebtoken');
const User = require('../model/user');

require('dotenv').config();
const secretKey = process.env.JWT_SECRET_KEY;
const authenticate = (req, res, next) => {
    try{
        const token = req.header('Authorization');
        const user = jwt.verify(token, secretKey);
        console.log(user.userId)
        User.findByPk(user.userId).then(user =>{
            // console.log("Authincation console ", user)
            // console.log(JSON.stringify(user));
            req.user = user;
            next();
        }).catch(err => {throw new Error(err)});
    }catch(err){
        console.log(err);
        return res.status(401).json({ success : false});
    }
}
module.exports = authenticate;