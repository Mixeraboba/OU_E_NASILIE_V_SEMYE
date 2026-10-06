import { Product } from '../models/productModel.js'
import { validateName, validatePrice } from '../../utils/validators.js'

export class ProductService {
  async create(data) {
    if (!validateName(data.name)) throw new Error('Некорректное название')
    if (!validatePrice(data.price)) throw new Error('Некорректная цена')
    return Product.create(data)
  }

  async getAll() {
    return Product.findAll()
  }

  async getById(id) {
    const product = await Product.findByPk(id)
    if (!product) throw new Error('Товар не найден')
    return product
  }

  async update(id, data) {
    const product = await Product.findByPk(id)
    if (!product) throw new Error('Товар не найден')

    if (data.name && !validateName(data.name)) throw new Error('Некорректное название')
    if (data.price !== undefined && !validatePrice(data.price)) throw new Error('Некорректная цена')

    await product.update(data)
    return product
  }

  async remove(id) {
    const product = await Product.findByPk(id)
    if (!product) throw new Error('Товар не найден')
    await product.destroy()
    return true
  }
}