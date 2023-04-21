import { UberDirectAuth } from './UberDirectAuth'
import {
    DeliveryData,
    DeliveryListResponse,
    deliveryListResponseSchema,
    DeliveryResponse,
    deliveryResponseSchema,
    PODRequest,
    PODResponse,
    pODResponseSchema,
    QuoteRequest,
    QuoteResponse,
    QuoteResponseSchema,
} from './DaasTypes'
import { ZodError } from 'zod'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'

/**
 * UberDirect Direct DaaS API Client
 * Delivery as a Service (DaaS) is a service that allows you to create deliveries between two addresses.
 */
export class UberDirectDaaS extends UberDirectTypeProtectErrorHandling {
    constructor(private readonly auth: UberDirectAuth) {
        super()
    }

    /**
     * Create a quote to check deliverability, validity and cost for delivery between two addresses.
     * @param requestBody
     */
    async quote(requestBody: QuoteRequest): Promise<QuoteResponse> {
        const url = `customers/${this.auth.getCustomerId()}/delivery_quotes`

        const response = await this.auth.makeApiRequest<QuoteResponse>('post', url, requestBody)
        try {
            QuoteResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }

    /**
     * Create a delivery between two addresses.
     * @param requestBody
     */
    async createDelivery(requestBody: DeliveryData): Promise<DeliveryResponse> {
        const url = `customers/${this.auth.getCustomerId()}/deliveries`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url, requestBody)
        try {
            deliveryResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }

        return response
    }

    /**
     * Retrieve the current status of an existing delivery
     * @param deliveryId
     */
    async getDelivery(deliveryId: string): Promise<DeliveryResponse> {
        const url = `customers/${this.auth.getCustomerId()}/deliveries/${deliveryId}`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('get', url)
        try {
            deliveryResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }

    /**
     * Modify an ongoing delivery.
     * @param deliveryId
     * @param requestBody
     */
    async updateDelivery(deliveryId: string, requestBody: DeliveryData): Promise<DeliveryResponse> {
        const url = `customers/${this.auth.getCustomerId()}/deliveries/${deliveryId}`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url, requestBody)
        try {
            deliveryResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }

    /**
     * Cancel an ongoing or previously scheduled delivery.
     * @param deliveryId
     */
    async cancelDelivery(deliveryId: string): Promise<boolean> {
        const url = `customers/${this.auth.getCustomerId()}/deliveries/${deliveryId}/cancel`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url)
        try {
            deliveryResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response.status === 'canceled'
    }

    /**
     * List deliveries for a customer.
     */
    async listDeliveries(): Promise<DeliveryListResponse> {
        const url = `customers/${this.auth.getCustomerId()}/deliveries`

        const response = await this.auth.makeApiRequest<DeliveryListResponse>('get', url)
        try {
            deliveryListResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }

    /**
     * If you require verification for a delivery, you can retrieve a proof-of-delivery image file through our API.
     * This file contains information such as the delivery status, timestamp, Uber Order ID, External Order ID,
     * and the type of proof collected (signature, picture, or pincode).
     * If signer name or relationship is enabled, it will also be included in the file.
     * You can use the delivery token, delivery uuid, or UUID from the CreateDelivery response to identify the order when making the API call.
     * @param customerId
     * @param deliveryId
     * @param requestBody
     */
    async getPOD(customerId: string, deliveryId: string, requestBody: PODRequest): Promise<PODResponse> {
        const url = `customers/${customerId}/deliveries/${deliveryId}/proof-of-delivery`

        const response = await this.auth.makeApiRequest<PODResponse>('post', url, requestBody)
        try {
            pODResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }
}
