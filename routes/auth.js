import express from 'express'
import request from 'request'
import md5 from 'md5'
import connection from '../database'
import { API_SERVER } from '../config'
import { compose } from '../../ittp-user-mobile-app/node_modules/redux';

const router = express.Router()

router.post('/:citizen_id/accessTokens', async function (req, res) {
  const data = await getAccessToken(req.body.username, md5(req.body.password))
  if (data) {
    require('crypto').randomBytes(48, async function (err, buffer) {
      const token = buffer.toString('hex')
      if (await setAccessToken(token, data.accessToken)) {
        const result = await getCitizenId(token)
        res.status(200).send(result)
      } else {
        res.status(404).send('404 Not Found')
      }
    })
  } else {
    res.status(404).send('404 Not Found')
  }
})

router.get('/:accessToken/citizenId', async function (req, res) {
  const data = await getCitizenId(req.params.accessToken)
  if (data) {
    res.status(200).send(data);
  } else {
    res.status(404).send('404 Not Found')
  }
})

router.post('/:accessTokens/fb', async function (req, res) {
  const data = await checkFB(req.body.id)
  if (data) {
    if (await setAccessToken(req.body.accessToken, data.accessToken)) {
      const result = await getCitizenId(req.body.accessToken)
      res.status(200).send(result)
    } else {
      res.status(404).send('404 Not Found')
    }
  } else {
    res.status(404).send('404 Not Found')
  }
})

router.post('/:accessTokens/setFb', async function (req, res) {
  const data = await checkUsername(req.body.username)
  if (data) {
    if (await setFb(req.body.accessToken, req.body.username, req.body.id)) {
      const result = await getCitizenId(req.body.accessToken)
      res.status(200).send(result)
    } else {
      res.status(404).send('404 Not Found')
    }
  } else {
    const path = `${API_SERVER}/api/Loans/citizen/${req.body.username}`
    request(path, async function (error, response, body) {
      if (body === '[]') {
        res.status(404).send('404 Not Found')
      } else {
        if (await fbInsert(req.body.accessToken, req.body.username, req.body.id)) {
          const result = await getCitizenId(req.body.accessToken)
      res.status(200).send(result)
        } else {
      res.status(404).send('404 Not Found')
        }
      }
    })
  }
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

const setFb = async (accessToken, username, idFacebook) => {
  return new Promise(function (resolve, reject) {
    connection.query(
      `UPDATE auth
      SET accessToken = '${accessToken}', idFacebook = '${idFacebook}'
      WHERE username = '${username}' `,
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

const fbInsert = async (accessToken, username, idFacebook) => {
  return new Promise(function (resolve, reject) {
    connection.query(
      `INSERT INTO auth (username, password, idFacebook, accessToken)
      VALUES ('${username}', '81dc9bdb52d04dc20036dbd8313ed055', '${idFacebook}', '${accessToken}')`,
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

const checkFB = async (idFacebook) => {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT accessToken,username FROM auth 
      WHERE idFacebook = '${idFacebook}' `,
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

const checkUsername = async (username) => {
  return new Promise(function (resolve, reject) {
    connection.query(
      `SELECT accessToken,username FROM auth 
      WHERE username = '${username}' `,
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
