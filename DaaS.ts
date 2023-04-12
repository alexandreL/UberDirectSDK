import { UberDeliveryAuth } from './UberDeliveryAuth'
import {
    DeliveryListResponse,
    DeliveryRequest,
    DeliveryResponse, PODRequest,
    PODResponse,
    QuoteRequest,
    QuoteResponse
} from './types'

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

    async cancelDelivery(deliveryId: string): Promise<boolean> {
        const url = `customers/${ this.auth.getCustomerId() }/deliveries/${ deliveryId }/cancel`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url)
        return response.status === 'canceled'
    }

    async listDeliveries(): Promise<DeliveryListResponse> {
        const url = `customers/${ this.auth.getCustomerId() }/deliveries`

        const response = await this.auth.makeApiRequest<DeliveryListResponse>('get', url)
        return response
    }

    async getPOD(customerId: string, deliveryId: string, requestBody: PODRequest): Promise<PODResponse> {
        const url = `customers/${customerId}/deliveries/${deliveryId}/proof-of-delivery`;

        const response = await this.auth.makeApiRequest<PODResponse>('post', url, requestBody);
        return response;
    }
}
