# Uber Direct SDK README.md

The Uber Direct SDK allows you to integrate your own apps and services with Uber Direct order delivery. This SDK is built using TypeScript, which provides better type checking and helps you avoid runtime errors.

## Installation

```
npm install uber-direct-sdk
```

## Usage

### Authentication

```typescript
import { UberDirectAuth } from 'uber-direct-sdk';

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

const fakeBody = {
  event: 'fake_event',
};

const fakeHeaders = {
  'x-uber-signature': 'fake_signature',
};

const result = uberDirectWebhook.handleWebhook(fakeBody, fakeHeaders);
```

## Error Handling

The SDK provides type checking for the request and response objects. If a parameter or property is missing or has the wrong data type, the SDK will throw an error. You can also use the `setThrowCallback` method to handle errors that occur during the type checking.

```typescript
daaS.setThrowCallback((error) => {
  // Send the error to a monitoring system or message queue
  console.error(`error in type protection: ${error.message}`);
  console.error(error);
});

uberDirectWebhook.setThrowCallback((error) => {
  // Send the error to a monitoring system or message queue
  console.error(`error in type protection: ${error.message}`);
  console.error(error);
});
```

## Rate Limiting

Our API returns a 429 customer_limited error when you have submitted too many requests in too short of a timeframe. If you are getting rate-limited for intentional usage scenarios, please contact your Account Manager.
