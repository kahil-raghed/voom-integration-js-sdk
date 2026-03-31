import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';

export class Client {
  // ===== Constants =====
    static readonly DEFAULT_BASE_URL = 'https://crm-integration.voomproject.com';

    static readonly API_HELLO = '/api/client-api/v1/hello';
    static readonly API_BULK_PUSH = '/api/client-api/v1/inventory/bulk-push';
    static readonly API_GET_UNITS = '/api/client-api/v1/inventory/get-units';

  // ===== Properties =====
  private baseUrl: string = Client.DEFAULT_BASE_URL;
  private clientId: string;
  private clientSecret: string;
  private http: AxiosInstance;
    private basicAuth?: { username: string; password: string };
    private isBasicAuthEnabled: boolean = false;

  // ===== Constructor =====
    constructor(
        clientId: string,
        clientSecret: string,
        basicAuth?: { username: string; password: string }
    ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
        this.basicAuth = basicAuth;

    this.http = axios.create({
      headers: {
                'Content-Type': 'application/json',
      },
    });
  }

  // ===== Base URL =====
  getBaseUrl(): string {
    return this.baseUrl;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

    // ===== Auth Configuration =====
    useBasicAuth(enable: boolean = true): void {
        if (enable && !this.basicAuth) {
            throw new Error('Basic Auth credentials must be provided in the constructor to enable it.');
        }
        this.isBasicAuthEnabled = enable;
    }

  // ===== Signature Generation =====
  private generateApiSignature(
    clientId: string,
    requestId: string,
    requestTime: string,
    clientSecret: string
  ): string {
    const stringToSign = clientId + requestId + requestTime;

    const signature = crypto
            .createHmac('sha256', clientSecret)
      .update(stringToSign)
            .digest('base64');

    return signature;
  }

  // ===== Core API Caller =====
  private async callApi<T = any>(
        method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: any
  ): Promise<T> {
        const headers: Record<string, string> = {};

        if (!this.isBasicAuthEnabled) {
    const requestId = crypto.randomUUID();
    const requestTime = new Date().toISOString();

    const signature = this.generateApiSignature(
      this.clientId,
      requestId,
      requestTime,
      this.clientSecret
    );

            headers['X-Client-Id'] = this.clientId;
            headers['X-Request-Id'] = requestId;
            headers['X-Request-Time'] = requestTime;
            headers['X-Request-Signature'] = signature;
        }

        const requestConfig: any = {
      method,
      url: this.baseUrl + path,
      data,
            headers,
        };

        if (this.isBasicAuthEnabled && this.basicAuth) {
            requestConfig.auth = this.basicAuth;
        }

        const response = await this.http.request<T>(requestConfig);

    return response.data;
  }

  // ===== Public API Methods =====

  /**
   * Push units in bulk
   */
  bulkPush(units: any[]): Promise<any> {
        return this.callApi('POST', Client.API_BULK_PUSH, {
      units,
    });
  }

  /**
   * Test API connection
   */
  hello(): Promise<any> {
        return this.callApi('POST', Client.API_HELLO);
  }

  /**
   * Get units
   */
  getUnits(): Promise<any> {
        return this.callApi('POST', Client.API_GET_UNITS);
  }
}
