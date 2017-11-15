import mysql from 'mysql'

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  port: '3309',
  database: 'userApp'
})

connection.connect(async function(err){
  if(!err) {
    console.log('Connection Successful')
  } else {
    console.log(err)
  }
})

module.exports = connection