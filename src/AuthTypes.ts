export interface AuthCredentials {
    clientId: string;
    clientSecret: string;
    customerId: string;
}

export interface AuthInstance {
    clientId: string;
    clientSecret: string;
    customerId: string;
    accessToken?: string
    tokenExpirationTime?: number
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
