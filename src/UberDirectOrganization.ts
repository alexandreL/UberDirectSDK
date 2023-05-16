import { UberDirectAuth } from './UberDirectAuth'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'
import { UberDirectLogger } from './UberDirectLogger'
import {
    CreateDirectOrgResponse,
    DirectOrganizationDetailsResponse,
    InviteNewUserRequestBody,
    ResponseInviteNewUser
} from './types/OrganizationTypes'

/**
 * UberDirect Direct DaaS API Client
 * Delivery as a Service (DaaS) is a service that allows you to create deliveries between two addresses.
 */
export class UberDirectOrganization extends UberDirectTypeProtectErrorHandling {
    constructor(private readonly auth: UberDirectAuth, private readonly logger = new UberDirectLogger(), private readonly testMode = false) {
        super()
    }

    getOrganizationDetails(organizationId: string) {
        const url = `direct/organizations/${ organizationId }`
        return this.auth.makeApiRequest<DirectOrganizationDetailsResponse>('get', url, {}, this.logger)
    }

    createOrganization(organization: CreateDirectOrgResponse) {
        const url = 'direct/organizations'
        return this.auth.makeApiRequest<DirectOrganizationDetailsResponse>('post', url, organization, this.logger)
    }

    inviteNewUser(newUser: InviteNewUserRequestBody, organizationId: string) {
        const url = `direct/organizations/${ organizationId }/memberships/invite`
        return this.auth.makeApiRequest<ResponseInviteNewUser>('post', url, newUser, this.logger)
    }
}
