import logger from "../logging";
import { Parser, WatsonParser } from "./parser";
import { ConversationRepository } from "./conversationRepository";
import { Handlers } from "./intent/handlers";
import { Agent, WatsonAgent } from "./agent";
import { DictionaryOfStrings } from "./customTypes";

export class Conversation {

    private repository: ConversationRepository;
    private handlers: Handlers;
    private agent: Agent;

    constructor() {
        logger.trace("Creating new Conversation instance");

        this.repository = new ConversationRepository();
        this.handlers = new Handlers();
        this.agent = new WatsonAgent();
    }

    public async reply(body: any): Promise<any> {
        const response = await this.agent.sendMessage(body);

        const parser = this.getParser(response);
        await this.storeConversation(parser);

        const reply = await this.generateReply(parser);

        if (reply) {
            parser.appendToOutput(reply);
        }

        return parser.getResponse();
    }

    private getParser(response: any): Parser {
        return new WatsonParser(response);
    }

    private async storeConversation(parser: Parser): Promise<void> {
        const conversationId = parser.getConversationId();

        if (!conversationId) {
            throw new Error("Response has no conversation ID.");
        }

        const intent = parser.getIntent();
        if (intent) {
            await this.repository.store(`${conversationId}.intent`, intent);
        }

        const parameters = parser.getParameters();
        if (parameters) {
            await this.repository.store(`${conversationId}.parameters`, JSON.stringify(parameters));
        }
    }

    private async generateReply(parser: Parser): Promise<string | false> {
        if (parser.isConversationComplete()) {
            logger.debug("Conversation is complete, checking to see if a reply needs to be generated.");
            const conversationId = parser.getConversationId();

            const getLastIntent = this.repository.retrieve(`${conversationId}.intent`);
            const parametersAsString = await this.repository.retrieve(`${conversationId}.parameters`);

            if (parametersAsString && parametersAsString !== "{}") {
                const parameters = JSON.parse(parametersAsString) as DictionaryOfStrings;

                if (!parameters) {
                    throw new Error(`Unable to parse parameters from JSON: ${parametersAsString}`);
                }

                return this.handlers.handleWithParameters(await getLastIntent, parameters);
            } else {
                return this.handlers.handle(await getLastIntent);
            }
        }

        return false;
    }
}
