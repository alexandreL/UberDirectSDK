import { ZodError } from 'zod'

export class UberDirectTypeProtectErrorHandling {
    callback: ((error: ZodError) => void) | null = null

    constructor(private enableThrow: boolean = false) {
    }

    setThrowCallback(callback: (error: ZodError) => void) {
        this.callback = callback
    }

    setEnableThrow(enableThrow: boolean) {
        this.enableThrow = enableThrow
    }

    protected throw(error: ZodError) {
        if (this.callback) {
            this.callback(error)
        }
        if (this.enableThrow) {
            throw error
        }
    }
}
