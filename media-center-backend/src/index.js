import express from 'express'

import { _, HOME_DIR_KEY, HOME_DIR } from '~/env'

import root from '~/api/root'
import * as bodyParser from 'body-parser'
import storage from 'node-persist'
import cors from 'cors'

(async () => {
  await storage.init()
  await storage.set(HOME_DIR_KEY, HOME_DIR)

  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use('/static', express.static('/'))

  root(app)

  app.listen(3001, function () {
    console.log('Example app listening on port 3000!')
  })
})()
