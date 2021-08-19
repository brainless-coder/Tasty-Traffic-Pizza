const Order = require('../../../models/order');
const moment = require('moment');

function orderController() {
    return {
        store(req, res) {
            // Validate request
            const { phone, address } = req.body;
            if (!phone || !address) {
                req.flash('error', 'All fields are required');
                return res.redirect('/cart');
            }

            // now, create our order and save it in DB
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            });

            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully');
                    delete req.session.cart;
                    // Emit the event for realtime order updation on admin dashboard
                    const eventEmitter = req.app.get('eventEmitter');
                    eventEmitter.emit('orderPlaced', placedOrder);

                    return res.redirect('/customers/orders');
                });
            }).catch(err => {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/cart');
            });
        },
        async index(req, res) {
            // iss particular user ke saare orders fetch karo
            const orders = await Order.find({ customerId: req.user._id }, null, { sort: { 'createdAt': -1 } });
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render('customers/orders', { orders: orders, moment: moment });
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id);
            // check Authorization, so that a user can only check the status of his order
            if (req.user._id.toString() === order.customerId.toString()) {
                res.render('customers/singleOrder', { order });
            } else {
                res.redirect('/');
            }
        }
    }
}


module.exports = orderController;