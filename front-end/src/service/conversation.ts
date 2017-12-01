import logger from "../logging";
import { Parser, WatsonParser } from "./parser";
import { ConversationRepository } from "./conversationRepository";
import { IntentHandlers } from "./intentHandler";
import { Agent, WatsonAgent } from "./agent";
import { DictionaryOfStrings } from "./customTypes";

export class Conversation {

    private repository: ConversationRepository;
    private handlers: IntentHandlers;
    private agent: Agent;

    private parser: Parser;

    constructor() {
        this.repository = new ConversationRepository();
        this.handlers = new IntentHandlers();
        this.agent = new WatsonAgent();
    }

    public async reply(context: any, input: any): Promise<any> {
        const response = await this.agent.sendMessage(context, input);

        this.setParser(response);
        await this.store(response);

        const reply = await this.generateReply(response);

        if (reply) {
            this.parser.appendToOutput(reply);
        }

        return this.parser.getResponse();
    }

    private setParser(response: any) {
        this.parser = new WatsonParser(response);
    }

    private store(response: any): Promise<void> {
        const conversationId = this.parser.getConversationId();

        if (!conversationId) {
            throw new Error("Response has no conversation ID.");
        }

        return this.storeConversation(conversationId, response);
    }

    private async storeConversation(conversationId: string, response: any): Promise<void> {
        const intent = this.parser.getIntent();
        if (intent) {
            await this.repository.store(`${conversationId}.intent`, intent);
        }

        const parameters = this.parser.getParameters();
        if (parameters) {
            await this.repository.store(`${conversationId}.parameters`, JSON.stringify(parameters));
        }
    }

    private async generateReply(response: any): Promise<string | false> {
        if (this.parser.isConversationComplete()) {
            return this.generateReplyForConversation(response);
        }

        return false;
    }

    private async generateReplyForConversation(response: any): Promise<string | false> {
        const conversationId = this.parser.getConversationId();

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
}
