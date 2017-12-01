import logger from "../logging";

export class IntentHandlers {
    private intentHandlers: Map<string, IntentHandlerBase>;

    constructor() {
        this.intentHandlers = new Map<string, IntentHandlerBase>();
        logger.debug("Attaching handlers");
        this.addHandler(FindByStateHandler);
        logger.debug("Attached all handlers");
    }

    public handleWithParameters(intent: string, parameters: { [index: string]: {value: string} }): Promise<string | false> | false {
        const handler = this.getHandler(intent);

        return handler ? handler.createReply(parameters) : false;
    }

    public handle(intent: string): Promise<string | false> | false {
        const handler = this.getHandler(intent);

        return handler ? handler.createReply() : false;
    }

    private getHandler(intent: string): IntentHandlerBase | false {
        if (this.intentHandlers.has(intent)) {
            return this.intentHandlers.get(intent) as IntentHandlerBase;
        }

        return false;
    }

    private addHandler<T>(ctor: { new (): IntentHandlerBase; }) {
        logger.trace(`Attaching handler: ${ctor.name}.`);
        const handler = new ctor();
        logger.debug(`Attaching handler ${ctor.name} for intent ${handler.intent}.`);
        this.intentHandlers.set(handler.intent, handler);
    }
}

abstract class IntentHandlerBase {
    public abstract readonly intent: string;
    public abstract readonly parameterNames: string[];

    public abstract createReply(params?: { [index: string]: {value: string} }): Promise<string | false>;
}

class FindByStateHandler extends IntentHandlerBase {
    public parameterNames: string[] = ["state"];
    public readonly intent = "find-by-state";

    public async createReply(params?: { [index: string]: {value: string} }): Promise<string | false> {
        if (params && params["state"]) {
            const state = params["state"];

            return `Found schools for state ${state}`;
        }

        return false;
    }
}
