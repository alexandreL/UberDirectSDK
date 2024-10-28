import * as console from 'console'
import { Logger } from './types/logger'

export class UberDirectLogger {
    constructor(logger?: Logger, enable = false) {
        if (logger)
            this._logger = logger
        this._enable = enable
    }

    private _enable = false

    set enable(enable: boolean) {
        this._enable = enable
    }

    private _logger: Logger = console

    set logger(logger: Logger) {
        this._logger = logger
    }

    debug(message: string, ...args: unknown[]) {
        if (!this._enable) return
        this._logger.info(message, ...args)
    }

    warn(message: string, ...args: unknown[]) {
        if (!this._enable) return
        this._logger.warn(message, ...args)
    }

    error(message: string, ...args: unknown[]) {
        if (!this._enable) return
        this._logger.error(message, ...args)
    }
}
