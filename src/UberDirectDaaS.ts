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
} from './types/DaasTypes'
import { ZodError } from 'zod'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'
import { UberDirectLogger } from './UberDirectLogger'

/**
 * UberDirect Direct DaaS API Client
 * Delivery as a Service (DaaS) is a service that allows you to create deliveries between two addresses.
 */
export class UberDirectDaaS extends UberDirectTypeProtectErrorHandling {
    constructor(private readonly auth: UberDirectAuth, private readonly logger = new UberDirectLogger(), private readonly testMode = false) {
        super()
    }

    /**
     * Create a quote to check deliverability, validity and cost for delivery between two addresses.
     * @param requestBody
     * @param customerId
     */
    async quote(requestBody: QuoteRequest, customerId: undefined | string = undefined): Promise<QuoteResponse> {
        const url = `customers/${ customerId || this.auth.getCustomerId() }/delivery_quotes`

        const response = await this.auth.makeApiRequest<QuoteResponse>('post', url, requestBody, this.logger)
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
     * @param customerId
     */
    async createDelivery(requestBody: DeliveryData, customerId: undefined | string = undefined): Promise<DeliveryResponse> {
        const url = `customers/${ customerId || this.auth.getCustomerId() }/deliveries`
        if (this.testMode) {
            requestBody.test_specifications = {
                robo_courier_specification: {
                    mode: 'auto',
                },
            }
        }

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url, requestBody, this.logger)
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
     * @param customerId
     */
    async getDelivery(deliveryId: string, customerId: undefined | string = undefined): Promise<DeliveryResponse> {
        const url = `customers/${ customerId || this.auth.getCustomerId() }/deliveries/${ deliveryId }`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('get', url, undefined, this.logger)
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
     * @param customerId
     */
    async updateDelivery(deliveryId: string, requestBody: DeliveryData, customerId: undefined | string = undefined): Promise<DeliveryResponse> {
        const url = `customers/${ customerId || this.auth.getCustomerId() }/deliveries/${ deliveryId }`
        if (this.testMode) {
            requestBody.test_specifications = {
                robo_courier_specification: {
                    mode: 'auto',
                },
            }
        }

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url, requestBody, this.logger)
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
     * @param customerId
     */
    async cancelDelivery(deliveryId: string, customerId: undefined | string = undefined): Promise<boolean> {
        const url = `customers/${ customerId || this.auth.getCustomerId() }/deliveries/${ deliveryId }/cancel`

        const response = await this.auth.makeApiRequest<DeliveryResponse>('post', url, undefined, this.logger)
        try {
            deliveryResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response.status === 'canceled'
    }

    /**
     * List all deliveries for a customer.
     * @param customerId
     */
    async listDeliveries(customerId: undefined | string = undefined): Promise<DeliveryListResponse> {
        const url = `customers/${ customerId || this.auth.getCustomerId() }/deliveries`

        const response = await this.auth.makeApiRequest<DeliveryListResponse>('get', url, undefined, this.logger)
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
     * @param deliveryId
     * @param requestBody
     * @param customerId
     */
    async getPOD(deliveryId: string, requestBody: PODRequest, customerId: undefined | string = undefined): Promise<PODResponse> {
        const url = `customers/${ customerId || this.auth.getCustomerId() }/deliveries/${ deliveryId }/proof-of-delivery`

        const response = await this.auth.makeApiRequest<PODResponse>('post', url, requestBody, this.logger)
        try {
            pODResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }
}
