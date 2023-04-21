import axios, { AxiosError, AxiosInstance } from 'axios'
import { AuthCredentials, Method } from './AuthTypes'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'

/*
 * UberDirectAuth
 * @class
 * @classdesc UberDirectAuth is a class to handle authentication with Uber Direct API and used by all Services of the uber-direct-sdk
 * @param {AuthCredentials} credentials
 * @param {string} credentials.clientId
 * @param {string} credentials.clientSecret
 * @param {string} credentials.customerId
 */
export class UberDirectAuth extends UberDirectTypeProtectErrorHandling {
    httpClient: AxiosInstance
    private _clientId: string
    private _clientSecret: string
    private _customerId: string
    private _accessToken?: string
    private _tokenExpirationTime?: number

    constructor(credentials: AuthCredentials) {
        super()
        this._clientId = credentials.clientId
        this._clientSecret = credentials.clientSecret
        this._customerId = credentials.customerId
        this.httpClient = axios.create({
            baseURL: 'https://api.uber.com/v1/',
            headers: {
                Authorization: `Bearer ${this._accessToken}`,
                'Content-Type': 'application/json',
            },
        })
    }

    /**
     * get customer id
     */
    getCustomerId(): string {
        return this._customerId
    }

    /**
     * make api request
     * @param method
     * @param endpoint
     * @param data
     * @param retryCount
     */
    async makeApiRequest<ResponseType>(
        method: Method,
        endpoint: string,
        data?: Record<string, unknown>,
        retryCount = 0
    ): Promise<ResponseType> {
        const accessToken = await this.getAccessToken()

        try {
            const response = await this.httpClient.request({
                method,
                url: endpoint,
                data,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data
        } catch (e) {
            const error = e as AxiosError
            //  if error is 504 retry request in 5seconds
            if (error.response?.status === 504) {
                if (retryCount > 3) throw error
                await new Promise(resolve => setTimeout(resolve, 5000))
                return this.makeApiRequest<ResponseType>(method, endpoint, data, retryCount + 1)
            }
            throw error
        }
    }

    /**
     * authenticate and get access token
     * @private
     */
    private async getAccessToken(): Promise<string> {
        if (
            !this._accessToken ||
            (this._tokenExpirationTime && Date.now() >= this._tokenExpirationTime)
        ) {
            const response = await axios.post(
                'https://login.uber.com/oauth/v2/token',
                {
                    grant_type: 'refresh_token',
                    client_id: this._clientId,
                    client_secret: this._clientSecret,
                }
            )

            this._accessToken = response.data.access_token
            this._tokenExpirationTime =
                Date.now() + response.data.expires_in * 1000 - 300000
        }

        if (!this._accessToken)
            throw new Error('Unable to get access token')

        return this._accessToken
    }
}
