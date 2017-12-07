import * as Logger from "bunyan";
import { Parser } from "./parser";
import { ConversationRepository } from "./repository/conversation";
import { Handlers } from "./intent/handlers";
import { Agent } from "./agent";
import { DictionaryOfStrings } from "./customTypes";
import { WatsonAgent } from "./watson/agent";
import { WatsonParser } from "./watson/parser";

export class Conversation {

    private log: Logger;

    constructor(log: Logger) {
        log.trace("Creating new Conversation instance");

        this.log = log;
    }

    public async reply(body: any): Promise<any> {
        const response = await this.getAgent().sendMessage(body);

        const parser = this.getParser(response);

        this.checkParserAndUpdateLogger(parser);
        this.logUserInput(parser);

        await this.storeConversation(parser);

        const reply = await this.generateReply(parser);

        if (reply) {
            parser.appendToOutput(reply);
            await this.resetStoredConversation(parser);
        }

        this.logGeneratedOutput(parser);

        return parser.getResponse();
    }

    private logUserInput(parser: Parser) {
        const userInput = parser.getInput();
        if (userInput) {
            this.log.info(`User asked: ${userInput}`);
        }
    }

    private logGeneratedOutput(parser: Parser) {
        const generatedOutput = parser.getOutputText();
        if (generatedOutput) {
            const multilineOutput = generatedOutput.join("\n");
            this.log.info(`Formulated response: ${multilineOutput}`);
        }
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

    private checkParserAndUpdateLogger(parser: Parser): void {
        const isValidResponse = parser.isValidResponse();

        if (!isValidResponse) {
            throw new Error("Response is invalid.");
        }

        const conversationId = parser.getConversationId();
        this.log = this.log.child({ conversationId });
    }

    private async storeConversation(parser: Parser): Promise<void> {
        const conversationId = parser.getConversationId();
        this.log = this.log.child({ conversationId });

        const intent = parser.getIntent();
        if (intent) {
            await this.getRepository().store(`${conversationId}.intent`, intent);
        }

        const parameters = parser.getParameters();
        if (parameters) {
            await this.getRepository().store(`${conversationId}.parameters`, JSON.stringify(parameters));
        }
    }

    private async resetStoredConversation(parser: Parser): Promise<void> {
        const conversationId = parser.getConversationId();

        this.log.debug("Clearing stored conversation info.");
        await this.getRepository().unset(`${conversationId}.intent`);
        await this.getRepository().unset(`${conversationId}.parameters`);
    }

    private async generateReply(parser: Parser): Promise<string | false> {
        if (!parser.isConversationComplete()) {
            this.log.debug("Conversation is not yet complete, we need some more info.");
            return false;
        }

        this.log.debug("Conversation is complete.");

        if (parser.isIgnoredRequest()) {
            this.log.debug("No additional info needs to be generated.");
            return false;
        }

        this.log.info("Checking to see if additional info can be generated.");
        const conversationId = parser.getConversationId();

        const getLastIntent = this.getRepository().retrieve(`${conversationId}.intent`);
        const parametersAsString = await this.getRepository().retrieve(`${conversationId}.parameters`);

        if (parametersAsString && parametersAsString !== "\"{\"0\":{}}\"") {
            const parameters = JSON.parse(parametersAsString) as DictionaryOfStrings;

            if (!parameters) {
                throw new Error(`Unable to parse parameters from JSON: ${parametersAsString}`);
            }

            return await this.getHandlers().handleWithParameters(await getLastIntent, parameters);
        } else {
            return await this.getHandlers().handle(await getLastIntent);
        }
    }
}
