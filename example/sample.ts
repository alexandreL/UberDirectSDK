import {
    CourierUpdateWebookEvent,
    DeliveryStatusWebhookEvent,
    RefundRequestWebhookEvent,
    UberDirectAuth,
    UberDirectDaaS,
    UberDirectWebhook,
} from '../src'

async function run(): Promise<DeliveryStatusWebhookEvent | CourierUpdateWebookEvent | RefundRequestWebhookEvent> {
    const auth = new UberDirectAuth({
        clientId: 'CLIENT_ID',
        clientSecret: 'CLIENT_SECRET',
        customerId: 'CUSTOMER_ID',
    })

    // directly throw if error occurs in response type
    auth.setEnableThrow(true)

    const daaS = new UberDirectDaaS(auth)
    daaS.setThrowCallback((error) => {
        // send to broker of monitoring system or message queue
        console.error(`error in type protection: ${error.message}`)
        console.error(error)
    })

    // quote is executed without error but if tue type is wrong, it will only send a warning to the callback
    const quote = await daaS.quote({
        dropoff_address: '55 Rue du Faubourg Saint-Honoré, 75008 Paris',
        pickup_address: '55 Rue du Faubourg Saint-Honoré, 75008 Paris',
        pickup_ready_dt: new Date().toISOString(),
    })

    console.log(quote)
    const uberDirectWebhook = new UberDirectWebhook('SECRET')
    uberDirectWebhook.setThrowCallback((error) => {
        // send to broker of monitoring system or message queue
        console.error(`error in type protection: ${error.message}`)
        console.error(error)
    })

    const fakeBody = {
        event: 'fake_event',
    }
    const fakeHeaders = {
        'x-uber-signature': 'fake_signature',
    }

    // webhook is executed without error but if the type is wrong, it will only send a warning to the callback
    return uberDirectWebhook.verifyAndHandleWebhook(fakeBody, fakeHeaders)
}

run()
    .then(() => console.log('done'))
    .catch((error) => console.error(error))
