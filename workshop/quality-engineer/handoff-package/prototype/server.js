const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const { initDb, getPets, addPet, resetDb } = require('./src/db')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// initialize DB and start server
async function start() {
  await initDb('db.json')

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Prototype server running at http://localhost:${port}`))
}
start().catch(err => { console.error('Failed to start server', err); process.exit(1) })

app.use('/', express.static(path.join(__dirname, 'static')))
const apiRouter = require('./src/router')
app.use('/api', apiRouter)

// server started in start()
