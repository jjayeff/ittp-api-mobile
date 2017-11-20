import express from 'express'
import bodyParser from 'body-parser'
import loan from './routes/loan'
import auth from './routes/auth'

const app = express()
const PORT = 3030

app.use(bodyParser.json())

app.use('/api/Loans', loan)
app.use('/api/Auth', auth)

app.listen(PORT)