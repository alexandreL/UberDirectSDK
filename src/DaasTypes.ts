export interface QuoteRequest extends Record<string, unknown> {
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

export interface QuoteResponse {
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

export type DeliveryStatus =
    | 'pending'
    | 'pickup'
    | 'pickup_complete'
    | 'dropoff'
    | 'delivered'
    | 'canceled'
    | 'returned'
    | 'ongoing'

export interface StructuredAddress extends Record<string, unknown> {
    /** Array of street address elements. */
    street_address: string[];
    /** The city of the address. */
    city: string;
    /** The state of the address. */
    state: string;
    /** The zip code of the address. */
    zip_code: string;
    /** The country of the address (optional). */
    country?: string;
}

export interface DeliveryData extends Record<string, unknown> {
    /** The address where the courier will make the dropoff in structured address format. */
    dropoff_address: string;
    /** Name of the place where the courier will make the dropoff. */
    dropoff_name: string;
    /** The phone number of the dropoff location. */
    dropoff_phone_number: string;
    /** @deprecated Use manifest_items instead. A description of the items being delivered. */
    manifest?: string;
    /** List of items being delivered. */
    manifest_items: ManifestItem[];
    /** Pickup address in structured address format. */
    pickup_address: string;
    /** Name of the place where the courier will make the pickup. */
    pickup_name: string;
    /** The phone number of the pickup location. */
    pickup_phone_number: string;
    /** The action the courier should take for a successful delivery. */
    deliverable_action?: DeliverableAction;
    /** Business name of the dropoff location. */
    dropoff_business_name?: string;
    /** Dropoff latitude coordinate. */
    dropoff_latitude?: number;
    /** Dropoff longitude coordinate. */
    dropoff_longitude?: number;
    /** Additional instructions for the courier at the dropoff location. */
    dropoff_notes?: string;
    /** Additional instructions provided by the merchant for the dropoff. */
    dropoff_seller_notes?: string;
    /** Verification steps (i.e. barcode scanning) that must be taken before the dropoff can be completed. */
    dropoff_verification?: VerificationRequirement;
    /** A reference that identifies the manifest. */
    manifest_reference?: string;
    /** Value (in US cents) of the items in the delivery. */
    manifest_total_value?: number;
    /** Business name of the pickup location. */
    pickup_business_name?: string;
    /** Pickup latitude coordinate. */
    pickup_latitude?: number;
    /** Pickup longitude coordinate. */
    pickup_longitude?: number;
    /** Additional instructions for the courier at the pickup location. */
    pickup_notes?: string;
    /** Verification steps (i.e. barcode scanning) that must be taken before the pickup can be completed. */
    pickup_verification?: VerificationRequirement;
    /** The ID of a previously generated delivery quote. */
    quote_id?: string;
    /** The action the courier should take for an unsuccessful delivery. */
    undeliverable_action?: UndeliverableAction;
    /** Beginning of the window when an order must be picked up. */
    pickup_ready_dt?: string;
    /** End of the window when an order may be picked up. */
    pickup_deadline_dt?: string;
    /** Beginning of the window when an order must be dropped off. */
    dropoff_ready_dt?: string;
    /** End of the window when an order must be dropped off. */
    dropoff_deadline_dt?: string;
    /** @deprecated Flag to indicate if the delivery requires signature capture at dropoff. */
    requires_dropoff_signature?: boolean;
    /** Flag to indicate if the delivery requires ID check (minimum age) at dropoff. */
    requires_id?: boolean;
    /** Upfront tip amount in cents. */
    tip?: number;
    /** A key used to avoid duplicate order creation with identical idempotency keys for the same account. */
    idempotency_key?: string;
    /** Unique identifier used by partners to reference a store or location. */
    external_store_id?: string;
    /** Verification steps (barcode scanning, picture, or signature) that must be taken before the return can be completed. */
    return_verification?: VerificationRequirement;
}

export interface ManifestItem extends Record<string, unknown> {
    /** Description of item */
    name: string;
    /** Quantity of items */
    quantity: number;
    /** Approximate size of item */
    size: Size;
    /** optional - dimensions of item */
    dimensions?: Dimensions;
    /** optional - price of the item */
    price?: number;
    /** optional - weight in grams */
    weight?: number;
}

export interface Size extends Record<string, unknown> {
    /** You can carry it with one hand e.g. bottle of water. */
    small: string;
    /** You need a tote bag to carry it e.g. retail bag. */
    medium: string;
    /** You need two hands to carry it e.g. computer monitor. */
    large: string;
    /** You will need to make multiple trips to/from a vehicle to transport e.g. grocery order. Specifying `xlarge` will cause dispatch to only couriers using a car or larger (no walkers/bikes/scooters/etc…). */
    xlarge: string;
    /** Deprecated - same as large. */
    big: string;
}

export interface Dimensions extends Record<string, unknown> {
    /** optional - length in centimeters */
    length?: number;
    /** optional - height in centimeters */
    height?: number;
    /** optional - depth in centimeters */
    depth?: number;
}

export interface DeliverableAction extends Record<string, unknown> {
    /** Meet at door delivery. This is the default if DeliverableAction is not set. */
    deliverable_action_meet_at_door: string;
    /** The “happy path” action for the courier to take on a delivery. When used, delivery action can be set to “leave at door” for a contactless delivery. Cannot leave at door when signature or ID verification requirements are applied when creating a delivery. Photo confirmation of delivery will be automatically applied as a requirement to complete drop-off. */
    deliverable_action_leave_at_door: string;
}

export interface VerificationRequirement extends Record<string, unknown> {
    /** Signature requirement spec to indicate that a signature must be collected at this waypoint. */
    signature_requirement?: SignatureRequirement;
    /** Barcode values/types that must be scanned at the waypoint. Number of elements in the array is equal to the number of barcodes that must be scanned. */
    barcodes?: BarcodeRequirement[];
    /** Pincode requirement spec to indicate a delivery requires pincode confirmation upon delivery. */
    pincode?: PincodeRequirement;
    /** Package verifications required for this waypoint. */
    package?: PackageRequirement;
    /** Identification scanning/verification requirements for this waypoint. */
    identification?: IdentificationRequirement;
    /** Flag for if a picture is required at this waypoint. */
    picture?: boolean;
}

export interface SignatureRequirement extends Record<string, unknown> {
    /** Flag for if a signature is required at this waypoint. */
    enabled: boolean;
    /** Flag for if the signer’s name is required at this waypoint. */
    collect_signer_name?: boolean;
    /** Flag for if the signer’s relationship to the intended recipient is required at this waypoint. */
    collect_signer_relationship?: boolean;
}

export interface BarcodeRequirement extends Record<string, unknown> {
    /** String value encoded in the barcode. */
    value: string;
    /** Type of barcode. Valid values: “CODE39”, “CODE39_FULL_ASCII”, “CODE128”, “QR”. */
    type: string;
}

export interface PincodeRequirement extends Record<string, unknown> {
    /** When set to true in POST requests, the delivery will require pincode entry at handoff. */
    enabled: boolean;
    /** The pincode that the customer must present at dropoff. This field will be ignored in the CreateDelivery requests, and the pin code is internally generated when this requirement is present. */
    value?: string;
}

export interface PackageRequirement extends Record<string, unknown> {
    /** Number of bags to be picked up. */
    bag_count?: number;
    /** Number of drinks to be picked up. */
    drink_count?: number;
}

export interface IdentificationRequirement extends Record<string, unknown> {
    /** Minimum age that must be verified for this delivery. */
    min_age?: number;
}

export interface UndeliverableAction extends Record<string, unknown> {
    /** Specify the “unhappy path” action for the courier to take on a delivery once a normal delivery attempt is made and a customer is not available. Cannot leave at door when signature or ID verification requirements are applied when creating a delivery. Photo confirmation of delivery will be automatically applied as a requirement to complete drop-off. */
    leave_at_door: string;
    /** Specify the “unhappy path” action for the courier to take on a delivery once a normal delivery attempt is made and a customer is not available. This action requests the courier to return the delivery to the pickup waypoint. */
    'return': string;
}

export interface DeliveryResponse extends Record<string, unknown> {
    /** Flag indicating if the delivery is ongoing. */
    complete: boolean;
    /** Information about the courier. Only present when a delivery is in progress. */
    courier?: CourierInfo;
    /** Flag indicating if the courier is close to the pickup or dropoff location. */
    courier_imminent: boolean;
    /** Date/Time at which the delivery was created. */
    created: string;
    /** Three-letter ISO currency code, in lowercase. */
    currency: string;
    /** Dropoff details. */
    dropoff: WaypointInfo;
    /** When a delivery must be dropped off. This is the end of the dropoff window. */
    dropoff_deadline: string;
    /** Estimated drop-off time. */
    dropoff_eta: string;
    /** This field identifies who received delivery at the dropoff location. */
    dropoff_identifier: string;
    /** When a delivery is ready to be dropped off. This is the start of the dropoff window. */
    dropoff_ready: string;
    /** An ID for an account as stored in an external system. */
    external_id: string;
    /** Amount in cents that will be charged if this delivery is created. */
    fee: number;
    /** Unique identifier for the delivery ( `del_` + tokenize(uuid)). */
    id: string;
    /** The type of object being described. Always “delivery”. */
    kind: string;
    /** Flag that indicates if this is live mode or test mode. */
    live_mode: boolean;
    /** A detailed description of what the courier will be delivering. */
    manifest: ManifestInfo;
    /** List of items being delivered. */
    manifest_items: ManifestItem[];
    /** The pickup details for the delivery. */
    pickup: WaypointInfo;
    /** When a delivery must be picked up by. This is the end of the pickup window. */
    pickup_deadline: string;
    /** Estimated time the courier will arrive at the pickup location. */
    pickup_eta: string;
    /** When a delivery is ready to be picked up. This is the start of the pickup window. */
    pickup_ready: string;
    /** ID for the Delivery Quote if one was provided when creating this Delivery. */
    quote_id: string;
    /** This is an array of the refund information. */
    refund: RefundData[];
    /** A collection describing other jobs that share an association. i.e.: a return delivery. */
    related_deliveries: RelatedDelivery[];
    /** The current status of the delivery. Always pending when the delivery is created. */
    status: DeliveryStatus;
    /** Amount in cents that will be paid to the courier as a tip. */
    tip: number;
    /** This url can be used to track the courier during the delivery (unauthenticated page). */
    tracking_url: string;
    /** If a delivery was undeliverable, this field will contain the resulting action taken by the courier. */
    undeliverable_action: string;
    /** If a delivery was undeliverable, this field will contain the reason why it was undeliverable. */
    undeliverable_reason: string;
    /** Date/Time at which the delivery was last updated. */
    updated: string;
    /** Alternative delivery identifier. “Id” field should be used for any identification purposes. “uuid” field is equally unique but loses contextual information (i.e. nothing in this identifier points out that it relates to a delivery). “uuid” is case-sensitive. Value for the “uuid” field is UUID v4 with ‘-’ characters removed. */
    uuid: string;
    /** The return details for the delivery. */
    'return'?: WaypointInfo;
}

export interface CourierInfo {
    /** Courier's first name and last initial. */
    name: string;
    /** @deprecated Courier's rating on a scale of 1.0 to 5.0. */
    rating?: number;
    /** The type of vehicle the courier is using. */
    vehicle_type: 'bicycle' | 'car' | 'van' | 'truck' | 'scooter' | 'motorcycle' | 'walker';
    /** The courier's phone number. This is a masked phone number that can only receive calls or SMS from the dropoff phone number. */
    phone_number: string;
    /** A latitude and longitude indicating courier's location. */
    location: LatLng;
    /** A URL to courier's profile image. */
    img_href?: string;
}

export interface LatLng {
    /** Latitude. */
    lat: number;
    /** Longitude. */
    lng: number;
}

export interface WaypointInfo {
    /** Display name of the person/merchant at the waypoint. */
    name: string;
    /** The masked phone number of the waypoint. */
    phone_number: string;
    /** The address of the waypoint. */
    address: string;
    /** Structured address of the waypoint. */
    detailed_address?: Address;
    /** Additional instructions at the waypoint location. */
    notes?: string;
    /** Delivery instructions provided by the seller for the courier at the waypoint location. */
    seller_notes?: string;
    /** When a picture is requested as proof-of-delivery, this field contains the notes provided by the courier (e.g. where the items were left). */
    courier_notes?: string;
    /** Geographic location (Latitude, Longitude) associated with the waypoint. */
    location: LatLng;
    /** Details about different verifications that have/will occur at this waypoint and any associated proof. */
    verification?: VerificationProof;
    /** Details about the verification steps that have/must be taken at this waypoint. */
    verification_requirements?: VerificationRequirement;
    /** Unique identifier used by our Partners to reference a Store or Location. */
    external_store_id?: string;
}

export interface Address {
    street_address_1: string;
    street_address_2?: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    sublocality_level_1?: string;
}

export interface VerificationProof {
    /** Signature information captured. */
    signature?: SignatureProof;
    /** Barcode values/types that were scanned. */
    barcodes?: BarcodeRequirement[];
    /** Picture captured at the waypoint. */
    picture?: PictureProof;
    /** Identification information or scanning information captured. */
    identification?: IdentificationProof;
    /** Pin entry data available after delivery completes. */
    pin_code?: PincodeProof;
    /** The geographic location (Latitude, Longitude) where the job completes. */
    completion_location?: LatLng;
}

export interface SignatureProof {
    /** The url of the signature image. */
    image_url: string;
    /** The name of the person who signed for the package. */
    signer_name?: string;
    /** The relationship of the person who signed for the package to the intended recipient. */
    signer_relationship?: string;
}

export interface BarcodeRequirement {
    /** String value encoded in the barcode. */
    value: string;

    /** Type of barcode. Valid values: "CODE39", "CODE39_FULL_ASCII", "CODE128", "QR". */
    /** @ts-ignore type is custom type */
    type: 'CODE39' | 'CODE39_FULL_ASCII' | 'CODE128' | 'QR';
}

export interface PictureProof {
    /** The url of the image taken at the waypoint. */
    image_url: string;
}

export interface IdentificationProof {
    /** Flag if ID was successfully verified/scanned. */
    min_age_verified?: boolean;
}

export interface PincodeProof {
    /** Value entered during pin verification. */
    entered: string;
}

export interface VerificationRequirement {
    /** @deprecated Flag for if a signature is required at this waypoint. signature_requirement should be used instead. */
    signature?: boolean;
    /** Signature requirement spec to indicate that a signature must be collected at this waypoint. */
    signature_requirement?: SignatureRequirement;
    /** Barcode values/types that must be scanned at the waypoint. Number of elements in the array is equal to the number of barcodes that must be scanned. */
    barcodes?: BarcodeRequirement[];
    /** Pincode requirement spec to indicate a delivery requires pincode confirmation upon delivery. */
    pincode?: PincodeRequirement;
    /** Package verifications required for this waypoint. */
    package?: PackageRequirement;
    /** Identification scanning/verification requirements for this waypoint. */
    identification?: IdentificationRequirement;
    /** A flag indicating whether a picture is required at this waypoint. */
    picture?: boolean;
}

export interface SignatureRequirement {
    /** Flag for if a signature is required at this waypoint. */
    enabled: boolean;
    /** Flag for if the signer’s name is required at this waypoint. */
    collect_signer_name?: boolean;
    /** Flag for if the signer’s relationship to the intended recipient is required at this waypoint. */
    collect_signer_relationship?: boolean;
}

export interface BarcodeRequirement {
    /** String value encoded in the barcode. */
    value: string;
    /** Type of barcode. Valid values: “CODE39”, “CODE39_FULL_ASCII”, “CODE128”, “QR”. */
    type: string;
}

export interface PincodeRequirement {
    /** When set to true in POST requests, the delivery will require pincode entry at handoff. */
    enabled: boolean;
    /** The pincode that the customer must present at dropoff. This is a read-only field available in GET requests that will contain the internally generated pincode. */
    value?: string;
}

export interface PackageRequirement {
    /** Number of bags to be picked up. */
    bag_count?: number;
    /** Number of drinks to be picked up. */
    drink_count?: number;
}

export interface IdentificationRequirement {
    /** Minimum age that must be verified for this delivery. */
    min_age?: number;
}

export interface ManifestInfo {
    /** Reference that identifies the manifest */
    reference: string;
    /** @deprecated A detailed description of what the courier will be delivering */
    description?: string;
    /** Value of the items in the delivery, in local currency */
    total_value: number;
}

export interface ManifestItem {
    /** Description of item */
    name: string;
    /** Quantity of items */
    quantity: number;
    /** Approximate size of item */
    size: Size;
    /** [optional] Struct that contains dimensions */
    dimensions?: Dimensions;
    /** [optional] The price of the item */
    price?: number;
    /** [optional] Weight in grams */
    weight?: number;
}

export interface RelatedDelivery {
    /** Unique identifier for the delivery */
    id: string;
    /** Indicating the nature of the delivery identified in related_deliveries */
    relationship: 'original' | 'returned';
}

export interface RefundData {
    /**  Unique identifier of the refund request. */
    id: string;
    /**  UTC Time i.e. 2023-03-15T04:14:15Z. */
    created_at: number;
    /**  Three-letter ISO currency code, in uppercase i.e. USD. */
    currency_code: string;
    /**  Total monetary amount that the partner is liable to their customers for in cents i.e. 1234. */
    total_partner_refund: number;
    /**  Total monetary amount that Uber will adjust on the billing details report & invoice in cents i.e. 1834. */
    total_uber_refund: number;
    /**  See the refund fee array object. */
    refund_fees: RefundFee[];
    /**  See the refund order item array object. */
    refund_order_items: RefundOrderItem[];
}

export interface RefundFee {
    /**  See the fee code string object. */
    fee_code: FeeCode;
    /**  The amount of the refund fee of the given category. */
    value: number;
    /**  See the category string object. */
    category: Category;
}

type FeeCode = 'UBER_DELIVERY_FEE' | 'PARTNER_FEE' | 'PARTNER_TAX';

type Category = 'DELIVERY' | 'TAX';

export interface RefundOrderItem {
    /**  See the refund item array object. */
    refund_items: RefundItem[];
    /**  “UBER” or “PARTNER”. */
    party_at_fault: string;
    /**  The monetary value of items that the partner is liable towards their customers in cents. */
    partner_refund_amount: number;
    /**  The monetary value of items that Uber will adjust on the billing details report & invoice in cents. */
    uber_refund_amount: number;
    /**  A predefined string of refund reason. */
    reason: string;
}

export interface RefundItem {
    /**  The name of the item. */
    name: string;
    /**  The quantity of the item. */
    quantity: number;
}

export interface RefundPayload {
    created: string;
    data: RefundData;
    delivery_id: string;
    external_id: string;
    external_order_id: string;
    id: string;
    kind: string;
}

export interface UpdateDeliveryRequest {
    /** Additional instructions for the courier at the dropoff location. Max 280 characters. */
    dropoff_notes?: string;

    /** Additional instructions provided by the merchant for the dropoff. Max 280 characters. */
    dropoff_seller_notes?: string;

    /** Verification steps (i.e. barcode scanning) that must be taken before the dropoff can be completed. */
    dropoff_verification?: VerificationRequirement;

    /** Reference that identifies the manifest. Use this to connect a delivery to corresponding information in your system. */
    manifest_reference?: string;

    /** Additional instructions for the courier at the pickup location. Max 280 characters. */
    pickup_notes?: string;

    /** Verification steps (i.e. barcode scanning) that must be taken before the pickup can be completed. */
    pickup_verification?: VerificationRequirement;

    /** Flag to indicate this delivery requires signature capture at dropoff. */
    requires_dropoff_signature?: boolean;

    /** Flag to indicate this delivery requires ID verification. */
    requires_id?: boolean;

    /** Amount in cents that will be paid to the courier as a tip. Can be modified up to 24 hours after a delivery is completed. */
    tip_by_customer?: number;

    /** Dropoff latitude coordinate. */
    dropoff_latitude?: number;

    /** Dropoff longitude coordinate. */
    dropoff_longitude?: number;
}

export interface DeliveryListResponse {
    data: DeliveryResponse[];
    /** URL to fetch the next set of deliveries */
    next_href: string;
    /** Response type, always "list" */
    object: string;
    /** @deprecated Response is always -1 */
    total_count: number;
    /** URL for the request */
    url: string;
}

export interface PODResponse {
    /** A long Base64 string representing the image */
    document: string;
}

export interface PODRequest extends Record<string, unknown> {
    waypoint: 'pickup' | 'dropoff' | 'return';
    type: 'picture' | 'signature' | 'pincode';
}
