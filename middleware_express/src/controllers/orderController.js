import { OrderService } from '../services/orderService.js'

const service = new OrderService()

export class OrderController {
  async getAll(req, res) {
    try { res.json(await service.getAll()) }
    catch (e) { res.status(500).json({ error: e.message }) }
  }

  async getOne(req, res) {
    try { res.json(await service.getById(req.params.id)) }
    catch (e) { res.status(404).json({ error: e.message }) }
  }

  async getByUser(req, res) {
    try { res.json(await service.getByUserId(req.params.userId)) }
    catch (e) { res.status(404).json({ error: e.message }) }
  }

  async create(req, res) {
    try { res.status(201).json(await service.create(req.body)) }
    catch (e) { res.status(400).json({ error: e.message }) }
  }

  async update(req, res) {
    try { res.json(await service.update(req.params.id, req.body)) }
    catch (e) { res.status(400).json({ error: e.message }) }
  }

  async remove(req, res) {
    try { await service.remove(req.params.id); res.json({ ok: true }) }
    catch (e) { res.status(404).json({ error: e.message }) }
  }
}