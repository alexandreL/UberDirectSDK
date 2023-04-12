import { DeliveryData, LatLng, RefundData } from './DaasTypes'

export interface CourierUpdate extends Record<string, unknown> {
    location: LatLng;
    /** The kind of the event (always "event.courier_update") */
    kind: WebhookEventKind;
    /** Flag indicating if the event applies to a live vs. a test delivery */
    live_mode: boolean;
    /** The ID of the delivery the event applies to */
    delivery_id: string;
    /** The ID of the job the event applies to */
    job_id: string;
    data: DeliveryData;
}

export interface RefundRequestEvent extends Record<string, unknown> {
    /** The kind of the event, (always "event.courier_update")  */
    kind: WebhookEventKind;
    /** Timestamp indicating when the event was generated. */
    created: number;
    /** The ID of the delivery the event applies to. */
    delivery_id: string;
    /** A unique ID for this event instance. */
    id: string;
    /** Information about the refund. */
    data: RefundData;
    /** An ID for an account as stored in an external system. */
    external_id?: string;
    /** An ID for delivery in an external system. */
    external_order_id?: string;
}

export enum WebhookEventKind {
    DeliveryStatus = 'event.delivery_status',
    CourierUpdate = 'event.courier_update',
    RefundRequest = 'event.refund_request',
    DapiStatusChanged = 'dapi.status_changed',
    DapiRefundRequested = 'dapi.refund_requested',
}
