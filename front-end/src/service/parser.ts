import { DictionaryOfStrings } from "./customTypes";

export interface Parser {
    isValidResponse(): boolean;
    isDialogComplete(): boolean;
    isIgnoredRequest(): boolean;

    getIntent(): string | false;
    getIntentConfidence(): number | false;
    getConversationId(): string | false;
    getParameters(): DictionaryOfStrings | false;
    getResponse(): any;
    getInput(): string | false;
    getOutputText(): string[] | false;

    appendToOutput(text: string): void;
}
