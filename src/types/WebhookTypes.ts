import { deliveryResponseSchema, latLngSchema, refundDataSchema } from './DaasTypes'
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
    location: latLngSchema.optional(),
    kind: webhookEventKindSchema.describe('The kind of the event (always "event.courier_update")'),
    live_mode: z.boolean().describe('Flag indicating if the event applies to a live vs. a test delivery'),
    delivery_id: z.string().describe('The ID of the delivery the event applies to'),
    job_id: z.string().optional().describe('The ID of the job the event applies to'),
    data: deliveryResponseSchema,
})

export type CourierUpdateWebookEvent = z.infer<typeof courierUpdateSchema>

export const refundRequestEventSchema = z.object({
    kind: webhookEventKindSchema.describe('The kind of the event, (always "event.courier_update") '),
    created: z.number().describe('Timestamp indicating when the event was generated.'),
    delivery_id: z.string().describe('The ID of the delivery the event applies to.'),
    id: z.string().describe('A unique ID for this event instance.'),
    data: refundDataSchema.describe('Information about the refund.'),
    external_id: z.string().optional().describe('An ID for an account as stored in an external system.'),
    external_order_id: z.string().optional().describe('An ID for delivery in an external system.'),
})

export type RefundRequestWebhookEvent = z.infer<typeof refundRequestEventSchema>

export const DeliveryStatusWebhookEventSchema = z.object({
    status: z.string().describe('Status of the delivery the event refers to.'),
    kind: z.string().describe('The kind of event in more detail (event.delivery_status).'),
    created: z.string().describe('Timestamp indicating when the event was generated.'),
    live_mode: z.boolean().describe('A flag indicating if the event applies to a live vs a test delivery.'),
    delivery_id: z.string().describe('The id of the delivery the event applies to.'),
    id: z.string().describe('A unique id for this event instance.'),
    data: deliveryResponseSchema.describe('Information about the delivery'),
    customer_id: z.string().describe('Unique identifier (prefixed cus_) for the customer this delivery belongs to.'),
    developer_id: z.string().describe('Unique identifier (prefixed dev_) for the developer the above customer_id maps to.'),
    account_id: z.string().describe('Unique identifier (prefixed acc_) for the account of the above developer that this delivery belongs to.'),
    batch_id: z.string().describe('When a delivery is batched, this unique identifier (prefixed bat_) indicates the batch that this delivery belongs to. Can be used to identify deliveries batched with the same courier.'),
    route_id: z.string().describe('Unique identifier (prefixed rte_) of the route a courier is taking.'),
})

export type DeliveryStatusWebhookEvent = z.infer<typeof DeliveryStatusWebhookEventSchema>
