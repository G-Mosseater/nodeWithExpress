import express from 'express';
import { router as AdminRoutes } from './routes/admin.js'
import { router as shopRoutes } from './routes/shop.js'
import { notFound } from './controllers/error.js';

const app = express();
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }));




app.use(express.static('public'))
app.use('/admin', AdminRoutes)
app.use(shopRoutes)



app.use(notFound)



app.listen(3000, () => {

    console.log('Server running on http://localhost:3000');
})