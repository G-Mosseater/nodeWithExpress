
// import fs from 'fs/promises'
// import { rootDir } from '../util/path.js'
// import path from 'path';
// const dataDir = path.join(rootDir, 'data');
// const filePath = path.join(dataDir, 'cart.json');





// export default class Cart {
//     static async addProduct(id, productPrice) {
//         let cart = { products: [], totalPrice: 0 }
//         try {
//             const fileContent = await fs.readFile(filePath, 'utf-8')
//             cart = JSON.parse(fileContent)
//         }
//         catch (err) {
//             console.log(err)
//         }

//         const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
//         const existingProduct = cart.products[existingProductIndex]

//         let updatedProduct
//         if (existingProduct) {
//             updatedProduct = { ...existingProduct }
//             updatedProduct.qty = updatedProduct.qty + 1
//             cart.products = [...cart.products]
//             cart.products[existingProductIndex] = updatedProduct
//         }
//         else {
//             cart.products.push({ id: id, qty: 1 })
//         }

//         cart.totalPrice += Number(productPrice)

//         await fs.writeFile(filePath, JSON.stringify(cart))
//         console.log(cart)
//     }


//     static async deleteProduct(id, productPrice) {


//         try {
//             const fileContent = await fs.readFile(filePath, 'utf-8')
//             const cart = JSON.parse(fileContent)
//             const updatedCart = { ...cart }
//             console.log(cart)

//             const product = updatedCart.products.find(prod => prod.id === id)
//             const productQty = product.qty
//             updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
//             updatedCart.totalPrice -= productPrice * productQty
//             await fs.writeFile(filePath, JSON.stringify(updatedCart))

//         }
//         catch (err) {
//             console.log(err)
//         }
//     }

//     static async getCart() {
//         try {
//             const fileContent = await fs.readFile(filePath, 'utf-8')
//             if (!fileContent) {
//                 return { products: [], totalPrice: 0 };
//             }
//             const cart = JSON.parse(fileContent)
//             return cart

//         }
//         catch (err) {
//             console.log(err)
//         }
//     }
// }
