const Razorpay = require('razorpay');
require('dotenv').config();
const Order = require('../model/order');
const User = require('../model/user')

const purchasepremium = async (req, res) => {
    try{
        var rzp = new Razorpay({
            key_id : process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({amount, currency: "INR"}, async(err, order)=>{
            if(err){
                console.log(err);
                // throw new Error(JSON.stringify(err));
            }
            const o = await Order.create({ orderid: order.id, status: 'PENDING', userId: req.user.id })
            // req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(()=>{
                return res.status(201).json({ order:o , key_id: rzp.key_id });
            // })
            
        })
    }catch(error){
        console.log(error);
        res.status(403).json({ message : 'Something went wrong', error: error })
    }
}

const updateTransactionStatus = (req, res)=>{
    try{
        const { payment_id, order_id} = req.body;
        console.log("hello")
        console.log(payment_id, order_id)
        Order.findOne({where: { orderid : order_id }}).then(order => {
            
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL' }).then(async()=>{
                // order.user.update({isPremium : true})
                console.log(order.getUser());
                let U = await order.getUser();
                U.isPremium = true;
                await U.save();
                return res.status(202).json({ sucess: true, message: "Transaction Successful"});
            }).catch((err)=>{
                throw new Error(err);
            })
        }).catch((err)=>{
            throw new Error(err);
        }) 
    }catch(err){
        console.log(err);
        res.status(403).json({ error: err, message: "Something went wrong" })
    }
}
module.exports = {
    purchasepremium,
    updateTransactionStatus
}
