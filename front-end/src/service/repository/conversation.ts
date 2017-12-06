import * as Logger from "bunyan";
import * as redis from "redis";
import { promisify } from "util";
import * as bluebird from "bluebird";

declare module "redis" {
    export interface RedisClient {
        getAsync(...args: any[]): Promise<string>;
        setAsync(...args: any[]): Promise<boolean>;
    }
}

export class ConversationRepository {
    private client: redis.RedisClient;

    private log: Logger;

    constructor(log: Logger) {
        this.log = log;
        this.createRedisClient();
    }

    public retrieve(key: string): Promise<string> {
        this.log.debug(`Retrieving value for key '${key}'`);
        return this.client.getAsync(key);
    }

    public async store(key: string, value: string): Promise<void> {
        this.log.trace(`Storing key '${key}'`);
        if (await this.client.setAsync(key, value)) {
            this.log.debug(`Stored key '${key}'`);
        }
    }

    private createRedisClient() {
        this.log.trace(`Creating Redis client.`);

        const port = process.env.REDIS_PORT || 6379;
        const host = process.env.REDIS_HOST || "localhost";

        this.client = redis.createClient(
            +port,
            host
        );

        bluebird.promisifyAll(this.client);

        this.client.on("error", (err) => {
            this.log.error(`An error occurred in the redis client: ${err}`);
            throw new Error(err);
        });
    }
}
