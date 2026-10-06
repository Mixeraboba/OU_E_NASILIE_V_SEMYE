import { Order, OrderItem } from '../models/orderModel.js'
import { Product } from '../models/productModel.js'
import { User } from '../models/userModel.js'
import { validateItemsForOrder } from '../../utils/validators.js'

export class OrderService {
  async create({ userId, items }) {
    if (!userId) throw new Error('userId обязателен')
    if (!validateItemsForOrder(items)) throw new Error('Некорректный список товаров')

    const user = await User.findByPk(userId)
    if (!user) throw new Error('Пользователь не найден')

    const order = await Order.create({ userId, status: 'new', total: 0 })

    let total = 0
    for (const item of items) {
      const product = await Product.findByPk(item.productId)
      if (!product) throw new Error(`Товар ${item.productId} не найден`)

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      })

      total += product.price * item.quantity
    }

    await order.update({ total })
    return this.getById(order.id)
  }

  async getAll() {
    return Order.findAll({ include: [{ model: OrderItem, as: 'items' }] })
  }

  async getById(id) {
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
    })
    if (!order) throw new Error('Заказ не найден')
    return order
  }

  async getByUserId(userId) {
    return Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
    })
  }

  async update(id, data) {
    const order = await Order.findByPk(id)
    if (!order) throw new Error('Заказ не найден')
    await order.update(data)
    return order
  }

  async remove(id) {
    const order = await Order.findByPk(id)
    if (!order) throw new Error('Заказ не найден')
    await OrderItem.destroy({ where: { orderId: id } })
    await order.destroy()
    return true
  }
}