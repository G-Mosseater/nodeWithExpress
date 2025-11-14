import { Product } from "./models/product.js";
import { User } from "./models/user.js";
import { sequelize } from "./util/db.js";
import { Cart } from "./models/cart.js";
import { CartItem } from "./models/cart-item.js";
import { Order } from "./models/order.js";
import { OrderItem } from "./models/order-item.js";

const showData = async () => {
    try {
        User.hasMany(Product, { foreignKey: 'userId', onDelete: 'CASCADE' });
        Product.belongsTo(User, { foreignKey: 'userId' });

        await sequelize.authenticate();
        console.log('Connected to database ✅');

        const users = await User.findAll({ include: Product });
        const products = await Product.findAll({ include: User });
        const cart = await Cart.findAll()
        const cartItem = await CartItem.findAll()
        const order = await Order.findAll()
        const orderItem = await OrderItem.findAll()


        console.log('Users:', users.map(u => u.toJSON()));
        console.log('Products:', products.map(p => p.toJSON()));
        console.log('Cart:', cart.map(c => c.toJSON()));
        console.log('cartItem:', cartItem.map(ci => ci.toJSON()));
        console.log('order:', order.map(o => o.toJSON()));
        console.log('orderItem:', orderItem.map(oi => oi.toJSON()));



    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
};

showData();