import express from 'express'
import request from 'request'
import { API_SERVER } from '../config'

const router = express.Router()

router.get("/mobile/:citizen_id/loans", async function (req, res) {
  request(`${API_SERVER}/api/Loans/mobile/${req.params.citizen_id}/loans`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const result = JSON.parse(response.body)
      res.send(result)
    }
  })
})

router.get("/mobile/:citizen_id/transactions", async function (req, res) {
  request(`${API_SERVER}/api/Loans/mobile/${req.params.citizen_id}/transactions`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const result = JSON.parse(response.body)
      res.send(result)
    }
  })
})

router.get("/mobile/:citizen_id/transactions90", async function (req, res) {
  request(`${API_SERVER}/api/Loans/mobile/${req.params.citizen_id}/transactions90`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const result = JSON.parse(response.body)
      res.send(result)
    }
  })
})

export default router