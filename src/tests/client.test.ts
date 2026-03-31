import axios from 'axios';
import { Client } from '../client';
import { UnitFactory, Unit } from '../units';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Client', () => {
    let client: Client;
    let basicAuth: { username: string; password: string };
    beforeEach(() => {
        basicAuth = { username: 'test-user', password: 'test-password' };
        client = new Client('test-id', 'test-secret', basicAuth);
        mockedAxios.request = jest.fn();
        client['http'] = mockedAxios as any;
    });

    it('should be initialized with the correct base URL', () => {
        expect(client.getBaseUrl()).toBe(Client.DEFAULT_BASE_URL);
    });

    it('should change the base URL when setBaseUrl is called', () => {
        const newUrl = 'https://new-api.example.com';
        client.setBaseUrl(newUrl);
        expect(client.getBaseUrl()).toBe(newUrl);
    });

    it('should generate signature and make bulk-push request', async () => {
        const mockData = { success: true };

        (mockedAxios.request as jest.Mock).mockResolvedValueOnce({
            data: mockData,
        });

        const testUnit: Unit = UnitFactory.make(
            'unit-123',
            'tenant-1',
            'project-1',
            'Sample Unit',
            'apartment',
            'A-101',
            'available',
            120.5,
            3,
            250000
        );
        const testUnits = [testUnit];
        const result = await client.bulkPush(testUnits);

        expect(result).toEqual(mockData);
        expect(mockedAxios.request).toHaveBeenCalledWith(
            expect.objectContaining({
                method: 'POST',
                url: expect.stringContaining(Client.API_BULK_PUSH),
                data: { units: testUnits },
                headers: expect.objectContaining({
                    'X-Client-Id': 'test-id',
                    'X-Request-Id': expect.any(String),
                    'X-Request-Time': expect.any(String),
                    'X-Request-Signature': expect.any(String),
                }),
            })
        );
    });

    it('should use basic auth when enabled and omit HMAC headers', async () => {
        const mockData = { success: true };
        (mockedAxios.request as jest.Mock).mockResolvedValueOnce({
            data: mockData,
        });

        client.useBasicAuth(true);

        const result = await client.hello();

        expect(result).toEqual(mockData);
        expect(mockedAxios.request).toHaveBeenCalledWith(
            expect.objectContaining({
                auth: expect.objectContaining({
                    username: 'test-user',
                    password: 'test-password'
                }),
                headers: {}
            })
        );
    });
});

