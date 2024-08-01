// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, { rest, json, urlencoded, cors, notFound, errorHandler } from '@feathersjs/express'
// the dotenv import has to come before the feather config import
import 'dotenv/config'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'

import type { Application } from './declarations'
import { configurationValidator } from './configuration'
import { createOleaLogger } from '../logger'
import { logError } from './hooks/log-error'
import { sqlite } from './sqlite'
import { services } from './services/index'
import { channels } from './channels'

const app: Application = express(feathers())
export const v1Logger = createOleaLogger('V1')

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
// @ts-ignore-error
app.set('view engine', 'pug')
// app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)
app.configure(sqlite)
app.configure(services)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger: v1Logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
