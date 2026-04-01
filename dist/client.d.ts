export declare class EasypaisaClient {
    private storeId;
    private hashKey;
    constructor();
    generateHash(data: string): string;
    request(method: string, path: string, body?: unknown): Promise<unknown>;
    post(path: string, body: unknown): Promise<unknown>;
    get(path: string): Promise<unknown>;
    getStoreId(): string;
}
