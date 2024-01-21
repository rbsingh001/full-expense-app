const Exp = require('../model/exp');
const User = require('../model/user')
const getExp = async (req, res) => {
    try {
        const id = req.user.id;

        console.log("req - User",req.user);
        const exps = await req.user.getExps();
        // const exps = await Exp.findAll({
        //     where: {
        //         userId: id
        //     }
        // })
        console.log(exps);
        res.send(exps);
    }
    catch (err) {
        console.log(err);
    }
}

const addExp = async(req, res) =>{
    try{
        const id = req.user.id;
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category;

        console.log(amount, description, category);

        const exp = await Exp.create({
            amount: amount,
            description: description,
            category: category,
            userId : id
        });
        console.log({exp: exp});
        res.send(exp);

    }catch(err){
        console.log(err);
    }

}

const delExp = async (req, res) => {
    try {
        const exp_id = req.params.exp_id;
        const del_exp = await Exp.destroy({
            where: { id: exp_id }
        })
        console.log(del_exp)
        res.status(204).json({ id: exp_id });
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = {
    getExp,
    addExp,
    delExp
}