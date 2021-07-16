function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart');
        },
        update(req, res) {
            // Structure of our Cart, ye bas refernce ke liye likha hai yhape
            // let cart = {
            //     items: {
            //         pizzaId: {item: pizzaObject, qty: 0}
            //         pizzaId: {item: pizzaObject, qty: 0}
            //         pizzaId: {item: pizzaObject, qty: 0}
            //     }, 
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            // For the first time, creating cart and adding basic object structure
            // Agar cart empty hai tab ye chalega
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            
            let cart = req.session.cart;

            // Check if the item exist in cart or not
            // if it exists then update qty, else add that item in cart
            if(!cart.items[req.body._id]) {
                cart.items[req.body._id] = {
                    item: req.body,
                    qty: 1
                }
                cart.totalQty += 1;
                cart.totalPrice += cart.items[req.body._id].item.price;
            } else {
                cart.items[req.body._id].qty += 1;
                cart.totalQty += 1;
                cart.totalPrice += cart.items[req.body._id].item.price;
            }

            return res.json({totalQty: cart.totalQty });
        }
    }
}

module.exports = cartController;