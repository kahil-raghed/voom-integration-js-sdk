import axios, { AxiosInstance } from "axios";
import crypto from "crypto";

export class Client {
  // ===== Constants =====
  static readonly DEFAULT_BASE_URL = "https://crm-integration.voomproject.com";

  static readonly API_HELLO = "/api/client-api/v1/hello";
  static readonly API_BULK_PUSH = "/api/client-api/v1/inventory/bulk-push";
  static readonly API_GET_UNITS = "/api/client-api/v1/inventory/get-units";

  // ===== Properties =====
  private baseUrl: string = Client.DEFAULT_BASE_URL;
  private clientId: string;
  private clientSecret: string;
  private http: AxiosInstance;

  // ===== Constructor =====
  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;

    this.http = axios.create({
      headers: {
        "Content-Type": "application/json",
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

  // ===== Signature Generation =====
  private generateApiSignature(
    clientId: string,
    requestId: string,
    requestTime: string,
    clientSecret: string
  ): string {
    const stringToSign = clientId + requestId + requestTime;

    const signature = crypto
      .createHmac("sha256", clientSecret)
      .update(stringToSign)
      .digest("base64");

    return signature;
  }

  // ===== Core API Caller =====
  private async callApi<T = any>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    data?: any
  ): Promise<T> {
    const requestId = crypto.randomUUID();
    const requestTime = new Date().toISOString();

    const signature = this.generateApiSignature(
      this.clientId,
      requestId,
      requestTime,
      this.clientSecret
    );

    const response = await this.http.request<T>({
      method,
      url: this.baseUrl + path,
      data,
      headers: {
        "X-Client-Id": this.clientId,
        "X-Request-Id": requestId,
        "X-Request-Time": requestTime,
        "X-Request-Signature": signature,
      },
    });

    return response.data;
  }

  // ===== Public API Methods =====

  /**
   * Push units in bulk
   */
  bulkPush(units: any[]): Promise<any> {
    return this.callApi("POST", Client.API_BULK_PUSH, {
      units,
    });
  }

  /**
   * Test API connection
   */
  hello(): Promise<any> {
    return this.callApi("POST", Client.API_HELLO);
  }

  /**
   * Get units
   */
  getUnits(): Promise<any> {
    return this.callApi("POST", Client.API_GET_UNITS);
  }
}
