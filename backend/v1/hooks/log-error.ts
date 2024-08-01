// For more information about this file see https://dove.feathersjs.com/guides/cli/log-error.html
import { v1Logger } from '../app'
import type { HookContext, NextFunction } from '../declarations'

export const logError = async (context: HookContext, next: NextFunction) => {
  try {
    await next()
  } catch (error: any) {
    v1Logger.error(error.stack)

    // Log validation errors
    if (error.data) {
      v1Logger.error('Data: %O', error.data)
    }

    throw error
  }
}
