import { Parser } from "../parser";
import { DictionaryOfStrings } from "../customTypes";

export class WatsonParser implements Parser {
    private response: any;

    private readonly ignoredParameterNames = [ "conversation_id", "system" ];
    private readonly ignoredNodes = [ "Anything else", "Welcome" ];

    constructor(response: any) {
        if (!response.context) {
            throw new Error("Response has no context.");
        }

        this.response = response;
    }

    public isValidResponse(): boolean {
        return this.getConversationId() !== false;
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
        const relevantParameterNames = Object.getOwnPropertyNames(this.response.context)
            .filter((name) => !this.ignoredParameterNames.some((ignored) => name === ignored));

        if (relevantParameterNames.length === 0) {
            return false;
        }

        const parameters: DictionaryOfStrings = {};

        relevantParameterNames.forEach((name) => {
            const value = this.response.context[name];
            parameters[name] = { value };
        });

        return parameters;
    }

    public isConversationComplete(): boolean {
        const context = this.response.context;
        const endOfConversation = context.system && context.system.branch_exited;

        return endOfConversation;
    }

    public isIgnoredRequest(): boolean {
        const output = this.response.output;

        if (!output) {
            return true;
        }

        if (output.nodes_visited) {
            const nodes = output.nodes_visited as string[];
            const isNodeIgnored = nodes.some((node) => this.ignoredNodes.indexOf(node) > -1);

            return isNodeIgnored;
        }

        throw new Error("No nodes have been visited!");
    }

    public appendToOutput(text: string) {
        const textPerLine = text.split("\n");
        textPerLine.forEach((line) => {
            this.response.output.text.push(line);
        });
    }

    public getResponse(): any {
        return this.response;
    }

    public getInput(): string | false {
        const hasInput = this.response.input && this.response.input.text;
        return hasInput ? this.response.input.text : false;
    }

    public getOutputText(): string[] | false {
        const hasOutput = this.response.output && this.response.output.text;
        return hasOutput ? this.response.output.text : false;
    }
}
