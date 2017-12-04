import logger from "../logging";
import { DictionaryOfStrings } from "./customTypes";

export interface Parser {
    getIntent(): string | false;
    getIntentConfidence(): number | false;
    getConversationId(): string | false;
    getParameters(): DictionaryOfStrings | false;
    getResponse(): any;
    isConversationComplete(): boolean;
    appendToOutput(text: string): void;
}

export class WatsonParser implements Parser {
    private response: any;
    private readonly ignoredParameterNames = [
        "conversation_id",
        "system"
    ];

    constructor(response: any) {
        if (!response.context) {
            throw new Error("Response has no context.");
        }

        this.response = response;
    }

    public getIntent(): string | false {
        if (this.response.intents && this.response.intents[0]) {
            return this.response.intents[0].intent;
        }
        return false;
    }

    public getIntentConfidence(): number | false {
        if (this.response.intents && this.response.intents[0]) {
            return this.response.intents[0].confidence;
        }
        return false;
    }

    public getConversationId(): string | false {
        return this.response.context.conversation_id;
    }

    public getParameters(): DictionaryOfStrings | false {
        const parameterNames = Object.getOwnPropertyNames(this.response.context)
            .filter((name) => !this.ignoredParameterNames.some((ignored) => name === ignored));
        const parameters: DictionaryOfStrings = {};

        if (parameterNames.length > 0) {
            parameterNames.map((name) => {
                parameters[name] = this.response.context[name];
            });

            return parameters;
        }

        return false;
    }

    public isConversationComplete(): boolean {
        return this.response.context && this.response.context.system && this.response.context.system.branch_exited;
    }

    public appendToOutput(text: string) {
        this.response.output.text.push(text);
    }

    public getResponse(): any {
        return this.response;
    }
}
