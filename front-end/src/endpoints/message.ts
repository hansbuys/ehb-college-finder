import { NextFunction, Request, Response, Router } from "express";
import logger from "../logging";
import { Conversation } from "../service/conversation";

class MessageService {
    public router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    public static async sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response> {
        logger.trace("sendMessage has been called.");

        return new Conversation()
            .reply(req.body)
            .then((body) => {
                logger.debug("Conversation has succesfully been answered.");
                return res.json(body);
            }).catch((err) => {
                logger.error(`Conversation has errored: ${err}`);
                return res.status(err.code || 500).json(err);
            });
    }

    public init(): void {
        logger.trace("Mapping routes for MessageService");

        this.router.post("/", MessageService.sendMessage);
    }
}

export default new MessageService().router;
