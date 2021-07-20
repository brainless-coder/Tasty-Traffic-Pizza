const Order = require('../../../models/order');

function orderController() {
    return {
        index(req, res) {
            // Fetch all active orders
            Order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 }}).populate('customerId', '-password').exec((err, orders) => {
                if (req.xhr) {
                    return res.json(orders);
                } else {
                    return res.render('admin/orders');
                }
            });

        }
    }
}

module.exports = orderController;