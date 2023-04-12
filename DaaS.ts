import { UberDeliveryAuth } from './UberDeliveryAuth'
import { DeliveryRequest, DeliveryResponse, QuoteRequest, QuoteResponse } from './types'

class DaaS {
    constructor(private readonly auth: UberDeliveryAuth) {
    }

    async quote(requestBody: QuoteRequest): Promise<QuoteResponse> {
        const url = `customers/${ this.auth.getCustomerId() }/delivery_quotes`

        const response = await this.auth.makeApiRequest<QuoteResponse>('post', url, requestBody)
        return response
    }

    async createDelivery(requestBody: DeliveryRequest): Promise<DeliveryResponse> {
        const url = `customers/${ this.auth.getCustomerId() }/deliveries`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url, requestBody)
        return response
    }

    async getDelivery(deliveryId: string): Promise<DeliveryResponse> {
        const url = `customers/${ this.auth.getCustomerId() }/deliveries/${ deliveryId }`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('get', url)
        return response
    }

    async updateDelivery(deliveryId: string, requestBody: DeliveryRequest): Promise<DeliveryResponse> {
        const url = `customers/${ this.auth.getCustomerId() }/deliveries/${ deliveryId }`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url, requestBody)
        return response
    }
}
