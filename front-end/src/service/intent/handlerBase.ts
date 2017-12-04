import { DictionaryOfStrings } from "../customTypes";

export abstract class HandlerBase {
    public abstract readonly intent: string;
    public abstract readonly parameterNames: string[];

    public abstract createReply(params?: DictionaryOfStrings): Promise<string | false>;
}
