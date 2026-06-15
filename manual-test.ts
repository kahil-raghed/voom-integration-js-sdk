import { Client } from './src/client';

const clientId = 'test client';
const clientSecret = 'test secret';

async function run() {
    console.log(`Initializing Client with ID: ${clientId}`);
    const client = new Client(clientId, clientSecret);
    
    try {
        console.log("\n--- Testing hello() ---");
        const helloResponse = await client.hello();
        console.log("Response:", JSON.stringify(helloResponse, null, 2));

        console.log("\n--- Testing getUnits() ---");
        const unitsResponse = await client.getUnits();
        console.log("Response:", JSON.stringify(unitsResponse, null, 2));

        console.log("\n--- Testing bulkPush() ---");
        const testUnits = [
            {
                unit_id: `test-unit-1`,
                tenant_id: "tenant_123",
                project_id: "project_456",
                name: "Test Apartment",
                type: "Apartment",
                code: "TA-101",
                availability: "available",
                area: 85.5,
                bedrooms: 2,
                price: 150000
            }
        ];
        const bulkPushResponse = await client.bulkPush(testUnits);
        console.log("Response:", JSON.stringify(bulkPushResponse, null, 2));

    } catch (error: any) {
        console.error("\n[!] Request Failed");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

run();
