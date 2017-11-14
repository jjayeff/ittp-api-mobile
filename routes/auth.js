import express from 'express'
import request from 'request'
import { API_SERVER } from '../config'

const router = express.Router()

router.post('/:citizen_id/accessTokens', async function (req, res) {
  if (req.body.username === '1' && req.body.password === '1') {
    const result = { accessToken: 'afwd123a9123d9a1a01230' }
    res.status(200).send(result);
  }
  res.status(400).send('Bad request !');
})

export default router
