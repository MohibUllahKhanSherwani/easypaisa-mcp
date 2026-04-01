import { createHmac } from "node:crypto";

const BASE_URL = "https://easypay.easypaisa.com.pk/easypay-service/rest/v4";
const TIMEOUT = 15_000;

export class EasypaisaClient {
  private storeId: string;
  private hashKey: string;

  constructor() {
    this.storeId = process.env.EASYPAISA_STORE_ID ?? "";
    this.hashKey = process.env.EASYPAISA_HASH_KEY ?? "";
    if (!this.storeId || !this.hashKey) {
      throw new Error(
        "Environment variables EASYPAISA_STORE_ID and EASYPAISA_HASH_KEY are required. " +
        "Get credentials from Easypaisa merchant portal."
      );
    }
  }

  generateHash(data: string): string {
    return createHmac("sha256", this.hashKey).update(data).digest("hex");
  }

  async request(method: string, path: string, body?: unknown): Promise<unknown> {
    const url = `${BASE_URL}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Credentials": Buffer.from(`${this.storeId}:${this.hashKey}`).toString("base64"),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Easypaisa HTTP ${response.status}: ${text}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        return response.json();
      }
      return { status: response.status, message: await response.text() };
    } catch (error) {
      clearTimeout(timer);
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error("Easypaisa: request timeout (15s). Try again later.");
      }
      throw error;
    }
  }

  async post(path: string, body: unknown): Promise<unknown> {
    return this.request("POST", path, body);
  }

  async get(path: string): Promise<unknown> {
    return this.request("GET", path);
  }

  getStoreId(): string {
    return this.storeId;
  }
}
