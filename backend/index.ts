import './tracing'
import { feathers } from '@feathersjs/feathers'
import express, { json, urlencoded, cors, serveStatic, notFound, errorHandler } from '@feathersjs/express'
import 'dotenv/config'
import configuration from '@feathersjs/configuration'
import { app as appV1 } from './v1/app'
import { createOleaLogger } from './logger'
import { configurationValidator } from './v1/configuration'

const port = appV1.get('port')
const host = appV1.get('host')

process.on('unhandledRejection', (reason) => logger.error('Unhandled Rejection %O', reason))

const app = express(feathers())

app.configure(configuration(configurationValidator))
console.log(app.get('public'))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use('/', serveStatic(app.get('public')))

app.use('/api/v1', appV1)

// Configure a middleware for 404s and the error handler
app.use(notFound())
const logger = createOleaLogger('ROOT')
app.use(errorHandler({ logger }))

app.listen(port).then(() => {
  logger.info(`Feathers app listening on http://${host}:${port}`)
})
