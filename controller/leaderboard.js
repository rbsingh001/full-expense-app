
const sequelize = require('../utils/database');
const User = require('../model/user');
const Exp = require('../model/exp');

const getleaderboard = async (req, res) => {
    try {
        const userLeaderboard = await User.findAll({
            attributes: [
                'id',
                'name',
                'totalExp'
                // [sequelize.fn('SUM', sequelize.col('exps.amount')), 'total_cost']
            ],
            // include: [
            //     {
            //         // model: Exp,
            //         // attributes: []
            //     }
            // ],
            // group: ['user.id'],
            order: [[sequelize.literal('totalExp'), 'DESC']]
        });

        console.log(userLeaderboard);
        res.json(userLeaderboard);
    } catch (err) {
        console.error(err);
        res.status(500).json('Error happened');
    }
}

module.exports = getleaderboard;