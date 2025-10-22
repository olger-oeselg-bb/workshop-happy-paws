const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const { initDb } = require('./src/db')
const logger = require('./src/logger')

const app = express()
app.use(cors())
app.use(bodyParser.json())
const fs = require('fs')

// ensure uploads directory exists and serve it
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
app.use('/uploads', express.static(uploadsDir))

// Serve frontend: check for dist/ (production build), fallback to static/ (legacy)
const distDir = path.join(__dirname, 'dist')
const staticDir = path.join(__dirname, 'static')
const useVueBuild = fs.existsSync(distDir) && fs.existsSync(path.join(distDir, 'index.html'))

if (useVueBuild) {
  logger.info('Serving Vue frontend from dist/')
  app.use('/', express.static(distDir))
} else {
  logger.info('Serving legacy frontend from static/')
  app.use('/', express.static(staticDir))
}

// initialize DB and start server
async function start() {
  await initDb('db.json')

  const port = process.env.PORT || 3000
  app.listen(port, () => logger.info({ port }, `Prototype server running at http://localhost:${port}`))
}
start().catch(err => { logger.error({ err }, 'Failed to start server'); process.exit(1) })

const apiRouter = require('./src/router')
app.use('/api', apiRouter)

// Fallback: serve index.html for SPA routing (when using Vue build)
if (useVueBuild) {
  app.use((req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
}

// server started in start()
