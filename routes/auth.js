import express from 'express'
import request from 'request'
import md5 from 'md5'
import connection from '../database'
import { API_SERVER } from '../config'

const router = express.Router()

router.post('/:citizen_id/accessTokens', async function (req, res) {
  const data = await getAccessToken(req.body.username, md5(req.body.password))
  if (data) {
    require('crypto').randomBytes(48, async function (err, buffer) {
      const token = buffer.toString('hex')
      if (await setAccessToken(token, data.accessToken)) {
        const result = await getCitizenId(token)
        res.status(200).send(result)
      }
    })
  }
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

const setAccessToken = async (accessToken, oldAccessToken) => {
  return new Promise(function (resolve, reject) {
    connection.query(
      `UPDATE auth
      SET accessToken = '${accessToken}'
      WHERE accessToken = '${oldAccessToken}' `,
      function (err, rows, fields) {
        if (!err) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    )
  })
}

export default router
