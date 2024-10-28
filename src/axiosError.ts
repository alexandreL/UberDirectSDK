import { AxiosError } from 'axios'
import { JsonValue } from 'type-fest'

function indent(str: string): string {
    return str
        .split('\n')
        .map((s) => (s ? `  ${s}` : ''))
        .join('\n')
}

function beautyJson(data: JsonValue): string {
    return JSON.stringify(data, null, 2)
}

export default function AxiosErrorToString(error: AxiosError): string {
    if (!error.isAxiosError) return error as unknown as string
    let requestMessage = ''

    if (error.config) {
        let requestData = ''

        if (error.config.data) {
            let { data } = error.config

            try {
                data = JSON.parse(data)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                // ignore
            }

            requestData = `
Request Data -
${indent(beautyJson(data))}`
        }

        requestMessage = `
Request -
  ${error.config.method ? error.config.method.toUpperCase() : ''} ${
        error.config.url
    }
${requestData}`
    }

    let responseMessage = ''

    if (error.response) {
        let responseData

        if (error.response.data) {
            responseData = `
Response Data -
${indent(beautyJson(error.response.data as JsonValue))}`
        }

        responseMessage = `
Response -
  ${error.response.status} ${error.response.statusText}
${responseData}`
    }

    return `
${error.stack}

Error Message -
  ${error.message}
${requestMessage}
${responseMessage}
`
}

