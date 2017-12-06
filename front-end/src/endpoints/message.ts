import { NextFunction, Request, Response, Router } from "express";
import logger from "../logging";
import { Conversation } from "../service/conversation";

class MessageService {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public static async sendMessage(req: any, res: Response, next: NextFunction): Promise<Response> {
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

    public init(): void {
        logger.trace("Mapping routes for MessageService");

        this.router.post("/", MessageService.sendMessage);
    }
}

export default new MessageService().router;
