# Voom Integration JS SDK

[![Version](https://img.shields.io/npm/v/@eyes360/voom-integration-js-sdk.svg)](https://www.npmjs.com/package/@eyes360/voom-integration-js-sdk)
[![License](https://img.shields.io/npm/l/@eyes360/voom-integration-js-sdk.svg)](LICENSE)

A powerful, easy-to-use JavaScript/TypeScript SDK for integrating with the Voom CRM Integration API. Seamlessly manage inventory and unit data synchronization between your systems and Voom CRM.

---

## 🚀 Key Features

- **Robust Authentication**: Supports both Signature-based (HMAC-SHA256) and Basic Authentication.
- **Bulk Operations**: Efficiently sync large unit datasets with `bulkPush`.
- **Easy Initialization**: Effortless client configuration with custom base URL support.
- **TypeScript First**: Full type safety for units and client responses.
- **Modern Architecture**: Built on top of `axios` for reliable HTTP communication.

---

## 📦 Installation

Install the SDK using your preferred package manager:

```bash
# npm
npm install @eyes360/voom-integration-js-sdk

# pnpm
pnpm add @eyes360/voom-integration-js-sdk

# yarn
yarn add @eyes360/voom-integration-js-sdk
```

---

## 🛠️ Quick Start

### 1. Initialize the Client

```typescript
import { Client } from '@eyes360/voom-integration-js-sdk';

// Initialize with Client ID and Secret
// By default, the client points to: https://crm-integration.voomproject.com
const client = new Client('YOUR_CLIENT_ID', 'YOUR_CLIENT_SECRET');

// (Optional) Change base URL if needed
// client.setBaseUrl('https://custom-crm.voomproject.com');
```


---

## 🔐 Authentication

The SDK supports two authentication mechanisms. By default, it uses a **Signature-based (HMAC-SHA256)** approach, which is more secure for server-to-server communication.

### Standard Signature Auth (Default)

The client automatically handles request signing using `X-Request-Signature`, `X-Request-Id`, and `X-Request-Time` headers.

```typescript
const client = new Client('CLIENT_ID', 'CLIENT_SECRET');
await client.hello(); // Automatically uses signature-based auth
```

### Basic Authentication

If your integration specifically requires Basic Authentication, you can initialize the client with credentials and enable it explicitly.

```typescript
const client = new Client('CLIENT_ID', 'CLIENT_SECRET', {
    username: 'YOUR_USERNAME',
    password: 'YOUR_PASSWORD'
});

// Enable Basic Auth (This disables signature headers)
client.useBasicAuth(true);

await client.hello(); // Uses Authorization: Basic header
```

---

## 📖 Usage Examples

### Test Connection

Quickly verify your credentials and connection to the Voom API.

```typescript
try {
    const response = await client.hello();
    console.log('API Connection Successful:', response);
} catch (error) {
    console.error('API Connection Failed:', error.message);
}
```

### Sync Units (Bulk Push)

Push units to the CRM in bulk.

```typescript
const units = [{
    unit_id: "UNIT-001",
    tenant_id: "TENANT-A",
    project_id: "PROJ-XYZ",
    name: "Luxury Suite 101",
    type: "Apartment",
    code: "LS101",
    availability: "available",
    area: 120.5,
    bedrooms: 2,
    price: 350000
}];

const result = await client.bulkPush(units);
console.log('Sync Result:', result);
```

### Fetch Existing Units

Retrieve a list of units from the CRM.

```typescript
const units = await client.getUnits();
console.log('Fetched Units:', units);
```

---

## 🧩 API Reference

### `new Client(clientId, clientSecret, basicAuth?)`
- `clientId`: (Required) Your integration client ID.
- `clientSecret`: (Required) Your integration client secret.
- `basicAuth`: (Optional) Object containing `username` and `password`.

### `client.hello()`
- Returns: `Promise<any>`
- Tests the API endpoint connectivity.

### `client.bulkPush(units)`
- `units`: (Required) Array of unit data objects.
- Returns: `Promise<any>`
- Pushes inventory data in bulk to Voom CRM.

### `client.getUnits()`
- Returns: `Promise<any>`
- Fetches units from the integration API.

### `client.useBasicAuth(enable)`
- `enable`: (Boolean) Default `true`. Switches the auth mode.

### `client.setBaseUrl(url)`
- `url`: (String) Update the API target endpoint.
- Default: `https://crm-integration.voomproject.com`


---

## 📜 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

&copy; 2026 Voom Project. All Rights Reserved.