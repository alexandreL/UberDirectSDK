import JsSHA from 'jssha'
import {
    CourierUpdate,
    courierUpdateSchema,
    DeliveryStatusWebhookEvent,
    DeliveryStatusWebhookEventSchema,
    RefundRequestEvent,
    refundRequestEventSchema,
    WebhookEventKind
} from './types/WebhookTypes'
import { ZodError } from 'zod'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'

export class UberDirectWebhook extends UberDirectTypeProtectErrorHandling {
    private readonly secret: string

    constructor(secret: string) {
        super()
        this.secret = secret
    }

    public verifySignature(payload: string, signatureHeader: string): boolean {
        const signature = this.calculateSignature(payload)
        return signature === signatureHeader
    }

    public verifySignatureWebhook(payload: string, headers: Record<string, unknown>): boolean {
        let signature = headers['x-postmates-signature']
        if (!signature)
            throw new Error('No signature provided')

        if (Array.isArray(signature) && signature.length > 0)
            signature = signature[0]

        if (typeof signature !== 'string')
            throw new Error('Invalid signature type')
        return this.verifySignature(payload, signature)
    }

    public getRequestEventKind(payload: string | Record<string, unknown>): WebhookEventKind {
        if (typeof payload === 'string') {
            const parsedPayload = JSON.parse(payload)
            return parsedPayload.kind
        }
        if (!payload.kind) throw new Error('Invalid payload')
        return payload.kind as WebhookEventKind
    }

    /**
     * Webhooks allow you to receive real-time updates to your ongoing deliveries. By configuring a URL we can POST updates to,
     * you’ll get the most up-to-date information to show to your customers.
     * @param payload
     * @param headers
     */
    public verifyAndHandleWebhook(payload: string | Record<string, unknown>, headers: Record<string, unknown>): DeliveryStatusWebhookEvent | CourierUpdate | RefundRequestEvent {
        let stringPayload: string
        if (typeof payload === 'string') {
            stringPayload = payload
        } else {
            stringPayload = JSON.stringify(payload)
        }
        if (!this.verifySignatureWebhook(stringPayload, headers)) {
            throw new Error('Invalid signature')
        }
        return this.handleWebhook(payload)
    }

    public handleWebhook(payload: string | Record<string, unknown>): DeliveryStatusWebhookEvent | CourierUpdate | RefundRequestEvent {
        const parsedPayload = typeof payload === 'string' ? JSON.parse(payload) : payload

        const eventKind = this.getRequestEventKind(parsedPayload)
        switch (eventKind) {
        case WebhookEventKind.DeliveryStatus:
            try {
                DeliveryStatusWebhookEventSchema.parse(parsedPayload)
            } catch (e) {
                this.throw(e as ZodError)
            }
            return parsedPayload as DeliveryStatusWebhookEvent
        case WebhookEventKind.CourierUpdate:
            try {
                courierUpdateSchema.parse(parsedPayload)
            } catch (e) {
                this.throw(e as ZodError)
            }
            return parsedPayload as CourierUpdate
        case WebhookEventKind.RefundRequest:
            try {
                refundRequestEventSchema.parse(parsedPayload)
            } catch (e) {
                this.throw(e as ZodError)
            }
            return parsedPayload as RefundRequestEvent
        }

        throw new Error('Unknown webhook event')
    }

    private calculateSignature(payload: string): string {
        const shaObj = new JsSHA('SHA-256', 'TEXT')
        shaObj.setHMACKey(this.secret, 'TEXT')
        shaObj.update(payload)
        return shaObj.getHMAC('HEX')
    }
}
