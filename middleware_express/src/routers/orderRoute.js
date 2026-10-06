import express from 'express'
import { OrderController } from '../controllers/orderController.js'

const router = express.Router()
const controller = new OrderController()

router.get('/', (req, res) => controller.getAll(req, res))
router.get('/user/:userId', (req, res) => controller.getByUser(req, res))
router.get('/:id', (req, res) => controller.getOne(req, res))
router.post('/', (req, res) => controller.create(req, res))
router.put('/:id', (req, res) => controller.update(req, res))
router.delete('/:id', (req, res) => controller.remove(req, res))

export default router