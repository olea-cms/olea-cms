// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
import { createLogger, format, transports } from 'winston'
import prettyjson from 'prettyjson'
import * as TB from 'triple-beam'
// @ts-ignore-error
const { MESSAGE } = TB.default

const labelFormat = format((info) => {
  const rest = Object.assign({}, info, {
    level: undefined,
    message: undefined,
    splat: undefined,
    label: undefined,
    timestamp: undefined
  })
  // const stringifiedRest = JSON.stringify(
  //   rest,
  //   null,
  //   2
  // )
  const prettyStringifiedRest = prettyjson.render(rest, {
    keysColor: 'red'
  })

  const padding = (info.padding && info.padding[info.level]) || ''
  if (prettyStringifiedRest !== '') {
    info[MESSAGE] = `[${info.label}] (${info.timestamp}) ${info.level}:${padding} ${info.message}
${prettyStringifiedRest}`
  } else {
    info[MESSAGE] = `[${info.label}] (${info.timestamp}) ${info.level}:${padding} ${info.message}`
  }

  return info
})

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const createOleaLogger = (label: string) =>
  createLogger({
    // To see more detailed errors, change this to 'debug'
    level: 'info',
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.align(),
      format.splat(),
      format.simple(),
      format.label({ label }),
      labelFormat()
    ),
    transports: [new transports.Console()]
  })
