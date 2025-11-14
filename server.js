import express from 'express';
import { router as AdminRoutes } from './routes/admin.js'
import { router as shopRoutes } from './routes/shop.js'
import { notFound } from './controllers/error.js';
import { sequelize } from './util/db.js';
import { Product } from './models/product.js';
import { User } from './models/user.js';
import { Cart } from './models/cart.js';
import { CartItem } from './models/cart-item.js';
import { Order } from './models/order.js';
import { OrderItem } from './models/order-item.js';

const app = express();
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use(async (req, res, next) => {
    try {
        const user = await User.findByPk(1)
        req.user = user
        next()
    }
    catch (err) {
        console.error(err)
    }
})

app.use('/admin', AdminRoutes)
app.use(shopRoutes)
app.use(notFound)



const table = async () => {
    try {

        Product.belongsTo(User, {
            constraints: true, onDelete: 'CASCADE'
        })
        User.hasMany(Product)
        User.hasOne(Cart)
        Cart.belongsTo(User)
        Cart.belongsToMany(Product, { through: CartItem })
        Product.belongsToMany(Cart, { through: CartItem })
        Order.belongsTo(User)
        User.hasMany(Order)
        Order.belongsToMany(Product, { through: OrderItem })

        await sequelize.sync();
        console.log(" Product table synced!");

        const [user, created] = await User.findOrCreate({
            where: { email: 'admin@example.com' },
            defaults: { name: 'Admin' }
        });
        const cart = await user.getCart();


        // console.log(created ? 'New user created' : 'User already exists:', user.toJSON());

        app.listen(3000, () => {
            console.log(" Server running on http://localhost:3000");
        });
    } catch (err) {
        console.error(err);
    }
}
table()
