const Exp = require('../model/exp');
const User = require('../model/user')
const sequelize = require('../utils/database')

const getExp = async (req, res) => {
    try {
        // const id = req.user.id;
        const exps = await req.user.getExps();

        // const exps = await Exp.findAll({
        //     where: {
        //         userId: id
        //     }
        // })
        // res.send(exps);
        res.status(200).json({ exps });
    }
    catch (err) {
        console.log(err);
    }
}

const addExp = async (req, res) => {

    const t = await sequelize.transaction();
    try {
        const id = req.user.id;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        console.log(amount, description, category);

        const exp = await Exp.create({
            amount: amount,
            description: description,
            category: category,
            userId: id
        },
            {
                transaction: t
            }
        )

        await User.update({
            totalExp: sequelize.literal(`totalExp + ${exp.amount}`)
        }, {
            where: { id: id },
            transaction: t
        })

        await t.commit();
        res.send(exp);
    }
    catch (err) {
        await t.rollback();
        return res.status(500).json({ success: false, error: err })
    }

}

const delExp = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const exp_id = req.params.exp_id;
        const expRecord = await Exp.findByPk(exp_id);
        if (!expRecord) {
            return res.status(404).json({ error: 'Exp record not found' });
        }
        await Exp.destroy({
            where: { id: exp_id },
            transaction: t
        })
        await User.update(
            { totalExp: sequelize.literal(`totalExp - ${expRecord.amount}`) },
            {
                where: { id: expRecord.userId },
                transaction: t
            }

        );
        await t.commit();
        res.status(204).json({ id: exp_id });
    }
    catch (err) {
        await t.rollback();
        console.log(err);
    }
}

module.exports = {
    getExp,
    addExp,
    delExp
}