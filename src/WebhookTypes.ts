import { latLngSchema, deliveryDataSchema, refundDataSchema } from './DaasTypes'
import { z } from 'zod'

export enum WebhookEventKind {
    DeliveryStatus = 'event.delivery_status',
    CourierUpdate = 'event.courier_update',
    RefundRequest = 'event.refund_request',
    DapiStatusChanged = 'dapi.status_changed',
    DapiRefundRequested = 'dapi.refund_requested',
}

export const webhookEventKindSchema = z.nativeEnum(WebhookEventKind)

export const courierUpdateSchema = z.object({
    location: latLngSchema,
    kind: webhookEventKindSchema.describe('The kind of the event (always "event.courier_update")'),
    live_mode: z.boolean().describe('Flag indicating if the event applies to a live vs. a test delivery'),
    delivery_id: z.string().describe('The ID of the delivery the event applies to'),
    job_id: z.string().describe('The ID of the job the event applies to'),
    data: deliveryDataSchema,
})

export type CourierUpdate = z.infer<typeof courierUpdateSchema>

export const refundRequestEventSchema = z.object({
    kind: webhookEventKindSchema.describe('The kind of the event, (always "event.courier_update") '),
    created: z.number().describe('Timestamp indicating when the event was generated.'),
    delivery_id: z.string().describe('The ID of the delivery the event applies to.'),
    id: z.string().describe('A unique ID for this event instance.'),
    data: refundDataSchema.describe('Information about the refund.'),
    external_id: z.string().optional().describe('An ID for an account as stored in an external system.'),
    external_order_id: z.string().optional().describe('An ID for delivery in an external system.'),
})

export type RefundRequestEvent = z.infer<typeof refundRequestEventSchema>
