import JsSHA from 'jssha'
import { DeliveryResponse, deliveryResponseSchema } from './DaasTypes'
import { CourierUpdate, RefundRequestEvent, WebhookEventKind, refundRequestEventSchema, courierUpdateSchema } from './WebhookTypes'
import { ZodError } from 'zod'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'

export class UberDirectWebhook extends UberDirectTypeProtectErrorHandling {
    private readonly secret: string

    constructor(secret: string) {
        super()
        this.secret = secret
    }

    public verifySignature(payload: string | Record<string, unknown>, signatureHeader: string): boolean {
        const signature = this.calculateSignature(payload)
        return signature === signatureHeader
    }

    public getRequestEventKind(payload: string | Record<string, unknown>): WebhookEventKind {
        if (typeof payload === 'string') {
            const parsedPayload = JSON.parse(payload)
            return parsedPayload.kind
        }
        if (!payload.kind) throw new Error('Invalid payload')
        return payload.kind as WebhookEventKind
    }

    public handleWebhook(payload: string | Record<string, unknown>, headers: Record<string, unknown>): DeliveryResponse | CourierUpdate | RefundRequestEvent {
        let signature = headers['x-postmates-signature']
        if (!signature)
            throw new Error('No signature provided')

        if (Array.isArray(signature) && signature.length > 0)
            signature = signature[0]

        if (typeof signature !== 'string')
            throw new Error('Invalid signature')

        if (!this.verifySignature(payload, signature)) {
            throw new Error('Invalid signature')
        }

        const eventKind = this.getRequestEventKind(payload)
        switch (eventKind) {
        case WebhookEventKind.DeliveryStatus:
            try {
                deliveryResponseSchema.parse(payload)
            } catch (e) {
                this.throw(e as ZodError)
            }
            return payload as DeliveryResponse
        case WebhookEventKind.CourierUpdate:
            try {
                courierUpdateSchema.parse(payload)
            } catch (e) {
                this.throw(e as ZodError)
            }
            return payload as CourierUpdate
        case WebhookEventKind.RefundRequest:
            try {
                refundRequestEventSchema.parse(payload)
            } catch (e) {
                this.throw(e as ZodError)
            }
            return payload as RefundRequestEvent
        }

        throw new Error('Unknown webhook event')
    }

    private calculateSignature(payload: string | Record<string, unknown>): string {
        const shaObj = new JsSHA('SHA-256', 'TEXT')
        shaObj.setHMACKey(this.secret, 'TEXT')
        if (typeof payload === 'string') {
            shaObj.update(payload)
        } else {
            shaObj.update(JSON.stringify(payload))
        }
        return shaObj.getHMAC('HEX')
    }
}
