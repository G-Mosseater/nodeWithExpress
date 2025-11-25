import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("./.env") });
import express from 'express';
import { router as AdminRoutes } from './routes/admin.js'
import { router as shopRoutes } from './routes/shop.js'
import { router as authRoutes } from './routes/auth.js'
import { User } from './models/userMongo.js';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session'
import csrf from 'csurf';
import flash from "connect-flash/lib/flash.js";
import multer from "multer";
// import { notFound } from './controllers/error.js';
// import { connectMongo, getDb } from './util/db.js';
import { connectDb } from './util/db.js'
// import { sequelize } from './util/db.js';
// import { Product } from './models/product.js';
// import { User } from './models/user.js';
// import { Cart } from './models/cart.js';
// import { CartItem } from './models/cart-item.js';
// import { Order } from './models/order.js';
// import { OrderItem } from './models/order-item.js';

const app = express();
const csrfProtection = csrf()
const Store = MongoDBStore(session)


app.set('view engine', 'ejs')
app.use('/util', express.static('util'))

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.minmetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))

const store = new Store({

    uri: process.env.MONGODB_URI,
    collection: 'sessions'

})
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/images', express.static('images'));

app.use(session({ secret: 'secretValue', resave: false, saveUninitialized: false, store: store }))




app.use(flash())
app.use(csrfProtection)

app.use(async (req, res, next) => {
    if (!req.session.userId) {
        req.user = null
        return next()
    }
    try {
        const user = await User.findById(req.session.userId)
        req.user = user || null
        next()
    } catch (err) {
        console.error(err)
        next()
    }
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    res.locals.errorMessage = req.flash('error');
    next()

})


const startServer = async () => {
    try {
        await connectDb();
        console.log('Connected to Mongo');

        app.use('/admin', AdminRoutes);
        app.use(shopRoutes);
        app.use(authRoutes)

        app.listen(3000, () => {
            console.log('Server started!');
        });

    } catch (err) {
        console.error('Error starting server:', err);
    }
};

startServer();












// app.use(async (req, res, next) => {
//   try {
//     const db = getDb();
//     let user = await db.collection("users").findOne({
//       _id: new ObjectId("69177248d43b1407a8149c60")
//     });

//     if (!user) {
//       user = {
//         _id: new ObjectId("69177248d43b1407a8149c60"),
//         name: "Admin",
//         email: "admin@example.com",
//         cart: { items: [] }
//       };
//       await db.collection("users").insertOne(user);
//       console.log("User created automatically");
//     }

//     req.user = user;
//     next();

//   } catch (err) {
//     console.error("User middleware error:", err);
//     next(err);
//   }
// });

// connectMongo().then(() => {
//   app.listen(3000, () => {
//     console.log(`Server running!`);
//   });
// });


// app.use(notFound)




// app.use(async (req, res, next) => {
//     try {
//         const user = await User.findByPk(1)
//         req.user = user
//         next()
//     }
//     catch (err) {
//         console.error(err)
//     }
// })

// const table = async () => {
//     try {

//         Product.belongsTo(User, {
//             constraints: true, onDelete: 'CASCADE'
//         })
//         User.hasMany(Product)
//         User.hasOne(Cart)
//         Cart.belongsTo(User)
//         Cart.belongsToMany(Product, { through: CartItem })
//         Product.belongsToMany(Cart, { through: CartItem })
//         Order.belongsTo(User)
//         User.hasMany(Order)
//         Order.belongsToMany(Product, { through: OrderItem })

//         await sequelize.sync();
//         console.log(" Product table synced!");

//         const [user, created] = await User.findOrCreate({
//             where: { email: 'admin@example.com' },
//             defaults: { name: 'Admin' }
//         });
//         const cart = await user.getCart();


//         // console.log(created ? 'New user created' : 'User already exists:', user.toJSON());

//         app.listen(3000, () => {
//             console.log(" Server running on http://localhost:3000");
//         });
//     } catch (err) {
//         console.error(err);
//     }
// }
// table()
