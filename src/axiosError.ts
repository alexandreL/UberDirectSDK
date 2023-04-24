import { AxiosError } from 'axios'
import { JsonValue } from 'type-fest'

function indent(str: string): string {
    return str
        .split('\n')
        .map((s) => (s ? `  ${s}` : ''))
        .join('\n')
}

function json(data: JsonValue): string {
    return JSON.stringify(data, null, 2)
}

export default function AxiosErrorToString(error: AxiosError): string {
    if (!error.isAxiosError) return error as unknown as string
    let requestMessage = ''

    if (error.config) {
        let { data } = error.config

        try {
            data = JSON.parse(data)
        } catch (_) {
            // ignore
        }

        let requestData = ''

        if (error.config.data) {
            requestData = `
Request Data -
${indent(json(data))}`
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
${indent(json(error.response.data))}`
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

