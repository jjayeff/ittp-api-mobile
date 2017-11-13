import express from 'express'
import loan from './routes/loan'

const app = express()
const PORT = 3030

app.use('/api/Loans', loan)

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))