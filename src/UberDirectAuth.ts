import axios, { AxiosError, AxiosInstance } from 'axios'
import { AuthCredentials, AuthInstance, Method } from './types/AuthTypes'
import { UberDirectTypeProtectErrorHandling } from './UberDirectTypeProtect'
import AxiosErrorToString from './axiosError'
import { UberDirectLogger } from './UberDirectLogger'

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

    private _accessToken?: string

    get accessToken(): string | undefined {
        return this._accessToken
    }

    private _tokenExpirationTime?: number

    get tokenExpirationTime(): number | undefined {
        return this._tokenExpirationTime
    }

    /**
     * reload new instance from saved instance
     * @param savedInstance
     */
    static reloadInstance(savedInstance: AuthInstance): UberDirectAuth {
        const auth = new UberDirectAuth({
            clientId: savedInstance.clientId,
            clientSecret: savedInstance.clientSecret,
            customerId: savedInstance.customerId,
        })
        auth._accessToken = savedInstance.accessToken
        auth._tokenExpirationTime = savedInstance.tokenExpirationTime
        return auth
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
     * @param logger
     * @param retryCount
     */
    async makeApiRequest<ResponseType>(
        method: Method,
        endpoint: string,
        data?: Record<string, unknown>,
        logger?: UberDirectLogger,
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
            if ((e as AxiosError).isAxiosError)
                logger?.error(AxiosErrorToString(e as AxiosError))
            else
                logger?.error('Error while making api request', e)
            const error = e as AxiosError
            //  if error is 504 retry request in 5seconds
            if (error.response?.status === 504) {
                if (retryCount > 3) throw error
                await new Promise(resolve => setTimeout(resolve, 5000))
                return this.makeApiRequest<ResponseType>(method, endpoint, data, logger, retryCount + 1)
            }
            throw new Error(AxiosErrorToString(error))
        }
    }

    /**
     * save current instance
     */
    exportInstance(): AuthInstance {
        return {
            clientId: this._clientId,
            clientSecret: this._clientSecret,
            customerId: this._customerId,
            accessToken: this._accessToken,
            tokenExpirationTime: this._tokenExpirationTime,
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
            const data = new URLSearchParams()
            data.append('grant_type', 'client_credentials')
            data.append('client_id', this._clientId)
            data.append('client_secret', this._clientSecret)
            data.append('scope', 'eats.deliveries')
            try {
                const response = await axios.post(
                    'https://login.uber.com/oauth/v2/token', data,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        }
                    }
                )
                if (response.data.token_type !== 'Bearer')
                    throw new Error('Invalid token type')
                this._accessToken = response.data.access_token
                this._tokenExpirationTime =
                    Date.now() + response.data.expires_in * 1000 - 300000
            } catch (e) {
                const error = e as AxiosError
                throw new Error(AxiosErrorToString(error))
            }
        }

        if (!this._accessToken)
            throw new Error('Unable to get access token')

        return this._accessToken
    }
}
