export interface Agent {
    sendMessage(body: any): Promise<{}>;
}
