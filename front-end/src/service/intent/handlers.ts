import * as Logger from "bunyan";
import { DictionaryOfStrings } from "../customTypes";
import { FindByStateHandler } from "./findByState";
import { HandlerBase } from "./handlerBase";

export class Handlers {
    private intentHandlers: Map<string, HandlerBase>;

    private log: Logger;

    constructor(log: Logger) {
        this.log = log;
        this.intentHandlers = new Map<string, HandlerBase>();
        this.log.trace("Attaching handlers");
        this.addHandler(FindByStateHandler);
        this.log.trace("Attached all handlers");
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

    private addHandler<T>(ctor: { new (log: Logger): HandlerBase; }) {
        this.log.trace(`Attaching handler: ${ctor.name}.`);
        const handler = new ctor(this.log);
        this.log.trace(`Attaching handler ${ctor.name} for intent ${handler.intent}.`);
        this.intentHandlers.set(handler.intent, handler);
    }
}
