import bcrypt from 'bcryptjs'
import { User } from '../models/userModel.js'
import { validateEmail, validatePassword, validateName } from '../../utils/validators.js'

export class UserService {
  async create({ name, email, password, role }) {
    if (!validateName(name)) throw new Error('Некорректное название')
    if (!validateEmail(email)) throw new Error('Некорректный email, пусси')
    if (!validatePassword(password)) {
      throw new Error('Пароль должен быть не короче 8 символов и содержать буквы и цифры')
    }

    const existing = await User.findOne({ where: { email } })
    if (existing) throw new Error('Пользователь с таким email уже существует')

    const hash = await bcrypt.hash(password, 10)
    return User.create({ name, email, password: hash, role })
  }

  async getAll() {
    return User.findAll({ attributes: { exclude: ['password'] } })
  }

  async getById(id) {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } })
    if (!user) throw new Error('Пользователь не найден')
    return user
  }

  async update(id, data) {
    const user = await User.findByPk(id)
    if (!user) throw new Error('Пользователь не найден')

    if (data.email && !validateEmail(data.email)) throw new Error('Некорректный email')
    if (data.name && !validateName(data.name)) throw new Error('Некорректное имя')

    if (data.password) {
      if (!validatePassword(data.password)) {
        throw new Error('Пароль должен быть не короче 8 символов и содержать буквы и цифры')
      }
      data.password = await bcrypt.hash(data.password, 10)
    }

    await user.update(data)
    return user
  }

  async remove(id) {
    const user = await User.findByPk(id)
    if (!user) throw new Error('Пользователь не найден')
    await user.destroy()
    return true
  }

  async verifyPassword(email, password) {
    const user = await User.findOne({ where: { email } })
    if (!user) return null
    const ok = await bcrypt.compare(password, user.password)
    return ok ? user : null
  }
}