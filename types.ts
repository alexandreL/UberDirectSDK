export interface AuthCredentials {
    clientId: string;
    clientSecret: string;
    customerId: string;
}

export interface QuoteRequestBody extends Record<string, unknown> {
    customer_id: string;
    dropoff_address: string;
    pickup_address: string;
    dropoff_latitude?: number;
    dropoff_longitude?: number;
    dropoff_phone_number?: string;
    pickup_latitude?: number;
    pickup_longitude?: number;
    pickup_phone_number?: string;
    pickup_ready_dt?: string;
    pickup_deadline_dt?: string;
    dropoff_ready_dt?: string;
    dropoff_deadline_dt?: string;
    manifest_total_value?: number;
    external_store_id?: string;
}

export interface QuoteResponseBody {
    created: string;
    currency_type: string;
    dropoff_deadline: string;
    dropoff_eta: string;
    duration: number;
    expires: string;
    fee: number;
    id: string;
    kind: string;
    pickup_duration: number;
    external_store_id?: string;
}

export type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';
