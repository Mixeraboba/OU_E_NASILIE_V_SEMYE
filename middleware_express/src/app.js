import express from 'express'
import cors from 'cors'
import usersRouter from './routers/userRoute.js'
import productsRouter from './routers/productRoute.js'
import ordersRouter from './routers/orderRoute.js'
import { sequelize } from './models/db.js'

const app = express()
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']

app.use((req, res, next) => {
  const time = new Date().toISOString()
  console.log(`${time} | ${req.method} ${req.url}`)
  next()
})

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use(express.json())

app.post('/echo', (req, res) => res.json(req.body))

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Authorization header is required' })
  next()
}

app.get('/admin', requireAuth, (req, res) => {
  res.json({ message: 'Admin page accessed successfully' })
})

app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', ordersRouter)

export const initDB = async () => {
  await sequelize.sync({ alter: true })
  console.log('Арз скопировал мой код')
}

export default app