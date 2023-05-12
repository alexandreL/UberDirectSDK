export class UberDirectLogger {
    constructor(logger: any = console, enable = false) {
        this._logger = logger
        this._enable = enable
    }

    private _enable = false

    set enable(enable: boolean) {
        this._enable = enable
    }

    private _logger = console

    set logger(logger: any) {
        this.logger = logger
    }

    info(message: string, ...args: any[]) {
        if (!this._enable) return
        this._logger.info(message, ...args)
    }

    warn(message: string, ...args: any[]) {
        if (!this._enable) return
        this._logger.warn(message, ...args)
    }

    error(message: string, ...args: any[]) {
        if (!this._enable) return
        this._logger.error(message, ...args)
    }
}
