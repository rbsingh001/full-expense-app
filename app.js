const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

const authMiddleware = require('./middleware/auth');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const expRoutes = require('./routes/exp');
const purchaseRoutes = require('./routes/purchase');
const leaderboardRoute = require('./routes/leaderboard');

const User = require('./model/user');
const Exp = require('./model/exp');
const Order = require('./model/order');
User.hasMany(Exp)
Exp.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User);

var cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json())

app.use('/', signupRoute);
app.use('/', loginRoute)
app.use('/', authMiddleware, expRoutes)
app.use('/purchase', authMiddleware, purchaseRoutes);

app.use('/', authMiddleware, leaderboardRoute );

sequelize
    // .sync({force: true})
    .sync()

    .then((result) => {

        app.listen(5000);
        console.log("app started")
    })
    .catch(err => console.log(err));
