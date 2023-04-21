# Uber Direct SDK README.md

The Uber Direct SDK allows you to integrate your own apps and services with Uber Direct order delivery.
This SDK is built using TypeScript, which provides better type checking and helps you avoid runtime errors.

## Installation

```
npm install uber-direct-sdk
```

## Usage

### Authentication

```typescript
import {UberDirectAuth} from 'uber-direct-sdk';

const auth = new UberDirectAuth({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    customerId: 'CUSTOMER_ID',
});

const token = await auth.getAccessToken();
```

### DaaS

The DaaS class contains methods for creating, listing, updating, and canceling deliveries.

```typescript
import { UberDirectDaaS } from 'uber-direct-sdk';

const daaS = new UberDirectDaaS(auth);

const quote = await daaS.quote({
 ...
});

const delivery = await daaS.createDelivery(quote.quote_id);

const deliveryList = await daaS.listDeliveries();

const deliveryInfo = await daaS.getDeliveryInfo(delivery.delivery_id);

await daaS.updateDelivery(delivery.delivery_id, {
    current_status: 'pickup',
});

await daaS.cancelDelivery(delivery.delivery_id);
```

### Webhooks

The `UberDirectWebhook` class allows you to handle webhook events from Uber Direct.

```typescript
import { UberDirectWebhook } from 'uber-direct-sdk';

const uberDirectWebhook = new UberDirectWebhook('SECRET');

function controler(req, res) {
    const result = uberDirectWebhook.handleWebhook(req.body, req.headers);
}
```

## JSON Request Verification Error Handling

The SDK uses [zod](https://github.com/colinhacks/zod) for verifying all JSON requests. This helps ensure that the data being sent to the API conforms to the
expected schema and reduces the likelihood of errors occurring due to malformed requests.

You can enable error throwing for each class by setting the `setEnableThrow` property to `true`. This will cause the SDK
to throw an error if it encounters a type error when validating JSON requests.
For example, to enable error throwing for a `UberDirectAuth` class:

```javascript
const auth = new UberDirectAuth({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    customerId: 'CUSTOMER_ID',
});
auth.setEnableThrow(true);
```

### Setting a Callback for Handling Type Errors

You can set a callback function to handle type errors that occur during JSON request validation. This can be useful for
logging or custom error handling.

To set a callback function for a class, use the `setThrowCallback` method and pass in the callback function as an
argument.

For example, to set a callback function for a `UberDirectDaaS` class:

```javascript
const daaS = new UberDirectDaaS(auth);
daaS.setThrowCallback((error) => {
    console.error(`Type error occurred: ${ error.message }`);
    // Perform additional error handling logic here
});
```
