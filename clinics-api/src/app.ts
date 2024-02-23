import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'

import * as routes from './routes'
const app = express()

app.use(rateLimit({
  windowMs: 60 * 1000 * 15, // 15 minutes
  limit: 300, // Limit each IP to 300 requests per 15min window
  standardHeaders: 'draft-7',
  legacyHeaders: false
}))

app.use(express.json())

app.get('/clinicsWithPatients', cors(), routes.clinicsWithPatients)

export default app
