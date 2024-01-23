const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./utils/database');

const authMiddleware = require('./middleware/auth');
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const expRoutes = require('./routes/exp');
const purchaseRoutes = require('./routes/purchase');

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

app.get('/premium/leaderboard', authMiddleware, async (req, res) => {
    const exps = await Exp.findAll();
    const users = await User.findAll();
    const userAggExps = {}

    exps.forEach((exp) => {
        if (userAggExps[exp.userId]) {
            userAggExps[exp.userId] = userAggExps[exp.userId] + exp.amount;

        } else {
            userAggExps[exp.userId] = exp.amount;
        }
    })
    var userLeaderboard = [];
    users.forEach((user) => {
        userLeaderboard.push({ name: user.name, total_cost: userAggExps[user.id] || 0 })
    })
    userLeaderboard.sort((a, b) => b.total_cost - a.total_cost);

    res.send(userLeaderboard);
})

sequelize
    // .sync({force: true})
    .sync()

    .then((result) => {

        app.listen(5000);
        console.log("app started")
    })
    .catch(err => console.log(err));
