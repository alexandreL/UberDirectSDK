class UberDirectTypeProtectErrorHandling {
    callback: ((error: Error) => void) | null = null

    constructor(private enableThrow: boolean = false) {
    }

    setCallback(callback: (error: Error) => void) {
        this.callback = callback
    }

    setEnableThrow(enableThrow: boolean) {
        this.enableThrow = enableThrow
    }

    protected throw(error: Error) {
        if (this.callback) {
            this.callback(error)
        }
        if (this.enableThrow) {
            throw error
        }
    }
}
