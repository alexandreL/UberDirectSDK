export class UberDirectLogger {
    logger = console
    isEnable = false

    setLogger(logger: any) {
        this.logger = logger
    }

    info(message: string, ...args: any[]) {
        if (!this.isEnable) return
        this.logger.info(message, ...args)
    }

    warn(message: string, ...args: any[]) {
        if (!this.isEnable) return
        this.logger.warn(message, ...args)
    }

    error(message: string, ...args: any[]) {
        if (!this.isEnable) return
        this.logger.error(message, ...args)
    }
}
