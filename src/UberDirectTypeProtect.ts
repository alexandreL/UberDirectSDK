import { ZodError } from 'zod'

export class UberDirectTypeProtectErrorHandling {
    callback: ((error: ZodError) => void) | null = null

    constructor(private enableThrow: boolean = false) {
    }

    /**
     * set callback to send error to broker of monitoring system or message queue
     * @param callback
     */
    setThrowCallback(callback: (error: ZodError) => void) {
        this.callback = callback
    }

    /**
     * set to true to throw error if type is wrong
     * set to false to only send a warning to the callback
     * @param enableThrow
     */
    setEnableThrow(enableThrow: boolean) {
        this.enableThrow = enableThrow
    }

    /**
     * throw error if enableThrow is true
     * always send error to callback
     * @param error
     * @protected
     */
    protected throw(error: ZodError) {
        if (this.callback) {
            this.callback(error)
        }
        if (this.enableThrow) {
            throw error
        }
    }
}
