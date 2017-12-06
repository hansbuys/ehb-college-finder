import * as Logger from "bunyan";
import { Parser, WatsonParser } from "./parser";
import { ConversationRepository } from "./repository/conversation";
import { Handlers } from "./intent/handlers";
import { Agent, WatsonAgent } from "./agent";
import { DictionaryOfStrings } from "./customTypes";

export class Conversation {

    private log: Logger;

    constructor(log: Logger) {
        log.trace("Creating new Conversation instance");

        this.log = log;
    }

    public async reply(body: any): Promise<any> {
        const response = await this.getAgent().sendMessage(body);

        const parser = this.getParser(response);
        await this.storeConversation(parser);

        const reply = await this.generateReply(parser);

        if (reply) {
            parser.appendToOutput(reply);
        }

        return parser.getResponse();
    }

    private getRepository(): ConversationRepository {
        return new ConversationRepository(this.log);
    }

    private getHandlers(): Handlers {
        return new Handlers(this.log);
    }

    private getAgent(): Agent {
        return new WatsonAgent(this.log);
    }

    private getParser(response: any): Parser {
        return new WatsonParser(response);
    }

    private async storeConversation(parser: Parser): Promise<void> {
        const conversationId = parser.getConversationId();
        this.log = this.log.child({ conversationId });

        if (!conversationId) {
            throw new Error("Response has no conversation ID.");
        }

        const intent = parser.getIntent();
        if (intent) {
            await this.getRepository().store(`${conversationId}.intent`, intent);
        }

        const parameters = parser.getParameters();
        if (parameters) {
            await this.getRepository().store(`${conversationId}.parameters`, JSON.stringify(parameters));
        }
    }

    private async generateReply(parser: Parser): Promise<string | false> {
        if (parser.isConversationComplete()) {
            this.log.info("Conversation is complete, checking to see if a reply needs to be generated.");
            const conversationId = parser.getConversationId();

            const getLastIntent = this.getRepository().retrieve(`${conversationId}.intent`);
            const parametersAsString = await this.getRepository().retrieve(`${conversationId}.parameters`);

            if (parametersAsString && parametersAsString !== "{}") {
                const parameters = JSON.parse(parametersAsString) as DictionaryOfStrings;

                if (!parameters) {
                    throw new Error(`Unable to parse parameters from JSON: ${parametersAsString}`);
                }

                return this.getHandlers().handleWithParameters(await getLastIntent, parameters);
            } else {
                return this.getHandlers().handle(await getLastIntent);
            }
        }

        return false;
    }
}
