const express = require('express');

const purchaseController = require('../controller/purchase');

var cors = require('cors');

const router = express.Router();
router.use(cors());
router.get('/premiummembership',purchaseController.purchasepremium);

router.post('/updatetransactionstatus', purchaseController.updateTransactionStatus);

module.exports = router;

// const express = require('express');
// require('dotenv').config();
// const router = express.Router();

// const Razorpay = require('razorpay');
// const Order = require('../model/order');

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// router.get('/purchase/premiummembership', async (req, res) => {
//     try {
//         const amount = 2500;

//         const options = {
//             amount: amount * 100, // Amount in paise
//             currency: "INR",
//             receipt: "order_receipt_" + Date.now(),
//         };

//         razorpay.orders.create(options, async (err, order) => {
//             if (err) {
//                 console.error(err);
//                 return res.status(500).json({ message: 'Failed to create order', error: err });
//             }

//             // Assuming req.user.createOrder is an asynchronous function returning a promise
//             await req.user.createOrder({ orderid: order.id, status: 'PENDING' });

//             res.status(201).json({ order, key_id: process.env.RAZORPAY_KEY_ID });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Something went wrong', error: error.message });
//     }
// });

// router.post('/purchase/updatetransactionstatus', async (req, res) => {
//     try {
//         const { payment_id, order_id } = req.body;

//         const order = await Order.findOne({ where: { orderid: order_id } });

//         if (!order) {
//             return res.status(404).json({ success: false, message: 'Order not found' });
//         }

//         await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

//         res.status(200).json({ success: true, message: 'Transaction Successful' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false, error: err.message, message: 'Something went wrong' });
//     }
// });


// module.exports = router;
