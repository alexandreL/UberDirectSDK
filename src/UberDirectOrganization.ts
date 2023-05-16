import { UberDirectAuth } from './UberDirectAuth'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'
import { UberDirectLogger } from './UberDirectLogger'
import {
    CreateDirectOrgRequest,
    createDirectOrgRequestSchema,
    CreateDirectOrgResponse, createDirectOrgResponseSchema,
    DirectOrganizationDetailsResponse,
    directOrganizationDetailsResponseSchema,
    InviteNewUserRequestBody,
    ResponseInviteNewUser,
    responseInviteNewUserSchema
} from './types/OrganizationTypes'
import { ZodError } from 'zod'

/**
 * UberDirect Direct DaaS API Client
 * Delivery as a Service (DaaS) is a service that allows you to create deliveries between two addresses.
 */
export class UberDirectOrganization extends UberDirectTypeProtectErrorHandling {
    constructor(private readonly auth: UberDirectAuth, private readonly logger = new UberDirectLogger()) {
        super()
    }

    async getOrganizationDetails(organizationId: string): Promise<DirectOrganizationDetailsResponse> {
        const url = `direct/organizations/${ organizationId }`
        const response = await this.auth.makeApiRequest<DirectOrganizationDetailsResponse>('get', url, {}, this.logger)
        try {
            directOrganizationDetailsResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }

    async createOrganization(organization: CreateDirectOrgRequest): Promise<CreateDirectOrgResponse> {
        const url = 'direct/organizations'
        const response = await this.auth.makeApiRequest<CreateDirectOrgResponse>('post', url, organization, this.logger)
        try {
            createDirectOrgResponseSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }

    async inviteNewUser(newUser: InviteNewUserRequestBody, organizationId: string): Promise<ResponseInviteNewUser> {
        const url = `direct/organizations/${ organizationId }/memberships/invite`
        const response = await this.auth.makeApiRequest<ResponseInviteNewUser>('post', url, newUser, this.logger)
        try {
            responseInviteNewUserSchema.parse(response)
        } catch (e) {
            this.throw(e as ZodError)
        }
        return response
    }
}
