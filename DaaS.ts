import { UberDeliveryAuth } from './UberDeliveryAuth'
import { QuoteRequestBody, QuoteResponseBody } from './types'

class DaaS {
    constructor(private readonly auth: UberDeliveryAuth) {
    }

    async quote(requestBody: QuoteRequestBody): Promise<QuoteResponseBody> {
        const url = `customers/${ this.auth.getCustomerId() }/delivery_quotes`

        const response = await this.auth.makeApiRequest<QuoteResponseBody>('post', url, requestBody)
        return response
    }
}
