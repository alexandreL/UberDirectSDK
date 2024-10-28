import { z } from 'zod'

export const structuredAddressSchema = z.object({
    street_address: z.array(z.string()).describe('The street address of the address.'),
    city: z.string().describe('The city of the address.'),
    state: z.string().describe('The state of the address.'),
    zip_code: z.string().describe('The zip code of the address.'),
    country: z.string().optional().describe('The country of the address (optional).'),
})

export type structuredAddress = z.infer<typeof structuredAddressSchema>

export const quoteRequestSchema = z.object({
    dropoff_address: z.string().describe('For single string, format is : “Street Address, City, State, Zip”'),
    pickup_address: z.string().describe('For single string, format is : “Street Address, City, State, Zip”'),
    dropoff_latitude: z.number().optional(),
    dropoff_longitude: z.number().optional(),
    dropoff_phone_number: z.string().optional(),
    pickup_latitude: z.number().optional(),
    pickup_longitude: z.number().optional(),
    pickup_phone_number: z.string().optional(),
    pickup_ready_dt: z.string().datetime().optional(),
    pickup_deadline_dt: z.string().datetime().optional(),
    dropoff_ready_dt: z.string().datetime().optional(),
    dropoff_deadline_dt: z.string().datetime().optional(),
    manifest_total_value: z.number().int().optional().describe('Value (in US cents) of the items in the delivery. Must be VAT free. i.e.: $10.99 => 1099.'),
    external_store_id: z.string().optional()
})
export type QuoteRequest = z.infer<typeof quoteRequestSchema>

export const QuoteResponseSchema = z.object({
    created: z.string().datetime().describe('The date and time the quote was created.'),
    currency_type: z.string(),
    dropoff_deadline: z.string().datetime(),
    dropoff_eta: z.string().datetime(),
    duration: z.number().describe('Estimated minutes for this delivery to reach dropoff.'),
    expires: z.string().datetime(),
    fee: z.number(),
    id: z.string(),
    kind: z.string(),
    pickup_duration: z.number(),
    external_store_id: z.string().optional()
})

export type QuoteResponse = z.infer<typeof QuoteResponseSchema>

export const deliveryStatusSchema = z.union([
    z.literal('pending').describe('Delivery has been accepted but does not yet have a courier assigned'),
    z.literal('pickup').describe('Courier is assigned and is en route to pick up the items'),
    z.literal('pickup_complete').describe('Courier is moving towards the dropoff'),
    z.literal('dropoff').describe('Courier is moving towards the dropoff'),
    z.literal('delivered').describe('Courier has completed the dropoff'),
    z.literal('canceled').describe('Delivery has been canceled. This could either be due to use of CancelDelivery endpoint or an internal reason'),
    z.literal('returned').describe('The delivery was canceled and a new delivery created to return items to the sender. (See related_deliveries in delivery object.)'),
])

export const sizeSchema = z.enum(['small', 'medium', 'large', 'xlarge']).describe(`
small: You can carry it with one hand e.g. bottle of water.
medium: You need a tote bag to carry it e.g. retail bag.
large: You need two hands to carry it e.g. computer monitor.
xlarge: You will need to make multiple trips to/from a vehicle to transport e.g. grocery order. Specifying \`xlarge\` will cause dispatch to only couriers using a car or larger (no walkers/bikes/scooters/etc…).
`)

export type Size = z.infer<typeof sizeSchema>

export const dimensionsSchema = z.object({
    length: z.number().optional().describe('optional - length in centimeters'),
    height: z.number().optional().describe('optional - height in centimeters'),
    depth: z.number().optional().describe('optional - depth in centimeters'),
})

export type Dimensions = z.infer<typeof dimensionsSchema>

export const deliverableActionSchema = z.enum(['deliverable_action_meet_at_door', 'deliverable_action_leave_at_door']).describe('The action the courier should take on a delivery. If not specified, the default is “meet at door”.')

export type DeliverableAction = z.infer<typeof deliverableActionSchema>

export const signatureRequirementSchema = z.object({
    enabled: z.boolean().describe('Flag for if a signature is required at this waypoint.'),
    collect_signer_name: z.boolean().optional().describe('Flag for if the signer’s name is required at this waypoint.'),
    collect_signer_relationship: z.boolean().optional().describe('Flag for if the signer’s relationship to the intended recipient is required at this waypoint.'),
})

export type SignatureRequirement = z.infer<typeof signatureRequirementSchema>

export const barcodeRequirementSchema = z.object({
    value: z.string().describe('String value encoded in the barcode.'),
    type: z.string().describe('Type of barcode. Valid values: “CODE39”, “CODE39_FULL_ASCII”, “CODE128”, “QR”.'),
})
export type BarcodeRequirement = z.infer<typeof barcodeRequirementSchema>

export const pincodeRequirementSchema = z.object({
    enabled: z.boolean().describe('When set to true in POST requests, the delivery will require pincode entry at handoff.'),
    value: z.string().optional().describe('The pincode that the customer must present at dropoff. This field will be ignored in the CreateDelivery requests, and the pin code is internally generated when this requirement is present.'),
})
export type PincodeRequirement = z.infer<typeof pincodeRequirementSchema>

export const packageRequirementSchema = z.object({
    bag_count: z.number().optional().describe('Number of bags to be picked up.'),
    drink_count: z.number().optional().describe('Number of drinks to be picked up.'),
})
export type PackageRequirement = z.infer<typeof packageRequirementSchema>

export const identificationRequirementSchema = z.object({
    min_age: z.number().optional().describe('Minimum age that must be verified for this delivery.'),
})
export type IdentificationRequirement = z.infer<typeof identificationRequirementSchema>

export const undeliverableActionSchema = z.enum([
    'leave_at_door', 'return', 'discard'
])

export type UndeliverableAction = z.infer<typeof undeliverableActionSchema>

export const latLngSchema = z.object({
    lat: z.number(),
    lng: z.number(),
})

export type LatLng = z.infer<typeof latLngSchema>

export const addressSchema = z.object({
    street_address_1: z.string(),
    street_address_2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    zip_code: z.string(),
    country: z.string(),
    sublocality_level_1: z.string().optional(),
})

export type Address = z.infer<typeof addressSchema>

export const signatureProofSchema = z.object({
    image_url: z.string().describe('The url of the signature image.'),
    signer_name: z.string().optional().describe('The name of the person who signed for the package.'),
    signer_relationship: z.string().optional().describe('The relationship of the person who signed for the package to the intended recipient.'),
})

export type SignatureProof = z.infer<typeof signatureProofSchema>

export const pictureProofSchema = z.object({
    image_url: z.string().describe('The url of the image taken at the waypoint.'),
})

export type PictureProof = z.infer<typeof pictureProofSchema>

export const identificationProofSchema = z.object({
    min_age_verified: z.boolean().optional().describe('Flag if ID was successfully verified/scanned.'),
})

export type IdentificationProof = z.infer<typeof identificationProofSchema>

export const pincodeProofSchema = z.object({
    entered: z.string().describe('Value entered during pin verification'),
})

export type PincodeProof = z.infer<typeof pincodeProofSchema>

export const verificationRequirementSchema = z.object({
    signature_requirement: signatureRequirementSchema.optional().describe('Signature requirement spec to indicate that a signature must be collected at this waypoint.'),
    barcodes: z.array(barcodeRequirementSchema).nullable().optional().describe('Barcode values/types that must be scanned at the waypoint. Number of elements in the array is equal to the number of barcodes that must be scanned.'),
    pincode: pincodeRequirementSchema.optional().describe('Pincode requirement spec to indicate a delivery requires pincode confirmation upon delivery.'),
    package: packageRequirementSchema.optional().describe('Package verifications required for this waypoint.'),
    identification: identificationRequirementSchema.optional().describe('Identification scanning/verification requirements for this waypoint.'),
    picture: z.boolean().optional().describe('Flag for if a picture is required at this waypoint.'),
})

export type VerificationRequirement = z.infer<typeof verificationRequirementSchema>

export const manifestInfoSchema = z.object({
    reference: z.string().describe('Reference that identifies the manifest'),
    description: z.string().optional().describe('@deprecated A detailed description of what the courier will be delivering'),
    total_value: z.number().describe('Value of the items in the delivery, in local currency'),
})

export type ManifestInfo = z.infer<typeof manifestInfoSchema>

export const manifestItemSchema = z.object({
    name: z.string().describe('Description of item'),
    quantity: z.number().describe('Quantity of items'),
    size: sizeSchema.describe('Approximate size of item'),
    dimensions: dimensionsSchema.optional().describe('[optional] Struct that contains dimensions'),
    price: z.number().int().optional().describe('[optional] The price of the item. MUST be VAT free.'),
    weight: z.number().optional().describe('[optional] Weight in grams'),
    vat_percentage: z.number().optional().describe('[optional] The percentage of VAT (value add tax) associated to the manifest_items. i.e.: 12.5% => 1250000.')
})

export type ManifestItem = z.infer<typeof manifestItemSchema>

export const relatedDeliverySchema = z.object({
    id: z.string().describe('Unique identifier for the delivery'),
    relationship: z.union([z.literal('original'), z.literal('returned'), z.literal('multi_order_related')]).describe('Indicating the nature of the delivery identified in related_deliveries'),
})

export type RelatedDelivery = z.infer<typeof relatedDeliverySchema>

const feeCodeSchema = z.union([
    z.literal('UBER_DELIVERY_FEE'),
    z.literal('PARTNER_FEE'),
    z.literal('PARTNER_TAX'),
])

const categorySchema = z.union([z.literal('DELIVERY'), z.literal('TAX')])

export const refundItemSchema = z.object({
    name: z.string().describe('The name of the item.'),
    quantity: z.number().describe('The quantity of the item.'),
})

export type RefundItem = z.infer<typeof refundItemSchema>

export const updateDeliveryRequestSchema = z.object({
    dropoff_notes: z.string().optional().describe('Additional instructions for the courier at the dropoff location. Max 280 characters.'),
    dropoff_seller_notes: z.string().optional().describe('Additional instructions provided by the merchant for the dropoff. Max 280 characters.'),
    dropoff_verification: verificationRequirementSchema.optional().describe('Verification steps (i.e. barcode scanning) that must be taken before the dropoff can be completed.'),
    manifest_reference: z.string().optional().describe('Reference that identifies the manifest. Use this to connect a delivery to corresponding information in your system.'),
    pickup_notes: z.string().optional().describe('Additional instructions for the courier at the pickup location. Max 280 characters.'),
    pickup_verification: verificationRequirementSchema.optional().describe('Verification steps (i.e. barcode scanning) that must be taken before the pickup can be completed.'),
    requires_dropoff_signature: z.boolean().optional().describe('Flag to indicate this delivery requires signature capture at dropoff.'),
    requires_id: z.boolean().optional().describe('Flag to indicate this delivery requires ID verification.'),
    tip_by_customer: z.number().optional().describe('Amount in cents that will be paid to the courier as a tip. Can be modified up to 24 hours after a delivery is completed.'),
    dropoff_latitude: z.number().optional().describe('Dropoff latitude coordinate.'),
    dropoff_longitude: z.number().optional().describe('Dropoff longitude coordinate.'),
})

export type UpdateDeliveryRequest = z.infer<typeof updateDeliveryRequestSchema>

export const pODResponseSchema = z.object({
    document: z.string().describe('A long Base64 string representing the image')
})

export type PODResponse = z.infer<typeof pODResponseSchema>

export const pODRequestSchema = z.object({
    waypoint: z.union([
        z.literal('pickup'),
        z.literal('dropoff'),
        z.literal('return')
    ]),
    type: z.union([
        z.literal('picture'),
        z.literal('signature'),
        z.literal('pincode'),
    ])
})

export type PODRequest = z.infer<typeof pODRequestSchema>

export const deliveryDataSchema = z.object({
    dropoff_address: z.string().describe('The address where the courier will make the dropoff in structured address format.'),
    dropoff_name: z.string().describe('Name of the place where the courier will make the dropoff.'),
    dropoff_phone_number: z.string().describe('The phone number of the dropoff location.'),
    manifest_items: z.array(manifestItemSchema).describe('List of items being delivered.'),
    pickup_address: z.string().describe('Pickup address in structured address format.'),
    pickup_name: z.string().describe('Name of the place where the courier will make the pickup.'),
    pickup_phone_number: z.string().describe('The phone number of the pickup location.'),
    deliverable_action: deliverableActionSchema.optional().describe('The action the courier should take for a successful delivery.'),
    dropoff_business_name: z.string().optional().describe('Business name of the dropoff location.'),
    dropoff_latitude: z.number().optional().describe('Dropoff latitude coordinate.'),
    dropoff_longitude: z.number().optional().describe('Dropoff longitude coordinate.'),
    dropoff_notes: z.string().optional().describe('Additional instructions for the courier at the dropoff location.'),
    dropoff_seller_notes: z.string().optional().describe('Additional instructions provided by the merchant for the dropoff.'),
    dropoff_verification: verificationRequirementSchema.optional().describe('Verification steps (i.e. barcode scanning) that must be taken before the dropoff can be completed.'),
    manifest_reference: z.string().optional().describe('A reference that identifies the manifest.'),
    manifest_total_value: z.number().int().optional().describe('Value (in US cents) of the items in the delivery. Must be VAT free.'),
    pickup_business_name: z.string().optional().describe('Business name of the pickup location.'),
    pickup_latitude: z.number().optional().describe('Pickup latitude coordinate.'),
    pickup_longitude: z.number().optional().describe('Pickup longitude coordinate.'),
    pickup_notes: z.string().optional().describe('Additional instructions for the courier at the pickup location.'),
    pickup_verification: verificationRequirementSchema.optional().describe('Verification steps (i.e. barcode scanning) that must be taken before the pickup can be completed.'),
    quote_id: z.string().optional().describe('The ID of a previously generated delivery quote.'),
    undeliverable_action: undeliverableActionSchema.optional().describe('The action the courier should take for an unsuccessful delivery.'),
    pickup_ready_dt: z.string().optional().describe('Beginning of the window when an order must be picked up.'),
    pickup_deadline_dt: z.string().optional().describe('End of the window when an order may be picked up.'),
    dropoff_ready_dt: z.string().optional().describe('Beginning of the window when an order must be dropped off.'),
    dropoff_deadline_dt: z.string().optional().describe('End of the window when an order must be dropped off.'),
    requires_id: z.boolean().optional().describe('Flag to indicate if the delivery requires ID check (minimum age) at dropoff.'),
    tip: z.number().optional().describe('Upfront tip amount in cents.'),
    idempotency_key: z.string().optional().describe('A key used to avoid duplicate order creation with identical idempotency keys for the same account.'),
    external_store_id: z.string().optional().describe('Unique identifier used by partners to reference a store or location.'),
    return_verification: verificationRequirementSchema.optional().describe('Verification steps (barcode scanning, picture, or signature) that must be taken before the return can be completed.'),
    test_specifications: z.object({
        robo_courier_specification: z.object({
            mode: z.string().describe('The mode of the robo courier simulation.'),
            enroute_for_pickup_at: z.string().optional().describe('The time when the robo courier will be enroute for pickup.'),
            pickup_imminent_at: z.string().optional().describe('The time when the robo courier will be imminent for pickup.'),
            pickup_at: z.string().optional().describe('The time when the robo courier will be at the pickup location.'),
            dropoff_imminent_at: z.string().optional().describe('The time when the robo courier will be imminent for dropoff.'),
            dropoff_at: z.string().optional().describe('The time when the robo courier will be at the dropoff location.'),
            cancel_reason: z.enum([
                'cannot_access_customer_location',
                'cannot_find_customer_address',
                'customer_rejected_order',
                'customer_unavailable'
            ]).optional().describe('The reason the robo courier was cancelled.'),
        })
    }).optional().describe('Set this field to simulate a robot courier delivery. This field is only available for development purposes.'),
})

export type DeliveryData = z.infer<typeof deliveryDataSchema>

export const courierInfoSchema = z.object({
    name: z.string().describe('Courier\'s first name and last initial.'),
    rating: z.string().optional().describe('@deprecated Courier\'s rating on a scale of 1.0 to 5.0.'),
    vehicle_type: z.union([
        z.literal('bicycle'),
        z.literal('car'),
        z.literal('van'),
        z.literal('truck'),
        z.literal('scooter'),
        z.literal('motorcycle'),
        z.literal('walker'),
        z.literal('BICYCLE'),
        z.literal('CAR'),
        z.literal('VAN'),
        z.literal('TRUCK'),
        z.literal('SCOOTER'),
        z.literal('MOTORCYCLE'),
        z.literal('WALKER'),
    ]).describe('The type of vehicle the courier is using.'),
    phone_number: z.string().describe('The courier\'s phone number. This is a masked phone number that can only receive calls or SMS from the dropoff phone number.'),
    location: latLngSchema.describe('A latitude and longitude indicating courier\'s location.'),
    img_href: z.string().optional().describe('A URL to courier\'s profile image.'),
})

export type CourierInfo = z.infer<typeof courierInfoSchema>

export const verificationProofSchema = z.object({
    signature: signatureProofSchema.optional().describe('Signature information captured.'),
    barcodes: z.array(barcodeRequirementSchema).optional().describe('Barcode values/types that were scanned.'),
    picture: pictureProofSchema.optional().describe('Picture captured at the waypoint.'),
    identification: identificationProofSchema.optional().describe('Identification information or scanning information captured.'),
    pin_code: pincodeProofSchema.optional().describe('Pin entry data available after delivery completes.'),
    completion_location: latLngSchema.optional().describe('The geographic location (Latitude, Longitude) where the job completes.'),
})

export type VerificationProof = z.infer<typeof verificationProofSchema>

export const refundFeeSchema = z.object({
    fee_code: feeCodeSchema.describe('See the fee code string object.'),
    value: z.number().describe('The amount of the refund fee of the given category.'),
    category: categorySchema.describe('See the category string object.'),
})

export type RefundFee = z.infer<typeof refundFeeSchema>

export const refundOrderItemSchema = z.object({
    refund_items: z.array(refundItemSchema).describe('See the refund item array object.'),
    party_at_fault: z.enum(['UBER', 'PARTNER']).describe('“UBER” or “PARTNER”.'),
    partner_refund_amount: z.number().describe('The monetary value of items that the partner is liable towards their customers in cents.'),
    uber_refund_amount: z.number().describe('The monetary value of items that Uber will adjust on the billing details report & invoice in cents.'),
    reason: z.string().describe('A predefined string of refund reason.'),
})

export type RefundOrderItem = z.infer<typeof refundOrderItemSchema>

export const waypointInfoSchema = z.object({
    name: z.string().describe('Display name of the person/merchant at the waypoint.'),
    phone_number: z.string().describe('The masked phone number of the waypoint.'),
    address: z.string().describe('The address of the waypoint.'),
    detailed_address: addressSchema.optional().describe('Structured address of the waypoint.'),
    notes: z.string().optional().describe('Additional instructions at the waypoint location.'),
    seller_notes: z.string().optional().describe('Delivery instructions provided by the seller for the courier at the waypoint location.'),
    courier_notes: z.string().optional().describe('When a picture is requested as proof-of-delivery, this field contains the notes provided by the courier (e.g. where the items were left).'),
    location: latLngSchema.describe('Geographic location (Latitude, Longitude) associated with the waypoint.'),
    verification: verificationProofSchema.optional().describe('Details about different verifications that have/will occur at this waypoint and any associated proof.'),
    verification_requirements: verificationRequirementSchema.optional().describe('Details about the verification steps that have/must be taken at this waypoint.'),
    external_store_id: z.string().optional().describe('Unique identifier used by our Partners to reference a Store or Location.'),
    status: z.enum(['completed', 'failed']).describe('Delivery status in respect to the waypoint location'),
    status_timestamp: z.string().datetime().describe('Timestamp of when the status was triggered'),
})

export type WaypointInfo = z.infer<typeof waypointInfoSchema>

export const refundDataSchema = z.object({
    id: z.string().describe('Unique identifier of the refund request.'),
    created_at: z.number().describe('UTC Time i.e. 2023-03-15T04:14:15Z.'),
    currency_code: z.string().describe('Three-letter ISO currency code, in uppercase i.e. USD.'),
    total_partner_refund: z.number().describe('Total monetary amount that the partner is liable to their customers for in cents i.e. 1234.'),
    total_uber_refund: z.number().describe('Total monetary amount that Uber will adjust on the billing details report & invoice in cents i.e. 1834.'),
    refund_fees: z.array(refundFeeSchema).describe('See the refund fee array object.'),
    refund_order_items: z.array(refundOrderItemSchema).describe('See the refund order item array object.'),
})

export type RefundData = z.infer<typeof refundDataSchema>

export const refundPayloadSchema = z.object({
    created: z.string(),
    data: refundDataSchema,
    delivery_id: z.string(),
    external_id: z.string(),
    external_order_id: z.string(),
    id: z.string(),
    kind: z.string(),
})

export type RefundPayload = z.infer<typeof refundPayloadSchema>

export const deliveryResponseSchema = z.object({
    complete: z.boolean().describe('Flag indicating if the delivery is ongoing.'),
    courier: courierInfoSchema.optional().nullable().describe('Information about the courier. Only present when a delivery is in progress.'),
    courier_imminent: z.boolean().describe('Flag indicating if the courier is close to the pickup or dropoff location.'),
    created: z.string().describe('Date/Time at which the delivery was created.'),
    currency: z.string().describe('Three-letter ISO currency code, in lowercase.'),
    dropoff: waypointInfoSchema.describe('Dropoff details.'),
    dropoff_deadline: z.string().describe('When a delivery must be dropped off. This is the end of the dropoff window.'),
    dropoff_eta: z.string().describe('Estimated drop-off time.'),
    dropoff_identifier: z.string().optional().describe('This field identifies who received delivery at the dropoff location.'),
    dropoff_ready: z.string().describe('When a delivery is ready to be dropped off. This is the start of the dropoff window.'),
    external_id: z.string().describe('An ID for an account as stored in an external system.'),
    fee: z.number().describe('Amount in cents that will be charged if this delivery is created.'),
    id: z.string().describe('Unique identifier for the delivery ( `del_` + tokenize(uuid)).'),
    kind: z.string().describe('The type of object being described. Always “delivery”.'),
    live_mode: z.boolean().describe('Flag that indicates if this is live mode or test mode.'),
    manifest: manifestInfoSchema.describe('A detailed description of what the courier will be delivering.'),
    manifest_items: z.array(manifestItemSchema).describe('List of items being delivered.'),
    pickup: waypointInfoSchema.describe('The pickup details for the delivery.'),
    pickup_deadline: z.string().describe('When a delivery must be picked up by. This is the end of the pickup window.'),
    pickup_eta: z.string().describe('Estimated time the courier will arrive at the pickup location.'),
    pickup_ready: z.string().describe('When a delivery is ready to be picked up. This is the start of the pickup window.'),
    quote_id: z.string().describe('ID for the Delivery Quote if one was provided when creating this Delivery.'),
    refund: z.array(refundDataSchema).optional().describe('This is an array of the refund information.'),
    related_deliveries: z.array(relatedDeliverySchema).optional().nullable().describe('A collection describing other jobs that share an association. i.e.: a return delivery.'),
    status: deliveryStatusSchema.describe('The current status of the delivery. Always pending when the delivery is created.'),
    tip: z.number().optional().describe('Amount in cents that will be paid to the courier as a tip.'),
    tracking_url: z.string().describe('This url can be used to track the courier during the delivery (unauthenticated page).'),
    undeliverable_action: z.enum(['left_at_door', 'returned', '']).describe('If a delivery was undeliverable, this field will contain the resulting action taken by the courier.'),
    undeliverable_reason: z.string().describe('If a delivery was undeliverable, this field will contain the reason why it was undeliverable.'),
    updated: z.string().describe('Date/Time at which the delivery was last updated.'),
    uuid: z.string().describe('Alternative delivery identifier. “Id” field should be used for any identification purposes. “uuid” field is equally unique but loses contextual information (i.e. nothing in this identifier points out that it relates to a delivery). “uuid” is case-sensitive. Value for the “uuid” field is UUID v4 with ‘-’ characters removed.'),
    return: waypointInfoSchema.optional().describe('The return details for the delivery.'),
})

export type DeliveryResponse = z.infer<typeof deliveryResponseSchema>

export const deliveryListResponseSchema = z.object({
    data: z.array(deliveryResponseSchema),
    next_href: z.string().describe('URL to fetch the next set of deliveries'),
    object: z.string().describe('Response type, always "list"'),
    total_count: z.number().describe('@deprecated Response is always -1'),
    url: z.string().describe('URL for the request'),
})

export type DeliveryListResponse = z.infer<typeof deliveryListResponseSchema>
