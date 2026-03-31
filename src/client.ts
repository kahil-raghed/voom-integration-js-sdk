import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { Unit } from './units';

/**
 * Voom CRM Integration Client.
 * Handles authentication and communication with the Voom CRM integration API.
 */

interface ApiRequestConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    data?: any;
    headers: Record<string, string>;
    auth?: { username: string; password: string };
}

export class Client {
  // ===== Constants =====
    /** Default base URL for the Voom CRM Integration API */
    static readonly DEFAULT_BASE_URL = 'https://crm-integration.voomproject.com';

    /** Endpoint for connectivity testing */
    static readonly API_HELLO = '/api/client-api/v1/hello';
    /** Endpoint for bulk inventory synchronization */
    static readonly API_BULK_PUSH = '/api/client-api/v1/inventory/bulk-push';
    /** Endpoint for retrieving stored units */
    static readonly API_GET_UNITS = '/api/client-api/v1/inventory/get-units';


  // ===== Properties =====
  private baseUrl: string = Client.DEFAULT_BASE_URL;
  private clientId: string;
  private clientSecret: string;
  private http: AxiosInstance;
    private basicAuth?: { username: string; password: string };
    private isBasicAuthEnabled: boolean = false;

  // ===== Constructor =====
    /**
     * Creates a new instance of the Voom Integration Client.
     * 
     * @param clientId - The integration client ID.
     * @param clientSecret - The integration client secret.
     * @param basicAuth - Optional credentials for Basic Authentication.
     */
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
  /**
   * Retrieves the current base URL used for API requests.
   * @returns {string} The current base URL.
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Sets a custom base URL for the API requests.
   * @param baseUrl - The new base URL to use.
   */
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

    // ===== Auth Configuration =====
    /**
     * Enables or disables Basic Authentication.
     * If enabled, standard signature-based headers will not be sent.
     * 
     * @param enable - Whether to use Basic Auth.
     * @throws {Error} If Basic Auth credentials were not provided in the constructor.
     */
    useBasicAuth(enable: boolean = true): void {
        if (enable && !this.basicAuth) {
            throw new Error('Basic Auth credentials must be provided in the constructor to enable it.');
        }
        this.isBasicAuthEnabled = enable;
    }

  // ===== Signature Generation =====
  /**
   * Generates a secure HMAC-SHA256 signature for request authentication.
   * 
   * @private
   */
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
  /**
   * Internal method to perform HTTP requests with automatic authentication.
   * 
   * @private
   */
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


    const requestConfig: ApiRequestConfig = {
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
   * Pushes units to the Voom CRM in bulk.
   * 
   * @param units - An array of unit data to synchronize.
   * @returns {Promise<any>} The API response.
   */
  bulkPush(units: Unit[]): Promise<any> {
        return this.callApi('POST', Client.API_BULK_PUSH, {
      units,
    });
  }

  /**
   * Tests the connection to the Voom CRM Integration API.
   * 
   * @returns {Promise<any>} The API response from the hello endpoint.
   */
  hello(): Promise<any> {
        return this.callApi('POST', Client.API_HELLO);
  }

  /**
   * Retrieves a list of units from the Voom CRM Integration.
   * 
   * @returns {Promise<any>} The API response containing unit data.
   */
  getUnits(): Promise<any> {
        return this.callApi('POST', Client.API_GET_UNITS);
  }
}
