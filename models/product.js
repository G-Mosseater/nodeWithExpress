import fs from 'fs/promises'
import path from 'path'
import { rootDir } from '../util/path.js'
import Cart from './cart.js';
const dataDir = path.join(rootDir, 'data');
const filePath = path.join(dataDir, 'products.json');


export default class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    async save() {
        await fs.mkdir(dataDir, { recursive: true })

        let products = []

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8')
            products = JSON.parse(fileContent)
        } catch (err) {
            console.log('No products file found, creating a new one.')
        }

        if (this.id) {
            const existingProductIndex = products.findIndex(prod => prod.id === this.id)
            if (existingProductIndex !== -1) {
                products[existingProductIndex] = this
            } else {
                products.push(this)
            }
        } else {
            this.id = Date.now().toString() 
            products.push(this)
        }

        await fs.writeFile(filePath, JSON.stringify(products))
    }



    static async fetchAll() {

        try {
            const fileContent = await fs.readFile(filePath, 'utf-8')
            return JSON.parse(fileContent)
        }
        catch (err) {
            return []
        }
    }
    static async findById(id) {

        const product = await Product.fetchAll()
        if (!product) return res.status(404).send('Product not found');

        return product.find(product => product.id === id)

    }
    static async deleteById(id) {
        try {
            const products = await Product.fetchAll()

            const productToDelete = products.find(prod => prod.id === id)
            if (!productToDelete) return

            const updatedProducts = products.filter(prod => prod.id !== id)

            await fs.writeFile(filePath, JSON.stringify(updatedProducts))

            await Cart.deleteProduct(id, productToDelete.price)
        } catch (err) {
            console.log('Error deleting product:', err)
        }
    }




}