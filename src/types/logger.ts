export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug'
export type Args = (...args: unknown[]) => string | false | void

export interface Logger {
    log: (level: LogLevel, ...args: unknown[]) => string | false | void
    error: Args
    warn: Args
    info: Args
    debug: Args
}
