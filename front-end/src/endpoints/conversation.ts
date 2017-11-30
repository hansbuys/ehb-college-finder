import logger from "../logging";
import * as redis from "redis";

export class Conversation {
    private client: redis.RedisClient;

    constructor() {
        this.createRedisClient();
    }

    public store(response: any) {
        if (response.context) {
            const conversationId = response.context.conversation_id;

            if (conversationId) {
                this.storeConversation(conversationId, response);
            } else {
                logger.error("Response has no conversation ID.");
            }
        } else {
            logger.error("Response has no context.");
        }
    }

    private storeConversation(conversationId: string, response: any) {
        if (response.intents && response.intents[0]) {
            const intent = response.intents[0];
            this.storeKeyValue(`${conversationId}.intent`, intent.intent);
        }
        if (response.context.state) {
            const state = response.context.state;
            this.storeKeyValue(`${conversationId}.state`, state);
        }
    }

    private storeKeyValue(key: string, value: string) {
        logger.debug(`Storing '${key}':'${value}'`);
        if (this.client.set(key, value)) {
            logger.debug(`Stored '${key}':'${value}'`);
        }
    }

    private createRedisClient() {
        const port = process.env.REDIS_PORT || 6379;
        const host = process.env.REDIS_HOST || "localhost";
        this.client = redis.createClient(
            +port,
            host
        );

        this.client.on("error", (err) => {
            logger.error(`An error occurred in the redis client: ${err}`);
            throw new Error(err);
        });
    }
}
