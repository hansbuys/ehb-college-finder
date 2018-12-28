import { NextFunction, Request, Response, Router } from "express";
import logger from "../logging";
import { Conversation } from "../service/conversation";
import { controller, httpPost } from "inversify-express-utils";

@controller("/api")
export class MessageService {

    @httpPost("/message")
    public async sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response> {
        const log = req.log;
        log.trace("sendMessage has been called.");

        return new Conversation(log)
            .reply(req.body)
            .then((body) => {
                log.debug("Conversation has succesfully been answered.");
                return res.json(body);
            }).catch((err) => {
                log.error({ err }, `Conversation has errored.`);
                return res.status(err.code || 500).json(err);
            });
    }
}