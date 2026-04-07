import { Client } from '../client';

describe('E2E Tests for SDK Client', () => {
    const clientId = 'test client';
    const clientSecret = 'test secret';
    let client: Client;

    // Set timeout to 30s as these are E2E network calls
    jest.setTimeout(30000);

    beforeAll(() => {
        client = new Client(clientId, clientSecret);
    });

    it('should successfully test hello() endpoint', async () => {
        const helloResponse = await client.hello();
        expect(helloResponse).toBeDefined();
        // Hello response usually echoes something or acknowledges
        console.log("Hello Response:", JSON.stringify(helloResponse, null, 2));
    });

    it('should successfully retrieve getUnits()', async () => {
        const unitsResponse = await client.getUnits();
        expect(unitsResponse).toBeDefined();
        console.log("Units Response:", JSON.stringify(unitsResponse, null, 2));
    });

    it('should successfully execute bulkPush()', async () => {
        const testUnits = [
            {
                unit_id: `test-unit-${Date.now()}`,
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
        expect(bulkPushResponse).toBeDefined();
        console.log("Bulk Push Response:", JSON.stringify(bulkPushResponse, null, 2));
    });
});
