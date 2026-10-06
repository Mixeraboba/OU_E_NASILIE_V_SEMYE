import { useEffect, useState } from 'react'
import { usersApi, productsApi, ordersApi } from './api'

export default function App() {
  const [users, setUsers] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])

  const [userForm, setUserForm] = useState({ name: '', email: '', password: '' })
  const [productForm, setProductForm] = useState({ name: '', price: '', stock: '' })
  const [orderForm, setOrderForm] = useState({ userId: '', productId: '', quantity: '' })

  const [message, setMessage] = useState('')

  // Загрузка всех данных
  const loadAll = async () => {
    try {
      const [u, p, o] = await Promise.all([
        usersApi.getAll(),
        productsApi.getAll(),
        ordersApi.getAll(),
      ])
      setUsers(u)
      setProducts(p)
      setOrders(o)
    } catch (e) {
      setMessage('Ошибка загрузки: ' + (e.response?.data?.error || e.message))
    }
  }

  const getUserName = (userId) => {
  const user = users.find(u => u.id === userId)
  return user ? user.name : `Пользователь #${userId}`
}

const getProductName = (productId) => {
  const product = products.find(p => p.id === productId)
  return product ? product.name : `Товар #${productId}`
}

  useEffect(() => { loadAll() }, [])

  // --- Пользователи ---
  const createUser = async (e) => {
    e.preventDefault()
    try {
      await usersApi.create(userForm)
      setUserForm({ name: '', email: '', password: '' })
      setMessage('Пользователь создан')
      loadAll()
    } catch (e) {
      setMessage('Ошибка: ' + (e.response?.data?.error || e.message))
    }
  }

  const deleteUser = async (id) => {
    try { await usersApi.remove(id); loadAll() }
    catch (e) { setMessage('Ошибка: ' + (e.response?.data?.error || e.message)) }
  }

  // --- Товары ---
  const createProduct = async (e) => {
    e.preventDefault()
    try {
      await productsApi.create({
        name: productForm.name,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
      })
      setProductForm({ name: '', price: '', stock: '' })
      setMessage('Товар создан')
      loadAll()
    } catch (e) {
      setMessage('Ошибка: ' + (e.response?.data?.error || e.message))
    }
  }

  const deleteProduct = async (id) => {
    try { await productsApi.remove(id); loadAll() }
    catch (e) { setMessage('Ошибка: ' + (e.response?.data?.error || e.message)) }
  }

  // --- Заказы ---
  const createOrder = async (e) => {
    e.preventDefault()
    try {
      await ordersApi.create({
        userId: Number(orderForm.userId),
        items: [{ productId: Number(orderForm.productId), quantity: Number(orderForm.quantity) }],
      })
      setOrderForm({ userId: '', productId: '', quantity: '' })
      setMessage('Заказ создан')
      loadAll()
    } catch (e) {
      setMessage('Ошибка: ' + (e.response?.data?.error || e.message))
    }
  }

  const deleteOrder = async (id) => {
    try { await ordersApi.remove(id); loadAll() }
    catch (e) { setMessage('Ошибка: ' + (e.response?.data?.error || e.message)) }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <h1>Магазин — админка</h1>
      {message && <p style={{ color: 'blue' }}>{message}</p>}

      <hr />
      <h2>Пользователи</h2>
      <form onSubmit={createUser}>
        <input placeholder="Имя" value={userForm.name}
          onChange={e => setUserForm({ ...userForm, name: e.target.value })} required />
        <input placeholder="Email" value={userForm.email}
          onChange={e => setUserForm({ ...userForm, email: e.target.value })} required />
        <input placeholder="Пароль" type="password" value={userForm.password}
          onChange={e => setUserForm({ ...userForm, password: e.target.value })} required />
        <button type="submit">Создать</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            #{u.id} — {u.name} — {u.email} — {u.role}
            <button onClick={() => deleteUser(u.id)} style={{ marginLeft: 10 }}>Удалить</button>
          </li>
        ))}
      </ul>

      <hr />
      <h2>Товары</h2>
      <form onSubmit={createProduct}>
        <input placeholder="Название" value={productForm.name}
          onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
        <input placeholder="Цена" type="number" value={productForm.price}
          onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
        <input placeholder="На складе" type="number" value={productForm.stock}
          onChange={e => setProductForm({ ...productForm, stock: e.target.value })} />
        <button type="submit">Создать</button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            #{p.id} — {p.name} — {p.price}₽ — склад: {p.stock}
            <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: 10 }}>Удалить</button>
          </li>
        ))}
      </ul>

      <hr />
      <h2>Заказы</h2>
      <form onSubmit={createOrder}>
        <input placeholder="ID пользователя" type="number" value={orderForm.userId}
          onChange={e => setOrderForm({ ...orderForm, userId: e.target.value })} required />
        <input placeholder="ID товара" type="number" value={orderForm.productId}
          onChange={e => setOrderForm({ ...orderForm, productId: e.target.value })} required />
        <input placeholder="Кол-во" type="number" value={orderForm.quantity}
          onChange={e => setOrderForm({ ...orderForm, quantity: e.target.value })} required />
        <button type="submit">Создать</button>
      </form>

      <ul>
  {orders.map(o => (
    <li key={o.id} style={{ marginBottom: 10 }}>
      <b>#{o.id}</b> — пользователь: <b>{getUserName(o.userId)}</b> — сумма: {o.total}₽ — статус: {o.updatedAt}
      <br />
      <span style={{ fontSize: 13, color: '#555' }}>
        Товары:{' '}
        {o.items?.map(it => (
          <span key={it.id}>
            {getProductName(it.productId)} × {it.quantity} ({it.price}₽)
            {it !== o.items[o.items.length - 1] ? ', ' : ''}
          </span>
        ))}
      </span>
      <button onClick={() => deleteOrder(o.id)} style={{ marginLeft: 10 }}>Удалить</button>
    </li>
  ))}
</ul>
    </div>
  )
}