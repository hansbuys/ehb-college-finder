import { HandlerBase } from "./handlerBase";
import { DictionaryOfStrings } from "../customTypes";

export class FindByStateHandler extends HandlerBase {
    public parameterNames: string[] = ["state"];
    public readonly intent = "find-by-state";

    public async createReply(params?: DictionaryOfStrings): Promise<string | false> {
        if (params && params["state"]) {
            const state = params["state"];

            return `Found schools for state ${state}`;
        }

        return false;
    }
}
