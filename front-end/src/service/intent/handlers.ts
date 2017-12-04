import logger from "../../logging";
import { DictionaryOfStrings } from "../customTypes";
import { FindByStateHandler } from "./findByState";
import { HandlerBase } from "./handlerBase";

export class Handlers {
    private intentHandlers: Map<string, HandlerBase>;

    constructor() {
        this.intentHandlers = new Map<string, HandlerBase>();
        logger.debug("Attaching handlers");
        this.addHandler(FindByStateHandler);
        logger.debug("Attached all handlers");
    }

    public handleWithParameters(intent: string, parameters: DictionaryOfStrings): Promise<string | false> | false {
        const handler = this.getHandler(intent);

        return handler ? handler.createReply(parameters) : false;
    }

    public handle(intent: string): Promise<string | false> | false {
        const handler = this.getHandler(intent);

        return handler ? handler.createReply() : false;
    }

    private getHandler(intent: string): HandlerBase | false {
        if (this.intentHandlers.has(intent)) {
            return this.intentHandlers.get(intent) as HandlerBase;
        }

        return false;
    }

    private addHandler<T>(ctor: { new (): HandlerBase; }) {
        logger.trace(`Attaching handler: ${ctor.name}.`);
        const handler = new ctor();
        logger.debug(`Attaching handler ${ctor.name} for intent ${handler.intent}.`);
        this.intentHandlers.set(handler.intent, handler);
    }
}
