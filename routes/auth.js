import express from 'express'
import request from 'request'
import connection from '../database'
import { API_SERVER } from '../config'

const router = express.Router()

router.post('/:citizen_id/accessTokens', async function (req, res) {
  const data = await getAccessToken(req.body.username, req.body.password)
  res.status(200).send(data);
})

router.get('/:accessToken/citizenId', async function (req, res) {
  const data = await getCitizenId(req.params.accessToken)
  res.status(200).send(data);
})

const getAccessToken = async (username, password) => {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT accessToken,username FROM auth 
      WHERE username = '${username}' AND password = '${password}' `,
      function (err, rows, fields) {
        if (!err) {
          resolve(rows[0])
        } else {
          reject(err)
        }
      }
    )
  })
}

const getCitizenId = async (accessToken) => {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT accessToken,username FROM auth 
      WHERE accessToken = '${accessToken}' `,
      function (err, rows, fields) {
        if (!err) {
          resolve(rows[0])
        } else {
          reject(err)
        }
      }
    )
  })
}

export default router
