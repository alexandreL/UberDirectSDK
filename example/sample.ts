import { UberDirectAuth, UberDirectDaaS, UberDirectWebhook } from '../src'

async function run() {
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
        console.error(`error in type protection: ${ error.message }`)
        console.error(error)
    })

    // quote is executed without error but if tue type is wrong, it will only send a warning to the callback
    const quote = await daaS.quote({
        customer_id: 'CUSTOMER_ID',
        dropoff_address: 'dropoff_address',
        pickup_address: 'pickup_address',
        dropoff_latitude: 0,
        dropoff_longitude: 0,
        dropoff_phone_number: 'dropoff_phone_number',
        pickup_latitude: 0,
        pickup_longitude: 0,
        pickup_phone_number: 'pickup_phone_number',
        pickup_ready_dt: 'pickup_ready_dt',
        pickup_deadline_dt: 'pickup_deadline_dt',
        dropoff_ready_dt: 'dropoff_ready_dt',
        dropoff_deadline_dt: 'dropoff_deadline_dt',
        manifest_total_value: 0,
        external_store_id: 'external_store_id',
    })

    const uberDirectWebhook = new UberDirectWebhook('SECRET')
    uberDirectWebhook.setThrowCallback((error) => {
        // send to broker of monitoring system or message queue
        console.error(`error in type protection: ${ error.message }`)
        console.error(error)
    })

    const fakeBody = {
        event: 'fake_event',
    }
    const fakeHeaders = {
        'x-uber-signature': 'fake_signature',
    }

    // webhook is executed without error but if tue type is wrong, it will only send a warning to the callback
    const result = uberDirectWebhook.handleWebhook(fakeBody, fakeHeaders)

}

run()
    .then(() => console.log('done'))
    .catch((error) => console.error(error))
