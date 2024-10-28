import { z } from 'zod'

const merchantTypeSchema = z.union([
    z.literal('MERCHANT_TYPE_RESTAURANT'),
    z.literal('MERCHANT_TYPE_GROCERY'),
    z.literal('MERCHANT_TYPE_LIQUOR'),
    z.literal('MERCHANT_TYPE_RETAIL'),
    z.literal('MERCHANT_TYPE_ESSENTIALS'),
    z.literal('MERCHANT_TYPE_PHARMACY'),
    z.literal('MERCHANT_TYPE_SPECIALTY_FOOD'),
    z.literal('MERCHANT_TYPE_FLOWER'),
    z.literal('MERCHANT_TYPE_PET_SUPPLY'),
])

export type MerchantType = z.infer<typeof merchantTypeSchema>

const billingTypeSchema = z.union([
    z.literal('BILLING_TYPE_CENTRALIZED'),
    z.literal('BILLING_TYPE_DECENTRALIZED'),
])

const addressSchema = z.object({
    street1: z.string().optional(),
    street2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipcode: z.string().optional(),
    country_iso2: z.string().optional(),
})

const phoneDetailsSchema = z.object({
    phone_number: z.string().optional(),
    country_code: z.string(),
    subscriber_number: z.string(),
})

const pointOfContactSchema = z.object({
    email: z.string(),
    phone_details: phoneDetailsSchema.optional(),
})

const organizationInfoSchema = z.object({
    name: z.string(),
    merchant_type: merchantTypeSchema,
    point_of_contact: pointOfContactSchema,
    billing_type: billingTypeSchema,
    address: addressSchema,
})

const hierarchyInfoSchema = z.object({
    parent_organization_id: z.string(),
})

export const directOrganizationDetailsResponseSchema = z.object({
    organization_id: z.string(),
    info: organizationInfoSchema,
    hierarchy_info: hierarchyInfoSchema.optional(),
})

export type DirectOrganizationDetailsResponse = z.infer<typeof directOrganizationDetailsResponseSchema>

export const createDirectOrgRequestSchema = z.object({
    info: organizationInfoSchema,
    hierarchy_info: hierarchyInfoSchema,
})

export type CreateDirectOrgRequest = z.infer<typeof createDirectOrgRequestSchema>

export const createDirectOrgResponseSchema = z.object({
    organization_id: z.string(),
    info: organizationInfoSchema,
    hierarchy_info: hierarchyInfoSchema,
})

export type CreateDirectOrgResponse = z.infer<typeof createDirectOrgResponseSchema>

const roleSchema = z.union([
    z.literal('ROLE_ADMIN'),
    z.literal('ROLE_EMPLOYEE'),
])

const userDetailsSchema = z.object({
    email: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    phone_details: phoneDetailsSchema.optional(),
})

export const inviteNewUserRequestBodySchema = z.object({
    user_details: userDetailsSchema,
    roles: z.array(roleSchema),
})

export type InviteNewUserRequestBody = z.infer<typeof inviteNewUserRequestBodySchema>

export const responseInviteNewUserSchema = z.object({
    membership_id: z.string(),
    organization_id: z.string(),
    user_details: userDetailsSchema,
    roles: z.array(roleSchema),
})

export type ResponseInviteNewUser = z.infer<typeof responseInviteNewUserSchema>
